/**
 * common.js - Portfolio Multi-page Common Utilities
 * - Mobile Navigation Toggle
 * - Active Page Navigation Indicator
 * - Lucide Icons Initialization
 * - Interactive Estimate Calculator (for services.html)
 * - FAQ Accordions (for process.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Mobile Navigation Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
        });
    }

    // 3. Highlight Active Navigation Item
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('text-sky-600', 'font-bold');
            link.classList.remove('text-slate-600');
        }
    });

    // 4. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-header');
    faqItems.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.faq-icon');
            if (content) {
                const isCollapsed = content.classList.contains('hidden');
                document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
                document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');
                
                if (isCollapsed) {
                    content.classList.remove('hidden');
                    if (icon) icon.style.transform = 'rotate(180deg)';
                }
            }
        });
    });

    // 5. Interactive Estimate Calculator (services.html)
    initEstimateCalculator();
});

/**
 * Real-time Estimate Calculator
 */
function initEstimateCalculator() {
    const calcForm = document.getElementById('estimate-calculator');
    if (!calcForm) return;

    const baseTypeSelect = document.getElementById('calc-type');
    const optionCheckboxes = document.querySelectorAll('.calc-option');
    const speedSelect = document.getElementById('calc-speed');
    const resultTotal = document.getElementById('calc-total');
    const resultTimeline = document.getElementById('calc-timeline');

    function calculate() {
        let total = 0;
        let daysMin = 7;
        let daysMax = 14;

        // Base type
        const selectedType = baseTypeSelect ? baseTypeSelect.value : 'lp';
        switch (selectedType) {
            case 'lp':
                total += 150000;
                daysMin = 7; daysMax = 14;
                break;
            case 'corporate':
                total += 250000;
                daysMin = 14; daysMax = 25;
                break;
            case 'booking_ec':
                total += 400000;
                daysMin = 21; daysMax = 35;
                break;
            case 'custom_saas':
                total += 600000;
                daysMin = 30; daysMax = 50;
                break;
            case 'ai_integration':
                total += 350000;
                daysMin = 14; daysMax = 28;
                break;
        }

        // Options
        optionCheckboxes.forEach(cb => {
            if (cb.checked) {
                total += parseInt(cb.value, 10) || 0;
                daysMin += parseInt(cb.dataset.days || '0', 10);
                daysMax += parseInt(cb.dataset.days || '0', 10);
            }
        });

        // Speed modifier
        if (speedSelect && speedSelect.value === 'express') {
            total = Math.round(total * 1.25);
            daysMin = Math.max(3, Math.round(daysMin * 0.6));
            daysMax = Math.max(7, Math.round(daysMax * 0.6));
        }

        if (resultTotal) {
            resultTotal.textContent = `¥${total.toLocaleString()}`;
        }
        if (resultTimeline) {
            resultTimeline.textContent = `約 ${daysMin} 〜 ${daysMax} 営業日`;
        }
    }

    if (baseTypeSelect) baseTypeSelect.addEventListener('change', calculate);
    if (speedSelect) speedSelect.addEventListener('change', calculate);
    optionCheckboxes.forEach(cb => cb.addEventListener('change', calculate));

    // Run initial calculation
    calculate();
}
