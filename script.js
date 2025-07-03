// ===== SIMPLIFIED PORTFOLIO SCRIPT WITH FIXES =====

// ===== LOADING SCREEN =====
class LoadingScreen {
    constructor() {
        this.loadingElement = document.getElementById('loadingScreen');
        this.minLoadTime = 1500;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.hideAfterDelay();
            });
        } else {
            this.hideAfterDelay();
        }
    }

    async hideAfterDelay() {
        const elapsed = Date.now() - this.startTime;
        const remaining = Math.max(0, this.minLoadTime - elapsed);
        
        await new Promise(resolve => setTimeout(resolve, remaining));
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hidden');
            setTimeout(() => {
                this.loadingElement.remove();
            }, 500);
        }
        console.log('🎮 Loading complete!');
    }
}

// ===== THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        const themeToggle = document.getElementById('themeToggle');
        
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            document.body.removeAttribute('data-theme');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    }
}

// ===== PROJECT MANAGER =====
class ProjectManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadProjects();
        this.setupFilters();
        this.renderProjects();
    }

    loadProjects() {
        this.projects = [
            {
                id: 1,
                title: 'Portfolio Evolution',
                category: 'web',
                level: 'Lv. 95',
                icon: '🎮',
                description: 'Modern portfolio website with Pokemon-themed interactive elements.',
                tech: ['HTML5', 'CSS3', 'JavaScript', 'PWA'],
                liveUrl: '#',
                codeUrl: 'https://github.com/Jack-Ryan-Delargy'
            },
            {
                id: 2,
                title: 'React Pokédex',
                category: 'web',
                level: 'Lv. 88',
                icon: '⚡',
                description: 'Interactive Pokédex built with React and the PokéAPI.',
                tech: ['React', 'TypeScript', 'REST API', 'CSS Modules'],
                liveUrl: '#',
                codeUrl: 'https://github.com/Jack-Ryan-Delargy'
            },
            {
                id: 3,
                title: 'Pixel Adventure',
                category: 'game',
                level: 'Lv. 82',
                icon: '🕹️',
                description: '2D pixel-art adventure game with Canvas and vanilla JS.',
                tech: ['JavaScript', 'HTML5 Canvas', 'Web Audio', 'Game Physics'],
                liveUrl: '#',
                codeUrl: 'https://github.com/Jack-Ryan-Delargy'
            },
            {
                id: 4,
                title: 'Task Manager Pro',
                category: 'tool',
                level: 'Lv. 76',
                icon: '📋',
                description: 'Full-stack task management app with real-time updates.',
                tech: ['Node.js', 'Express', 'MongoDB', 'Socket.io'],
                liveUrl: '#',
                codeUrl: 'https://github.com/Jack-Ryan-Delargy'
            },
            {
                id: 5,
                title: 'Weather Wizard',
                category: 'mobile',
                level: 'Lv. 70',
                icon: '🌦️',
                description: 'Mobile-first weather app with beautiful animations.',
                tech: ['React Native', 'Weather API', 'Async Storage', 'Animations'],
                liveUrl: '#',
                codeUrl: 'https://github.com/Jack-Ryan-Delargy'
            },
            {
                id: 6,
                title: 'Code Snippets',
                category: 'tool',
                level: 'Lv. 65',
                icon: '💻',
                description: 'Developer tool for managing and sharing code snippets.',
                tech: ['Vue.js', 'Firebase', 'Syntax Highlighting', 'PWA'],
                liveUrl: '#',
                codeUrl: 'https://github.com/Jack-Ryan-Delargy'
            }
        ];
        
        this.filteredProjects = [...this.projects];
    }

    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.currentFilter = btn.dataset.filter;
                this.filterProjects();
            });
        });
    }

    filterProjects() {
        if (this.currentFilter === 'all') {
            this.filteredProjects = [...this.projects];
        } else {
            this.filteredProjects = this.projects.filter(project => 
                project.category === this.currentFilter
            );
        }
        this.renderProjects();
    }

    renderProjects() {
        const grid = document.getElementById('projectGrid');
        if (!grid) return;

        grid.innerHTML = this.filteredProjects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <div class="project-header">
                    <div class="project-icon">${project.icon}</div>
                    <div class="project-info">
                        <h3>${project.title}</h3>
                        <div class="project-level">${project.level}</div>
                    </div>
                </div>
                <div class="project-description">
                    ${project.description}
                </div>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveUrl}" class="project-link primary" target="_blank">
                        View Live
                    </a>
                    <a href="${project.codeUrl}" class="project-link secondary" target="_blank">
                        View Code
                    </a>
                </div>
            </div>
        `).join('');
    }
}

// ===== CONTACT FORM =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        this.setLoading(true);

        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.showSuccess();
            this.form.reset();
            
            // Dispatch custom event for achievements
            document.dispatchEvent(new CustomEvent('formSubmitted', { detail: data }));
        } catch (error) {
            this.showError();
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        if (this.submitBtn) {
            this.submitBtn.classList.toggle('loading', loading);
            this.submitBtn.disabled = loading;
        }
    }

    showSuccess() {
        this.showNotification('Message sent successfully! 🎉', 'success');
    }

    showError() {
        this.showNotification('Failed to send message. Please try again. 😔', 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: ${type === 'success' ? 'var(--pokemon-green)' : 'var(--pokemon-red)'};
                color: white;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 30px var(--shadow-medium);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            ">
                ${message}
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// ===== TYPEWRITER EFFECT =====
class TypewriterEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 50,
            deleteSpeed: 30,
            pauseTime: 2000,
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? this.options.deleteSpeed : this.options.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = this.options.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupScrollObserver();
        this.setupNavbarScroll();
    }

    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, this.observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

// ===== SMOOTH SCROLLING =====
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (window.mobileMenu) {
                        window.mobileMenu.close();
                    }
                }
            });
        });
    }
}

// ===== SIMPLE SOUND MANAGER =====
class SoundManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.init();
    }

    init() {
        // Initialize audio context on first user interaction
        document.addEventListener('click', this.initAudioContext.bind(this), { once: true });
        document.addEventListener('touchstart', this.initAudioContext.bind(this), { once: true });
        
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, a[href]')) {
                this.playClick();
            }
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('button, .btn, a[href]')) {
                this.playHover();
            }
        });
    }

    initAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                console.warn('Audio context not supported');
            }
        }
    }

    playClick() {
        if (!this.enabled || !this.audioContext) return;
        this.createBeep(800, 0.1, 0.1);
    }

    playHover() {
        if (!this.enabled || !this.audioContext) return;
        this.createBeep(600, 0.05, 0.05);
    }

    play(soundName) {
        if (!this.enabled) return;
        
        switch (soundName) {
            case 'click':
                this.playClick();
                break;
            case 'hover':
                this.playHover();
                break;
            case 'success':
                this.playSuccess();
                break;
        }
    }

    playSuccess() {
        if (!this.enabled || !this.audioContext) return;
        
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(freq, 0.3, 0.1);
            }, index * 100);
        });
    }

    createBeep(frequency, duration, volume = 0.1) {
        if (!this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (error) {
            // Audio not supported, silent fail
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        console.log(`🔊 Sound ${this.enabled ? 'enabled' : 'disabled'}`);
    }
}

// ===== ENHANCED MOBILE MENU =====
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.navLinks = document.getElementById('navLinks');
        this.isOpen = false;
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }

        // Close menu when clicking nav links
        if (this.navLinks) {
            this.navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                    this.close();
                }
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.navLinks.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.close();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isAnimating) return;
        
        this.isOpen ? this.close() : this.open();
    }

    open() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = true;
        
        this.navLinks.classList.add('active');
        this.menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Play sound effect
        if (window.soundManager) {
            window.soundManager.play('click');
        }
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }

    close() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.isOpen = false;
        
        this.navLinks.classList.remove('active');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Play sound effect
        if (window.soundManager) {
            window.soundManager.play('click');
        }
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 400);
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.particleContainer = document.getElementById('particles');
        this.maxParticles = 50;
        this.init();
    }

    init() {
        if (!this.particleContainer) return;
        
        this.createParticles();
        this.animateParticles();
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
    }

    createParticle() {
        if (!this.particleContainer) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random starting position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        this.particleContainer.appendChild(particle);
        
        // Remove particle after animation
        particle.addEventListener('animationend', () => {
            if (particle.parentNode) {
                particle.remove();
            }
            // Create new particle to maintain count
            setTimeout(() => this.createParticle(), Math.random() * 5000);
        });
    }

    animateParticles() {
        // Additional particle animations can be added here
    }
}

// ===== ERROR HANDLER =====
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.warn('Handled error:', e.error?.message || e.message);
            // Don't show errors to users, just log them
        });

        // Promise rejection handling
        window.addEventListener('unhandledrejection', (e) => {
            console.warn('Handled promise rejection:', e.reason);
            e.preventDefault();
        });

        // Image error handling
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    handleImageError(img) {
        if (!img.dataset.fallbackHandled) {
            img.dataset.fallbackHandled = 'true';
            img.style.display = 'none';
            
            // Try to show fallback element
            const fallback = img.nextElementSibling;
            if (fallback && fallback.classList.contains('emoji-fallback')) {
                fallback.style.display = 'block';
            }
        }
    }
}

// ===== MAIN APP INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize error handler first
    new ErrorHandler();
    
    // Initialize all components
    new LoadingScreen();
    window.themeManager = new ThemeManager();
    window.projectManager = new ProjectManager();
    window.contactForm = new ContactForm();
    window.scrollAnimations = new ScrollAnimations();
    window.smoothScrolling = new SmoothScrolling();
    window.mobileMenu = new MobileMenu();
    window.particleSystem = new ParticleSystem();
    
    // Initialize sound manager
    window.soundManager = new SoundManager();
    
    // Initialize typewriter effect
    const typewriterTexts = [
        'Full-Stack Developer',
        'React Specialist', 
        'Node.js Expert',
        'Problem Solver',
        'Code Trainer'
    ];
    
    const typewriterElement = document.getElementById('heroTypewriter');
    if (typewriterElement) {
        window.typewriterEffect = new TypewriterEffect(typewriterElement, typewriterTexts);
    }
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Page loaded in ${loadTime}ms`);
        });
    }
    
    console.log('🎮 Enhanced portfolio loaded successfully!');
});

// Add basic CSS animations if not already present
if (!document.querySelector('#dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Improved focus styles */
        *:focus-visible {
            outline: 2px solid var(--text-accent);
            outline-offset: 2px;
            border-radius: 4px;
        }
        
        /* Smooth transitions for theme switching */
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Export for debugging
window.PortfolioApp = {
    themeManager: () => window.themeManager,
    mobileMenu: () => window.mobileMenu,
    soundManager: () => window.soundManager,
    projectManager: () => window.projectManager
};
