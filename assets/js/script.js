document.addEventListener('DOMContentLoaded', () => {
    const hamburgerButton = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    const loadingOverlay = document.getElementById('loadingOverlay');

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

    // Loading Screen Management
    function hideLoadingScreen() {
        if (loadingOverlay) {
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }

    // Hide loading screen after content loads
    if (document.readyState === 'complete') {
        setTimeout(hideLoadingScreen, 800);
    } else {
        window.addEventListener('load', () => {
            setTimeout(hideLoadingScreen, 800);
        });
    }

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollAnimationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Once animated, we can stop observing this element
                scrollAnimationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => {
        scrollAnimationObserver.observe(el);
    });

    // Parallax Effect
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1); // Different speeds for different elements
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    // Throttled scroll event for parallax
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            requestParallaxUpdate();
        }
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Add scrolling class for scroll-dependent animations
        document.body.classList.add('scrolling');
        
        // Remove scrolling class after scroll ends
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 150);
    });

    // Enhanced Service Card Interactions
    const serviceCards = document.querySelectorAll('.service');
    
    serviceCards.forEach(card => {
        // Mouse move effect for tilt
        card.addEventListener('mousemove', (e) => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Ripple effect on click
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 209, 0, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            // Add ripple animation keyframes if not already added
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Enhanced Form Interactions
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    
    formInputs.forEach(input => {
        // Label animation on focus
        input.addEventListener('focus', () => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transform = 'translateY(-2px)';
                label.style.color = 'var(--color-accent)';
            }
        });
        
        input.addEventListener('blur', () => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.style.transform = '';
                if (!input.value) {
                    label.style.color = '';
                }
            }
        });
        
        // Real-time validation feedback
        input.addEventListener('input', () => {
            if (input.checkValidity()) {
                input.style.borderColor = 'var(--color-accent)';
                input.style.boxShadow = '0 0 0 2px rgba(255, 209, 0, 0.2)';
            } else if (input.value) {
                input.style.borderColor = '#ff4444';
                input.style.boxShadow = '0 0 0 2px rgba(255, 68, 68, 0.2)';
            } else {
                input.style.borderColor = '';
                input.style.boxShadow = '';
            }
        });
    });

    // Form submission animation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const submitBtn = contactForm.querySelector('.cta-btn');
            if (submitBtn) {
                submitBtn.style.transform = 'scale(0.95)';
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                setTimeout(() => {
                    submitBtn.style.transform = '';
                }, 200);
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic particle generation
    function createParticle() {
        const particleContainer = document.querySelector('.floating-particles');
        if (!particleContainer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = '-' + Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 25000);
    }

    // Create new particles periodically
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(createParticle, 3000);
    }

    // Header background on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(10, 27, 38, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 27, 38, 0.9)';
            header.style.boxShadow = '';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add transition to header
    if (header) {
        header.style.transition = 'all 0.3s ease';
    }

    // Initialize animations
    setTimeout(() => {
        document.body.classList.add('animations-ready');
    }, 100);
});