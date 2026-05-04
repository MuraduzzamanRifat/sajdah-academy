/* Preloader — inline HTML + CSS + JS that renders before React hydrates.
   Shows the medallion brand mark with a slow amber breathing animation
   while fonts, images, and JS load. Fades out on window.load and removes
   itself from the DOM. Only shows on the first navigation per session. */
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
  transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1);
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

/* Inline script — runs immediately at parse time. Hides preloader once
   all critical resources have loaded, then removes it from the DOM. */
const PRELOADER_JS = `
(function() {
  var el = document.getElementById('__preloader');
  if (!el) return;
  // Skip if user already saw the preloader this session
  try {
    if (sessionStorage.getItem('__preloader_seen')) {
      el.parentNode && el.parentNode.removeChild(el);
      return;
    }
  } catch(_) {}
  var hide = function() {
    el.classList.add('__loaded');
    setTimeout(function() {
      el.parentNode && el.parentNode.removeChild(el);
      try { sessionStorage.setItem('__preloader_seen', '1'); } catch(_) {}
    }, 600);
  };
  // Fire on full window load (fonts, images, JS all ready)
  if (document.readyState === 'complete') {
    setTimeout(hide, 200);
  } else {
    window.addEventListener('load', function() { setTimeout(hide, 200); });
  }
  // Hard cap: never block interaction longer than 4 seconds
  setTimeout(hide, 4000);
})();
`;

export default function Preloader() {
  const medallion = asset("/medallion-128.webp");
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRELOADER_CSS }} />
      <div id="__preloader" aria-hidden="true">
        <div id="__preloader__inner">
          <div id="__preloader__ring" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={medallion} alt="" width={110} height={110} />
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: PRELOADER_JS }} />
    </>
  );
}
