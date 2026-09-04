# SVG Design

## What is SVG Design?

**SVG (Scalable Vector Graphics)** is a format for drawing vector graphics (shapes, lines, text) using XML. For DevOps Galaxy, SVG is how we render planets, connections, and labels on the canvas.

**SVG Design** answers:
- How do we draw planets (circles, rings, glows)?
- How do we draw connections between planets (curved lines)?
- How do we position planets in the galaxy?
- How do we make planets interactive (clickable, hoverable)?
- How do we handle zoom and pan?

SVG is perfect for DevOps Galaxy because:
- Scalable (looks good at any zoom level)
- Interactive (can respond to clicks, hovers)
- Crisp (sharp lines and shapes, not blurry like canvas)
- Accessible (can contain semantic information)

---

## SVG Structure Overview

The SVG will have multiple layers, rendered from back to front:

```
SVG Canvas (infinite 2D space)
├── Background Layer
│   └── Animated starfield (twinkling stars)
├── Connection Layer
│   ├── Bezier curves (dependencies)
│   └── Connection labels (optional)
├── Planet Layer
│   ├── Planet group 1
│   │   ├── Glow/shadow
│   │   ├── Circle (colored)
│   │   ├── Ring/border
│   │   └── Label text
│   ├── Planet group 2
│   │ ...
└── UI Layer (Overlay)
    ├── Zoom controls
    ├── Pan indicator
    └── Status summary
```

---

## Layer 1: Starfield Background

The animated starfield provides atmosphere and depth.

### Starfield Elements

```svg
<g id="starfield">
  <circle cx="100" cy="50" r="1" fill="#ffffff" opacity="0.6" />
  <circle cx="250" cy="180" r="0.8" fill="#ffffff" opacity="0.4" />
  <circle cx="450" cy="300" r="1.2" fill="#ffffff" opacity="0.8" />
  <!-- Many more stars... -->
  
  <!-- Optional: nebula/galaxy background -->
  <ellipse cx="2000" cy="1500" rx="1000" ry="800" 
           fill="url(#nebulaGradient)" opacity="0.1" />
</g>
```

### Starfield Properties

| Property | Value | Purpose |
|----------|-------|---------|
| **Star Count** | 100-300 | More on desktop, fewer on mobile |
| **Star Size** | 0.5-2px | Varied for depth |
| **Opacity** | 0.3-0.9 | Varied for depth |
| **Color** | #ffffff | White stars |
| **Animation** | Twinkling (optional) | Subtle opacity changes over 2-4 seconds |

### Starfield Performance

- Stars are static (generated once at load)
- Twinkling is optional (can skip for performance)
- On mobile: Fewer stars for better performance
- Starfield stays in background (rarely updates)

---

## Layer 2: Connection Layer

Connections show dependencies between planets.

### Connection Structure

```svg
<g id="connections">
  <!-- Dependency: frontend-service → api-service -->
  <path d="M 100 100 Q 200 150 300 200" 
        stroke="#ffffff" 
        stroke-width="2" 
        fill="none" 
        opacity="0.6"
        class="connection-line" />
  
  <!-- Arrow head (optional) -->
  <polygon points="300,200 295,195 300,190" 
           fill="#ffffff" 
           opacity="0.6" />
  
  <!-- Connection label (optional) -->
  <text x="180" y="130" font-size="12" fill="#d1d5db">
    required
  </text>
  
  <!-- More connections... -->
</g>
```

### Connection Properties

| Property | Value | Purpose |
|----------|-------|---------|
| **Line Type** | Bezier Curve (quadratic) | Smooth, non-overlapping paths |
| **Color** | #ffffff (white) | Visible on dark background |
| **Opacity** | 0.6 | Subtle, not distracting |
| **Width** | 2px | Clear but not bold |
| **Arrow** | Optional at destination | Shows direction of dependency |
| **Label** | "required" or "optional" | Indicates dependency type |

### Bezier Curve Calculation

Connections use **quadratic Bezier curves** to create smooth paths:

```
Start point:  (100, 100)    — Planet A center
Control point: (200, 150)   — Calculated midpoint
End point:     (300, 200)   — Planet B center

SVG Path: M 100 100 Q 200 150 300 200
          └─ Move to start
              └─ Quadratic bezier to end via control point
```

The control point is calculated to avoid crossing planets:
- Midpoint between two planets
- Offset perpendicular to the line connecting them
- Offset distance depends on planet distance

### Optional: Connection States

```
Default:   opacity: 0.6, stroke-width: 2px
Hovered:   opacity: 0.9, stroke-width: 3px, color: status-color
Related:   opacity: 1.0 (if hovering over connected planet)
Hidden:    opacity: 0.2 (others fade when panning near a planet)
```

---

## Layer 3: Planet Layer

Planets are the main visual elements. Each planet is a group containing multiple SVG elements.

### Single Planet Structure

```svg
<g id="planet-api-service" class="planet" data-service-id="api-service">
  
  <!-- Background glow (shadow effect) -->
  <circle cx="300" cy="200" r="45" 
          fill="#10b981" 
          opacity="0.2" 
          filter="url(#planetGlow)" />
  
  <!-- Outer ring/border -->
  <circle cx="300" cy="200" r="42" 
          fill="none" 
          stroke="#10b981" 
          stroke-width="1" 
          opacity="0.6" />
  
  <!-- Main planet circle (status color) -->
  <circle cx="300" cy="200" r="40" 
          fill="#10b981" 
          class="planet-circle" />
  
  <!-- Inner ring highlight -->
  <circle cx="300" cy="200" r="38" 
          fill="none" 
          stroke="#ffffff" 
          stroke-width="1" 
          opacity="0.3" />
  
  <!-- Status icon (optional) -->
  <text x="300" y="205" 
        text-anchor="middle" 
        font-size="24" 
        fill="#ffffff">
    ✓
  </text>
  
  <!-- Label background (optional, for readability) -->
  <rect x="250" y="250" width="100" height="24" 
        fill="#1f2937" 
        opacity="0.8" 
        rx="4" />
  
  <!-- Service name label -->
  <text x="300" y="268" 
        text-anchor="middle" 
        font-size="14" 
        fill="#ffffff"
        class="planet-label">
    api-service
  </text>
  
  <!-- Invisible click/hover zone (larger than visual) -->
  <circle cx="300" cy="200" r="50" 
          fill="transparent" 
          class="planet-hitbox"
          pointer-events="all" />
</g>
```

### Planet Components

#### 1. Glow Effect
```svg
<circle cx="300" cy="200" r="45" 
        fill="#10b981" 
        opacity="0.2" 
        filter="url(#planetGlow)" />
```
- Soft shadow/halo behind planet
- Color matches status (green, orange, red)
- Can use SVG blur filter for softness

#### 2. Outer Ring
```svg
<circle cx="300" cy="200" r="42" 
        fill="none" 
        stroke="#10b981" 
        stroke-width="1" 
        opacity="0.6" />
```
- Subtle border around planet
- Same color as planet
- Semi-transparent

#### 3. Main Planet Circle
```svg
<circle cx="300" cy="200" r="40" 
        fill="#10b981" 
        class="planet-circle" />
```
- Primary visual element
- Color: Green/Orange/Red (status)
- Size: 80px diameter (40px radius)

#### 4. Inner Highlight
```svg
<circle cx="300" cy="200" r="38" 
        fill="none" 
        stroke="#ffffff" 
        stroke-width="1" 
        opacity="0.3" />
```
- Subtle white inner ring
- Creates depth/3D effect
- Optional (can skip for simplicity)

#### 5. Status Icon (Optional)
```svg
<text x="300" y="205" font-size="24" fill="#ffffff">
  ✓
</text>
```
- Shows latest pipeline result
- ✓ = Passed
- ✗ = Failed
- ⏳ = Running
- Optional feature

#### 6. Label
```svg
<text x="300" y="268" text-anchor="middle" font-size="14">
  api-service
</text>
```
- Service name below planet
- Centered
- White text
- Optional background for readability

#### 7. Hit Box
```svg
<circle cx="300" cy="200" r="50" 
        fill="transparent" 
        class="planet-hitbox"
        pointer-events="all" />
```
- Invisible larger circle
- Makes small planets easier to click
- Only visible for debugging

### Planet Sizing

| Size | Radius | Diameter | Use Case |
|------|--------|----------|----------|
| **Small** | 30px | 60px | Mobile, zoomed out |
| **Medium** | 40px | 80px | Default size |
| **Large** | 50px | 100px | Zoomed in, highlighted |

Size changes smoothly with zoom level.

### Planet Colors (Status)

```css
/* Green: Healthy */
fill: #10b981
stroke: #10b981
glow-color: #10b981

/* Orange: Running */
fill: #f59e0b
stroke: #f59e0b
glow-color: #f59e0b

/* Red: Failed */
fill: #ef4444
stroke: #ef4444
glow-color: #ef4444

/* Gray: Unknown */
fill: #64748b
stroke: #64748b
glow-color: #64748b
```

### Planet States

#### Default State
```css
.planet {
  opacity: 1;
  filter: none;
}
```

#### Hover State
```css
.planet:hover {
  transform: scale(1.15);
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}
```

#### Active/Clicked State
```css
.planet.active {
  transform: scale(1.2);
  filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
  stroke-width: 2;
}
```

#### Faded State (when panning)
```css
.planet.faded {
  opacity: 0.3;
}
```

---

## Layer 4: Coordinate System

How are planets positioned in the galaxy?

### Coordinate Space

The SVG has an infinite coordinate system:

```
SVG Coordinate System:
(0, 0) ─────────────► x
  │
  │       🪐 frontend (100, 100)
  │            ↓
  │      🪐 api (300, 300)
  │       /        \
  │      /          \
  │     ↓            ↓
  │ 🪐 db       🪐 payment
  │ (200, 500)  (400, 500)
  │
  ▼
  y
```

### Positioning Strategy

Planets are positioned manually in a configuration file:

```json
{
  "services": [
    {
      "id": "frontend-service",
      "position": { "x": 100, "y": 100 }
    },
    {
      "id": "api-service",
      "position": { "x": 300, "y": 300 }
    },
    {
      "id": "database-service",
      "position": { "x": 200, "y": 500 }
    },
    {
      "id": "payment-service",
      "position": { "x": 400, "y": 500 }
    }
  ]
}
```

### Future: Force-Directed Layout

Later, we could use a **force-directed layout algorithm** to automatically position planets:

```
Force Simulation:
- Planets repel each other (avoid overlap)
- Connections act like springs (pull connected planets closer)
- Algorithm iterates until stable

Libraries: D3.js force-layout, Three.js, Babylon.js
```

For now, manual positioning is sufficient.

---

## Layer 5: Zoom & Pan

SVG handles zoom and pan using transformations.

### Viewport & Transform

```svg
<svg id="galaxy-canvas" width="1200" height="800" viewBox="0 0 1200 800">
  <g id="galaxy-content" transform="translate(0, 0) scale(1)">
    <!-- All planets, connections, starfield here -->
  </g>
</svg>
```

### Zoom Implementation

Zoom is handled by scaling the transform:

```javascript
// User scrolls mouse wheel
onMouseWheel(event) {
  const zoomFactor = 1.1; // 10% zoom per scroll
  const direction = event.deltaY > 0 ? -1 : 1; // down = zoom out
  
  currentZoom *= Math.pow(zoomFactor, direction);
  
  // Clamp zoom (min 0.5x, max 3x)
  currentZoom = Math.max(0.5, Math.min(3, currentZoom));
  
  // Update SVG transform
  galaxyContent.style.transform = 
    `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
}
```

### Pan Implementation

Pan is handled by translating the transform:

```javascript
// User clicks and drags
onMouseDown(event) {
  startX = event.clientX;
  startY = event.clientY;
  startPanX = panX;
  startPanY = panY;
}

onMouseMove(event) {
  if (mouseDown) {
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    
    panX = startPanX + deltaX;
    panY = startPanY + deltaY;
    
    // Update SVG transform
    galaxyContent.style.transform = 
      `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
  }
}
```

### Transform Matrix

The final transform combines zoom and pan:

```
transform = translate(panX, panY) scale(zoomLevel)

Example: 
- panX = 100, panY = 50 (panned right and down)
- zoomLevel = 1.5 (zoomed in 50%)
- Result: translate(100px, 50px) scale(1.5)
```

---

## SVG Filters & Effects

SVG supports filters for visual effects.

### Glow Effect

```svg
<defs>
  <filter id="planetGlow">
    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
    <feMerge>
      <feMergeNode in="coloredBlur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
```

### Drop Shadow

```svg
<filter id="dropShadow">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
  <feOffset dx="2" dy="2" result="offsetblur"/>
  <feComponentTransfer>
    <feFuncA type="linear" slope="0.3"/>
  </feComponentTransfer>
  <feMerge>
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### Gradients (Optional)

```svg
<defs>
  <radialGradient id="nebulaGradient">
    <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#1f2937" stop-opacity="0"/>
  </radialGradient>
</defs>
```

---

## Interactive SVG Elements

### Click Detection

Planets are clickable using `pointer-events` and click handlers:

```svg
<g id="planet-api-service" class="planet">
  <!-- Visual elements... -->
  
  <!-- Hit box with click handler -->
  <circle cx="300" cy="200" r="50" 
          fill="transparent" 
          class="planet-hitbox"
          pointer-events="all"
          onclick="handlePlanetClick(event)" />
</g>
```

JavaScript:

```javascript
function handlePlanetClick(event) {
  const planet = event.target.closest('.planet');
  const serviceId = planet.dataset.serviceId;
  
  // Highlight planet
  planet.classList.add('active');
  
  // Open detail panel
  showDetailPanel(serviceId);
}
```

### Hover Effects

```svg
<g id="planet-api-service" class="planet">
  <!-- Elements -->
</g>
```

CSS:

```css
.planet:hover {
  cursor: pointer;
}

.planet:hover .planet-circle {
  filter: brightness(1.2);
}

.planet:hover .planet-label {
  font-weight: bold;
}
```

---

## SVG Organization: Best Practices

### Keep SVG Simple

- Don't generate massive SVGs (slow to parse)
- Update only what changes (planets, not entire SVG)
- Use classes for styling (not inline styles)

### Performance Tips

- Use CSS for animations (faster than SVG animations)
- Debounce zoom/pan events (don't update on every pixel)
- Cache SVG DOM references
- Consider Canvas or WebGL for very large galaxy (100+ planets)

### Accessibility

```svg
<g id="planet-api-service" class="planet" role="button">
  <title>API Service - Status: Green</title>
  <desc>Backend API service, currently healthy with all tests passing</desc>
  
  <!-- Elements -->
</g>
```

---

## Summary: SVG Structure

```
SVG Canvas (Coordinate System)
├── Background
│   └── Starfield (static stars + optional nebula)
├── Connections
│   ├── Bezier curves (dependencies)
│   └── Labels (required/optional)
├── Planets
│   └── Per service:
│       ├── Glow
│       ├── Outer ring
│       ├── Circle (status color)
│       ├── Inner highlight
│       ├── Status icon
│       ├── Label
│       └── Hit box
└── Zoom/Pan
    └── Applied via transform: translate() scale()
```

---

## Next Steps

Once we approve SVG Design:

1. **Prototype (Step 9)** — Build a small working version
   - Create the basic SVG structure
   - Render planets and connections
   - Implement zoom/pan
   - Hook up API calls
   - Test with mock data

2. Then expand to real services, CI/CD, etc.

---

**Last Updated:** 2026-09-04

