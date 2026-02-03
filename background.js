// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    captureFullPageScreenshot(request.tabId, request.pageTitle, request.pageUrl)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
});

async function captureFullPageScreenshot(tabId, pageTitle, pageUrl) {
  // Inject script to get page dimensions and scroll
  const [{ result: pageInfo }] = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: getPageInfo
  });
  
  const { pageHeight, pageWidth, viewportHeight, viewportWidth } = pageInfo;
  
  // Calculate number of screenshots needed
  const numScreenshots = Math.ceil(pageHeight / viewportHeight);
  
  // Array to store screenshot data URLs
  const screenshots = [];
  
  // Capture screenshots by scrolling
  for (let i = 0; i < numScreenshots; i++) {
    // Scroll to position
    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: scrollToPosition,
      args: [i * viewportHeight]
    });
    
    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Capture visible tab
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: 'png' });
    screenshots.push(dataUrl);
  }
  
  // Restore original scroll position
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: scrollToPosition,
    args: [pageInfo.originalScrollY]
  });
  
  // Stitch screenshots together
  const fullScreenshot = await stitchScreenshots(screenshots, pageWidth, pageHeight, viewportHeight);
  
  // Generate filename
  const filename = generateFilename(pageTitle, pageUrl);
  
  // Download the screenshot
  await downloadScreenshot(fullScreenshot, filename);
}

function getPageInfo() {
  const body = document.body;
  const html = document.documentElement;
  
  return {
    pageHeight: Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    ),
    pageWidth: Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    ),
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
    originalScrollY: window.scrollY
  };
}

function scrollToPosition(y) {
  window.scrollTo(0, y);
}

async function stitchScreenshots(screenshots, pageWidth, pageHeight, viewportHeight) {
  // Create a canvas to stitch all screenshots
  const canvas = new OffscreenCanvas(pageWidth, pageHeight);
  const ctx = canvas.getContext('2d');
  
  for (let i = 0; i < screenshots.length; i++) {
    const img = await loadImage(screenshots[i]);
    const y = i * viewportHeight;
    
    // Calculate the height to draw (last screenshot might be partial)
    const heightToDraw = Math.min(viewportHeight, pageHeight - y);
    
    // Draw the image: source (0, 0, img.width, heightToDraw) -> destination (0, y, pageWidth, heightToDraw)
    ctx.drawImage(img, 0, 0, img.width, heightToDraw, 0, y, pageWidth, heightToDraw);
  }
  
  // Convert canvas to blob
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  
  // Convert blob to data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function loadImage(dataUrl) {
  // Convert data URL to blob
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  
  // Create ImageBitmap (available in service workers, unlike Image)
  const imageBitmap = await createImageBitmap(blob);
  return imageBitmap;
}

function generateFilename(pageTitle, pageUrl) {
  // Extract site name from title or URL
  let siteName = pageTitle || 'screenshot';
  
  // Clean up the site name
  siteName = siteName
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .toLowerCase();
  
  // Limit length
  if (siteName.length > 50) {
    siteName = siteName.substring(0, 50);
  }
  
  // Generate timestamp with seconds
  const now = new Date();
  const timestamp = now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    '-' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
  
  return `${siteName}-${timestamp}.png`;
}

async function downloadScreenshot(dataUrl, filename) {
  // Convert data URL to blob for download
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  
  // Download using chrome.downloads API
  await chrome.downloads.download({
    url: objectUrl,
    filename: filename,
    saveAs: false
  });
  
  // Clean up object URL after a delay
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
