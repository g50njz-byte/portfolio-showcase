/* ==========================================================================
   Plan C: UVU STUDIO - INTERACTIVE & ANIMATION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ----------------------------------------------------------------------
       1. CUSTOM CURSOR BEHAVIOR
       ---------------------------------------------------------------------- */
    const cursorDot = document.getElementById('cursorDot');
    const cursorCircle = document.getElementById('cursorCircle');
    const cursorText = document.getElementById('cursorText');

    if (cursorDot && cursorCircle) {
        let mouseX = 0, mouseY = 0;
        let circleX = 0, circleY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Smooth follow loop for outer circle
        function animateCursor() {
            circleX += (mouseX - circleX) * 0.15;
            circleY += (mouseY - circleY) * 0.15;
            
            cursorCircle.style.left = `${circleX}px`;
            cursorCircle.style.top = `${circleY}px`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Custom Cursor Labels on Interactive Hover
        document.querySelectorAll('[data-cursor]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const text = el.getAttribute('data-cursor');
                cursorText.textContent = text || 'VIEW';
                cursorCircle.classList.add('active');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorCircle.classList.remove('active');
            });
        });
    }

    /* ----------------------------------------------------------------------
       2. STICKY HEADER & SCROLL DETECTION
       ---------------------------------------------------------------------- */
    const siteHeader = document.getElementById('siteHeader');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        // Active Section Highlight
        const sections = document.querySelectorAll('section[id]');
        let currentSectionId = '';

        // Check if scrolled to near bottom
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            currentSectionId = 'contact';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 250;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    /* ----------------------------------------------------------------------
       3. REVEAL ANIMATIONS ON SCROLL (INTERSECTION OBSERVER)
       ---------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal-element');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------------------------
       4. FULLSCREEN STICKY PARALLAX SHOWCASE SWITCHER
       ---------------------------------------------------------------------- */
    const showcaseSection = document.getElementById('parallax-showcase');
    const parallaxMedias = document.querySelectorAll('.parallax-bg-media');
    const showcaseSteps = document.querySelectorAll('.showcase-step');
    const dotBtns = document.querySelectorAll('.dot-btn');

    if (showcaseSection) {
        window.addEventListener('scroll', () => {
            const rect = showcaseSection.getBoundingClientRect();
            const totalScrollHeight = showcaseSection.offsetHeight - window.innerHeight;
            const currentScrollProgress = Math.min(Math.max(-rect.top / totalScrollHeight, 0), 1);

            let activeIndex = 0;
            if (currentScrollProgress > 0.66) {
                activeIndex = 2;
            } else if (currentScrollProgress > 0.33) {
                activeIndex = 1;
            } else {
                activeIndex = 0;
            }

            updateParallaxState(activeIndex);
        });

        function updateParallaxState(index) {
            parallaxMedias.forEach((media, i) => {
                if (i === index) {
                    media.classList.add('active');
                } else {
                    media.classList.remove('active');
                }
            });

            showcaseSteps.forEach((step, i) => {
                if (i === index) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });

            dotBtns.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        dotBtns.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.target.getAttribute('data-index'), 10);
                updateParallaxState(targetIdx);
            });
        });
    }

    /* ----------------------------------------------------------------------
       5. MOBILE MENU TOGGLE
       ---------------------------------------------------------------------- */
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
    }

    /* ----------------------------------------------------------------------
       6. VIDEO PLAYBACK FALLBACK ENHANCEMENT
       ---------------------------------------------------------------------- */
    const bgVideos = document.querySelectorAll('video');
    bgVideos.forEach(video => {
        video.play().catch(err => {
            console.log('Autoplay restriction handled:', err);
        });
    });

});
