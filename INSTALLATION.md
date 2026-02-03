# Installation and Testing Guide

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/jdecode/full-page-screenshot.git
   cd full-page-screenshot
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or click the three-dot menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the `full-page-screenshot` directory
   - The extension should now appear in your extensions list

5. **Pin the extension (optional)**
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "Full Page Screenshot" and click the pin icon

## Testing the Extension

### Quick Test
1. Open any webpage (or use the included `test-page.html`)
2. Click the Full Page Screenshot extension icon
3. Click "Take Screenshot" button
4. Check your Downloads folder for the screenshot

### Test with test-page.html
1. Open `test-page.html` in Chrome
2. Take a screenshot using the extension
3. Verify the filename format: `test-page-for-full-page-screenshot-YYYYMMDD-HHMMSS.png`
4. Open the screenshot and verify it captures the entire page (including content below the fold)

### Expected Behavior
- ✅ Extension icon appears in toolbar
- ✅ Popup opens when clicked
- ✅ "Capturing..." status message appears
- ✅ "Screenshot saved!" confirmation message
- ✅ Screenshot appears in Downloads folder
- ✅ Filename follows the pattern: `site-name-YYYYMMDD-HHMMSS.png`
- ✅ Full page is captured (not just visible viewport)

## Troubleshooting

### Extension doesn't load
- Make sure you selected the correct directory
- Check that all files are present (manifest.json, popup.html, popup.js, background.js, icons)
- Check for errors in the Extensions page

### Screenshot not working
- Check that the website allows screenshots
- Some sites with strict security policies may block screenshot capture
- Check browser console for errors (F12)

### Filename issues
- If page has no title, it will use "screenshot" as the default name
- Special characters are automatically removed
- Spaces are replaced with dashes

## Browser Compatibility

This extension is designed for **Chrome and Chromium-based browsers** (Edge, Brave, etc.) that support:
- Manifest V3
- chrome.tabs.captureVisibleTab API
- chrome.scripting API
- chrome.downloads API

## Known Limitations

1. **Same-origin policy**: Some websites may restrict screenshot capture
2. **Dynamic content**: Content that loads after scrolling may not be captured properly
3. **Iframe content**: Content inside iframes from different origins won't be captured
4. **Protected content**: DRM-protected or secure content may appear blank

## Privacy & Security

- ✅ No data is sent to external servers
- ✅ No tracking or analytics
- ✅ Screenshots are saved locally only
- ✅ Minimal permissions requested (activeTab, downloads, scripting)
- ✅ Open source - all code is visible and auditable
