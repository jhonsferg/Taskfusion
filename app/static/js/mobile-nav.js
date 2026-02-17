// Mobile hamburger menu functionality
class MobileNav {
  constructor() {
    this.overlay = null;
    this.init();
  }

  init() {
    this.createOverlay();
    this.createToggleButton();
    this.enhanceMenu();
    this.attachEventListeners();
  }

  createOverlay() {
    // Check if overlay already exists
    this.overlay = document.querySelector('.navbar__overlay');
    
    if (!this.overlay) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'navbar__overlay';
      document.body.appendChild(this.overlay);
    }
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

  enhanceMenu() {
    const menu = document.querySelector('.navbar__menu');
    if (!menu || menu.querySelector('.mobile-menu-header')) return;

    // Create menu header
    const header = document.createElement('div');
    header.className = 'mobile-menu-header';
    header.innerHTML = `
      <div class="mobile-menu-header__content">
        <i class="fas fa-tasks mobile-menu-header__icon"></i>
        <h2 class="mobile-menu-header__title">TaskFusion</h2>
        <p class="mobile-menu-header__subtitle">Task Management</p>
      </div>
    `;

    // Insert at the beginning
    menu.insertBefore(header, menu.firstChild);
  }

  toggleMenu(open) {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');
    
    if (!toggle || !menu) return;

    if (open) {
      toggle.classList.add('active');
      menu.classList.add('active');
      this.overlay.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent scroll
    } else {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      this.overlay.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = ''; // Restore scroll
    }
  }

  attachEventListeners() {
    const toggle = document.querySelector('.navbar__toggle');
    const menu = document.querySelector('.navbar__menu');
    
    if (!toggle || !menu) return;

    // Toggle button click
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = toggle.classList.contains('active');
      this.toggleMenu(!isActive);
    });

    // Close menu when clicking a link
    const links = menu.querySelectorAll('.navbar__link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.toggleMenu(false);
      });
    });

    // Close menu when clicking overlay
    this.overlay.addEventListener('click', () => {
      this.toggleMenu(false);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        this.toggleMenu(false);
      }
    });
  }
}

// Initialize mobile nav
document.addEventListener('DOMContentLoaded', () => {
  new MobileNav();
});
