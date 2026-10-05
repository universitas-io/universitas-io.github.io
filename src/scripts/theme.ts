export function initThemeToggle() {
  const toggleButtons = document.querySelectorAll<HTMLButtonElement>(
    '[data-theme-toggle]'
  );

  function getCurrentTheme(): 'light' | 'dark' {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark' || current === 'light') return current;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function setTheme(theme: 'light' | 'dark') {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = getCurrentTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  });
}

// Auto-initialize when loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
}
