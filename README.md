# MyNavigation

A Chrome extension for creating your personalized web navigation page with customizable categories and links.

## Features

- Two-level navigation: organize your favorite websites by categories and links
- Add and delete categories and links directly from the extension popup
- Auto-complete link protocol (http/https) to avoid errors
- Card-style, clean, and modern UI layout
- Data is persisted using `chrome.storage.local`, with `config.json` as a fallback for first load
- Click the extension icon to open the navigation page in a new tab
- Fully supports Chrome Manifest V3

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select this project folder.
5. The extension icon will appear in your Chrome toolbar.

## Usage

- Click the extension icon to open your navigation page.
- Use the sidebar to add or delete categories and links.
- All changes are saved automatically in your browser.

## Project Structure

- `manifest.json` — Chrome extension manifest (v3)
- `background.js` — Handles opening the navigation page
- `popup.html` — Main UI for navigation and management
- `popup.js` — Logic for rendering, adding, and deleting categories/links
- `popup.css` — Styles for a modern, card-based UI
- `config.json` — Default categories and links (used on first load)
- `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png` — Extension icons

## License

MIT License
