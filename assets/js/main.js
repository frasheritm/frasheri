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
      btn.setAttribute('aria-expanded', String(open));

      if (overlay) overlay.hidden = !open;

      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    // ✅ forza menu chiuso al load (anti stato ripristinato / bfcache)
    setOpen(false);
    window.addEventListener('pageshow', () => setOpen(false));

    btn.addEventListener('click', () => {
      setOpen(!links.classList.contains('open'));
    });

    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => setOpen(false))
    );

    if (overlay) overlay.addEventListener('click', () => setOpen(false));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => setOpen(false));
  }

  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
