# Valentine's Photo Showcase 💖

A modern, interactive Valentine's Day card with photo slideshow that has been enhanced with the latest web technologies.

## 🚀 New Features (2024 Update)

### 🌙 Dark/Light Theme Toggle
- Modern theme switching with one-click toggle
- Persistent theme preference using localStorage
- Smooth CSS transitions between themes
- System preference detection

### 📱 Progressive Web App (PWA)
- Offline functionality with service worker
- App-like experience on mobile devices
- Web app manifest for installation
- Cached resources for faster loading

### ♿ Enhanced Accessibility
- Screen reader compatibility with ARIA labels
- Keyboard navigation support
- Skip links for better navigation
- High contrast mode support
- Reduced motion preference respect

### ⚡ Performance Optimizations
- Optimized heart animation system
- Lazy loading for images
- Debounced resize handlers
- Visibility-based animation control
- Modern CSS with custom properties

### 🎨 Modern Design
- CSS custom properties for consistent theming
- Responsive design improvements
- Smooth micro-interactions
- Modern button designs
- Better mobile experience

## 🎯 Usage

Simply open `index.html` in a modern web browser. The app will work offline after the first load thanks to the service worker.

### Navigation
1. **Main Card**: Click or press Enter to open the Valentine's card
2. **Theme Toggle**: Click the moon/sun icon in the top-right to switch themes
3. **Second Page**: View the romantic photo slideshow
4. **Back Button**: Return to the main card from the slideshow

### Keyboard Navigation
- `Tab` - Navigate between interactive elements
- `Enter` or `Space` - Activate buttons and open card
- `Escape` - Future functionality (modal handling)

## 🛠️ Technical Details

### Files Structure
```
├── index.html              # Main Valentine's card page
├── page.html              # Photo slideshow page
├── style.css              # Original styling
├── style-modern.css       # Modern enhancements and theming
├── main-polished.js       # Enhanced JavaScript with error handling
├── manifest.json          # PWA manifest
├── sw.js                 # Service worker for offline functionality
├── js/                   # Modular JavaScript (alternative approach)
└── images/               # 1.png, 2.png, 3.jpg
```

### Browser Support
- **Modern Browsers**: Full feature support (Chrome 60+, Firefox 55+, Safari 12+)
- **Older Browsers**: Graceful degradation with core functionality maintained
- **Mobile**: Responsive design works on all screen sizes

### Features by Browser Capability
- **Service Worker**: Offline functionality (supported in most modern browsers)
- **CSS Custom Properties**: Dynamic theming (fallback colors provided)
- **Web Animations API**: Smooth heart animations (CSS fallback available)
- **localStorage**: Theme persistence (graceful failure if unavailable)

## 🎨 Customization

### Changing Themes
The app uses CSS custom properties for easy theming. Edit `style-modern.css`:

```css
:root {
  --primary-color: #d04e4e;
  --background-color: lightcoral;
  /* ... other colors */
}

[data-theme="dark"] {
  --primary-color: #ff6b6b;
  --background-color: #2c1810;
  /* ... dark theme colors */
}
```

### Adding Photos
Replace the images (`1.png`, `2.png`, `3.jpg`) with your own romantic photos. Update the `page.html` file to change the slideshow text.

## 🐛 Troubleshooting

### Service Worker Issues
If offline functionality isn't working:
1. Check browser developer tools -> Application -> Service Workers
2. Clear cache and reload the page
3. Ensure you're not in private/incognito mode

### Theme Not Persisting
If theme doesn't save between sessions:
1. Check if localStorage is enabled in your browser
2. Ensure you're not in private/incognito mode
3. Check browser developer tools -> Application -> Local Storage

## 📱 Installation as PWA

On supported browsers and devices:
1. Visit the site in your browser
2. Look for "Add to Home Screen" or "Install App" option
3. The app will behave like a native application

## 💝 What Makes This Special

This isn't just a simple Valentine's card - it's a showcase of modern web development practices:
- **Accessibility-first design** ensures everyone can enjoy the experience
- **Progressive enhancement** means it works everywhere, but shines on modern devices
- **Performance optimizations** make it smooth and responsive
- **PWA capabilities** let it work offline and feel native
- **Modern CSS** provides smooth animations and beautiful theming

Perfect for developers wanting to send a tech-savvy Valentine's message! 💕

## 🔧 Development

To modify or extend the app:
1. Edit HTML structure in `index.html` and `page.html`
2. Modify styling in `style-modern.css` (don't edit `style.css` - it's the original)
3. Enhance functionality in `main-polished.js`
4. Update PWA settings in `manifest.json`
5. Modify caching behavior in `sw.js`

The code is extensively commented and uses modern JavaScript features with fallbacks for older browsers.