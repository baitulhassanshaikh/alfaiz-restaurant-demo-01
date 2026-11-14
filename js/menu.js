(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const chips = $$('.chip'), dishes = $$('.dish'), empty = $('#menuEmpty');

  function filter(cat) {
    let shown = 0;
    chips.forEach(c => { const on = c.dataset.filter === cat; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on); });
    dishes.forEach(d => {
      const match = cat === 'all' || d.dataset.cat === cat;
      d.classList.toggle('is-hidden', !match);
      d.classList.remove('is-pop');
      if (match) { shown++; void d.offsetWidth; d.classList.add('is-pop'); }
    });
    empty.hidden = shown > 0;
  }
  chips.forEach(c => c.addEventListener('click', () => filter(c.dataset.filter)));
  $$('[data-jump]').forEach(a => a.addEventListener('click', () => filter(a.dataset.jump)));

  // Details dialog
  const modal = $('#dishModal');
  const close = () => modal.close();
  $$('[data-details]').forEach(b => b.addEventListener('click', () => {
    const d = b.closest('.dish'), img = $('img', d);
    $('#dmImg').src = img.src.replace('w=800', 'w=1000'); $('#dmImg').alt = img.alt;
    $('#dmCat').textContent = d.dataset.cat;
    $('#dmTitle').textContent = $('h3', d).textContent;
    $('#dmDesc').textContent = $('p', d).textContent;
    $('#dmPrice').textContent = $('strong', d).textContent;
    modal.showModal();
  }));
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) close(); });
})();
