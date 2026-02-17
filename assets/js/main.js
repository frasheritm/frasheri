(() => {
  const btn = document.querySelector('[data-menu-btn]');
  const links = document.querySelector('[data-nav-links]');
  const overlay = document.querySelector('[data-nav-overlay]');

  if (btn && links) {
    if (!links.id) links.id = 'primary-nav';
    btn.setAttribute('aria-controls', links.id);
    btn.setAttribute('aria-expanded', 'false');

    const setOpen = (open) => {
      links.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    };

    // stato iniziale SEMPRE chiuso (anche con back/forward cache)
    setOpen(false);
    window.addEventListener('pageshow', () => setOpen(false));

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setOpen(!links.classList.contains('open'));
    });

    // chiudi quando clicchi un link
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => setOpen(false))
    );

    // chiudi cliccando overlay
    if (overlay) overlay.addEventListener('click', () => setOpen(false));

    // chiudi con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    // se passi a desktop/tablet grande, chiudi
    window.addEventListener('resize', () => setOpen(false));
  }

  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
