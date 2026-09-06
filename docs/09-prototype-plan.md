# Step 9: Prototype Plan

## Goal

Build a **visual prototype** to validate the rotating spiral galaxy concept **before committing to any library choices**.

This is about answering: *Does the spiral galaxy look good? Does it feel right? What actually works in practice?*

---

## What We're NOT Doing Yet

- ❌ Choosing a specific Canvas library
- ❌ Building full DevOps integration
- ❌ Creating production-quality code
- ❌ Implementing detail panels
- ❌ Connecting to real APIs

## What We ARE Doing

- ✅ Render a rotating spiral on Canvas (plain JavaScript)
- ✅ Add particle effects (stars flowing through)
- ✅ Implement pan and zoom
- ✅ Position placeholder planets
- ✅ See if it looks amazing
- ✅ Understand performance characteristics
- ✅ Learn what Canvas features we actually need

---

## Prototype Architecture

### Tech Stack (Minimal)

```
Frontend:
├── HTML5 Canvas (plain, no library initially)
├── Vanilla JavaScript (no frameworks yet)
├── Basic CSS (styling only)
└── Local mock data (JSON)

Backend:
└── Optional - mock data served locally
```

### File Structure

```
prototype/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js             (entry point, animation loop)
│   ├── spiral.js           (spiral rendering logic)
│   ├── particles.js        (particle system)
│   ├── camera.js           (zoom & pan)
│   └── data.js             (mock service data)
└── data/
    └── services.json       (mock services)
```

---

## Phase 1a: Core Spiral Rendering (Day 1-2)

### Goal
Render a rotating spiral on Canvas.

### Deliverables

1. **HTML Canvas Setup**
   ```html
   <canvas id="galaxy" width="1400" height="800"></canvas>
   ```

2. **Spiral Drawing Function**
   - Use Archimedean spiral equation: `r = a + b*θ`
   - Draw purple/blue spiral arms
   - Rotate smoothly over time
   - Show 2-4 spiral arms

3. **Basic Animation Loop**
   ```javascript
   function animate() {
     // Clear canvas
     // Draw spiral with current rotation
     // Request next frame
     requestAnimationFrame(animate);
   }
   ```

### Success Criteria

- ✅ Spiral renders and rotates
- ✅ Smooth 60fps animation
- ✅ Looks visually interesting
- ✅ Rotation speed feels right

### Questions to Answer

- Does the spiral look like a real galaxy?
- Is the rotation smooth?
- What's the right rotation speed?
- What colors work best?
- How many spiral arms?

---

## Phase 1b: Particle Effects (Day 2-3)

### Goal
Add stars/particles flowing through the spiral.

### Deliverables

1. **Particle System**
   - Create 50-100 particles
   - Each particle has:
     - Position along spiral (theta value)
     - Speed (moves along spiral)
     - Opacity (varies for depth)
     - Size (varies for depth)

2. **Particle Update Loop**
   - Update particle position each frame
   - Wrap around when reaching end
   - Fade in/out as they move

3. **Particle Rendering**
   - Draw small dots/circles
   - Variable opacity for depth
   - Twinkling effect (optional)

### Success Criteria

- ✅ Particles flow through spiral smoothly
- ✅ Visible depth (varying opacity)
- ✅ No performance degradation
- ✅ Looks alive and dynamic

### Questions to Answer

- Do particles make it look better?
- How many is the right amount?
- What speed feels right?
- Should they twinkle?
- What opacity range works?

---

## Phase 2: Interactive Canvas (Day 3-4)

### Goal
Add zoom and pan interactions.

### Deliverables

1. **Zoom Implementation**
   ```javascript
   // Mouse wheel event
   canvas.addEventListener('wheel', (e) => {
     const zoomFactor = 1.1;
     const direction = e.deltaY > 0 ? -1 : 1;
     
     zoomLevel *= Math.pow(zoomFactor, direction);
     zoomLevel = Math.max(0.5, Math.min(3, zoomLevel)); // Clamp
   });
   ```

2. **Pan Implementation**
   ```javascript
   // Mouse drag
   canvas.addEventListener('mousedown', startPan);
   canvas.addEventListener('mousemove', updatePan);
   canvas.addEventListener('mouseup', endPan);
   ```

3. **Transform Management**
   - Apply transformations to canvas
   - Keep spiral smooth during interaction
   - Update particle rendering with transforms

### Success Criteria

- ✅ Zoom with mouse wheel works smoothly
- ✅ Pan with click-drag works smoothly
- ✅ No lag during interaction
- ✅ Spiral and particles stay in sync

### Questions to Answer

- What zoom range feels right?
- Is click-drag intuitive?
- Should there be limits on panning?
- Do we need a reset button?

---

## Phase 3: Planets Overlay (Day 4-5)

### Goal
Add placeholder planets to the spiral.

### Deliverables

1. **Mock Service Data**
   ```json
   {
     "services": [
       {
         "id": "api-service",
         "name": "API Service",
         "status": "green",
         "position": { "x": 400, "y": 300, "theta": 2.5 }
       },
       {
         "id": "frontend-service",
         "name": "Frontend",
         "status": "green",
         "position": { "x": 600, "y": 200, "theta": 1.2 }
       },
       {
         "id": "payment-service",
         "name": "Payment",
         "status": "red",
         "position": { "x": 300, "y": 500, "theta": 4.8 }
       }
     ]
   }
   ```

2. **Planet Rendering**
   - Draw circles at specified positions
   - Color: green, orange, or red (status)
   - Add glow/shadow effect
   - Add service name label

3. **Planet Positioning**
   - Manually place on spiral or nearby
   - Or automatically position based on theta value
   - Test different positions

### Success Criteria

- ✅ Planets render on canvas
- ✅ Colors match status
- ✅ Planets visible over spiral
- ✅ Labels readable
- ✅ Good visual balance

### Questions to Answer

- Do planets look good on the spiral?
- Is the positioning intuitive?
- Should planets be ON the spiral or NEAR it?
- What size should planets be?
- Do glows/shadows enhance it?

---

## Phase 4: Basic Interactivity (Day 5)

### Goal
Make planets clickable and show basic interaction.

### Deliverables

1. **Click Detection**
   - Detect mouse position
   - Check if click is within planet radius
   - Highlight clicked planet

2. **Visual Feedback**
   - Highlight clicked planet (scale up, glow)
   - Show planet name or ID
   - Log to console what was clicked

3. **Reset**
   - Click background to deselect
   - ESC key to deselect

### Success Criteria

- ✅ Can click planets
- ✅ Visual feedback on click
- ✅ Can deselect
- ✅ No lag during interaction

### Questions to Answer

- Is click detection responsive?
- Should detail panel appear?
- What visual feedback is best?
- How large should click zone be?

---

## Prototype Deliverables

### By End of Day 5, We Have

```
prototype/
├── index.html              (Canvas + controls)
├── js/
│   ├── main.js             (init + animation loop)
│   ├── spiral.js           (spiral math & rendering)
│   ├── particles.js        (particle system)
│   ├── camera.js           (zoom & pan)
│   ├── planets.js          (planet rendering & interaction)
│   └── data.js             (mock data)
├── css/
│   └── style.css           (minimal styling)
└── data/
    └── services.json       (3-4 mock services)
```

### What It Does

- Renders a beautiful rotating spiral with particles
- Smooth zoom and pan
- Clickable planets with visual feedback
- Runs in any modern browser
- ~2000 lines of vanilla JavaScript

### What It Shows

- Does the spiral look amazing? ✓
- Do particles enhance it? ✓
- Is pan/zoom smooth? ✓
- Can we interact with planets? ✓
- What performance feels like

---

## Information Gathering

### Metrics to Track

While building, pay attention to:

1. **Visual Quality**
   - Does it look impressive?
   - What tweaks make it better?
   - What was wasted effort?

2. **Performance**
   - FPS (should be 60)
   - Frame time in console
   - Smooth during interactions?
   - Any lag spikes?

3. **Complexity**
   - How complex is the code?
   - Hard to read/maintain?
   - Lots of bugs?
   - How long did each part take?

4. **Library Needs**
   - Do we need math libraries?
   - Do we need animation helpers?
   - Do we need particle system framework?
   - Do we need WebGL for performance?

---

## Deciding on a Library (After Prototype)

**After prototype is done**, we can decide:

### Evaluate Based On

1. **What was hard to implement?**
   - Particle system? → Look for particle library
   - Math/transforms? → Look for math library
   - Canvas handling? → Look for canvas framework

2. **What was slow?**
   - If 60fps struggles with current approach → Need optimization
   - If smooth → Current approach works

3. **What do we need going forward?**
   - React integration? → Pixi.js + React wrapper
   - 3D potential? → Babylon.js or Three.js
   - 2D only? → Pixi.js or EaselJS

4. **Team preferences?**
   - Simplicity? → Pixi.js
   - Features? → Babylon.js
   - Community? → Three.js

---

## Why No Library Choice Yet?

Libraries have tradeoffs. **Building it first helps us understand**:

| Question | How Prototype Answers It |
|----------|-------------------------|
| "Do we need a particle system library?" | If particles are easy, probably not |
| "Does vanilla Canvas work?" | If performance is fine, yes |
| "What features are essential?" | What takes most effort to build |
| "Will we scale to 100 planets?" | Test with many planets |
| "Is 3D needed?" | See if 2D satisfies the vision |

**Prototype = decision research**

---

## Success Criteria for Phase 1 Prototype

By the end, we should be able to answer:

- ✅ **"Does the spiral galaxy look amazing?"** — YES or NO, why?
- ✅ **"Is it performant?"** — 60fps or not, what's the bottleneck?
- ✅ **"Can we make planets interactive?"** — Easy or hard?
- ✅ **"What library would help most?"** — Identified needs
- ✅ **"Is the vision achievable?"** — Confident yes or concerns?

---

## Timeline

| Phase | Duration | Output |
|-------|----------|--------|
| 1a: Spiral | 1-2 days | Rotating spiral |
| 1b: Particles | 1 day | Particles flowing through |
| 2: Interactions | 1-2 days | Zoom & pan working |
| 3: Planets | 1 day | Planets rendered |
| 4: Interactivity | 1 day | Clickable planets |
| **Total** | **5-7 days** | **Working prototype** |

---

## Git Strategy

Commit frequently:

```
git commit -m "Phase 1a: Basic spiral rendering"
git commit -m "Phase 1b: Add particle effects"
git commit -m "Phase 2: Implement zoom and pan"
git commit -m "Phase 3: Render planets on canvas"
git commit -m "Phase 4: Basic planet interactivity"
```

Each commit is a working state you can demo or revert.

---

## What's NOT in This Prototype

- ❌ React integration
- ❌ API calls
- ❌ Detail panels
- ❌ Real CI/CD data
- ❌ Production code quality
- ❌ Tests
- ❌ Optimizations

These come after we validate the visual concept.

---

## After Prototype Success

Once we have a working prototype and know it looks amazing:

1. **Choose a Canvas library** (informed decision)
2. **Refactor into React** (integrate with frontend)
3. **Connect to backend API** (real service data)
4. **Build detail panels** (service information)
5. **Add animations** (enhance experience)
6. **Optimize performance** (scale to many services)

---

## Next Action

Ready to build? Start with:

```bash
# Create prototype directory
mkdir -p prototype/{js,css,data}

# Create basic files
touch prototype/index.html
touch prototype/js/main.js
touch prototype/css/style.css
touch prototype/data/services.json
```

Then start Phase 1a: Draw that first spiral! 🌌

---

**Last Updated:** 2026-09-06

