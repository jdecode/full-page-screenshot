# full-page-screenshot
A minimal Chrome extension to take full page screenshots of a URL

## Features
- Take full page screenshots of any webpage
- Automatically downloads the screenshot with a meaningful filename
- Filename format: `site-name-YYYYMMDD-HHMMSS.png`
  - Site name is derived from the page title
  - Spaces are replaced with dashes
  - Timestamp includes seconds for uniqueness

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked"
5. Select the directory containing this extension

## Usage

1. Navigate to any webpage you want to capture
2. Click the extension icon in your browser toolbar
3. Click the "Take Screenshot" button
4. The screenshot will be automatically saved to your Downloads folder

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Popup interaction logic
- `background.js` - Screenshot capture and processing logic
- `icon*.png` - Extension icons

