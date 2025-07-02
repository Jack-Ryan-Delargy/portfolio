// ===== SIMPLE GAMEBOY DISPLAY =====
// Replace the complex gameboy-engine.js with this simple version

class SimpleGameboy {
    constructor() {
        this.currentPokemon = 0;
        this.pokemon = [
            { name: 'PIKACHU', type: 'Electric', level: 85, hp: 85, sprite: '⚡' },
            { name: 'CHARIZARD', type: 'Fire', level: 88, hp: 92, sprite: '🔥' },
            { name: 'BLASTOISE', type: 'Water', level: 82, hp: 88, sprite: '🌊' },
            { name: 'VENUSAUR', type: 'Grass', level: 80, hp: 90, sprite: '🌿' },
            { name: 'MEWTWO', type: 'Psychic', level: 95, hp: 98, sprite: '🧠' }
        ];
        
        this.messages = [
            "Welcome, Trainer!",
            "Ready for battle?",
            "Choose your Pokemon!",
            "Adventure awaits!",
            "Gotta code 'em all!"
        ];
        
        this.currentMessage = 0;
        this.init();
    }

    init() {
        this.updateDisplay();
        this.setupControls();
        this.startAutoRotation();
        console.log('🎮 Simple Gameboy initialized!');
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
    }

    handleInput(input) {
        switch (input) {
            case 'up':
            case 'right':
                this.nextPokemon();
                break;
            case 'down':
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
        
        // Play sound effect if available
        if (window.soundManager) {
            window.soundManager.play('click');
        }
    }

    nextPokemon() {
        this.currentPokemon = (this.currentPokemon + 1) % this.pokemon.length;
        this.updateDisplay();
    }

    previousPokemon() {
        this.currentPokemon = (this.currentPokemon - 1 + this.pokemon.length) % this.pokemon.length;
        this.updateDisplay();
    }

    selectPokemon() {
        const pokemon = this.pokemon[this.currentPokemon];
        this.showTemporaryMessage(`${pokemon.sprite} ${pokemon.name} SELECTED!`);
    }

    showInfo() {
        const pokemon = this.pokemon[this.currentPokemon];
        this.showTemporaryMessage(`Type: ${pokemon.type}\nLevel: ${pokemon.level}\nHP: ${pokemon.hp}%`);
    }

    showMessage() {
        const message = this.messages[this.currentMessage];
        this.currentMessage = (this.currentMessage + 1) % this.messages.length;
        this.showTemporaryMessage(message);
    }

    randomPokemon() {
        this.currentPokemon = Math.floor(Math.random() * this.pokemon.length);
        this.updateDisplay();
    }

    updateDisplay() {
        const pokemon = this.pokemon[this.currentPokemon];
        
        // Update title
        const titleEl = document.getElementById('pixelTitle');
        if (titleEl) {
            titleEl.textContent = pokemon.name;
        }

        // Update description
        const descEl = document.getElementById('pixelDesc');
        if (descEl) {
            descEl.textContent = `${pokemon.sprite} ${pokemon.type} Type\nLevel ${pokemon.level}\nUse D-pad to navigate`;
        }

        // Update HP bar
        const hpFill = document.getElementById('hpFill');
        if (hpFill) {
            hpFill.style.width = `${pokemon.hp}%`;
        }

        // Update level number
        const levelNumber = document.getElementById('levelNumber');
        if (levelNumber) {
            levelNumber.textContent = pokemon.level;
        }

        // Update game score
        const gameScore = document.getElementById('gameScore');
        if (gameScore) {
            gameScore.textContent = pokemon.level * 100;
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

    startAutoRotation() {
        setInterval(() => {
            this.nextPokemon();
        }, 8000); // Change every 8 seconds
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing gameboy instances
    if (window.gameboyEngine) {
        window.gameboyEngine = null;
    }
    
    // Initialize simple gameboy
    setTimeout(() => {
        if (document.getElementById('pixelTitle')) {
            window.simpleGameboy = new SimpleGameboy();
        }
    }, 500);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SimpleGameboy };
}