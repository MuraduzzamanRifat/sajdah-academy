/* Preloader — inline HTML + CSS + JS that renders before React hydrates.

   The marketing layout already reads `headers()` to build the JSON-LD
   nonce; passing the same nonce as a prop here avoids forcing this
   component to be async and dragging the rest of the marketing surface
   into dynamic rendering for one header read.

   Hide trigger fires on first paint after DOMContentLoaded (double rAF)
   instead of window.load, so it doesn't wait for every image / JS
   chunk. Hard cap 1.5s. */

import { asset } from "../lib/asset";

const PRELOADER_CSS = `
#__preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #022c22;
  background-image:
    radial-gradient(circle at 50% 42%, rgba(245,158,11,0.18) 0%, rgba(16,185,129,0.06) 30%, transparent 60%);
  opacity: 1;
  transition: opacity 350ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity;
  /* pointer-events: none from the FIRST moment so the overlay can NEVER
     block scroll/clicks even if the JS hide path is blocked (CSP edge
     case, navigation timing). The page content is server-rendered
     behind it — there's no interaction we need to intercept. The
     animation handles the visual fade-out; events were never our job. */
  pointer-events: none;
  /* CSS-only safety net. If the inline JS doesn't run, the preloader
     still fades via this animation. Without forwards-fill, opacity
     would snap back to 1 after the animation; with forwards, the
     final transparent state persists. */
  animation: __preloader_autohide 600ms 1200ms forwards;
}
#__preloader.__loaded { opacity: 0; }
@keyframes __preloader_autohide {
  to { opacity: 0; visibility: hidden; }
}
#__preloader__inner {
  position: relative;
  width: 160px; height: 160px;
  display: flex; align-items: center; justify-content: center;
}
#__preloader__inner img {
  width: 110px; height: 110px;
  object-fit: contain;
  animation: __preloader_breathe 2.4s ease-in-out infinite;
  filter: drop-shadow(0 0 24px rgba(245, 158, 11, 0.45));
}
#__preloader__ring {
  position: absolute; inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.15);
  border-top-color: #fbbf24;
  animation: __preloader_spin 1.1s linear infinite;
}
@keyframes __preloader_spin { to { transform: rotate(360deg); } }
@keyframes __preloader_breathe {
  0%, 100% { transform: scale(1); opacity: 0.85; }
  50%      { transform: scale(1.06); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  #__preloader__inner img,
  #__preloader__ring { animation: none; }
  #__preloader { transition: opacity 100ms linear; }
}
`;

const PRELOADER_JS = `
(function() {
  var el = document.getElementById('__preloader');
  if (!el) return;
  try {
    if (sessionStorage.getItem('__preloader_seen')) {
      el.parentNode && el.parentNode.removeChild(el);
      return;
    }
  } catch(_) {}
  var hidden = false;
  var hide = function() {
    if (hidden) return;
    hidden = true;
    el.classList.add('__loaded');
    setTimeout(function() {
      el.parentNode && el.parentNode.removeChild(el);
      try { sessionStorage.setItem('__preloader_seen', '1'); } catch(_) {}
    }, 360);
  };
  var onReady = function() {
    if ('requestAnimationFrame' in window) {
      requestAnimationFrame(function() { requestAnimationFrame(hide); });
    } else {
      setTimeout(hide, 50);
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }
  setTimeout(hide, 800);
})();
`;

export default function Preloader({ nonce }: { nonce?: string }) {
  const medallion = asset("/medallion-128.webp");
  return (
    <>
      <style nonce={nonce} dangerouslySetInnerHTML={{ __html: PRELOADER_CSS }} />
      <div id="__preloader" aria-hidden="true">
        <div id="__preloader__inner">
          <div id="__preloader__ring" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={medallion} alt="" width={110} height={110} />
        </div>
      </div>
      <script nonce={nonce} dangerouslySetInnerHTML={{ __html: PRELOADER_JS }} />
    </>
  );
}
