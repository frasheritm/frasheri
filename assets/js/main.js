(() => {
  const btn = document.querySelector('[data-menu-btn]');
  const links = document.querySelector('[data-nav-links]');
  if (btn && links) {
    // id per aria-controls
    if (!links.id) links.id = 'primary-nav';
    btn.setAttribute('aria-controls', links.id);
    btn.setAttribute('aria-expanded', 'false');

    const setOpen = (open) => {
      links.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    };

    btn.addEventListener('click', () => {
      const open = !links.classList.contains('open');
      setOpen(open);
    });

    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

    document.addEventListener('click', (e) => {
      const inside = links.contains(e.target) || btn.contains(e.target);
      if (!inside) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
