(() => {
  const btn = document.querySelector('[data-menu-btn]');
  const links = document.querySelector('[data-nav-links]');
  if (btn && links) {
    btn.addEventListener('click', () => links.classList.toggle('open'));
  }
})();
