# Tech Spec — Puneeth's ASCII Cosmos

## Dependencies

### Core (from template)
- react, react-dom, react-router-dom
- gsap + ScrollTrigger
- geist (font package)
- vite, typescript, tailwindcss

### New installs
- `three` + `@types/three` — 3D vortex gallery
- `lenis` — smooth scrolling

---

## Component Inventory

### Layout
| Component | Source | Reuse |
|---|---|---|
| AlienCursor | Custom | Single instance at app root |

### Sections
| Component | Source | Notes |
|---|---|---|
| Hero | Modified from template | Color scheme + ASCII signature |
| Manifesto | Modified from template | Color scheme + content |
| ProjectsVortex | Custom | Three.js canvas |
| Observation | Modified from template | Color scheme + content |
| Archives | Modified from template | Remove grayscale filters, add neon glow |
| Footer | Modified from template | ASCII decoration + color |

### Reusable Components
| Component | Source | Used By |
|---|---|---|
| ColorAsciiCanvas | Modified from template | Hero (right panel) |
| VortexGallery | Custom | ProjectsVortex section |
| VortexCard | Custom (internal to VortexGallery) | One per project |

### Pages
| Component | Source |
|---|---|
| FacilityDetail | Modified from template → ProjectDetail |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|---|---|---|---|
| Color ASCII moon canvas | Vanilla Canvas API | Replace rgba fill with HSL based on intensity; add shadowBlur glow; keep existing noise/rotation/mouse logic | Medium |
| Hero entrance (blur + fade) | GSAP | Timeline: title blur(12→0)+opacity, eyebrow translateY+opacity, lead text translateY+opacity, notes staggered translateY+opacity | Low |
| Manifesto scroll reveal | GSAP + ScrollTrigger | opacity+translateY tween, trigger at top 70%–30% scrub | Low |
| Vortex gallery 3D helix | Three.js | 9 PlaneGeometry meshes positioned on helical spiral; Group auto-rotation + drag interaction; raycaster hover detection | High |
| Vortex card fly-in | GSAP + ScrollTrigger | Cards animate from z=-1000 to helix positions, stagger 0.1s | Medium |
| Vortex background particles | Three.js | InstancedMesh with 200 points, custom ASCII texture, drift animation via sin(time) | Medium |
| Observation scroll reveal | GSAP + ScrollTrigger | opacity+scale tween, trigger at top 60% | Low |
| Archives 3D carousel | GSAP + ScrollTrigger | Same as template: scroll-scrubbed rotationY/rotationZ/brightness | Low |
| Archives vault burst-in | GSAP | Timeline: carousel zoom away (rotationX, rotationY, z), then burstGridIn with per-item distance-based delay | Medium |
| Alien cursor follow | Vanilla JS | mousemove listener → translate3d; requestAnimationFrame loop | Low |
| Alien cursor trail | Vanilla JS | Ring buffer of 5 previous positions, render at decreasing opacity with cycling characters | Medium |
| Archives vault close | GSAP | Reverse of burst-in: grid items fade+scale+z, then carousel reset | Low |

---

## State & Logic

### Alien Cursor
- State: position (x, y), hover state (boolean), trail positions (ring buffer)
- Event: global mousemove, mouseover/mouseout on interactive elements
- Note: Disable on touch devices via `'ontouchstart' in window` check

### Vortex Gallery
- State: rotation offset (drag accumulation), hovered card index, target rotation
- Refs: scene, camera, renderer, helix group, raycaster, mouse vector
- Event: mousedown/mousemove/mouseup for drag, click for navigation
- Cleanup: dispose renderer, geometries, materials, textures on unmount

### Color ASCII Canvas
- Same as template: refs for canvas, ctx, width, height, cols, rows, time, mouse
- Modified: color lookup function based on intensity (HSL mapping)

---

## Architecture Decisions

### Three.js in React
- Use raw Three.js (not R3F) for direct control over the vortex scene
- All Three.js setup/teardown in a single `useEffect`
- Animation loop via `requestAnimationFrame` with delta-time
- Resize handled via ResizeObserver on the container ref

### Project Data
- Keep using `facilitiesConfig` in `config.ts` but repurpose fields:
  - `slug` → repo slug
  - `name` → repo name
  - `code` → language
  - `status` → description
  - `address` → tags
  - `image` → generated cover image path
  - `article` → project details + certificate slugs
- Project detail page reads from same config, filters by slug

### Certificate Data
- Use `archivesConfig.items` with generated certificate poster images

### Cursor Strategy
- Render at app root level (outside router)
- Global CSS: `* { cursor: none !important; }`
- Event delegation for hover detection (not per-element listeners)

---

## Other Key Decisions

### No shadcn/ui components needed
The design is fully custom-styled with inline styles (matching template pattern). No shadcn components are used.

### SPA Fallback
The `/project/:slug` route requires SPA fallback on static hosting. Add a `404.html` that redirects to `index.html`, or use HashRouter as fallback if hosting doesn't support SPA redirects.

### Asset Strategy
- 13 images to generate (9 project covers + 4 certificates)
- 2 videos to generate (manifesto + observation)
- All placed in `public/images/` and `public/videos/`

### Performance Notes
- Vortex gallery: reduce particle count to 100 on mobile
- ASCII canvas: reduce cols to 90 on < 768px
- Lazy-load Three.js via dynamic import if bundle size is a concern
