   
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
    