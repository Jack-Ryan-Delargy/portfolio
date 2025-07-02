// ===== MASTER INTEGRATION FIX =====
// This script ensures all components work together properly

class MasterIntegrationFix {
    constructor() {
        this.components = new Map();
        this.initOrder = [
            'assetManager',
            'loadingScreen', 
            'themeManager',
            'gameboyEngine',
            'techCarousel',
            'projectManager',
            'contactForm',
            'scrollAnimations',
            'performanceTracker'
        ];
        
        this.init();
    }

    async init() {
        console.log('🔧 Master Integration Fix: Starting...');
        
        // Wait for DOM to be fully ready
        await this.waitForDOM();
        
        // Initialize components in order
        await this.initializeComponents();
        
        // Set up integration bridges
        this.setupIntegrationBridges();
        
        // Final validation
        this.validateIntegration();
        
        console.log('✅ Master Integration Fix: Complete!');
    }

    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async initializeComponents() {
        for (const componentName of this.initOrder) {
            try {
                await this.initializeComponent(componentName);
                await this.sleep(100); // Small delay between components
            } catch (error) {
                console.warn(`Failed to initialize ${componentName}:`, error);
            }
        }
    }

    async initializeComponent(componentName) {
        switch (componentName) {
            case 'assetManager':
                if (!window.assetManager && typeof AssetManager !== 'undefined') {
                    window.assetManager = new AssetManager();
                }
                break;
                
            case 'loadingScreen':
                if (!window.loadingScreen && typeof LoadingScreen !== 'undefined') {
                    window.loadingScreen = new LoadingScreen();
                }
                break;
                
            case 'themeManager':
                if (!window.themeManager && typeof ThemeManager !== 'undefined') {
                    window.themeManager = new ThemeManager();
                }
                break;
                
            case 'gameboyEngine':
                if (!window.gameboyEngine && typeof GameboyEngine !== 'undefined') {
                    window.gameboyEngine = new GameboyEngine();
                }
                // Connect gameboy to existing controller
                this.connectGameboyEngine();
                break;
                
            case 'techCarousel':
                if (!window.techCarousel && typeof TechCarousel !== 'undefined') {
                    const carouselContainer = document.getElementById('techCarousel');
                    if (carouselContainer) {
                        window.techCarousel = new EnhancedTechCarousel();
                    }
                }
                break;
                
            case 'projectManager':
                if (!window.projectManager && typeof ProjectManager !== 'undefined') {
                    window.projectManager = typeof EnhancedProjectManager !== 'undefined' 
                        ? new EnhancedProjectManager() 
                        : new ProjectManager();
                }
                break;
                
            case 'contactForm':
                if (!window.contactForm && typeof ContactForm !== 'undefined') {
                    window.contactForm = typeof EnhancedContactForm !== 'undefined'
                        ? new EnhancedContactForm()
                        : new ContactForm();
                }
                break;
                
            case 'scrollAnimations':
                if (!window.scrollAnimations && typeof ScrollAnimations !== 'undefined') {
                    window.scrollAnimations = new ScrollAnimations();
                }
                break;
                
            case 'performanceTracker':
                if (!window.performanceTracker && typeof PerformanceTracker !== 'undefined') {
                    window.performanceTracker = new PerformanceTracker();
                }
                break;
        }
        
        this.components.set(componentName, window[componentName]);
    }

    connectGameboyEngine() {
        // Connect gameboy engine to existing gameboy controller
        if (window.gameboyEngine && window.GameboyController) {
            const originalHandleInput = window.GameboyController.prototype.handleInput;
            
            window.GameboyController.prototype.handleInput = function(input) {
                // Call original handler
                if (originalHandleInput) {
                    originalHandleInput.call(this, input);
                }
                
                // Also send to gameboy engine
                if (window.gameboyEngine) {
                    window.gameboyEngine.handleInput(input);
                }
            };
        }
    }

    setupIntegrationBridges() {
        // Bridge gameboy events
        this.bridgeGameboyEvents();
        
        // Bridge tech carousel events
        this.bridgeTechCarouselEvents();
        
        // Bridge form events
        this.bridgeFormEvents();
        
        // Bridge scroll events
        this.bridgeScrollEvents();
        
        // Bridge performance events
        this.bridgePerformanceEvents();
    }

    bridgeGameboyEvents() {
        // Ensure gameboy controller exists and works with all systems
        const gameboyElement = document.getElementById('gameboy');
        if (!gameboyElement) return;

        // Add event listeners for gameboy interactions
        gameboyElement.addEventListener('click', (e) => {
            if (e.target.matches('.d-pad-btn, .action-btn, .system-btn')) {
                // Trigger achievement if available
                if (window.achievementSystem) {
                    window.achievementSystem.updateStat('gameboyInteractions', 1);
                }
                
                // Play sound
                if (window.soundManager) {
                    window.soundManager.play('click');
                }
            }
        });
    }

    bridgeTechCarouselEvents() {
        // Connect tech carousel to achievement system
        const carouselElement = document.getElementById('techCarousel');
        if (!carouselElement) return;

        carouselElement.addEventListener('click', () => {
            if (window.achievementSystem) {
                window.achievementSystem.updateStat('skillsViewed', 1);
            }
        });
    }

    bridgeFormEvents() {
        // Ensure form submission triggers all necessary events
        document.addEventListener('formSubmitted', () => {
            if (window.achievementSystem) {
                window.achievementSystem.updateStat('contactFormSubmissions', 1);
            }
            
            if (window.soundManager) {
                window.soundManager.play('success');
            }
        });
    }

    bridgeScrollEvents() {
        // Enhance scroll tracking
        let lastScrollY = 0;
        const scrollHandler = () => {
            const currentScrollY = window.scrollY;
            const scrollDelta = Math.abs(currentScrollY - lastScrollY);
            
            if (window.achievementSystem && scrollDelta > 0) {
                window.achievementSystem.updateStat('scrollDistance', scrollDelta);
            }
            
            lastScrollY = currentScrollY;
        };
        
        window.addEventListener('scroll', this.throttle(scrollHandler, 100));
    }

    bridgePerformanceEvents() {
        // Report performance metrics to tracking system
        if (window.performanceTracker) {
            // Monitor long tasks
            if ('PerformanceObserver' in window) {
                try {
                    const observer = new PerformanceObserver((list) => {
                        list.getEntries().forEach(entry => {
                            if (entry.duration > 50) {
                                window.performanceTracker.reportMetric('longTask', entry.duration);
                            }
                        });
                    });
                    observer.observe({ entryTypes: ['longtask'] });
                } catch (e) {
                    // Long task observation not supported
                }
            }
        }
    }

    validateIntegration() {
        const requiredElements = [
            '#pixelTitle',
            '#pixelDesc', 
            '#hpFill',
            '#levelNumber',
            '#techCarousel',
            '#contactForm'
        ];
        
        const missingElements = requiredElements.filter(selector => 
            !document.querySelector(selector)
        );
        
        if (missingElements.length > 0) {
            console.warn('Missing required elements:', missingElements);
            this.createMissingElements(missingElements);
        }
        
        // Validate component initialization
        const expectedComponents = [
            'assetManager',
            'soundManager',
            'themeManager'
        ];
        
        const missingComponents = expectedComponents.filter(comp => 
            !window[comp]
        );
        
        if (missingComponents.length > 0) {
            console.warn('Missing components:', missingComponents);
            this.initializeMissingComponents(missingComponents);
        }
        
        console.log('🔍 Integration validation complete');
    }

    createMissingElements(missingSelectors) {
        missingSelectors.forEach(selector => {
            const id = selector.replace('#', '');
            let element;
            
            switch (id) {
                case 'pixelTitle':
                    element = document.createElement('h3');
                    element.textContent = 'DEVTRAINER';
                    break;
                case 'pixelDesc':
                    element = document.createElement('p');
                    element.textContent = 'System Ready';
                    break;
                case 'hpFill':
                    element = document.createElement('div');
                    element.style.width = '85%';
                    element.style.height = '100%';
                    element.style.background = 'var(--pokemon-green)';
                    break;
                case 'levelNumber':
                    element = document.createElement('span');
                    element.textContent = '85';
                    break;
                default:
                    element = document.createElement('div');
            }
            
            element.id = id;
            element.style.display = element.style.display || 'block';
            
            // Try to find appropriate parent
            const gameboy = document.querySelector('.gameboy');
            if (gameboy && ['pixelTitle', 'pixelDesc', 'hpFill', 'levelNumber'].includes(id)) {
                gameboy.appendChild(element);
            } else {
                document.body.appendChild(element);
            }
            
            console.log(`Created missing element: ${id}`);
        });
    }

    initializeMissingComponents(missingComponents) {
        missingComponents.forEach(componentName => {
            switch (componentName) {
                case 'assetManager':
                    window.assetManager = { 
                        createFallbackAvatar: () => {},
                        preloadCriticalAssets: () => {}
                    };
                    break;
                case 'soundManager':
                    window.soundManager = {
                        play: (sound) => console.log(`Playing ${sound}`),
                        toggle: () => {},
                        setVolume: () => {}
                    };
                    break;
                case 'themeManager':
                    window.themeManager = {
                        toggleTheme: () => {
                            document.body.toggleAttribute('data-theme');
                        }
                    };
                    break;
            }
            console.log(`Created fallback for: ${componentName}`);
        });
    }

    // Utility functions
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Diagnostics
    runDiagnostics() {
        const diagnostics = {
            dom: document.readyState,
            components: Array.from(this.components.keys()),
            missingElements: [],
            errors: []
        };
        
        // Check for required elements
        const required = ['#gameboy', '#techCarousel', '#contactForm'];
        required.forEach(selector => {
            if (!document.querySelector(selector)) {
                diagnostics.missingElements.push(selector);
            }
        });
        
        // Check for JavaScript errors
        const originalError = window.onerror;
        window.onerror = (msg, url, line, col, error) => {
            diagnostics.errors.push({ msg, url, line, col, error });
            if (originalError) originalError(msg, url, line, col, error);
        };
        
        console.log('🔧 Site Diagnostics:', diagnostics);
        return diagnostics;
    }
}

// ===== AUTO-INITIALIZATION =====
// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.masterIntegrationFix = new MasterIntegrationFix();
    });
} else {
    window.masterIntegrationFix = new MasterIntegrationFix();
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MasterIntegrationFix };
}