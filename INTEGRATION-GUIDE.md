# GalaxyJS Integration Guide

## Overview

DevOps Galaxy now uses **GalaxyJS** for the spiral galaxy visualization instead of a custom vanilla Canvas implementation.

This document explains:
- What was changed
- How GalaxyJS is integrated
- How to run the application
- How to add services/interactions later

---

## Changes Made

### Files Removed

```
prototype/                          (entire folder removed)
├── index.html
├── css/style.css
├── js/
│   ├── main.js
│   ├── spiral.js
│   └── particles.js
└── README.md
```

**Reason:** Replaced with GalaxyJS library. No need to maintain custom Canvas code.

### Files Added

```
devops-galaxy/
├── package.json                    (Node.js dependencies)
├── vite.config.js                  (Vite configuration)
├── index.html                      (HTML entry point with GalaxyJS CDN)
├── .gitignore                      (Git ignore rules)
│
└── src/
    ├── main.jsx                    (React entry point)
    ├── index.css                   (Global styles)
    ├── App.jsx                     (Main app component)
    ├── App.css                     (App styling)
    └── components/
        ├── Galaxy.jsx              (GalaxyJS wrapper component)
        └── Galaxy.css              (Galaxy container styling)
```

### Project Structure

```
devops-galaxy/
├── docs/                           (Design documentation - unchanged)
├── src/                            (React application source)
├── package.json                    (Dependencies)
├── vite.config.js                  (Build configuration)
├── index.html                      (HTML entry)
├── README.md                       (Project overview)
└── .gitignore                      (Git configuration)
```

---

## How GalaxyJS Is Integrated

### 1. CDN Script (index.html)

```html
<script src="https://edwson.com/GalaxyJS/galaxy.min.js"></script>
```

GalaxyJS is loaded via CDN. It provides the `window.Galaxy` global object.

### 2. React Component (src/components/Galaxy.jsx)

The `Galaxy` component:

```jsx
export default function Galaxy() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && window.Galaxy) {
      // Initialize GalaxyJS
      const galaxy = window.Galaxy.create('spiral', containerRef.current, {
        speed: 0.5,
        stars: 600,
        colors: ['#ffffff', '#9bd0ff', '#c9b8ff']
      })
    }
  }, [])

  return <div ref={containerRef} id="stage"></div>
}
```

**Key aspects:**
- Uses React hooks (useRef, useEffect)
- Initializes GalaxyJS when component mounts
- Uses the 'spiral' galaxy type (not 'classic' or others)
- Configurable parameters: speed, stars, colors
- Container element has id `stage` (GalaxyJS requirement)

### 3. Application Structure

```
React (App.jsx)
    ↓
Header (DevOps Galaxy title)
    ↓
Main (Galaxy component)
    ↓
GalaxyJS (spiral visualization)
    ↓
Canvas element with rotating spiral
    ↓
Footer (attribution)
```

---

## Architecture: Galaxy vs Application

### Galaxy (Visualization Layer)
- **What:** Rotating spiral with particles
- **Where:** `src/components/Galaxy.jsx`
- **Managed by:** GalaxyJS library
- **Responsibility:** Visual environment only

### Application (Logic Layer)
- **What:** Service data, status, interactions
- **Where:** `src/App.jsx` and future components
- **Managed by:** React + DevOps Galaxy logic
- **Responsibility:** All application functionality

**These are intentionally separate.** The galaxy is just the backdrop.

---

## Running the Application

### Prerequisites

```bash
# Make sure you have Node.js installed
node --version    # Should be 16+
npm --version
```

### Install Dependencies

```bash
cd ~/projects/devops-galaxy
npm install
```

### Development Server

```bash
npm run dev
```

This starts Vite dev server at `http://localhost:5173`

Browser will auto-open with the DevOps Galaxy dashboard showing the spiral.

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder.

---

## Current State

### What Works ✅

- React + Vite application running
- GalaxyJS spiral galaxy rendering
- Rotating animation
- Particles/stars flowing through spiral
- Dark theme UI with header/footer
- Responsive to window resize

### What's Missing ❌

- Service planets (not added yet)
- Backend API integration (not added yet)
- Click interactions (not added yet)
- Detail panels (not added yet)
- Service status visualization (not added yet)

**These will be added incrementally.**

---

## Next Steps: Adding Services

When you're ready to add DevOps services, the architecture will look like:

### 1. Create Services Component

```jsx
// src/components/Services.jsx
export default function Services() {
  // Render interactive service planets on top of galaxy
  // Use Canvas overlay or SVG layer over GalaxyJS
}
```

### 2. Position Services

Services will be positioned as **overlays on the galaxy**:

```
GalaxyJS Canvas (background)
    ↓ (beneath)
React Components (interactive services)
    ↓ (on top)
Service Planets (clickable)
    ↓ (on top)
Detail Panels (when clicked)
```

### 3. Connect to Backend API

```jsx
useEffect(() => {
  // Fetch services from backend API
  fetch('/api/services')
    .then(res => res.json())
    .then(data => {
      // Position planets based on data
      // Update colors based on status
    })
}, [])
```

### 4. Interactive Elements

```jsx
function ServicePlanet({ service }) {
  const handleClick = () => {
    // Show detail panel
    // Highlight service
  }

  return (
    <div
      className="planet"
      style={{ left: service.x, top: service.y }}
      onClick={handleClick}
    >
      {service.name}
    </div>
  )
}
```

---

## GalaxyJS Configuration

### Current Settings (Galaxy.jsx)

```javascript
Galaxy.create('spiral', containerRef.current, {
  speed: 0.5,           // Rotation speed (0-2, default 1)
  stars: 600,           // Number of flowing particles
  colors: [             // Color palette
    '#ffffff',          // White
    '#9bd0ff',          // Light blue
    '#c9b8ff'           // Light purple
  ],
  size: 2,              // Particle size
  count: 8000           // Total background stars
})
```

### Adjustable Parameters

```javascript
// In Galaxy.jsx, modify the Galaxy.create() options:

speed: 0.5          // Slower/faster rotation
stars: 600          // More/fewer particles
colors: [...]       // Change color scheme
size: 2             // Larger/smaller particles
count: 8000         // More/fewer background stars
```

To experiment, open browser console:

```javascript
// These are exposed for debugging
window.galaxyInstance      // The Galaxy object
window.Galaxy              // The library
```

---

## File Organization

```
src/
├── main.jsx                        # React entry point
├── index.css                       # Global styles
├── App.jsx                         # Main app component
├── App.css                         # App layout
├── components/
│   ├── Galaxy.jsx                  # GalaxyJS wrapper
│   ├── Galaxy.css                  # Galaxy styling
│   ├── Header.jsx                  # (future)
│   ├── Services.jsx                # (future)
│   ├── ServiceDetail.jsx           # (future)
│   └── ...                         # (future)
└── hooks/                          # (future)
    ├── usePipelineStatus.js        # (future)
    └── ...                         # (future)
```

---

## Key Design Decisions

### 1. CDN vs NPM Package

**Decision:** CDN (simpler initial setup)

If later we need:
- Better bundling
- Type definitions
- Closer integration

We can switch to NPM package:
```bash
npm install galaxyjs
```

### 2. Component-Based

**Decision:** Wrap GalaxyJS in React component

Benefits:
- Integrates naturally with React ecosystem
- Easy to manage lifecycle
- Can compose with other components later
- Services/UI can be layered on top

### 3. Separation of Concerns

**Decision:** Galaxy visualization separate from application logic

Benefits:
- Easy to replace/upgrade GalaxyJS later
- Application doesn't depend on gallery internals
- Can focus on DevOps features separately
- Testing is simpler

---

## Debugging

### Enable Console Logging

GalaxyJS logs to console. Open F12 to see:
- Initialization messages
- Galaxy instance info

### Check Galaxy Status

```javascript
// In browser console:
console.log(window.Galaxy)
console.log(window.galaxyInstance)
```

### Inspect Container

```javascript
// In browser console:
document.getElementById('stage')
```

---

## Performance

### Current Metrics

- **Particles:** 600 flowing stars
- **Background:** 8000 stars total
- **Animation:** 60fps target
- **Canvas:** Full viewport

### Optimization Tips

If performance is an issue:
- Reduce `stars` parameter
- Reduce `count` parameter
- Disable background stars if not needed
- Use `speed` to adjust animation load

---

## Next Phase

Once GalaxyJS is confirmed working:

1. **Phase 2:** Create Services component
2. **Phase 3:** Position planets on galaxy
3. **Phase 4:** Connect to backend API
4. **Phase 5:** Add interactions (click, detail panels)

---

## Resources

- **GalaxyJS:** https://edwson.com/GalaxyJS/
- **React:** https://react.dev
- **Vite:** https://vitejs.dev
- **DevOps Galaxy Docs:** `/docs/`

---

**Integration Date:** 2026-09-06  
**Status:** ✅ Complete

The spiral galaxy is now running inside React + Vite. Ready for next steps!
