# Marcelino Academy — Premium Website Blueprint

Luxury education brand positioning: **"East Africa's most forward-thinking international academy."**

---

## Full site structure

```
/                          → Cinematic hero + proof + pillars + journey + testimonials + CTA
/about                     → Heritage, mission, leadership, campus film strip
/admissions                → 4-step journey, fees transparency, Spline apply widget
/academics                 → Curriculum bands, outcomes, university pathways
/courses                   → Bento program grid with hover depth
/teachers                  → Faculty spotlight carousel
/student-life              → Hostel, sports, arts, clubs mosaic
/gallery                   → Masonry + lightbox, motion on scroll
/news                      → Editorial cards, featured story
/blog                      → Long-form thought leadership
/careers                   → Culture + open roles
/faqs                      → Accordion with search
/testimonials              → Video quotes + written social proof
/downloads                 → Prospectus, calendars, policies
/contact                   → Map, departments, premium form
/auth/login                → Minimal glass portal entry
/portals/*                 → Existing dashboards (unchanged shell)
```

---

## Homepage sections (premium copy)

| # | Section | Headline | Subcopy |
|---|---------|----------|---------|
| 1 | Hero | *Where brilliance becomes belonging.* | Marcelino International Academy unites rigorous academics, human-centered technology, and a global community on one transformative campus in Uganda. |
| 2 | Trust strip | — | 2,500+ scholars · 98% university placement · 25+ nationalities · Cambridge & local excellence |
| 3 | Pillars | *Three promises we never compromise.* | Academic mastery · Whole-child development · Future-ready digital fluency |
| 4 | Experience bento | *Learning that feels alive.* | Labs, studios, pitches, and quiet reflection spaces designed for the 21st century |
| 5 | Spline 3D | *Step inside our campus.* | Interactive scene — embed your Spline export below |
| 6 | Outcomes | *Results that open doors.* | Oxbridge, Ivy, African leaders — our alumni narrative |
| 7 | Testimonials | *Voices from our circle.* | Parent + alumni quotes with star ratings |
| 8 | CTA | *Your child's next chapter starts here.* | 2025–2026 admissions now open |

---

## Animation & effects library

| Effect | Where | Tech |
|--------|-------|------|
| Particle constellation | Hero background | Canvas 2D + optional Three.js orbs |
| Gradient mesh drift | Hero, CTAs | CSS `@keyframes mesh-drift` |
| Grain overlay | Full site | `noise.svg` opacity 4% |
| Scroll reveal | All sections | Framer Motion `whileInView` |
| Stagger children | Cards, stats | `staggerChildren: 0.08` |
| Magnetic buttons | Primary CTAs | Mouse follow transform |
| Text shimmer | Gold accent words | `background-clip: text` animation |
| Marquee logos | Trust strip | CSS infinite scroll |
| Parallax layers | Page heroes | `useScroll` + `useTransform` |
| Card tilt | Bento grid | `rotateX/Y` on mouse |
| Cursor glow | Desktop only | Radial gradient follower |
| Page transition | Route change | Optional `AnimatePresence` |

### Particles spec (hero)
- 120–180 dots, gold + teal + white
- Connect nearby nodes with 1px lines (distance < 120px)
- Slow drift + mouse repulsion radius 150px
- `requestAnimationFrame`, resize-aware

### Three.js spec (hero fallback layer)
- Transparent canvas, floating icosahedron wireframe + 3 point lights
- `OrbitControls` disabled — auto-rotate Y at 0.15 rad/s
- Bloom feel via emissive teal material

---

## Spline scenes (build in Spline.app)

| Scene | Placement | Suggested content |
|-------|-----------|-------------------|
| `campus-hero.spline` | Homepage hero right | Rotating modern school building, soft lighting |
| `graduation-cap.spline` | Academics page | Floating cap + particles |
| `open-book.spline` | Admissions | Book opening animation on scroll |
| `globe-network.spline` | About / global | Connected nodes = international community |

**Embed:** Set `NEXT_PUBLIC_SPLINE_SCENE_URL` in `.env.local` to your Spline public URL.

Export settings: optimize for web, disable heavy physics, max 2MB.

---

## Design tokens (luxury)

| Token | Value |
|-------|-------|
| Primary deep | `#0A0F1C` (richer than brand-950) |
| Gold accent | `#C9A227` → `#F4E4BC` gradient |
| Teal accent | `#0D9488` → `#5EEAD4` |
| Glass | `backdrop-blur-2xl`, border `white/10` |
| Display font | Plus Jakarta Sans 700–800 |
| Body | Inter 400–500, tracking slightly open |

---

## Implementation phases

1. **Foundation** — tokens, globals, premium components ✅ (this PR)
2. **Homepage** — full rebuild with hero + particles + three ✅
3. **Inner pages** — upgrade `PageHero` + section components
4. **Spline** — drop in scene URLs per page
5. **Polish** — Lighthouse, reduced motion, SEO meta per page

---

## Environment variables

```env
NEXT_PUBLIC_SPLINE_SCENE_URL=https://prod.spline.design/your-scene/scene.splinecode
NEXT_PUBLIC_ENABLE_THREE_HERO=true
```
