# Atomic Habits Tracker PWA

A Progressive Web App for tracking and building better habits based on the Atomic Habits methodology.

## Features

- 📱 **Installable PWA** - Add to home screen on any device
- 🔄 **Offline Support** - Works without internet connection
- 📊 **Habit Analytics** - Track your progress with visual heatmaps
- 🎯 **Goal Setting** - Set daily/weekly goals for each habit
- 🌙 **Dark Theme** - Easy on the eyes with cyber-green accents
- 💾 **Local Storage** - Your data stays on your device

## Installation

### Option 1: Serve Locally (Development)

1. Install a local server (e.g., using Python or Node.js):

   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```

   **Using Node.js:**
   ```bash
   npx serve .
   # or
   npx http-server .
   ```

2. Open your browser and navigate to `http://localhost:8080/DeepseekAtomic.html`

3. Click the install button in your browser's address bar (or use the browser menu to "Install App")

### Option 2: Deploy to a Web Server

1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for PWA features)
3. Navigate to your domain and install the app

## Generating PNG Icons

The PWA includes an SVG icon that works on modern browsers. For full compatibility, you should generate PNG icons:

1. Open `generate-icons.html` in your browser
2. Click "Download" on each icon size
3. Save the downloaded files to the `icons/` folder

Required icon sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## File Structure

```
Atomic Habits/
├── DeepseekAtomic.html    # Main application
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker for offline support
├── generate-icons.html    # Icon generator utility
├── README.md              # This file
└── icons/
    ├── icon.svg           # Vector icon (scalable)
    └── icon-*.png         # PNG icons (generate these)
```

## PWA Requirements

For the PWA to work correctly:

1. **HTTPS** - Service workers require a secure context (localhost works for development)
2. **Valid Manifest** - The `manifest.json` must be properly linked
3. **Service Worker** - The `sw.js` must be in the root directory
4. **Icons** - At least one icon (192x192 minimum) is required

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (iOS 11.3+, macOS)
- ✅ Samsung Internet
- ✅ Opera

## Troubleshooting

### App won't install
- Ensure you're using HTTPS (or localhost)
- Check that `manifest.json` is accessible
- Verify the service worker is registered (check DevTools > Application)

### Offline mode not working
- Clear the browser cache and reload
- Check DevTools > Application > Service Workers
- Ensure all cached files exist

### Icons not showing
- Generate PNG icons using `generate-icons.html`
- Verify icon paths in `manifest.json`

## License

MIT License - Feel free to use and modify for your own projects.
