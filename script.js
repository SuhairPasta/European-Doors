   
        // Mobile nav toggle: no external libs
        (function(){
            const toggle = document.querySelector('.nav-toggle');
            const navLinks = document.getElementById('nav-links');

            if(!toggle || !navLinks) return;

            function setOpen(open){
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                if(open) navLinks.classList.add('open'); else navLinks.classList.remove('open');
            }

            toggle.addEventListener('click', ()=>{
                const isOpen = toggle.getAttribute('aria-expanded') === 'true';
                setOpen(!isOpen);
            });

            // Close on Escape
            document.addEventListener('keydown', e=>{
                if(e.key === 'Escape') setOpen(false);
            });

            // Close when clicking outside (mobile menu)
            document.addEventListener('click', e=>{
                if(!navLinks.classList.contains('open')) return;
                const withinNav = e.composedPath && e.composedPath().includes(navLinks);
                const withinToggle = e.composedPath && e.composedPath().includes(toggle);
                if(!withinNav && !withinToggle) setOpen(false);
            });
        })();

        // Navbar scroll behavior: change color/height after scrolling down
        (function(){
            const nav = document.querySelector('nav.site-nav');
            const threshold = 120; // pixels scrolled before changing
            if(!nav) return;
            function onScroll(){
                if(window.scrollY > threshold) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
            }
            document.addEventListener('scroll', onScroll, { passive: true });
            // run once to set initial state
            onScroll();
        })();
    window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.heritage-navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});
  // Selection of all nav-links inside the mobile menu
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuToggle = document.getElementById('navbarNav'); // Use 'offcanvasNavbar' if using offcanvas
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

    navLinks.forEach((l) => {
        l.addEventListener('click', () => {
            // Only close if the menu is currently shown (important for mobile)
            if (menuToggle.classList.contains('show')) {
                bsCollapse.hide();
            }
        });
    });
  
document.addEventListener('DOMContentLoaded', function() {
    const aboutOptions = {
        threshold: 0.2 // Trigger when 20% of the section is visible
    };

    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Once it animates in, stop watching it (for performance)
                aboutObserver.unobserve(entry.target);
            }
        });
    }, aboutOptions);

    // Select the left and right columns to animate
    const animatedElements = document.querySelectorAll('.about-animate-left, .about-animate-right');
    animatedElements.forEach(el => aboutObserver.observe(el));
});
