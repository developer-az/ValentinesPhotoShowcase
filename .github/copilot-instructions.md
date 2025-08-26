# Valentine's Photo Showcase
Valentine's Photo Showcase is an interactive HTML5, CSS, and JavaScript web application that creates a romantic Valentine's Day card experience. The application features a clickable card that opens with 3D animation and transitions to a scrolling photo marquee showcase.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively
- Run the application locally:
  - `cd /path/to/ValentinesPhotoShowcase`
  - `python3 -m http.server 8000` -- starts immediately. NEVER CANCEL.
  - Alternative: `npx http-server -p 8001` -- takes ~10 seconds to install and start. NEVER CANCEL.
  - Navigate to `http://localhost:8000` or `http://localhost:8001`
- Install dependencies (only if needed for Vercel analytics):
  - `npm install` -- takes ~30 seconds. NEVER CANCEL.
- No build process required - this is a static HTML/CSS/JS application

## Validation
- ALWAYS manually validate the complete user workflow after making changes:
  1. Start local server and navigate to main page
  2. Verify floating hearts animation is working
  3. Click on the Valentine's card (the "Click To Open <3" area)
  4. Verify card opening animation (3D flip effect)
  5. Wait 3 seconds for automatic redirect to photo showcase page
  6. Verify scrolling marquee with photos and text is working
  7. Take screenshots of both pages for documentation
- The application loads instantly - no waiting for builds or complex startup
- Google Fonts may be blocked in local development (shows as console errors) but does not affect functionality

## Common Tasks
The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Structure
```
ValentinesPhotoShowcase/
├── index.html          # Main Valentine's card page
├── page.html          # Photo showcase page  
├── main.js            # Main page interactivity and heart animations
├── main2.js           # Marquee animation logic
├── style.css          # Main page styling and card animations
├── style2.css         # Photo showcase page styling
├── 1.png, 2.png, 3.jpg # Photo assets displayed in marquee
├── package.json       # Vercel analytics dependencies only
├── package-lock.json  # Lock file
└── node_modules/      # Vercel analytics packages
```

### Key Files and Their Purpose
- **index.html**: Entry point with interactive Valentine's card
- **main.js**: Handles card click events, heart animations, and page transition
- **page.html**: Second page displaying scrolling photo marquee
- **main2.js**: Creates duplicated marquee content for seamless scrolling
- **style.css**: Complex 3D card animations and responsive design
- **style2.css**: Marquee animations and photo styling

### Application Flow
1. User lands on index.html with floating hearts background
2. Clicking card triggers CSS 3D rotation animation
3. JavaScript automatically redirects to page.html after 3 seconds
4. page.html displays infinite scrolling marquee of photos and text

### Package.json Content
```json
{
  "dependencies": {
    "@vercel/analytics": "^1.2.2",
    "@vercel/speed-insights": "^1.0.10"
  }
}
```

### Available Server Commands
- `python3 -m http.server 8000` - Python built-in server (recommended)
- `npx http-server -p 8001` - Node.js http-server (installs automatically)
- Both servers start immediately and serve static files

### CSS Architecture
- **style.css**: Contains complex animations including:
  - 3D card flip animations using CSS transforms
  - Floating heart animations with random positioning
  - Responsive design for mobile devices
- **style2.css**: Contains marquee scrolling animations using:
  - CSS custom properties for dynamic element counting
  - Smooth infinite scrolling with CSS animations

### JavaScript Functionality
- **main.js**: 
  - Creates random floating hearts with overlap detection
  - Handles card click events and automatic page transition
  - Uses multiple intervals for varied heart generation
- **main2.js**:
  - Dynamically clones marquee content for seamless looping
  - Calculates element counts using CSS custom properties

### Testing Scenarios
After making any changes, ALWAYS validate:
1. **Visual functionality**: Hearts animate, card flips properly
2. **Interaction**: Card responds to clicks and opens correctly  
3. **Navigation**: Automatic redirect works after 3 seconds
4. **Marquee**: Photo showcase scrolls smoothly and infinitely
5. **Responsive**: Test on different screen sizes if modifying CSS
6. **Performance**: All animations remain smooth

### Common Development Tasks
- **Modify card appearance**: Edit style.css `.valentines-day-card`, `.card-front`, `.card-inside` classes
- **Change photo content**: Replace 1.png, 2.png, 3.jpg files and update page.html
- **Adjust timing**: Modify setTimeout in main.js (currently 3000ms)
- **Update animations**: Modify CSS keyframes in style.css and style2.css
- **Add new photos**: Update page.html marquee list and ensure images are properly sized

### Browser Compatibility Notes
- Works in all modern browsers
- CSS 3D transforms require modern browser support
- Google Fonts may be blocked in local development (non-critical)
- Application is fully responsive for mobile and desktop

Remember: This is a simple static web application with no build step required. Changes to HTML, CSS, and JS files are immediately visible when refreshing the browser.