# DevOps Galaxy - Prototype

## Phase 1b: Spiral with Particles

Minimal prototype to validate the rotating spiral galaxy with particle effects.

### What This Is

- ✅ A rotating Archimedean spiral (2 arms)
- ✅ Particle system (80 particles flowing through spiral)
- ✅ Twinkling/depth effects on particles
- ✅ Smooth 60fps animation
- ✅ Vanilla JavaScript (no libraries)
- ✅ Pure Canvas rendering
- ✅ ~400 lines of code

### What This Is NOT

- ❌ Zoom/pan (coming Phase 2)
- ❌ Planets/services (coming Phase 3)
- ❌ Click interactions (coming Phase 4)
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
│   ├── spiral.js       (Spiral rendering logic - 80 lines)
│   ├── particles.js    (Particle system - 120 lines)
│   └── main.js         (Animation loop + init - 180 lines)
└── README.md           (This file)
```

---

## Code Overview

### particles.js

Contains two classes:

**`Particle`** - Represents a single particle
- Flows along the spiral path
- Has opacity and size (for depth illusion)
- Twinkling effect (opacity varies)
- Wraps around when reaching end of spiral

**`ParticleSystem`** - Manages all particles
- Creates particles distributed along spiral
- Updates all particles each frame
- Draws all particles to canvas
- Provides info about particle statistics

Key features:
- **80 particles by default** (configurable)
- **Twinkling effect** - Opacity varies over time for liveliness
- **Depth via opacity** - Particles have varying opacity for depth perception
- **Varied speeds** - Each particle has slightly different speed

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

### ROTATION COMMANDS

```javascript
// Pause/resume rotation
galaxy.toggleRotation()

// Change rotation speed (radians per frame)
galaxy.setRotationSpeed(0.001)    // Slower
galaxy.setRotationSpeed(0.005)    // Faster
galaxy.setRotationSpeed(0)         // Stop
```

### SPIRAL COMMANDS

```javascript
// Get spiral info
galaxy.spiral.getInfo()

// Change spiral parameters
galaxy.spiral.a = 75              // Inner radius
galaxy.spiral.b = 100             // Arm spacing
galaxy.spiral.armCount = 3        // Number of arms
galaxy.spiral.opacity = 0.6       // Opacity (0-1)
```

### PARTICLE COMMANDS

```javascript
// Get particle system info
galaxy.getParticleInfo()

// Change particle count
galaxy.setParticleCount(50)       // Fewer particles
galaxy.setParticleCount(150)      // More particles
galaxy.setParticleCount(200)      // Way more particles

// Tweak individual particles
galaxy.particleSystem.particles[0].speed = 0.01
galaxy.particleSystem.particles[0].opacity = 0.8
```

### CONSOLE TIPS

The console will automatically print helpful tips when the page loads:
```
💡 Tip: Try these commands in console:

  ROTATION:
    galaxy.toggleRotation()         - Pause/resume rotation
    galaxy.setRotationSpeed(0.005)  - Change rotation speed

  SPIRAL:
    galaxy.spiral.getInfo()         - Get spiral parameters
    galaxy.spiral.armCount = 3      - Change number of arms
    galaxy.spiral.opacity = 0.6     - Change opacity

  PARTICLES:
    galaxy.getParticleInfo()        - Get particle stats
    galaxy.setParticleCount(120)    - Change particle count
```

---

## Things to Test

1. **Visual Appearance**
   - Does the spiral look good?
   - Do particles enhance it?
   - Is the rotation smooth?
   - What rotation speed feels best?
   - Are the colors right (purple spiral, white particles)?
   - Do particles create depth illusion?

2. **Particle Effects**
   - Try different particle counts (50, 100, 150, 200)
   - Does twinkling look good?
   - Are particles visible enough?
   - Do they create the right atmosphere?
   - What count looks "most amazing"?

3. **Performance**
   - Check FPS in console (should be ~60)
   - Is it smooth at different particle counts?
   - Any lag when resizing window?
   - Performance on different machines?
   - At what particle count does FPS drop?

4. **Experimentation**
   - Try different rotation speeds
   - Try different spiral arm counts (2, 3, 4, 5)
   - Try different particle counts
   - Try different spiral opacity/color
   - Combine settings that look best

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

Once this phase looks amazing:

1. ✅ **Phase 1a:** Rotating spiral (DONE)
2. ✅ **Phase 1b:** Particle effects (DONE)
3. **Phase 2:** Add zoom and pan interactions
4. **Phase 3:** Render planets on the spiral
5. **Phase 4:** Make planets clickable

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

**Phase 1a Status:** ✅ Complete (Rotating Spiral)
**Phase 1b Status:** ✅ Complete (Particles)  
**Ready for Phase 2?** Once particles look amazing! 🌌

