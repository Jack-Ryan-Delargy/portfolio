// ===== ENHANCED GAMEBOY ENGINE =====

class GameboyEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = {
            currentScreen: 'pokemon',
            pokemon: [
                { name: 'PIKACHU', type: 'Electric', level: 85, hp: 85, sprite: '⚡', color: '#FFD700' },
                { name: 'CHARIZARD', type: 'Fire', level: 88, hp: 92, sprite: '🔥', color: '#FF6B47' },
                { name: 'BLASTOISE', type: 'Water', level: 82, hp: 88, sprite: '🌊', color: '#4ECDC4' },
                { name: 'VENUSAUR', type: 'Grass', level: 80, hp: 90, sprite: '🌿', color: '#95E1D3' },
                { name: 'MEWTWO', type: 'Psychic', level: 95, hp: 98, sprite: '🧠', color: '#C678DD' },
                { name: 'RAYQUAZA', type: 'Dragon', level: 92, hp: 95, sprite: '🐉', color: '#7CB342' }
            ],
            currentPokemon: 0,
            messages: [
                "Welcome, Trainer!",
                "Ready for battle?",
                "Choose your Pokemon!",
                "Adventure awaits!",
                "Gotta code 'em all!",
                "System operational!",
                "Pokemon data loaded!"
            ],
            currentMessage: 0,
            stats: {
                interactions: 0,
                pokemonViewed: 0,
                timeActive: 0
            }
        };
        
        this.animationFrame = null;
        this.lastUpdateTime = 0;
        this.autoRotateTimer = 0;
        this.isActive = false;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupControls();
        this.startGameLoop();
        this.updateDisplay();
        this.startAutoRotation();
        console.log('🎮 Enhanced Gameboy Engine initialized!');
    }

    setupCanvas() {
        const gameDisplay = document.getElementById('gameDisplay');
        if (!gameDisplay) return;

        // Create canvas if it doesn't exist
        this.canvas = document.createElement('canvas');
        this.canvas.width = 240;
        this.canvas.height = 160;
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            border-radius: 4px;
            image-rendering: pixelated;
            background: #8fbc8f;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        // Clear any existing content and add canvas
        gameDisplay.innerHTML = '';
        gameDisplay.appendChild(this.canvas);
        
        this.isActive = true;
    }

    setupControls() {
        // D-pad controls
        document.querySelectorAll('.d-pad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleInput(btn.dataset.direction);
            });
        });

        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleInput(btn.dataset.action);
            });
        });

        // System buttons
        document.querySelectorAll('.system-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleInput(btn.dataset.action);
            });
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    handleKeyboard(e) {
        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'Space': 'a',
            'Enter': 'start',
            'Shift': 'select',
            'KeyB': 'b'
        };

        const action = keyMap[e.code];
        if (action) {
            e.preventDefault();
            this.handleInput(action);
        }
    }

    handleInput(input) {
        this.gameState.stats.interactions++;
        
        switch (input) {
            case 'up':
                this.switchScreen('stats');
                break;
            case 'down':
                this.switchScreen('pokemon');
                break;
            case 'right':
                this.nextPokemon();
                break;
            case 'left':
                this.previousPokemon();
                break;
            case 'a':
                this.selectPokemon();
                break;
            case 'b':
                this.showInfo();
                break;
            case 'start':
                this.showMessage();
                break;
            case 'select':
                this.randomPokemon();
                break;
        }
        
        this.updateDisplay();
        
        // Play sound effect
        if (window.soundManager) {
            window.soundManager.play('click');
        }

        // Accessibility announcement
        if (window.accessibilityEnhancer) {
            window.accessibilityEnhancer.announceToScreenReader(this.getStatusText());
        }
    }

    switchScreen(screen) {
        this.gameState.currentScreen = screen;
        this.render();
    }

    nextPokemon() {
        this.gameState.currentPokemon = (this.gameState.currentPokemon + 1) % this.gameState.pokemon.length;
        this.gameState.stats.pokemonViewed++;
    }

    previousPokemon() {
        this.gameState.currentPokemon = (this.gameState.currentPokemon - 1 + this.gameState.pokemon.length) % this.gameState.pokemon.length;
        this.gameState.stats.pokemonViewed++;
    }

    selectPokemon() {
        const pokemon = this.getCurrentPokemon();
        this.showTemporaryMessage(`${pokemon.sprite} ${pokemon.name} SELECTED!`);
        
        // Trigger achievement if available
        if (window.achievementSystem) {
            window.achievementSystem.updateStat('pokemonSelected', 1);
        }
    }

    showInfo() {
        const pokemon = this.getCurrentPokemon();
        this.showTemporaryMessage(`${pokemon.name}\nType: ${pokemon.type}\nLv: ${pokemon.level}\nHP: ${pokemon.hp}%`);
    }

    showMessage() {
        const message = this.gameState.messages[this.gameState.currentMessage];
        this.gameState.currentMessage = (this.gameState.currentMessage + 1) % this.gameState.messages.length;
        this.showTemporaryMessage(message);
    }

    randomPokemon() {
        this.gameState.currentPokemon = Math.floor(Math.random() * this.gameState.pokemon.length);
        this.gameState.stats.pokemonViewed++;
    }

    getCurrentPokemon() {
        return this.gameState.pokemon[this.gameState.currentPokemon];
    }

    updateDisplay() {
        const pokemon = this.getCurrentPokemon();
        
        // Update HTML elements
        const titleEl = document.getElementById('pixelTitle');
        if (titleEl) {
            titleEl.textContent = pokemon.name;
        }

        const descEl = document.getElementById('pixelDesc');
        if (descEl) {
            if (this.gameState.currentScreen === 'stats') {
                descEl.textContent = `Interactions: ${this.gameState.stats.interactions}\nPokemon viewed: ${this.gameState.stats.pokemonViewed}\nUse D-pad to navigate`;
            } else {
                descEl.textContent = `${pokemon.sprite} ${pokemon.type} Type\nLevel ${pokemon.level}\nUse D-pad to navigate`;
            }
        }

        const hpFill = document.getElementById('hpFill');
        if (hpFill) {
            hpFill.style.width = `${pokemon.hp}%`;
            hpFill.style.background = pokemon.hp > 50 ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #f87171, #ef4444)';
        }

        const levelNumber = document.getElementById('levelNumber');
        if (levelNumber) {
            levelNumber.textContent = pokemon.level;
        }

        const gameScore = document.getElementById('gameScore');
        if (gameScore) {
            gameScore.textContent = pokemon.level * 100 + this.gameState.stats.interactions * 10;
        }

        // Render canvas
        this.render();
    }

    render() {
        if (!this.ctx || !this.isActive) return;

        const pokemon = this.getCurrentPokemon();
        
        // Clear canvas
        this.ctx.fillStyle = '#8fbc8f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState.currentScreen === 'pokemon') {
            this.renderPokemonScreen(pokemon);
        } else if (this.gameState.currentScreen === 'stats') {
            this.renderStatsScreen();
        }
        
        // Add scan lines effect
        this.addScanLines();
    }

    renderPokemonScreen(pokemon) {
        // Background pattern
        this.ctx.fillStyle = 'rgba(45, 74, 45, 0.1)';
        for (let x = 0; x < this.canvas.width; x += 20) {
            for (let y = 0; y < this.canvas.height; y += 20) {
                this.ctx.fillRect(x, y, 1, 1);
            }
        }

        // Pokemon sprite area
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(20, 20, 200, 80);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(21, 21, 198, 78);

        // Pokemon sprite (using emoji)
        this.ctx.font = '48px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = pokemon.color || '#2d4a2d';
        this.ctx.fillText(pokemon.sprite, this.canvas.width / 2, 75);

        // Pokemon name
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillStyle = '#2d4a2d';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(pokemon.name, this.canvas.width / 2, 120);

        // Type and level
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`${pokemon.type} • Lv.${pokemon.level}`, this.canvas.width / 2, 140);

        // HP Bar
        const barWidth = 120;
        const barHeight = 8;
        const barX = (this.canvas.width - barWidth) / 2;
        const barY = 145;
        
        this.ctx.fillStyle = '#2d4a2d';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        this.ctx.fillStyle = pokemon.hp > 50 ? '#4ade80' : '#f87171';
        this.ctx.fillRect(barX, barY, (barWidth * pokemon.hp) / 100, barHeight);
    }

    renderStatsScreen() {
        // Background
        this.ctx.fillStyle = 'rgba(45, 74, 45, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillStyle = '#2d4a2d';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TRAINER STATS', this.canvas.width / 2, 30);

        // Stats
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        
        const stats = [
            `Interactions: ${this.gameState.stats.interactions}`,
            `Pokemon Viewed: ${this.gameState.stats.pokemonViewed}`,
            `Time Active: ${Math.floor(this.gameState.stats.timeActive / 1000)}s`,
            `Current Pokemon: ${this.getCurrentPokemon().name}`,
            `Collection: ${this.gameState.pokemon.length}/151`
        ];

        stats.forEach((stat, index) => {
            this.ctx.fillText(stat, 20, 60 + (index * 20));
        });

        // Navigation hint
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'rgba(45, 74, 45, 0.7)';
        this.ctx.fillText('Press DOWN for Pokemon', this.canvas.width / 2, 150);
    }

    addScanLines() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let y = 0; y < this.canvas.height; y += 2) {
            this.ctx.fillRect(0, y, this.canvas.width, 1);
        }
    }

    showTemporaryMessage(message) {
        const descEl = document.getElementById('pixelDesc');
        if (!descEl) return;

        const originalMessage = descEl.textContent;
        descEl.textContent = message;

        setTimeout(() => {
            this.updateDisplay();
        }, 2000);
    }

    startGameLoop() {
        const gameLoop = (currentTime) => {
            if (currentTime - this.lastUpdateTime >= 100) { // 10 FPS for retro feel
                this.gameState.stats.timeActive = currentTime;
                this.lastUpdateTime = currentTime;
            }
            
            if (this.isActive) {
                this.animationFrame = requestAnimationFrame(gameLoop);
            }
        };
        
        gameLoop(0);
    }

    startAutoRotation() {
        setInterval(() => {
            if (this.gameState.currentScreen === 'pokemon') {
                this.nextPokemon();
                this.updateDisplay();
            }
        }, 8000);
    }

    getStatusText() {
        const pokemon = this.getCurrentPokemon();
        return `${pokemon.name}, ${pokemon.type} type, level ${pokemon.level}`;
    }

    // Public API methods
    pause() {
        this.isActive = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    resume() {
        this.isActive = true;
        this.startGameLoop();
    }

    reset() {
        this.gameState.currentPokemon = 0;
        this.gameState.currentMessage = 0;
        this.gameState.currentScreen = 'pokemon';
        this.gameState.stats = {
            interactions: 0,
            pokemonViewed: 0,
            timeActive: 0
        };
        this.updateDisplay();
    }

    getGameState() {
        return { ...this.gameState };
    }
}

// ===== ACHIEVEMENT SYSTEM =====
class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_click',
                name: 'First Steps',
                description: 'Make your first interaction',
                requirement: { stat: 'interactions', value: 1 },
                icon: '👶',
                unlocked: false
            },
            {
                id: 'pokemon_explorer',
                name: 'Pokemon Explorer',
                description: 'View 10 different Pokemon',
                requirement: { stat: 'pokemonViewed', value: 10 },
                icon: '🔍',
                unlocked: false
            },
            {
                id: 'button_masher',
                name: 'Button Masher',
                description: 'Make 50 interactions',
                requirement: { stat: 'interactions', value: 50 },
                icon: '🎮',
                unlocked: false
            },
            {
                id: 'dedicated_trainer',
                name: 'Dedicated Trainer',
                description: 'Stay active for 5 minutes',
                requirement: { stat: 'timeActive', value: 300000 },
                icon: '⭐',
                unlocked: false
            }
        ];
        
        this.stats = {
            interactions: 0,
            pokemonViewed: 0,
            timeActive: 0,
            pokemonSelected: 0
        };
        
        this.init();
    }

    init() {
        this.loadProgress();
        console.log('🏆 Achievement system initialized');
    }

    updateStat(statName, value) {
        this.stats[statName] = (this.stats[statName] || 0) + value;
        this.checkAchievements();
        this.saveProgress();
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked) {
                const req = achievement.requirement;
                if (this.stats[req.stat] >= req.value) {
                    this.unlockAchievement(achievement);
                }
            }
        });
    }

    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.showAchievementNotification(achievement);
        
        if (window.soundManager) {
            window.soundManager.play('success');
        }
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 2rem;
                left: 2rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 30px var(--shadow-medium);
                z-index: 10000;
                animation: slideInLeft 0.3s ease;
                min-width: 280px;
            ">
                <div style="font-weight: bold; margin-bottom: 0.5rem;">
                    ${achievement.icon} Achievement Unlocked!
                </div>
                <div style="font-size: 1.1em; margin-bottom: 0.25rem;">
                    ${achievement.name}
                </div>
                <div style="opacity: 0.9; font-size: 0.9em;">
                    ${achievement.description}
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    saveProgress() {
        try {
            localStorage.setItem('gameboy_achievements', JSON.stringify({
                achievements: this.achievements,
                stats: this.stats
            }));
        } catch (error) {
            console.warn('Could not save achievement progress');
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('gameboy_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                this.achievements = data.achievements || this.achievements;
                this.stats = data.stats || this.stats;
            }
        } catch (error) {
            console.warn('Could not load achievement progress');
        }
    }

    getProgress() {
        return {
            achievements: this.achievements,
            stats: this.stats,
            completion: Math.round((this.achievements.filter(a => a.unlocked).length / this.achievements.length) * 100)
        };
    }
}

// ===== AUTO INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all elements are ready
    setTimeout(() => {
        if (document.getElementById('gameDisplay')) {
            window.gameboyEngine = new GameboyEngine();
            window.achievementSystem = new AchievementSystem();
            
            // Connect gameboy stats to achievement system
            const originalUpdateStat = window.achievementSystem.updateStat.bind(window.achievementSystem);
            
            // Override gameboy stat updates to trigger achievements
            if (window.gameboyEngine) {
                const originalHandleInput = window.gameboyEngine.handleInput.bind(window.gameboyEngine);
                window.gameboyEngine.handleInput = function(input) {
                    originalHandleInput(input);
                    window.achievementSystem.updateStat('interactions', 1);
                };
            }
        }
    }, 500);
});

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameboyEngine, AchievementSystem };
}
