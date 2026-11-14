(() => {
  'use strict';
  const items = [...document.querySelectorAll('#gallery-grid .g')];
  const lb = document.getElementById('lightbox'), img = lb.querySelector('img');
  let i = 0, opener = null, x0 = null;
  const show = n => {
    i = (n + items.length) % items.length;
    img.classList.add('is-swap');
    setTimeout(() => { img.src = items[i].dataset.full; img.alt = items[i].querySelector('img').alt; }, 180);
    img.onload = () => img.classList.remove('is-swap');
  };
  function open(n) {
    opener = document.activeElement; lb.hidden = false; document.body.style.overflow = 'hidden';
    img.src = items[n].dataset.full; img.alt = items[n].querySelector('img').alt; i = n;
    requestAnimationFrame(() => lb.classList.add('is-open'));
    lb.querySelector('[data-close]').focus();
  }
  function close() {
    lb.classList.remove('is-open'); document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; img.removeAttribute('src'); }, 300);
    opener && opener.focus();
  }
  items.forEach((b, n) => b.addEventListener('click', () => open(n)));
  lb.addEventListener('click', e => {
    if (e.target.closest('[data-prev]')) show(i - 1);
    else if (e.target.closest('[data-next]')) show(i + 1);
    else if (e.target === lb || e.target.closest('[data-close]')) close();
  });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
})();
