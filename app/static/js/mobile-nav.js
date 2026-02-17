// Mobile hamburger menu functionality
class MobileNav {
  constructor() {
    this.init();
  }

  init() {
    this.createToggleButton();
    this.attachEventListeners();
  }

  createToggleButton() {
    const navbarContainer = document.querySelector('.navbar__container');
    if (!navbarContainer) return;

    const existingToggle = document.querySelector('.navbar__toggle');
    if (existingToggle) return; // Already exists

    const toggle = document.createElement('button');
    toggle.className = 'navbar__toggle';
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="navbar__toggle-icon"></span>';

    // Insert before menu
    const menu = navbarContainer.querySelector('.navbar__menu');
    if (menu) {
      navbarContainer.insertBefore(toggle, menu);
    }
  }

  attachEventListeners() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');
    
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.toggle('active');
      menu.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking a link
    const links = menu.querySelectorAll('.navbar__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// Initialize mobile nav
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
});
