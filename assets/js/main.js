(() => {
  const btn = document.querySelector('[data-menu-btn]');
  const links = document.querySelector('[data-nav-links]');
  if (btn && links) {
    const closeMenu = () => links.classList.remove('open');

    btn.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
      const inside = links.contains(e.target) || btn.contains(e.target);
      if (!inside) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // footer year if present
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
