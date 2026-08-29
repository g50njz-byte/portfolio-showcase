/* ==========================================================================
   Plan D: RAW STREET & HIPHOP SHOWCASE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. CUSTOM STREET CURSOR
       ---------------------------------------------------------------------- */
    const streetCursor = document.getElementById('streetCursor');

    if (streetCursor) {
        window.addEventListener('mousemove', (e) => {
            streetCursor.style.left = `${e.clientX}px`;
            streetCursor.style.top = `${e.clientY}px`;
        });
    }

    /* ----------------------------------------------------------------------
       2. REEL VIDEO & IMAGE SELECTOR (INTERACTIVE ARCHIVE)
       ---------------------------------------------------------------------- */
    const reelMediaWrap = document.getElementById('reelMediaWrap');
    const reelVideo = document.getElementById('reelVideo');
    const reelTitle = document.getElementById('reelTitle');
    const reelDesc = document.getElementById('reelDesc');
    const reelBtns = document.querySelectorAll('.reel-btn');

    if (reelBtns.length > 0) {
        reelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const img = btn.getAttribute('data-img');
                const title = btn.getAttribute('data-title');
                const desc = btn.getAttribute('data-desc');

                reelBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Smooth media switch with robust fallback
                if (reelMediaWrap) {
                    reelMediaWrap.style.backgroundImage = `url('${img}')`;
                }

                if (reelVideo) {
                    reelVideo.style.opacity = '0.2';
                    setTimeout(() => {
                        reelVideo.src = src;
                        const playPromise = reelVideo.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                reelVideo.style.opacity = '1';
                            }).catch(err => {
                                console.log('Video playback blocked/failed, using high-res fallback image:', err);
                                reelVideo.style.opacity = '0'; // Hide broken video element to show clean background image
                            });
                        }
                        if (reelTitle) reelTitle.textContent = title;
                        if (reelDesc) reelDesc.textContent = desc;
                    }, 150);
                }
            });
        });
    }

    /* ----------------------------------------------------------------------
       3. SCROLL ACTIVE NAV & HEADER STICKY
       ---------------------------------------------------------------------- */
    const navBtns = document.querySelectorAll('.street-nav .nav-btn');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let currentId = '';

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            currentId = 'contact';
        } else {
            sections.forEach(sec => {
                const secTop = sec.offsetTop - 200;
                const secHeight = sec.offsetHeight;
                if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                    currentId = sec.getAttribute('id');
                }
            });
        }

        if (currentId) {
            navBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('href') === `#${currentId}`) {
                    btn.classList.add('active');
                }
            });
        }
    });

    /* ----------------------------------------------------------------------
       4. MOBILE NAV TOGGLE
       ---------------------------------------------------------------------- */
    const navToggle = document.getElementById('navToggle');
    const streetNav = document.querySelector('.street-nav');

    if (navToggle && streetNav) {
        navToggle.addEventListener('click', () => {
            if (streetNav.style.display === 'flex') {
                streetNav.style.display = 'none';
            } else {
                streetNav.style.display = 'flex';
                streetNav.style.flexDirection = 'column';
                streetNav.style.position = 'absolute';
                streetNav.style.top = '100%';
                streetNav.style.left = '0';
                streetNav.style.width = '100%';
                streetNav.style.backgroundColor = '#050505';
                streetNav.style.padding = '20px';
            }
        });
    }

});
