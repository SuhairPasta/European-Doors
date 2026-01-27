   
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

window.onload = function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    // Make sure all items are visible on initial page load
    productItems.forEach(item => item.classList.add('is-visible'));

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 1. Update UI for the buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetFilter = this.getAttribute('data-filter');

            productItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = targetFilter === 'all' || itemCategory === targetFilter;

                if (shouldShow) {
                    // Step A: Bring back to layout
                    item.style.display = "block";
                    // Step B: Trigger the CSS animation after a tiny delay
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, 50); // Increased delay slightly for stability
                } else {
                    // Step A: Trigger Fade Out animation
                    item.classList.remove('is-visible');
                    // Step B: Remove from layout after the 0.5s CSS transition finishes
                    setTimeout(() => {
                        if (!item.classList.contains('is-visible')) {
                            item.style.display = "none";
                        }
                    }, 500); 
                }
            });
        });
    });
};





