// ===== SIMPLIFIED PORTFOLIO SCRIPT =====

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
        this.setupSkillBars();
        this.setupNavbarScroll();
    }

    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    if (entry.target.classList.contains('skills')) {
                        setTimeout(() => this.animateSkillBars(), 500);
                    }
                }
            });
        }, this.observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    setupSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            const level = item.dataset.level;
            const progressBar = item.querySelector('.skill-progress');
            if (progressBar) {
                progressBar.dataset.width = `${level}%`;
            }
        });
    }

    animateSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            const progressBar = item.querySelector('.skill-progress');
            if (progressBar) {
                setTimeout(() => {
                    const width = progressBar.dataset.width;
                    progressBar.style.width = width;
                }, index * 100);
            }
        });
    }

    setupNavbarScroll() {
        const navbar = document.getElementById('navbar');

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
                }
            });
        });
    }
}

// ===== SIMPLE SOUND MANAGER =====
class SoundManager {
    constructor() {
        this.enabled = true;
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn')) {
                this.playClick();
            }
        });
    }

    playClick() {
        if (!this.enabled) return;
        
        // Simple click sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Audio not supported, silent fail
        }
    }

    play(soundName) {
        if (soundName === 'click') {
            this.playClick();
        }
    }
}

// ===== MOBILE MENU =====
class MobileMenu {
    constructor() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.navLinks = document.getElementById('navLinks');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                this.toggle();
            });
        }

        if (this.navLinks) {
            this.navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    this.close();
                }
            });
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.navLinks.classList.add('active');
        this.menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.navLinks.classList.remove('active');
        this.menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== MAIN APP INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new LoadingScreen();
    new ThemeManager();
    new ProjectManager();
    new ContactForm();
    new ScrollAnimations();
    new SmoothScrolling();
    new MobileMenu();
    
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
        new TypewriterEffect(typewriterElement, typewriterTexts);
    }
    
    console.log('🎮 Simple portfolio loaded successfully!');
});

// Add basic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);