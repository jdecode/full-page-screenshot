document.getElementById('captureBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Capturing...';
  
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to background script to capture screenshot
    chrome.runtime.sendMessage({
      action: 'captureScreenshot',
      tabId: tab.id,
      pageTitle: tab.title,
      pageUrl: tab.url
    }, (response) => {
      if (response && response.success) {
        statusDiv.textContent = 'Screenshot saved!';
        setTimeout(() => {
          statusDiv.textContent = '';
          window.close();
        }, 1500);
      } else {
        statusDiv.textContent = 'Error: ' + (response ? response.error : 'Unknown error');
      }
    });
  } catch (error) {
    statusDiv.textContent = 'Error: ' + error.message;
    console.error(error);
  }
});

