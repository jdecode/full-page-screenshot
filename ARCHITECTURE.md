# Extension Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Browser                          │
│                                                             │
│  ┌──────────────┐         ┌─────────────────────┐          │
│  │   User       │  Click  │   Extension Popup   │          │
│  │              │────────▶│   (popup.html)      │          │
│  │              │         │                     │          │
│  └──────────────┘         │  [Take Screenshot]  │          │
│                           │   Button            │          │
│                           └──────────┬──────────┘          │
│                                      │                      │
│                                      │ Message              │
│                                      ▼                      │
│                           ┌──────────────────────┐          │
│                           │  Background Script   │          │
│                           │  (background.js)     │          │
│                           │                      │          │
│                           │  1. Get page info    │          │
│                           │  2. Scroll & capture │          │
│                           │  3. Stitch images    │          │
│                           │  4. Generate name    │          │
│                           │  5. Download         │          │
│                           └──────────┬───────────┘          │
│                                      │                      │
│                           ┌──────────▼───────────┐          │
│                           │   Content Script     │          │
│                           │   (injected)         │          │
│                           │                      │          │
│                           │  - Get dimensions    │          │
│                           │  - Scroll page       │          │
│                           │  - Restore position  │          │
│                           └──────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Downloads Folder     │
                    │                        │
                    │  site-name-timestamp   │
                    │  .png                  │
                    └────────────────────────┘
```

## Component Breakdown

### 1. **manifest.json**
- Defines extension metadata and permissions
- Permissions: activeTab, downloads, scripting
- Registers popup and background scripts

### 2. **popup.html + popup.js**
- User interface with a single button
- Sends message to background script
- Shows status feedback to user

### 3. **background.js** (Service Worker)
- Main logic coordinator
- Handles messages from popup
- Injects content scripts
- Captures visible tabs
- Stitches screenshots
- Generates filename
- Downloads final image

### 4. **Content Scripts** (Injected)
Functions injected into the active tab:
- `getPageInfo()` - Gets page dimensions
- `scrollToPosition()` - Scrolls to specific Y position

## Data Flow

```
User Click → Popup Message → Background Script
                                      │
                                      ├─▶ Inject: getPageInfo()
                                      │   └─▶ Returns: pageHeight, pageWidth, etc.
                                      │
                                      ├─▶ For each viewport section:
                                      │   ├─▶ Inject: scrollToPosition(y)
                                      │   ├─▶ Wait 200ms
                                      │   └─▶ captureVisibleTab() → dataUrl
                                      │
                                      ├─▶ stitchScreenshots() → fullImage
                                      │
                                      ├─▶ generateFilename() → "site-name-timestamp.png"
                                      │
                                      └─▶ chrome.downloads.download()
```

## Filename Generation Logic

```javascript
Input: "My Awesome Website!"
  ↓ Remove special characters
"My Awesome Website"
  ↓ Trim whitespace
"My Awesome Website"
  ↓ Replace spaces with dashes
"My-Awesome-Website"
  ↓ Convert to lowercase
"my-awesome-website"
  ↓ Add timestamp
"my-awesome-website-20260203-143025.png"
```

## Technical Details

- **Manifest Version**: 3 (latest)
- **Image Format**: PNG
- **Canvas Type**: OffscreenCanvas for performance
- **Scroll Wait Time**: 200ms between captures
- **Max Filename Length**: 50 characters (site name)
- **Timestamp Format**: YYYYMMDD-HHMMSS
