(() => {
  const search = document.querySelector('#note-search');
  if (!search) return;
  const buttons = [...document.querySelectorAll('[data-category][type="button"]')];
  const notes = [...document.querySelectorAll('[data-note]')];
  const groups = [...document.querySelectorAll('[data-group]')];
  let category = 'all';
  function apply() {
    const text = search.value.trim().toLocaleLowerCase();
    let count = 0;
    notes.forEach(note => {
      const show = (category === 'all' || category === note.dataset.category) && note.dataset.title.toLocaleLowerCase().includes(text);
      note.hidden = !show;
      if (show) count++;
    });
    groups.forEach(group => group.hidden = ![...group.querySelectorAll('[data-note]')].some(note => !note.hidden));
    buttons.forEach(button => button.setAttribute('aria-pressed', String(category === button.dataset.category)));
    document.querySelector('#note-count').textContent = `${count} 篇笔记`;
    document.querySelector('#empty-notes').hidden = count !== 0;
  }
  function readHash() {
    const requested = location.hash.slice(1);
    category = buttons.some(b => b.dataset.category === requested) ? requested : 'all';
    apply();
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category;
    history.replaceState(null, '', category === 'all' ? location.pathname : '#' + category);
    apply();
  }));
  search.addEventListener('input', apply);
  window.addEventListener('hashchange', readHash);
  readHash();
})();
