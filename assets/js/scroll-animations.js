/**
 * Navegação e comportamento de scroll:
 * - Reset para o topo ao carregar sem hash
 * - Smooth scroll para links âncora
 * - Destaque do link ativo conforme a seção que cruza o meio da tela
 * - Efeito de opacidade e auto-hide da barra de navegação
 */

(function() {
    'use strict';

    /**
     * Garante que a página abre no topo (evita micro-scroll / restauração do browser)
     */
    function initScrollReset() {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        const resetToTop = () => {
            const hash = window.location.hash;
            if (!hash || hash === '#hero') {
                window.scrollTo(0, 0);
            }
        };

        resetToTop();

        window.addEventListener('load', resetToTop);
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                resetToTop();
            }
        });
    }

    /**
     * Inicializa smooth scroll para links de navegação
     */
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Se menu mobile estiver aberto, deixar o mobile-menu.js gerenciar
                const navMenu = document.querySelector('.nav-menu');
                const isMenuOpen = navMenu && navMenu.classList.contains('active');
                const isMobile = window.innerWidth < 768;

                if (isMenuOpen && isMobile) {
                    return;
                }

                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        e.preventDefault();

                        const headerHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
                        const targetPosition = Math.max(0, targetElement.offsetTop - headerHeight);

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        if (history.pushState) {
                            history.pushState(null, null, href);
                        }
                    }
                }
            }, { passive: false });
        });
    }

    /**
     * Detecta a seção que cruza a linha central da viewport e atualiza o menu ativo
     */
    function updateActiveNavigation() {
        const sections = Array.from(document.querySelectorAll('[data-section]'));
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        if (!sections.length || !navLinks.length) return;

        let currentSectionId = null;
        let ticking = false;

        const setActiveLink = (sectionId) => {
            if (sectionId === currentSectionId) return;
            currentSectionId = sectionId;

            navLinks.forEach(link => {
                const isMatch = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('active', isMatch);
            });
        };

        const detectActiveSection = () => {
            ticking = false;

            const scrollY = window.scrollY || window.pageYOffset || 0;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const docHeight = document.documentElement.scrollHeight;

            // No fim da página, destaca a última seção (ex: Contato em telas altas)
            if (scrollY + viewportHeight >= docHeight - 4) {
                setActiveLink(sections[sections.length - 1].getAttribute('data-section'));
                return;
            }

            const headerHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
            const probeY = headerHeight + (viewportHeight - headerHeight) * 0.45;

            let activeId = sections[0].getAttribute('data-section');

            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= probeY) {
                    activeId = section.getAttribute('data-section');
                    if (rect.bottom > probeY) {
                        break;
                    }
                }
            }

            setActiveLink(activeId);
        };

        const scheduleDetect = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(detectActiveSection);
        };

        window.addEventListener('scroll', scheduleDetect, { passive: true });
        window.addEventListener('resize', scheduleDetect, { passive: true });
        detectActiveSection();
    }

    /**
     * Adiciona efeito de scroll no header (fundo mais opaco e auto-hide)
     */
    function initHeaderScrollEffect() {
        const nav = document.querySelector('#main-navigation.sticky-nav')
            || document.querySelector('.sticky-nav');
        if (!nav) return;

        const getScrollY = () => Math.max(
            0,
            window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
        );

        let lastScroll = getScrollY();
        let ticking = false;
        const scrollDelta = 4;
        const hideAfter = 48;

        const updateNavOnScroll = () => {
            const currentScroll = getScrollY();

            if (currentScroll > 24) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
                nav.classList.remove('nav--hidden');
            }

            // Esconder no scroll down (mesmo com reduced-motion — animação fica instantânea via CSS)
            if (currentScroll > hideAfter) {
                if (currentScroll > lastScroll + scrollDelta) {
                    nav.classList.add('nav--hidden');
                    if (window.mobileMenu?.isOpen?.()) {
                        window.mobileMenu.close();
                    }
                } else if (currentScroll < lastScroll - scrollDelta) {
                    nav.classList.remove('nav--hidden');
                }
            } else {
                nav.classList.remove('nav--hidden');
            }

            lastScroll = currentScroll;
            ticking = false;
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateNavOnScroll);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('scroll', onScroll, { passive: true, capture: true });
        updateNavOnScroll();
    }

    // Reset de scroll o mais cedo possível (antes do paint)
    initScrollReset();

    const init = () => {
        initSmoothScroll();
        updateActiveNavigation();
        initHeaderScrollEffect();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Mantido como no-op por compatibilidade com scripts que possam chamá-lo
    window.observeNewElements = function() {};
})();
