// ===== TECH SLIDER CLASS =====

class TechSlider {
    constructor() {
        this.technologies = [
            {
                name: 'JavaScript',
                category: 'Language',
                experience: '3+ Years',
                emoji: '🟨',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
                color: '#F7DF1E'
            },
            {
                name: 'React',
                category: 'Framework',
                experience: '2+ Years',
                emoji: '⚛️',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
                color: '#61DAFB'
            },
            {
                name: 'React Native',
                category: 'Mobile',
                experience: '2+ Years',
                emoji: '📱',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
                color: '#61DAFB'
            },
            {
                name: 'Node.js',
                category: 'Runtime',
                experience: '2+ Years',
                emoji: '🟢',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
                color: '#339933'
            },
            {
                name: 'Python',
                category: 'Language',
                experience: '2+ Years',
                emoji: '🐍',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
                color: '#3776AB'
            },
            {
                name: 'PHP',
                category: 'Language',
                experience: '1+ Years',
                emoji: '🐘',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
                color: '#777BB4'
            },
            {
                name: 'HTML5',
                category: 'Markup',
                experience: '3+ Years',
                emoji: '🧱',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
                color: '#E34F26'
            },
            {
                name: 'CSS3',
                category: 'Styling',
                experience: '3+ Years',
                emoji: '🎨',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                color: '#1572B6'
            },
            {
                name: 'Expo',
                category: 'Platform',
                experience: '1+ Years',
                emoji: '📦',
                imageUrl: null, // No good icon available, will use emoji
                color: '#000020'
            },
            {
                name: 'TypeScript',
                category: 'Language',
                experience: '1+ Years',
                emoji: '📘',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
                color: '#3178C6'
            },
            {
                name: 'MongoDB',
                category: 'Database',
                experience: '2+ Years',
                emoji: '🍃',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
                color: '#47A248'
            },
            {
                name: 'Express.js',
                category: 'Framework',
                experience: '2+ Years',
                emoji: '🚀',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
                color: '#000000'
            },
            {
                name: 'Git',
                category: 'Tool',
                experience: '3+ Years',
                emoji: '🌿',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
                color: '#F05032'
            },
            {
                name: 'VS Code',
                category: 'Editor',
                experience: '3+ Years',
                emoji: '💻',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                color: '#007ACC'
            },
            {
                name: 'Firebase',
                category: 'Backend',
                experience: '1+ Years',
                emoji: '🔥',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
                color: '#FFCA28'
            },
            {
                name: 'MySQL',
                category: 'Database',
                experience: '2+ Years',
                emoji: '🐬',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
                color: '#4479A1'
            },
            {
                name: 'PostgreSQL',
                category: 'Database',
                experience: '1+ Years',
                emoji: '🐘',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
                color: '#336791'
            },
            {
                name: 'Docker',
                category: 'Tool',
                experience: '1+ Years',
                emoji: '🐳',
                imageUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
                color: '#2496ED'
            }
        ];
        
        this.track = null;
        this.pauseBtn = null;
        this.playBtn = null;
        this.restartBtn = null;
        this.speedButtons = null;
        
        this.isPaused = false;
        this.currentSpeed = 'normal';
        this.speeds = {
            slow: '60s',
            normal: '30s',
            fast: '15s'
        };
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
            });
        } else {
            this.setupElements();
        }
    }

    setupElements() {
        this.track = document.getElementById('techSliderTrack');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.playBtn = document.getElementById('playBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.speedButtons = document.querySelectorAll('.speed-btn');
        
        if (this.track) {
            this.createTechItems();
            this.setupControls();
            console.log('🎮 Tech Slider initialized!');
        }
    }

    createTechItems() {
        // Create tech items HTML
        const itemsHTML = this.technologies.map(tech => `
            <div class="tech-item" data-tech="${tech.name.toLowerCase()}">
                <div class="tech-logo" style="background: ${tech.color}20; border: 2px solid ${tech.color}40;">
                    ${this.createTechIcon(tech)}
                </div>
                <div class="tech-name">${tech.name}</div>
                <div class="tech-category">${tech.category}</div>
                <div class="tech-experience">${tech.experience}</div>
            </div>
        `).join('');

        // Duplicate items for infinite scroll
        this.track.innerHTML = itemsHTML + itemsHTML;
        
        // Set initial animation
        this.setAnimationSpeed(this.currentSpeed);
        
        // Setup image error handling
        this.setupImageFallbacks();
    }

    createTechIcon(tech) {
        if (tech.imageUrl) {
            return `
                <img src="${tech.imageUrl}" 
                     alt="${tech.name}" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="emoji-fallback" style="display: none; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">${tech.emoji}</span>
            `;
        } else {
            return `<span class="emoji-fallback" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));">${tech.emoji}</span>`;
        }
    }

    setupImageFallbacks() {
        // Add error handling for all images
        const images = this.track.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => {
                img.style.display = 'none';
                const fallback = img.nextElementSibling;
                if (fallback) {
                    fallback.style.display = 'block';
                }
            });
        });
    }

    setupControls() {
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => {
                this.pauseAnimation();
            });
        }

        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => {
                this.playAnimation();
            });
        }

        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => {
                this.restartAnimation();
            });
        }

        if (this.speedButtons) {
            this.speedButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.speedButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.currentSpeed = btn.dataset.speed;
                    this.setAnimationSpeed(this.currentSpeed);
                });
            });
        }

        // Add hover pause/play functionality
        if (this.track) {
            this.track.addEventListener('mouseenter', (e) => {
                if (e.target.classList.contains('tech-item')) {
                    this.track.style.animationPlayState = 'paused';
                }
            });

            this.track.addEventListener('mouseleave', (e) => {
                if (e.target.classList.contains('tech-item')) {
                    if (!this.isPaused) {
                        this.track.style.animationPlayState = 'running';
                    }
                }
            });
        }
    }

    pauseAnimation() {
        if (this.track) {
            this.track.style.animationPlayState = 'paused';
        }
        if (this.pauseBtn) this.pauseBtn.style.display = 'none';
        if (this.playBtn) this.playBtn.style.display = 'flex';
        this.isPaused = true;
    }

    playAnimation() {
        if (this.track) {
            this.track.style.animationPlayState = 'running';
        }
        if (this.pauseBtn) this.pauseBtn.style.display = 'flex';
        if (this.playBtn) this.playBtn.style.display = 'none';
        this.isPaused = false;
    }

    restartAnimation() {
        if (this.track) {
            this.track.style.animation = 'none';
            this.track.offsetHeight; // Trigger reflow
            this.setAnimationSpeed(this.currentSpeed);
        }
        if (!this.isPaused) {
            this.playAnimation();
        }
    }

    setAnimationSpeed(speed) {
        const duration = this.speeds[speed];
        if (this.track) {
            this.track.style.animation = `slideInfinite ${duration} linear infinite`;
        }
    }

    // Method to add new technologies
    addTechnology(tech) {
        this.technologies.push(tech);
        this.createTechItems();
    }

    // Method to update experience levels
    updateExperience(techName, newExperience) {
        const tech = this.technologies.find(t => t.name.toLowerCase() === techName.toLowerCase());
        if (tech) {
            tech.experience = newExperience;
            this.createTechItems();
        }
    }
}

// ===== ENHANCED VERSION FOR EXISTING PORTFOLIO =====
class EnhancedTechSlider extends TechSlider {
    constructor() {
        super();
        this.setupAchievementIntegration();
    }

    setupAchievementIntegration() {
        // Integrate with existing achievement system if available
        if (window.achievementSystem) {
            this.track.addEventListener('click', (e) => {
                if (e.target.closest('.tech-item')) {
                    window.achievementSystem.updateStat('techItemsViewed', 1);
                }
            });
        }
    }

    // Integration with existing sound manager
    playSound(soundName) {
        if (window.soundManager) {
            window.soundManager.play(soundName);
        }
    }

    pauseAnimation() {
        super.pauseAnimation();
        this.playSound('click');
    }

    playAnimation() {
        super.playAnimation();
        this.playSound('click');
    }

    restartAnimation() {
        super.restartAnimation();
        this.playSound('click');
    }
}

// ===== AUTO-INITIALIZATION =====
// Initialize when DOM is ready, or immediately if it's already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('techSliderTrack')) {
            window.techSlider = new EnhancedTechSlider();
        }
    });
} else {
    // Small delay to ensure other components are initialized
    setTimeout(() => {
        if (document.getElementById('techSliderTrack')) {
            window.techSlider = new EnhancedTechSlider();
        }
    }, 100);
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TechSlider, EnhancedTechSlider };
}
