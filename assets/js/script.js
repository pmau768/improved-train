document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (!hamburgerButton || !navMenu) return;

    // Ensure ARIA attributes
    hamburgerButton.setAttribute('aria-expanded', 'false');
    if (!hamburgerButton.getAttribute('aria-controls')) {
        hamburgerButton.setAttribute('aria-controls', 'primary-navigation');
    }
    navMenu.setAttribute('aria-hidden', 'true');

    // Create backdrop for menu
    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    document.body.appendChild(backdrop);

    function openMenu() {
        navMenu.classList.add('active');
        backdrop.classList.add('active');
        hamburgerButton.setAttribute('aria-expanded', 'true');
        navMenu.setAttribute('aria-hidden', 'false');
        body.classList.add('no-scroll');
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        backdrop.classList.remove('active');
        hamburgerButton.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');
        body.classList.remove('no-scroll');
    }

    hamburgerButton.addEventListener('click', () => {
        const isOpen = navMenu.classList.contains('active');
        if (isOpen) closeMenu(); else openMenu();
    });

    backdrop.addEventListener('click', closeMenu);

    // Close on nav link click
    navMenu.addEventListener('click', (e) => {
        const target = e.target;
        if (target instanceof Element && target.closest('a')) {
            closeMenu();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Reset on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
});