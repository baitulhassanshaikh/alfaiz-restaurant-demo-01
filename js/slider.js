(() => {
  'use strict';
  const root = document.getElementById('slider'); if (!root) return;
  const track = root.querySelector('.slider__track'), slides = [...track.children], dotsBox = document.getElementById('dots');
  let i = 0, timer, x0 = null;
  const dots = slides.map((_, n) => { const b = document.createElement('button'); b.setAttribute('aria-label', `Show testimonial ${n + 1}`); b.addEventListener('click', () => { go(n); restart(); }); dotsBox.appendChild(b); return b; });
  function go(n) {
    i = (n + slides.length) % slides.length;
    track.style.transform = `translateX(${-i * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
    slides.forEach((s, k) => s.setAttribute('aria-hidden', k !== i));
  }
  const restart = () => { clearInterval(timer); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(i + 1), 7000); };
  root.querySelector('[data-prev]').addEventListener('click', () => { go(i - 1); restart(); });
  root.querySelector('[data-next]').addEventListener('click', () => { go(i + 1); restart(); });
  const view = root.querySelector('.slider__view');
  view.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
  view.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1)); x0 = null; restart(); });
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restart);
  go(0); restart();
})();
