# UI Design

## What is UI Design?

**UI (User Interface) Design** describes how users see and interact with the system. It answers:
- What does the dashboard look like?
- Where are the key elements?
- What happens when the user clicks something?
- What colors, fonts, and spacing do we use?
- How does it look on different screen sizes?

UI Design bridges the gap between abstract data model and actual visual interface.

---

## Overall Layout

The DevOps Galaxy dashboard is an interactive, immersive experience designed to feel like exploring a real galaxy. It has two main sections:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Overlay)                                             │
│  DevOps Galaxy  |  Status: 3 Green, 0 Orange, 1 Red  [↻]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  INTERACTIVE GALAXY ENVIRONMENT                              │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ✧ ✧  Animated starfield background            ✧  │    │
│  │                                                     │    │
│  │              🪐 frontend-service                   │    │
│  │                      ↓                             │    │
│  │             🪐 api-service ✧                      │    │
│  │              ╱            ╲                        │    │
│  │             ╱              ╲                       │    │
│  │            ↓                ↓                      │    │
│  │   🪐 database-service   🪐 payment-service       │    │
│  │                                                     │    │
│  │ (Pan with mouse, Zoom with scroll wheel)          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  DETAIL PANEL (Slides in on planet click)                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ✕ API Service | Status: Green | [...]             │    │
│  └─────────────────────────────────────────────────────┘    │
```

---

## Section 1: Header

The header provides information and controls.

```
┌─────────────────────────────────────────────────────────────┐
│ DevOps Galaxy    Status: 3 Green, 0 Orange, 1 Red   [↻]    │
└─────────────────────────────────────────────────────────────┘
```

### Header Components

| Element | Purpose | Notes |
|---------|---------|-------|
| **Logo** | "DevOps Galaxy" text | Left side, identifies the app |
| **Status Summary** | Quick count of services by status | Shows: "3 Green, 1 Orange, 2 Red" |
| **Refresh Button** | Manual refresh trigger | Icon: ↻, clicking triggers POST /api/refresh |
| **Auto-Refresh Indicator** | Shows refresh is happening | Spinner/pulse animation |
| **Last Updated** | Timestamp of last data fetch | Right side, updates every 30 seconds |

### Header Styling

- **Background:** Dark (charcoal or navy)
- **Text:** Light (white or light gray)
- **Height:** ~60px
- **Fixed Position:** Stays at top when scrolling

---

## Section 2: Interactive Galaxy Environment

This is the main visualization. Services are displayed as **floating planets inside an interactive galaxy**. The environment is fully interactive and immersive.

### Galaxy Environment

- **Size:** Full viewport (full width, full height minus header)
- **Background:** Deep space with subtle animated starfield (twinkling stars, nebula effects)
- **Coordinate System:** Infinite 2D space (planets can be positioned anywhere)
- **Interactivity:** 
  - **Pan:** Click and drag to move around the galaxy
  - **Zoom:** Mouse wheel to zoom in/out
  - **Reset:** Button or keyboard shortcut to center view and reset zoom

### Visual Atmosphere

The galaxy environment should feel:
- **Immersive** — Like you're floating in space
- **Responsive** — Planets and background react to interaction
- **Calm** — Subtle animations, not jarring or distracting
- **Professional** — Dark space theme consistent with DevOps tools

### Planet Representation

Each service is a planet:

```
        Status Color Ring
              ⬤
          ◆━━⭐━━◆
         ◆         ◆
         ◆  name   ◆
         ◆         ◆
          ◆━━━━━━◆
```

**Planet Elements:**

1. **Circle** — Represents the service
   - **Size:** ~80px diameter (adjustable)
   - **Color:** Based on status
     - 🟢 Green: `#10b981` (emerald)
     - 🟠 Orange: `#f59e0b` (amber)
     - 🔴 Red: `#ef4444` (red)

2. **Status Ring** — Subtle outer ring indicating status
   - **Opacity:** 60%
   - **Glow Effect** (optional): Subtle shadow/glow for better visibility

3. **Label** — Service name below the planet
   - **Font:** 14px, sans-serif
   - **Color:** White or dark gray (depending on background)
   - **Max Width:** 120px (truncate with ellipsis if longer)

4. **Connection Lines** — Dependencies shown as lines between planets
   - **Style:** Curved paths (not straight lines)
   - **Color:** Semi-transparent white or light gray
   - **Width:** 2px
   - **Arrow:** Direction indicator (if clear which way dependency flows)

### Example Galaxy

```
                    ┌─────────────────┐
                    │ frontend-service│
                    │  🟢 (Green)      │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │  api-service    │
                    │  🟢 (Green)      │  ◄─── Planet
                    └──┬──────┬───┬───┘
                       │      │   │
        ┌──────────────┘       │   └──────────────┐
        │                      │                  │
    ┌───▼──────────┐   ┌──────▼────────┐   ┌────▼─────────┐
    │cache-service │   │database-service│  │payment-service
    │🟢 (Green)     │   │🟢 (Green)      │  │🔴 (Red)      │
    └──────────────┘   └────────────────┘  └──────────────┘
```

### Interaction: Planet States

#### Default State (Not Hovered)
- Planet floats in space
- Subtle glow matches status color
- Label visible below planet
- Background starfield animates softly

#### Hovered State
```
         🟢
      ◆━━⭐━━◆     ◄─── Ring brightens & glows
     ◆         ◆     ◄─── Circle grows slightly (1.15x scale)
     ◆   api   ◆     ◄─── Label becomes brighter
     ◆         ◆     ◄─── Glow effect intensifies
      ◆━━━━━━◆
    Cursor: pointer
    Shadow: Prominent glow halo
```

#### Clicked State
```
         🟢
      ◆━━⭐━━◆     ◄─── Highlighted
     ◆         ◆     ◄─── Details panel slides in
     ◆   api   ◆     ◄─── Planet may smoothly move to center (optional)
     ◆         ◆
      ◆━━━━━━◆
    Details Panel Appears ─►
```

### Immersive Effects

- **Floating Motion:** Planets have subtle floating/bobbing animations (optional parallax)
- **Glow & Aura:** Each planet has a colored glow that matches its status
- **Connection Lines:** Dependencies shown as glowing curves between planets
- **Responsive:** Planets react smoothly to pan/zoom interactions

---

## Section 3: Service Detail Panel

When a user clicks a planet, a detail panel slides in from the right.

### Panel Layout

```
┌────────────────────────────────────────┐
│ ✕  API Service                         │  ◄─── Close button
├────────────────────────────────────────┤
│                                        │
│ OVERVIEW                               │
│ Status: ●🟢 Green                     │
│ Team: Backend Team                     │
│ Repo: github.com/Shai-Shargal/api-srv │
│ Docs: docs.example.com/api             │
│                                        │
├────────────────────────────────────────┤
│ LATEST PIPELINE                        │
│ Run #12345                             │
│ Branch: main                           │
│ Started: 2026-09-04 10:00:00          │
│                                        │
│ STAGES:                                │
│ ✅ Build (330s)                        │
│ ✅ Test  (615s)                        │
│ ✅ Deploy (555s)                       │
│                                        │
│ COMMIT:                                │
│ abc123def456                           │
│ "Fix API response parsing"             │
│ by Alice Chen                          │
│                                        │
├────────────────────────────────────────┤
│ DEPENDENCIES                           │
│ ← frontend-service (required)          │
│ → database-service (required)          │
│ → cache-service (optional)             │
│                                        │
│ [View Full Logs] [GitHub] [Jenkins]   │
│                                        │
└────────────────────────────────────────┘
```

### Panel Sections

#### 1. Header (Sticky)
```
✕  API Service
```
- Close button (×)
- Service name
- Can remain visible while scrolling

#### 2. Overview
```
Status: ●🟢 Green
Team: Backend Team
Repository: https://github.com/...
Documentation: https://docs.example.com/...
Last Updated: 2026-09-04 10:35:45 (5 seconds ago)
```

#### 3. Latest Pipeline
```
Run #12345
Branch: main
Triggered by: Alice Chen
Started: 2026-09-04 10:00:00
Completed: 2026-09-04 10:25:00
Total Duration: 25 minutes

STAGES:
✅ Build    (5m 30s)    [View Logs]
✅ Test     (10m 15s)   [View Logs]
✅ Deploy   (9m 15s)    [View Logs]
```

Stage status icons:
- ✅ Passed
- ❌ Failed
- ⏳ Running (spinning icon)
- ⊙ Skipped

#### 4. Last Commit
```
Hash: abc123def456
Message: "Fix API response parsing"
Author: Alice Chen (alice@example.com)
Pushed: 2026-09-04 09:55:00

[View on GitHub]
```

#### 5. Dependencies
```
DEPENDS ON:
→ database-service (required)
→ cache-service (optional)

DEPENDED ON BY:
← frontend-service
← payment-service
```

#### 6. Actions (Footer)
```
[View Full Logs] [GitHub] [Jenkins] [Trigger Build]
```

Links to external systems for deeper investigation.

### Panel Behavior

- **Appears:** Slides in from right when planet is clicked
- **Width:** ~400-500px (responsive)
- **Height:** Full viewport (scrollable)
- **Closes:** Click × button, click outside panel, or ESC key
- **Transitions:** Smooth slide animation (300ms)
- **Z-Index:** Above galaxy canvas

---

## Implementation: Using Existing Libraries

The interactive galaxy environment (starfield animation, zoom, pan, particle effects, etc.) should **not be built from scratch**.

When we reach implementation phase, we will:

1. Research and evaluate existing libraries/components for interactive galaxy/space environments
2. Look for features like:
   - Canvas or WebGL-based rendering
   - Particle systems or starfield effects
   - Zoom and pan capabilities
   - Smooth animations
   - Good React integration
3. Select an appropriate library that fits our needs
4. Integrate it into our React application

**Note:** No specific library has been chosen yet. This decision will be made during the implementation phase, after evaluating available options.

---

## Color Scheme

### Status Colors

| Status | Color | Hex | RGB | Meaning |
|--------|-------|-----|-----|---------|
| **Green** | Emerald | `#10b981` | `16, 185, 129` | Healthy / Passed |
| **Orange** | Amber | `#f59e0b` | `245, 158, 11` | Running / In Progress |
| **Red** | Red | `#ef4444` | `239, 68, 68` | Failed / Error |
| **Gray** | Slate | `#64748b` | `100, 116, 139` | Unknown / Pending |

### Background Colors

| Element | Color | Hex | Purpose |
|---------|-------|-----|---------|
| **Page Background** | Dark Gray | `#1f2937` | Main canvas background |
| **Header** | Darker Gray | `#111827` | Contrast with main area |
| **Detail Panel** | Dark Gray | `#1f2937` | Consistent with canvas |
| **Hover State** | Lighter Gray | `#374151` | Indicates interactivity |

### Text Colors

| Usage | Color | Hex | Contrast |
|-------|-------|-----|----------|
| **Primary Text** | White | `#ffffff` | High contrast on dark |
| **Secondary Text** | Light Gray | `#d1d5db` | Good readability |
| **Labels** | Medium Gray | `#9ca3af` | De-emphasized |
| **Status Indicators** | Color-coded | Varies | Match status color |

### Dark Theme Rationale

- **Reduces Eye Strain:** Dark backgrounds are common in DevOps dashboards
- **Reduces Power Usage:** Especially on OLED screens
- **Makes Colors Pop:** Status indicators stand out more on dark backgrounds
- **Professional Feel:** Consistent with tools like GitHub, Jenkins, etc.

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", 
             "Oxygen", "Ubuntu", "Cantarell", sans-serif;
```

Modern system fonts (no web font downloads needed).

### Font Sizes

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| **Page Title** | 32px | Bold (700) | "DevOps Galaxy" in header |
| **Service Name** | 16px | Semi-bold (600) | Planet labels, detail panel title |
| **Section Headers** | 14px | Semi-bold (600) | "LATEST PIPELINE", "DEPENDENCIES" |
| **Body Text** | 14px | Regular (400) | Status info, timestamps |
| **Small Text** | 12px | Regular (400) | Secondary info, hints |
| **Code/Hash** | 12px | Monospace | Git commit hashes |

---

## Spacing & Layout

### Grid System

Use an 8px grid for consistency:
- Margins: 8px, 16px, 24px, 32px
- Padding: 8px, 16px, 24px
- Border Radius: 4px, 8px, 12px

### Canvas Padding

- Padding around galaxy canvas: 32px
- Minimum distance between planets: 100px
- Planet size: 80px diameter

### Detail Panel

- Width: 400px (fixed, or responsive to 90% on mobile)
- Padding: 24px
- Margins: 0 (full height)
- Max Width: 100% on mobile, 400px on desktop

---

## Responsive Design

DevOps Galaxy should work on different screen sizes.

### Breakpoints

| Breakpoint | Width | Device | Layout |
|------------|-------|--------|--------|
| **Mobile** | < 640px | Phone | Single column, stacked |
| **Tablet** | 640px - 1024px | Tablet | Galaxy smaller, panel on bottom |
| **Desktop** | > 1024px | Desktop | Full side-by-side layout |

### Mobile Adaptations

**Interactive Galaxy:**
- Smaller planets (60px instead of 80px)
- Touch-friendly pan/drag gestures
- Pinch-to-zoom support
- On-screen zoom controls (+ / - buttons) as fallback
- Simplified starfield (fewer particles for performance)

**Detail Panel:**
- Full width on mobile
- Slides up from bottom instead of from right
- Less padding to save space

**Header:**
- Simplified on mobile
- Compact status info
- Clear close button for detail panel

---

## Animations & Transitions

### Hover Animations

```css
/* Planet hover effect */
.planet:hover {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  transition: all 200ms ease-out;
}
```

### Panel Slide-In

```css
/* Detail panel entrance */
.detail-panel {
  animation: slideInRight 300ms ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Status Pulse (For Orange/Running)

```css
/* Orange planets pulse */
.planet.orange {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
```

### Auto-Refresh Indicator

```css
/* Refresh spinner in header */
.refresh-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

---

## Accessibility Considerations

### Color Contrast

- All text meets WCAG AA standard (4.5:1 contrast ratio)
- Don't rely solely on color (also use icons/patterns)

### Keyboard Navigation

- Tab through planets
- Enter to select planet
- ESC to close detail panel
- Arrow keys to navigate planets (future)

### Screen Readers

- Planets have `aria-label` attributes
- Status text is announced: "API Service, status Green"
- Links have descriptive text

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Wireframe: Dashboard Layout

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ DevOps Galaxy    3🟢 0🟠 1🔴          Last Updated: 10:35:45 [↻] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────────────────────────┐  ┌────────────────────┐ │
│ │                                     │  │ ✕ API Service      │ │
│ │              🪐 frontend (G)        │  ├────────────────────┤ │
│ │                    |                │  │ OVERVIEW           │ │
│ │                    ▼                │  │ Status: 🟢 Green   │ │
│ │          🪐 api-service (G)        │  │ Team: Backend      │ │
│ │           /              \          │  │ Repo: github...    │ │
│ │          /                \         │  │                    │ │
│ │         ▼                  ▼        │  │ LATEST PIPELINE    │ │
│ │   🪐 database (G)  🪐 payment (R)  │  │ Run #12345         │ │
│ │                                     │  │ ✅ Build (330s)    │ │
│ │                                     │  │ ✅ Test  (615s)    │ │
│ │  Galaxy Canvas (Scrollable)         │  │ ✅ Deploy (555s)   │ │
│ │                                     │  │                    │ │
│ │                                     │  │ COMMIT:            │ │
│ │                                     │  │ abc123def456       │ │
│ │                                     │  │ "Fix API..."       │ │
│ │                                     │  │                    │ │
│ │                                     │  │ DEPENDENCIES       │ │
│ │                                     │  │ ← frontend         │ │
│ │                                     │  │ → database         │ │
│ │                                     │  │ → cache (opt)      │ │
│ └─────────────────────────────────────┘  └────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌────────────────────────────────┐
│DevOps Galaxy  3🟢 0🟠 1🔴  [↻]│
├────────────────────────────────┤
│                                │
│  🪐 frontend (G)               │
│         |                      │
│         ▼                      │
│  🪐 api-service (G)           │
│   /            \               │
│  /              \              │
│ ▼                ▼             │
│ 🪐 db (G)  🪐 payment (R)     │
│                                │
│  Galaxy Canvas (Pinch to Zoom) │
│                                │
├────────────────────────────────┤
│ ✕ API Service                  │
│ Status: 🟢 Green               │
│ Team: Backend Team             │
│ ✅ Build   (330s)              │
│ ✅ Test    (615s)              │
│ ✅ Deploy  (555s)              │
│ [View Logs] [GitHub]           │
└────────────────────────────────┘
```

---

## State Machine: UI States

The dashboard can be in different states:

```
LOADING
  ├─ Show spinner
  └─> LOADED

LOADED
  ├─ Show planets with status
  ├─> On planet click → DETAIL_OPEN
  └─> On refresh → REFRESHING

REFRESHING
  ├─ Show spinner in header
  ├─ Animate status updates
  └─> LOADED

DETAIL_OPEN
  ├─ Show detail panel
  ├─> On close button → LOADED
  ├─> On ESC key → LOADED
  └─> On click outside → LOADED

ERROR
  ├─ Show error message
  │ "Unable to fetch data: GitHub API unavailable"
  ├─ Show cached data if available
  └─> Retry button
```

---

## Visual Examples

### Status Indicators

```
🟢 GREEN (Healthy)
   All stages passed
   Latest deployment successful
   No errors

🟠 ORANGE (Running)
   Build in progress
   Tests running
   Deployment in progress
   
   Animated pulse effect

🔴 RED (Failed)
   Build failed OR
   Tests failed OR
   Deployment failed
   
   Requires attention
```

### Stage Status Icons

```
✅ Passed     (checkmark)
❌ Failed     (X mark)
⏳ Running    (animated spinner)
⊙ Skipped     (circle)
? Unknown     (question mark)
```

---

## Summary: Key UI Principles

1. **Interactive Galaxy** — Immersive space environment with pan/zoom
2. **Floating Planets** — Services as interactive planets with glow effects
3. **Clear Status Visualization** — Green/Orange/Red colors at a glance
4. **Responsive Interactions** — Smooth hover effects, immediate feedback
5. **Immersive Atmosphere** — Animated starfield, subtle floating motion
6. **Responsive Design** — Works on mobile (touch), tablet, desktop
7. **Fast Interactions** — Smooth animations, quick loads
8. **Accessible** — Keyboard navigation, screen reader support
9. **Professional** — Modern design consistent with DevOps tools

---

**Last Updated:** 2026-09-04

