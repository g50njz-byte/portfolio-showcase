/* ==========================================================================
   Portfolio Plan A: 高級生食パン 匠 -TAKUMI- SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. JAPANESE CUSTOM CURSOR
       ---------------------------------------------------------------------- */
    const jpCursor = document.getElementById('jpCursor');
    const jpCursorFollower = document.getElementById('jpCursorFollower');

    if (jpCursor && jpCursorFollower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            jpCursor.style.left = `${mouseX}px`;
            jpCursor.style.top = `${mouseY}px`;
        });

        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            jpCursorFollower.style.left = `${followerX}px`;
            jpCursorFollower.style.top = `${followerY}px`;
            requestAnimationFrame(animateFollower);
        }
        animateFollower();
    }

    /* ----------------------------------------------------------------------
       2. PORTFOLIO META SPECIFICATION MODAL
       ---------------------------------------------------------------------- */
    const metaBadgeToggle = document.getElementById('metaBadgeToggle');
    const portfolioModal = document.getElementById('portfolioModal');
    const modalClose = document.getElementById('modalClose');

    if (metaBadgeToggle && portfolioModal) {
        metaBadgeToggle.addEventListener('click', () => {
            portfolioModal.classList.add('active');
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                portfolioModal.classList.remove('active');
            });
        }

        portfolioModal.addEventListener('click', (e) => {
            if (e.target === portfolioModal) {
                portfolioModal.classList.remove('active');
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. STICKY HEADER & ACTIVE NAV
       ---------------------------------------------------------------------- */
    const siteHeader = document.getElementById('siteHeader');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 200;
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

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
       4. REVEAL ANIMATIONS ON SCROLL (INTERSECTION OBSERVER)
       ---------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ----------------------------------------------------------------------
       5. DIRECT RESERVATION BUTTON LINKING
       ---------------------------------------------------------------------- */
    const itemReserveBtns = document.querySelectorAll('.item-reserve-btn');
    const productSelect = document.getElementById('productSelect');

    itemReserveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productName = btn.getAttribute('data-product');
            if (productSelect && productName) {
                if (productName.includes('雅')) productSelect.value = 'miyabi';
                else if (productName.includes('翠')) productSelect.value = 'midori';
                else if (productName.includes('ラスク')) productSelect.value = 'rusk';
            }
        });
    });

    /* ----------------------------------------------------------------------
       6. RESERVATION FORM ENHANCEMENTS & SUBMISSION SIMULATION
       ---------------------------------------------------------------------- */
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    const telInput = document.getElementById('telInput');
    if (telInput) {
        telInput.addEventListener('input', () => {
            telInput.value = telInput.value.replace(/[^0-9-]/g, '');
        });
    }

    const reserveForm = document.getElementById('reserveForm');
    if (reserveForm) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('nameInput').value;
            const shopSelect = document.getElementById('shopSelect');
            const shopText = shopSelect.options[shopSelect.selectedIndex].text;
            const date = document.getElementById('dateInput').value;
            const time = document.getElementById('timeSelect').value;

            alert(`【ご予約確定通知（シミュレーション）】\n\n${name} 様\nご予約ありがとうございます。\n\n受取店舗: ${shopText}\n受取日時: ${date} ${time}\n\n店舗にて焼き立てをご用意してお待ちしております。`);
            reserveForm.reset();
        });
    }

});
