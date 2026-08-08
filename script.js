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

// Navbar scroll behavior: add scrolled class when user scrolls
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.heritage-navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}, { passive: true });

// Close mobile Bootstrap nav on link click
(function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const menuToggle = document.getElementById('navbarNav');
    if (!menuToggle) return;
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle: false});

    navLinks.forEach((l) => {
        l.addEventListener('click', () => {
            if (menuToggle.classList.contains('show')) {
                bsCollapse.hide();
            }
        });
    });
})();

// Product filter
window.onload = function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    // Make sure all items are visible on initial page load
    productItems.forEach(item => item.classList.add('is-visible'));

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetFilter = this.getAttribute('data-filter');

            productItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = targetFilter === 'all' || itemCategory === targetFilter;

                if (shouldShow) {
                    item.style.display = "block";
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, 50);
                } else {
                    item.classList.remove('is-visible');
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


// ============================================================
//  TIMELINE — Sticky Scroll with Granular Per-Element Phases
//
//  Phase sequence per step:
//   Step 0: dot → vline → content  (3 phases)
//   Step 1-4: line → dot → vline → content  (4 phases each)
//
//  Total: 3 + (4 × 4) = 19 phases
//  Outer height set dynamically: 100vh + (19 × PX_PER_PHASE)
// ============================================================
(function () {
    const outer = document.getElementById('timelineOuter');
    if (!outer) return;

    const steps    = Array.from(outer.querySelectorAll('.timeline-step'));
    const lineFill = document.getElementById('timelineLine');
    const lineBg   = outer.querySelector('.timeline-line-bg');

    if (!steps.length) return;

    // ── Build the phase list ──────────────────────────────────────
    const phases = [];

    // Step 0 – no line before it, dot fills, then vertical line, then content card
    phases.push({ type: 'dot',     stepIdx: 0 });
    phases.push({ type: 'vline',   stepIdx: 0 });
    phases.push({ type: 'content', stepIdx: 0 });

    // Steps 1-4
    for (let s = 1; s < steps.length; s++) {
        phases.push({ type: 'line',    stepIdx: s });
        phases.push({ type: 'dot',     stepIdx: s });
        phases.push({ type: 'vline',   stepIdx: s });
        phases.push({ type: 'content', stepIdx: s });
    }

    const TOTAL_PHASES = phases.length;   // 19 phases total
    const PX_PER_PHASE = 160;             // pixels of scroll per phase

    // Set outer height so sticky section pins for exactly this scroll distance
    outer.style.height = 'calc(100vh + ' + (TOTAL_PHASES * PX_PER_PHASE) + 'px)';

    // ── Helper: get % width of fill line to reach a step's dot ───
    function getDotPct(stepIdx) {
        if (!lineBg || !steps[stepIdx]) return 0;
        const bgRect  = lineBg.getBoundingClientRect();
        const dot     = steps[stepIdx].querySelector('.step-dot');
        if (!dot || bgRect.width === 0) return 0;
        const dotRect = dot.getBoundingClientRect();
        const cx      = dotRect.left + dotRect.width / 2 - bgRect.left;
        return Math.min(100, Math.max(0, (cx / bgRect.width) * 100));
    }

    // ── Execute one phase ─────────────────────────────────────────
    function runPhase(p) {
        const { type, stepIdx } = phases[p];
        const step = steps[stepIdx];
        if (!step) return;

        switch (type) {
            case 'dot':
                step.querySelector('.step-dot').classList.add('show');
                break;
            case 'vline':
                step.classList.add('is-line-drawn');
                break;
            case 'content':
                step.querySelector('.step-card-wrapper').classList.add('show');
                break;
            case 'line':
                if (lineFill) {
                    requestAnimationFrame(() => {
                        lineFill.style.width = getDotPct(stepIdx) + '%';
                    });
                }
                break;
        }
    }

    let isFinished = false;

    // ── Finish timeline (remove sticky and height lock) ───────────
    function markAsFinished() {
        if (isFinished) return;
        isFinished = true;

        // Ensure all steps and elements are fully shown
        for (let p = 0; p < TOTAL_PHASES; p++) {
            runPhase(p);
        }
        if (lineFill) {
            lineFill.style.width = '100%';
        }

        // Remove the scroll listener completely
        window.removeEventListener('scroll', onScroll);

        // Store the current scroll position relative to the timeline top
        const outerTop = outer.getBoundingClientRect().top + window.scrollY;

        // Transition layout to static/relative
        outer.classList.add('finished');

        // Instantly align window scroll to the top of the static timeline section
        window.scrollTo({
            top: outerTop,
            behavior: 'instant'
        });
    }

    // ── Scroll handler ────────────────────────────────────────────
    let lastPhase = -1;

    function onScroll() {
        if (isFinished) return;

        const rect      = outer.getBoundingClientRect();
        const scrolled  = Math.max(0, -rect.top);
        const maxScroll = outer.offsetHeight - window.innerHeight;
        if (maxScroll <= 0) return;

        const progress    = Math.min(1, scrolled / maxScroll);
        const targetPhase = Math.min(TOTAL_PHASES - 1, Math.floor(progress * TOTAL_PHASES));

        if (targetPhase > lastPhase) {
            for (let p = lastPhase + 1; p <= targetPhase; p++) {
                runPhase(p);
            }
            lastPhase = targetPhase;
        }

        // Finish the timeline if the user has scrolled ALL the way down (progress >= 1)
        if (progress >= 1 || (scrolled <= 0 && lastPhase === TOTAL_PHASES - 1)) {
            markAsFinished();
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once in case already scrolled
})();


/* ==========================================================================
   3D FEATURED PROJECTS CAROUSEL
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    const carouselContainer = document.querySelector(".featured-carousel-container");
    const cards = document.querySelectorAll(".carousel-card");
    const dots = document.querySelectorAll(".carousel-dots .dot");
    if (!cards.length) return;

    let currentIndex = 0;
    const totalCards = cards.length;

    const btnPrev = document.getElementById("carouselPrev");
    const btnNext = document.getElementById("carouselNext");

    // Auto rotation timer
    let autoPlayTimer;

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(() => {
            navigate(1);
        }, 7000);
    }

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove("state-center", "state-left", "state-right", "state-hidden");

            if (index === currentIndex) {
                card.classList.add("state-center");
            } else if (index === (currentIndex - 1 + totalCards) % totalCards) {
                card.classList.add("state-left");
            } else if (index === (currentIndex + 1) % totalCards) {
                card.classList.add("state-right");
            } else {
                card.classList.add("state-hidden");
            }
        });

        // Update dots
        if (dots.length) {
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentIndex);
            });
        }

        startAutoPlay();
    }

    function navigate(direction) {
        if (direction === 1) {
            currentIndex = (currentIndex + 1) % totalCards;
        } else {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        }
        updateCarousel();
    }

    if (btnNext) btnNext.addEventListener("click", () => navigate(1));
    if (btnPrev) btnPrev.addEventListener("click", () => navigate(-1));

    // Dots click
    if (dots.length) {
        dots.forEach((dot) => {
            dot.addEventListener("click", (e) => {
                currentIndex = parseInt(e.currentTarget.dataset.index);
                updateCarousel();
            });
        });
    }

    // Touch swipe support
    let startX = 0;
    const track = document.getElementById("carouselTrack");
    if (track) {
        track.addEventListener("touchstart", (e) => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener("touchend", (e) => {
            const endX = e.changedTouches[0].screenX;
            if (startX - endX > 50) navigate(1);
            else if (endX - startX > 50) navigate(-1);
        }, { passive: true });
    }

    // Keyboard arrow key support (when carousel is in view)
    document.addEventListener("keydown", (e) => {
        if (!carouselContainer) return;
        const rect = carouselContainer.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
            if (e.key === "ArrowLeft") { e.preventDefault(); navigate(-1); }
            if (e.key === "ArrowRight") { e.preventDefault(); navigate(1); }
        }
    });

    // Mouse wheel support inside carousel (throttled)
    let isWheeling = false;
    if (carouselContainer) {
        carouselContainer.addEventListener("wheel", (e) => {
            e.preventDefault();
            if (isWheeling) return;
            isWheeling = true;

            if (e.deltaY > 0 || e.deltaX > 0) {
                navigate(1);
            } else {
                navigate(-1);
            }

            setTimeout(() => {
                isWheeling = false;
            }, 1200);
        }, { passive: false });
    }

    // Initialize
    updateCarousel();
});
