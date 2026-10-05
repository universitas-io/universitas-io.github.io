export function initMobileNav() {
  const trigger = document.querySelector<HTMLButtonElement>(
    '[data-mobile-menu-trigger]'
  );
  const dialog =
    document.querySelector<HTMLDialogElement>('#mobile-nav-dialog');
  const closeBtn = document.querySelector<HTMLButtonElement>(
    '[data-mobile-menu-close]'
  );

  if (!trigger || !dialog) return;

  function openMenu() {
    dialog?.showModal();
    trigger?.setAttribute('aria-expanded', 'true');
    // Focus first link or close button inside
    const firstFocusable = dialog?.querySelector<HTMLElement>('a, button');
    firstFocusable?.focus();
  }

  function closeMenu() {
    dialog?.close();
    trigger?.setAttribute('aria-expanded', 'false');
    trigger?.focus();
  }

  trigger.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);

  dialog.addEventListener('close', () => {
    trigger.setAttribute('aria-expanded', 'false');
  });

  // Close on backdrop click
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
      closeMenu();
    }
  });

  // Close on escape key
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    }
  });

  // Close when clicking any nav link inside dialog
  dialog.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      dialog.close();
      trigger.setAttribute('aria-expanded', 'false');
    });
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
}
