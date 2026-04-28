# Motion & Accessibility Policy

This project uses a **scoped premium motion layer** that runs only on three
approved surfaces:

1. Homepage announcement banner (gold sheen sweep)
2. Homepage hero background (slow Ken-Burns drift)
3. Featured Opportunity card (gentle gold pulse ring)

Forms, admin workflows, page transitions, and decorative micro-animations
are intentionally **not** part of this layer.

---

## Reduced-motion guarantee

All approved motion is suppressed automatically when **any** of these are true:

| Trigger | How it's detected | Effect |
|---|---|---|
| OS "Reduce motion" | `@media (prefers-reduced-motion: reduce)` + `MotionConfig reducedMotion="user"` | All CSS keyframes disabled, all Framer Motion transforms skipped |
| Touch / coarse pointer | `@media (hover: none) and (pointer: coarse)` | Banner shimmer hidden, featured pulse off, hero drift slowed |
| Low CPU (≤4 cores) | `navigator.hardwareConcurrency` runtime check | `data-low-power="true"` set on `<html>` → motion disabled |
| Save-Data / 2g / slow-2g | `navigator.connection` runtime check | Same as above |
| Measured frame rate < 45 fps | `requestAnimationFrame` probe (deferred to idle, after LCP) | Same as above |

Implementation:

- CSS: `src/index.css` — keyframes + media queries + `[data-low-power]` selectors
- Runtime: `src/lib/motion-preferences.ts` — sets `<html data-low-power>`
- Framer: `<MotionConfig reducedMotion="user">` in `src/App.tsx`
- Bootstrap: `initMotionPreferences()` called in `src/main.tsx` before React mounts

## Keyboard users

No motion in the approved layer is triggered by focus, hover, or click.
Keyboard navigation will never produce unexpected movement.

## How to test

1. **macOS:** System Settings → Accessibility → Display → Reduce Motion
2. **Windows:** Settings → Accessibility → Visual Effects → Animation Effects (off)
3. **iOS/Android:** Settings → Accessibility → Reduce Motion / Remove animations
4. **DevTools:** Rendering panel → "Emulate CSS media feature prefers-reduced-motion: reduce"

After enabling, reload `/` and `/opportunities`. The hero should be a
static image, the banner strip should have no sheen, and any featured
opportunity card should have a static gold border (no pulse).

## Adding new animations

If you add a new animation outside the three approved surfaces, follow this
checklist:

- Wrap CSS keyframes inside the same reduced-motion + `[data-low-power]` guards
- Use `transform`, `opacity`, or `box-shadow` only (no width / height / top / left)
- For Framer Motion components, the global `MotionConfig` already opts out
  for users with reduced motion — don't override it locally
- Never animate as a side effect of focus
