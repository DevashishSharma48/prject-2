const banner = document.querySelector('.image-banner');
const img = banner.querySelector('img');
const canvas = banner.querySelector('canvas');

function downloadBlob(blob, filename) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob);
  
  // Create a new anchor element
  const a = document.createElement('a');
  
  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = filename || 'download';
  
  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = function() {
    setTimeout(() => {
      // Release the object URL
      URL.revokeObjectURL(url);

      // Remove the event listener from the anchor element
      this.removeEventListener('click', clickHandler);

      // Remove the anchor element from the DOM
      (this.remove && (this.remove(), 1)) ||
      (this.parentNode && this.parentNode.removeChild(this));
    }, 150)
  };
  
  // Add the click event listener on the anchor element
  // a.addEventListener('click', clickHandler, false);
  
  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // a.click();
  
  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a;
}

function resolveCanvasDimensions() {
  const { width, height } = window.getComputedStyle(img);
  
  canvas.width = +parseFloat(width);
  canvas.height = +parseFloat(height);
  
  canvas.style.width = width;
  canvas.style.height = height;
}

function processGrayscaleImage() {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  
  ctx.drawImage(img, 0, 0, width, height);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0, len = data.length; i < len; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    
    data[i]     = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }

  ctx.putImageData(imageData, 0, 0);
  
  canvas.toBlob(blob => {
    const downloadLink = downloadBlob(blob);
    
    // Set the title and classnames of the link
    downloadLink.title = 'Download Grayscale';
    downloadLink.classList.add('btn-link', 'download-link');
    
    downloadLink.textContent = 'Download Grayscale';

    // Attach the link to the DOM
    document.body.appendChild(downloadLink);
  });
}

function initialize() {
  img.addEventListener('load', () => {
    resolveCanvasDimensions();
    processGrayscaleImage();

    banner.addEventListener('click', () => {
      banner.classList.toggle('flipped--grayscale');
    }, false);
  }, false);
}

initialize();