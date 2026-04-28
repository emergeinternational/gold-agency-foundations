/**
 * Motion preference & low-power detection.
 *
 * Adds a `data-low-power="true"` attribute to <html> when either:
 *   - The OS reports `prefers-reduced-motion: reduce`
 *   - The device has <= 4 logical cores (typical low-end mobile / tablet)
 *   - The Network Information API reports save-data or 2g/slow-2g
 *   - A lightweight rAF probe measures effective frame rate < 45 fps
 *
 * CSS layer in `index.css` reads this attribute to fully disable the
 * approved motion (hero drift, banner shimmer, featured pulse).
 *
 * This runs once on app boot; result is cached on <html>. No re-renders.
 */

type NetInfo = { saveData?: boolean; effectiveType?: string };

function setLowPower(reason: string) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  if (html.dataset.lowPower === "true") return;
  html.dataset.lowPower = "true";
  html.dataset.lowPowerReason = reason;
}

function staticChecks(): boolean {
  if (typeof window === "undefined") return false;

  // 1. OS-level reduced motion
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    setLowPower("prefers-reduced-motion");
    return true;
  }

  // 2. Hardware concurrency heuristic
  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores <= 4) {
    setLowPower("low-cores");
    return true;
  }

  // 3. Network Information API
  const conn = (navigator as Navigator & { connection?: NetInfo }).connection;
  if (conn) {
    if (conn.saveData) {
      setLowPower("save-data");
      return true;
    }
    if (conn.effectiveType && /^(2g|slow-2g)$/i.test(conn.effectiveType)) {
      setLowPower("slow-network");
      return true;
    }
  }

  return false;
}

function frameRateProbe() {
  if (typeof window === "undefined" || typeof requestAnimationFrame === "undefined") return;
  let frames = 0;
  const start = performance.now();
  const sampleMs = 600;

  const tick = () => {
    frames += 1;
    const elapsed = performance.now() - start;
    if (elapsed < sampleMs) {
      requestAnimationFrame(tick);
    } else {
      const fps = (frames / elapsed) * 1000;
      if (fps < 45) {
        setLowPower(`low-fps(${fps.toFixed(0)})`);
      }
    }
  };
  requestAnimationFrame(tick);
}

let initialized = false;
export function initMotionPreferences() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // Static checks are synchronous so the first paint already has the attribute.
  const blocked = staticChecks();

  // Listen for OS-level reduced-motion changes mid-session.
  const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (mq) {
    const onChange = () => {
      if (mq.matches) setLowPower("prefers-reduced-motion");
      else if (document.documentElement.dataset.lowPowerReason === "prefers-reduced-motion") {
        delete document.documentElement.dataset.lowPower;
        delete document.documentElement.dataset.lowPowerReason;
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener?.(onChange);
  }

  // Skip the rAF probe if we already classified the device.
  if (!blocked) {
    // Defer until after first paint so the probe doesn't fight LCP.
    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void })
        .requestIdleCallback(frameRateProbe);
    } else {
      setTimeout(frameRateProbe, 1500);
    }
  }
}
