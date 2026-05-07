/* Preloader — inline HTML + CSS + JS that renders before React hydrates.
   Shows the medallion brand mark with a slow amber breathing animation.

   Two bugs fixed in this revision:

   1) The new per-request CSP (set in middleware) drops 'unsafe-inline'
      from script-src whenever a nonce is present. The inline <script>
      below MUST carry the same nonce or it's silently blocked — which
      previously left the preloader sitting until the 4-second hard cap.

   2) The previous hide trigger was `window.load`, which waits for EVERY
      image, font, and JS chunk to finish. With WebGL hero + Three.js
      bundles that's easily 3-5 seconds. We now fade as soon as the
      first paint completes (DOMContentLoaded + a microtask), and cap
      at 1.5s instead of 4s.

   The component is a server component so it can read x-csp-nonce from
   request headers() and pass it down to both <style> and <script>. */

import { headers } from "next/headers";
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
}
#__preloader.__loaded {
  opacity: 0;
  pointer-events: none;
}
#__preloader__inner {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}
#__preloader__inner img {
  width: 110px;
  height: 110px;
  object-fit: contain;
  animation: __preloader_breathe 2.4s ease-in-out infinite;
  filter: drop-shadow(0 0 24px rgba(245, 158, 11, 0.45));
}
#__preloader__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(251, 191, 36, 0.15);
  border-top-color: #fbbf24;
  animation: __preloader_spin 1.1s linear infinite;
}
@keyframes __preloader_spin {
  to { transform: rotate(360deg); }
}
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

/* Inline script — runs at parse time. Hides preloader as soon as the
   document is interactive + first paint has happened. Does NOT wait
   for window.load (that gates on every image/JS chunk and is the
   reason the preloader felt slow). Hard cap reduced from 4s → 1.5s. */
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
  /* Fire on first paint after DOMContentLoaded — meaningful chrome is
     visible, hero may still be hydrating but that's fine. */
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
  /* Hard cap — never sit longer than 1.5s regardless of state. */
  setTimeout(hide, 1500);
})();
`;

export default async function Preloader() {
  const medallion = asset("/medallion-128.webp");
  const nonce = (await headers()).get("x-csp-nonce") ?? undefined;
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
