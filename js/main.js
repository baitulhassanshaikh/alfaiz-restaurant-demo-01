(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  window.addEventListener('load', () => document.body.classList.remove('is-loading'));
  setTimeout(() => document.body.classList.remove('is-loading'), 1500);

  // Nav: solid on scroll + mobile menu
  const nav = $('#nav'), burger = $('#burger'), links = $('#navLinks'), toTop = $('#toTop');
  const closeMenu = () => { links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; };
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  addEventListener('resize', () => { if (innerWidth > 1024) closeMenu(); });

  // Scroll reveal
  const items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(i => io.observe(i));
  } else items.forEach(i => i.classList.add('is-in'));

  // Scroll: nav state, back-to-top, light parallax (rAF throttled)
  const par = $$('.parallax');
  let tick = false;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 60);
    toTop.classList.toggle('is-show', y > 700);
    if (!reduce) par.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      $('.parallax__img', s).style.transform = `translate3d(0,${(p * -60).toFixed(1)}px,0)`;
    });
    tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  // Image fallback so a failed photo never leaves a broken icon
  $$('img').forEach(img => img.addEventListener('error', () => { img.style.visibility = 'hidden'; }, { once: true }));

  // Forms
  const dateInput = $('#dateInput');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => emailRe.test(v.trim()) || 'Enter a valid email address.',
    phone: v => /^[+\d][\d\s\-()]{6,17}$/.test(v.trim()) || 'Enter a valid phone number.',
    guests: v => !!v || 'Select number of guests.',
    date: v => (!!v && v >= dateInput.min) || 'Choose a date from today onwards.',
    time: v => !!v || 'Select a time.'
  };
  const rf = $('#reserveForm');
  const check = el => {
    const rule = rules[el.name]; if (!rule) return true;
    const res = rule(el.value), ok = res === true, msg = el.parentElement.querySelector('small');
    el.classList.toggle('is-bad', !ok); el.setAttribute('aria-invalid', !ok);
    if (msg) msg.textContent = ok ? '' : res;
    return ok;
  };
  $$('input,select', rf).forEach(el => { el.addEventListener('blur', () => check(el)); el.addEventListener('input', () => el.classList.contains('is-bad') && check(el)); });
  rf.addEventListener('submit', e => {
    e.preventDefault();
    const ok = $$('input,select', rf).map(check).every(Boolean);
    const out = $('#reserveOk');
    if (!ok) { out.hidden = true; const bad = $('.is-bad', rf); bad && bad.focus(); return; }
    out.hidden = false; rf.reset(); out.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  const nf = $('#newsForm'), nm = $('#newsMsg');
  nf.addEventListener('submit', e => {
    e.preventDefault();
    const v = nf.email.value.trim();
    if (!emailRe.test(v)) { nm.textContent = 'Please enter a valid email.'; nf.email.focus(); return; }
    nm.textContent = 'Thanks! Demo only: no subscription was created.'; nf.reset();
  });

  $('#yr').textContent = new Date().getFullYear();
})();
