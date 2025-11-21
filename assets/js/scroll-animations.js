/**
 * Sistema de animações de scroll progressivo
 * Usa Intersection Observer para detectar entrada de elementos no viewport
 * Anima texto primeiro, depois imagens (progressão visual)
 */

(function() {
    'use strict';

    // Configurações
    const ANIMATION_DELAY = 100; // Delay base entre animações
    const ROOT_MARGIN = '0px 0px -10% 0px'; // Trigger quando 10% do elemento está visível
    const THRESHOLD = 0.1; // Trigger quando 10% está visível
    
    // Verificar preferência de movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Intersection Observer para animações
    let animationObserver = null;
    
    // Intersection Observer para lazy loading de imagens
    let imageObserver = null;

    /**
     * Inicializa o sistema de animações
     */
    function initScrollAnimations() {
        // Verificar suporte ao Intersection Observer
        if (!('IntersectionObserver' in window)) {
            console.warn('Intersection Observer não suportado. Animações desabilitadas.');
            // Fallback: mostrar todos os elementos imediatamente
            document.querySelectorAll('.reveal-on-scroll').forEach(el => {
                el.classList.add('revealed');
            });
            return;
        }

        // Configurar Intersection Observer para animações
        animationObserver = new IntersectionObserver(
            handleAnimationIntersection,
            {
                root: null,
                rootMargin: ROOT_MARGIN,
                threshold: THRESHOLD
            }
        );

        // Configurar Intersection Observer para lazy loading de imagens
        // Root margin menor no mobile para melhor performance
        const imageRootMargin = window.innerWidth < 768 ? '100px' : '50px';
        imageObserver = new IntersectionObserver(
            handleImageIntersection,
            {
                root: null,
                rootMargin: imageRootMargin,
                threshold: 0.01
            }
        );

        // Observar elementos com classe reveal-on-scroll
        observeAnimationElements();
        
        // Observar imagens lazy
        observeLazyImages();
    }

    /**
     * Observa elementos que devem ser animados
     */
    function observeAnimationElements() {
        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach(element => {
            animationObserver.observe(element);
        });
    }

    /**
     * Handler para interseção de elementos de animação
     */
    function handleAnimationIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Se preferência por movimento reduzido, mostrar imediatamente
                if (prefersReducedMotion) {
                    element.classList.add('revealed');
                    observer.unobserve(element);
                    return;
                }
                
                // Obter delay customizado se existir (valores em segundos convertidos para ms)
                const delayValue = element.dataset.delay || 0;
                const delay = typeof delayValue === 'string' && delayValue.includes('.') 
                    ? parseFloat(delayValue) * 1000  // Converter segundos para milissegundos
                    : parseInt(delayValue) || 0;
                
                // Aplicar animação com delay
                setTimeout(() => {
                    element.classList.add('revealed');
                    // Remover will-change após animação para performance
                    requestAnimationFrame(() => {
                        element.style.willChange = 'auto';
                    });
                    observer.unobserve(element); // Parar de observar após animar
                }, delay);
            }
        });
    }

    /**
     * Observa imagens com lazy loading
     */
    function observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img.lazy-load');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Handler para interseção de imagens lazy
     */
    function handleImageIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Se a imagem tem data-src, carregar dela
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                
                // Adicionar classe loaded
                img.classList.add('loaded');
                observer.unobserve(img);
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
                
                // Verificar se o menu mobile está aberto - se estiver, NÃO interferir
                const navMenu = document.querySelector('.nav-menu');
                const isMenuOpen = navMenu && navMenu.classList.contains('active');
                const isMobile = window.innerWidth < 768;
                
                // Se menu mobile estiver aberto, SAIR IMEDIATAMENTE sem fazer nada
                // Deixar o mobile-menu.js gerenciar completamente
                if (isMenuOpen && isMobile) {
                    return; // Não fazer nada, deixar mobile-menu.js gerenciar
                }
                
                // Apenas processar links âncora quando menu NÃO está aberto
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Calcular posição considerando header fixo
                        const headerHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        // Smooth scroll
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Atualizar URL sem recarregar página (opcional)
                        if (history.pushState) {
                            history.pushState(null, null, href);
                        }
                    }
                }
            }, { passive: false }); // Permitir preventDefault quando necessário
        });
    }
    
    /**
     * Função auxiliar para fazer smooth scroll após menu fechar
     */
    function handleSmoothScroll(href) {
        if (!href || !href.startsWith('#')) return;
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            if (history.pushState) {
                history.pushState(null, null, href);
            }
        }
    }

    /**
     * Detecta a seção ativa e atualiza navegação
     */
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('.full-viewport-section[data-section]');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerHeight = document.querySelector('.sticky-nav')?.offsetHeight || 0;
        
        // Intersection Observer para seções
        if (!sections.length) return;
        
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        const sectionId = entry.target.getAttribute('data-section');
                        
                        // Atualizar link ativo
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                rootMargin: `-${headerHeight}px 0px -50% 0px`,
                threshold: [0, 0.5, 1]
            }
        );
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /**
     * Adiciona efeito de scroll no header (fundo mais opaco)
     */
    function initHeaderScrollEffect() {
        const nav = document.querySelector('.sticky-nav');
        if (!nav) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Adiciona animação stagger para elementos com data-delay
     * Suporta valores em segundos (0.2, 0.4) ou milissegundos (200, 400)
     */
    function initStaggerAnimations() {
        const elements = document.querySelectorAll('[data-delay]');
        elements.forEach(element => {
            const delayValue = element.dataset.delay || 0;
            // Se contém ponto decimal, assumir que está em segundos e converter
            const delay = typeof delayValue === 'string' && delayValue.includes('.') 
                ? parseFloat(delayValue) * 1000  // Converter segundos para milissegundos
                : parseInt(delayValue) || 0;
            
            // Aplicar delay tanto para animação quanto para transição CSS
            element.style.animationDelay = `${delay}ms`;
            element.style.transitionDelay = `${delay}ms`;
        });
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initScrollAnimations();
            initSmoothScroll();
            updateActiveNavigation();
            initHeaderScrollEffect();
            initStaggerAnimations();
        });
    } else {
        initScrollAnimations();
        initSmoothScroll();
        updateActiveNavigation();
        initHeaderScrollEffect();
        initStaggerAnimations();
    }

    // Re-observar elementos adicionados dinamicamente (ex: projetos do GitHub)
    window.observeNewElements = function() {
        if (animationObserver) {
            observeAnimationElements();
        }
        if (imageObserver) {
            observeLazyImages();
        }
    };

    // Exportar função para re-inicializar (útil quando novos elementos são adicionados)
    window.initScrollAnimations = initScrollAnimations;

})();
