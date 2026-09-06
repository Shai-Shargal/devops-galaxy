# DevOps Galaxy - Prototype

## Phase 1a: Rotating Spiral Prototype

Minimal prototype to validate the rotating spiral galaxy concept.

### What This Is

- ✅ A rotating Archimedean spiral
- ✅ Smooth 60fps animation
- ✅ Vanilla JavaScript (no libraries)
- ✅ Pure Canvas rendering
- ✅ ~200 lines of code

### What This Is NOT

- ❌ Particles
- ❌ Planets/services
- ❌ Zoom/pan
- ❌ React integration
- ❌ Backend connection
- ❌ Detail panels

---

## Running the Prototype

### Option 1: Quick Server (Python)

```bash
cd prototype

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: http://localhost:8000

### Option 2: Node.js

```bash
npm install -g http-server
cd prototype
http-server
```

Then open: http://localhost:8080

### Option 3: Direct File (Limited)

```bash
# Just open in browser
open prototype/index.html
```

Note: Some features may not work due to CORS restrictions.

---

## Prototype Structure

```
prototype/
├── index.html          (Canvas element + page structure)
├── css/
│   └── style.css       (Minimal dark theme styling)
├── js/
│   ├── spiral.js       (Spiral rendering logic)
│   └── main.js         (Animation loop + initialization)
└── README.md           (This file)
```

---

## Code Overview

### spiral.js

Contains the `Spiral` class that handles spiral rendering.

**Key method:**
```javascript
draw(rotation) {
  // Draws spiral at given rotation angle
  // Uses Archimedean spiral equation: r = a + b*θ
}
```

**Parameters:**
- `a` = 50 (inner radius)
- `b` = 80 (spacing between arms)
- `maxTheta` = 8π (number of rotations)
- `armCount` = 2 (number of visible arms)

### main.js

Contains the `GalaxyPrototype` class that handles:
- Canvas setup and resizing
- Animation loop (60fps target)
- FPS monitoring
- Spiral instantiation

**Key method:**
```javascript
animate() {
  // Clear canvas
  // Draw spiral with current rotation
  // Update rotation angle
  // Request next frame
  requestAnimationFrame(animate)
}
```

---

## Debugging & Experimentation

Open the browser console (F12) and try:

### Check FPS
```javascript
// FPS logs to console every second
// Check browser console
```

### Pause/Resume Rotation
```javascript
galaxy.toggleRotation()
```

### Change Rotation Speed
```javascript
galaxy.setRotationSpeed(0.001)    // Slower
galaxy.setRotationSpeed(0.005)    // Faster
galaxy.setRotationSpeed(0)         // Pause
```

### Get Spiral Parameters
```javascript
galaxy.spiral.getInfo()
```

Returns:
```
{
  centerX: 700,
  centerY: 400,
  innerRadius: 50,
  spacing: 80,
  maxTheta: 25.13...,
  armCount: 2,
  maxRadius: 850
}
```

### Change Spiral Parameters (Experimental)
```javascript
// Change inner radius
galaxy.spiral.a = 100

// Change spacing
galaxy.spiral.b = 120

// Change number of arms
galaxy.spiral.armCount = 3

// Change color opacity
galaxy.spiral.opacity = 0.6
```

---

## Things to Test

1. **Visual Appearance**
   - Does the spiral look good?
   - Is the rotation smooth?
   - What rotation speed feels best?
   - Are the colors right (purple)?

2. **Performance**
   - Check FPS in console
   - Is it smooth at 60fps?
   - Any lag when resizing window?
   - Performance on different machines?

3. **Experimentation**
   - Try different rotation speeds
   - Try different arm counts (3, 4, 5)
   - Try different colors
   - Try different inner radius/spacing values

---

## Observations & Notes

### Current Implementation

- **2 spiral arms** rotating together
- **Purple color** (#8b5cf6) with 40% opacity
- **Rotation speed** 0.002 radians per frame (~20 second full rotation)
- **60fps target** (monitor FPS in console)

### What Looks Good?

_Test and document what you find..._

### What Could Improve?

_Note any visual tweaks or performance issues..._

---

## Next Steps (After Validation)

Once this phase looks good:

1. **Phase 1b:** Add particle effects (stars flowing through spiral)
2. **Phase 2:** Add zoom and pan interactions
3. **Phase 3:** Render planets on the spiral
4. **Phase 4:** Make planets clickable

Each phase adds to this foundation without breaking it.

---

## Technical Notes

### Browser Compatibility

Works in all modern browsers with Canvas support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Canvas Context

Uses 2D Canvas context (`ctx.getContext('2d')`).

If we later switch to Pixi.js or Babylon.js, these mathematical formulas remain the same - only the rendering backend changes.

### Spiral Equation

The Archimedean spiral is a mathematical curve where:
- Points are equally spaced along the spiral arms
- Perfect for showing progression/flow
- Commonly used in design (logos, visualizations)

Formula: `r = a + b*θ`
- `r` = distance from center
- `θ` = angle in radians
- `a` = inner radius (where spiral starts)
- `b` = growth rate (spacing between arms)

---

## Resources

- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Archimedean Spiral](https://en.wikipedia.org/wiki/Archimedean_spiral)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

---

**Phase 1a Status:** ✅ Complete  
**Ready for Phase 1b?** Once visual validates as amazing! 🌌

