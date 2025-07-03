// ===== WORKING TETRIS GAME =====

class TetrisGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isActive = false;
        
        // Game settings
        this.COLS = 10;
        this.ROWS = 20;
        this.BLOCK_SIZE = 8;
        
        // Game state
        this.board = [];
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.playing = false;
        
        // Current piece
        this.piece = {
            x: 0,
            y: 0,
            shape: [],
            color: '#00FFFF'
        };
        
        // Timing
        this.dropCounter = 0;
        this.dropInterval = 1000; // milliseconds
        this.lastTime = 0;
        
        // Tetris pieces
        this.shapes = [
            // I piece
            [
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0],
                [0,0,0,0]
            ],
            // O piece  
            [
                [1,1],
                [1,1]
            ],
            // T piece
            [
                [0,1,0],
                [1,1,1],
                [0,0,0]
            ],
            // S piece
            [
                [0,1,1],
                [1,1,0],
                [0,0,0]
            ],
            // Z piece
            [
                [1,1,0],
                [0,1,1],
                [0,0,0]
            ],
            // J piece
            [
                [1,0,0],
                [1,1,1],
                [0,0,0]
            ],
            // L piece
            [
                [0,0,1],
                [1,1,1],
                [0,0,0]
            ]
        ];
        
        this.colors = [
            '#00FFFF', // I - Cyan
            '#FFFF00', // O - Yellow
            '#AA00FF', // T - Purple
            '#00FF00', // S - Green
            '#FF0000', // Z - Red
            '#0000FF', // J - Blue
            '#FF7F00'  // L - Orange
        ];
        
        this.init();
    }

    init() {
        console.log('🎮 Initializing Tetris Game...');
        
        if (!this.setupCanvas()) {
            console.error('❌ Failed to setup canvas');
            return;
        }
        
        this.setupControls();
        this.resetBoard();
        this.newPiece();
        this.gameLoop();
        
        console.log('✅ Tetris Game initialized successfully!');
    }

    setupCanvas() {
        const gameDisplay = document.getElementById('gameDisplay');
        if (!gameDisplay) {
            console.error('❌ gameDisplay element not found');
            return false;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = 160;
        this.canvas.height = 120;
        this.canvas.style.cssText = `
            width: 100%;
            height: 100%;
            border-radius: 4px;
            image-rendering: pixelated;
            background: #000;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        gameDisplay.innerHTML = '';
        gameDisplay.appendChild(this.canvas);
        
        this.isActive = true;
        return true;
    }

    setupControls() {
        // Remove any existing event listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        
        // D-pad controls
        document.querySelectorAll('.d-pad-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleButtonClick);
            btn.addEventListener('click', (e) => {
                this.handleInput(btn.dataset.direction);
            });
        });

        // Action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleButtonClick);
            btn.addEventListener('click', (e) => {
                this.handleInput(btn.dataset.action);
            });
        });

        // System buttons
        document.querySelectorAll('.system-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleButtonClick);
            btn.addEventListener('click', (e) => {
                this.handleInput(btn.dataset.action);
            });
        });

        // Keyboard controls
        this.handleKeyDown = (e) => {
            const keyMap = {
                'ArrowLeft': 'left',
                'ArrowRight': 'right', 
                'ArrowDown': 'down',
                'ArrowUp': 'up',
                'Space': 'a',
                'Enter': 'start'
            };
            
            const action = keyMap[e.code];
            if (action) {
                e.preventDefault();
                this.handleInput(action);
            }
        };
        
        document.addEventListener('keydown', this.handleKeyDown);
    }

    handleInput(input) {
        if (!this.playing && !this.gameOver) {
            if (input === 'start' || input === 'a') {
                this.startGame();
                return;
            }
        }
        
        if (this.gameOver) {
            if (input === 'start' || input === 'a') {
                this.restart();
                return;
            }
        }
        
        if (input === 'start') {
            this.togglePause();
            return;
        }
        
        if (!this.playing || this.paused) return;

        switch (input) {
            case 'left':
                this.movePiece(-1, 0);
                break;
            case 'right':
                this.movePiece(1, 0);
                break;
            case 'down':
                this.movePiece(0, 1);
                break;
            case 'up':
                this.rotatePiece();
                break;
            case 'a':
                this.hardDrop();
                break;
        }
        
        this.playSound();
    }

    startGame() {
        this.playing = true;
        this.paused = false;
        this.gameOver = false;
        console.log('🎮 Game started!');
    }

    togglePause() {
        if (this.playing) {
            this.paused = !this.paused;
            console.log(this.paused ? '⏸️ Game paused' : '▶️ Game resumed');
        }
    }

    restart() {
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.paused = false;
        this.playing = false;
        this.dropInterval = 1000;
        this.resetBoard();
        this.newPiece();
        console.log('🔄 Game restarted');
    }

    resetBoard() {
        this.board = [];
        for (let r = 0; r < this.ROWS; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.COLS; c++) {
                this.board[r][c] = 0;
            }
        }
    }

    newPiece() {
        const shapeIndex = Math.floor(Math.random() * this.shapes.length);
        this.piece = {
            x: Math.floor(this.COLS / 2) - 1,
            y: 0,
            shape: this.shapes[shapeIndex],
            color: this.colors[shapeIndex]
        };
        
        // Check game over
        if (this.collision(0, 0)) {
            this.gameOver = true;
            this.playing = false;
            console.log('💀 Game Over!');
        }
    }

    movePiece(dx, dy) {
        if (!this.collision(dx, dy)) {
            this.piece.x += dx;
            this.piece.y += dy;
            return true;
        }
        return false;
    }

    rotatePiece() {
        const rotated = this.rotate(this.piece.shape);
        const originalShape = this.piece.shape;
        this.piece.shape = rotated;
        
        if (this.collision(0, 0)) {
            this.piece.shape = originalShape; // Revert if collision
        }
    }

    rotate(shape) {
        const rotated = [];
        const size = shape.length;
        
        for (let i = 0; i < size; i++) {
            rotated[i] = [];
            for (let j = 0; j < size; j++) {
                rotated[i][j] = shape[size - 1 - j][i];
            }
        }
        
        return rotated;
    }

    hardDrop() {
        while (this.movePiece(0, 1)) {
            this.score += 2;
        }
        this.lockPiece();
    }

    collision(dx, dy) {
        const newX = this.piece.x + dx;
        const newY = this.piece.y + dy;
        
        for (let r = 0; r < this.piece.shape.length; r++) {
            for (let c = 0; c < this.piece.shape[r].length; c++) {
                if (this.piece.shape[r][c]) {
                    const boardX = newX + c;
                    const boardY = newY + r;
                    
                    // Check boundaries
                    if (boardX < 0 || boardX >= this.COLS || boardY >= this.ROWS) {
                        return true;
                    }
                    
                    // Check collision with existing pieces
                    if (boardY >= 0 && this.board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    lockPiece() {
        // Place piece on board
        for (let r = 0; r < this.piece.shape.length; r++) {
            for (let c = 0; c < this.piece.shape[r].length; c++) {
                if (this.piece.shape[r][c]) {
                    const boardX = this.piece.x + c;
                    const boardY = this.piece.y + r;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.piece.color;
                    }
                }
            }
        }
        
        // Clear lines
        this.clearLines();
        
        // New piece
        this.newPiece();
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let r = this.ROWS - 1; r >= 0; r--) {
            if (this.board[r].every(cell => cell !== 0)) {
                // Remove line
                this.board.splice(r, 1);
                // Add empty line at top
                this.board.unshift(new Array(this.COLS).fill(0));
                linesCleared++;
                r++; // Check same row again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += [0, 40, 100, 300, 1200][linesCleared] * (this.level + 1);
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
            
            console.log(`🎉 Cleared ${linesCleared} lines! Score: ${this.score}`);
        }
    }

    update(deltaTime) {
        if (!this.playing || this.paused || this.gameOver) return;
        
        this.dropCounter += deltaTime;
        
        if (this.dropCounter > this.dropInterval) {
            if (!this.movePiece(0, 1)) {
                this.lockPiece();
            }
            this.dropCounter = 0;
        }
    }

    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.playing && !this.gameOver) {
            this.renderStartScreen();
        } else if (this.gameOver) {
            this.renderGameOverScreen();
        } else if (this.paused) {
            this.renderPausedScreen();
        } else {
            this.renderGame();
        }
        
        this.addScanLines();
    }

    renderStartScreen() {
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TETRIS', 80, 40);
        
        this.ctx.font = '8px monospace';
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText('Press START to play', 80, 60);
        this.ctx.fillText('← → Move  ↑ Rotate', 80, 75);
        this.ctx.fillText('↓ Drop  A Hard Drop', 80, 85);
    }

    renderGameOverScreen() {
        this.renderGame();
        
        // Overlay
        this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = '#FF0000';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', 80, 45);
        
        this.ctx.font = '8px monospace';
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillText(`Score: ${this.score}`, 80, 60);
        this.ctx.fillText(`Lines: ${this.lines}`, 80, 70);
        this.ctx.fillText('Press START to restart', 80, 85);
    }

    renderPausedScreen() {
        this.renderGame();
        
        this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', 80, 60);
    }

    renderGame() {
        const startX = 10;
        const startY = 5;
        
        // Draw board border
        this.ctx.strokeStyle = '#333';
        this.ctx.strokeRect(startX - 1, startY - 1, 
            this.COLS * this.BLOCK_SIZE + 2, 
            this.ROWS * this.BLOCK_SIZE + 2);
        
        // Draw placed pieces
        for (let r = 0; r < this.ROWS; r++) {
            for (let c = 0; c < this.COLS; c++) {
                if (this.board[r][c]) {
                    this.drawBlock(
                        startX + c * this.BLOCK_SIZE,
                        startY + r * this.BLOCK_SIZE,
                        this.board[r][c]
                    );
                }
            }
        }
        
        // Draw current piece
        if (this.piece) {
            for (let r = 0; r < this.piece.shape.length; r++) {
                for (let c = 0; c < this.piece.shape[r].length; c++) {
                    if (this.piece.shape[r][c]) {
                        this.drawBlock(
                            startX + (this.piece.x + c) * this.BLOCK_SIZE,
                            startY + (this.piece.y + r) * this.BLOCK_SIZE,
                            this.piece.color
                        );
                    }
                }
            }
        }
        
        // Draw UI
        this.renderUI();
    }

    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        // Add border
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 0.5;
        this.ctx.strokeRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }

    renderUI() {
        const uiX = 95;
        
        this.ctx.font = '6px monospace';
        this.ctx.fillStyle = '#FFF';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText('SCORE', uiX, 15);
        this.ctx.fillText(this.score.toString(), uiX, 25);
        
        this.ctx.fillText('LINES', uiX, 40);
        this.ctx.fillText(this.lines.toString(), uiX, 50);
        
        this.ctx.fillText('LEVEL', uiX, 65);
        this.ctx.fillText(this.level.toString(), uiX, 75);
    }

    addScanLines() {
        this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
        for (let y = 0; y < this.canvas.height; y += 2) {
            this.ctx.fillRect(0, y, this.canvas.width, 1);
        }
    }

    updateDisplay() {
        // Update HTML elements
        const titleEl = document.getElementById('pixelTitle');
        if (titleEl) {
            titleEl.textContent = 'TETRIS';
        }

        const descEl = document.getElementById('pixelDesc');
        if (descEl) {
            if (this.gameOver) {
                descEl.textContent = `Game Over!\nScore: ${this.score}\nLines: ${this.lines}`;
            } else if (!this.playing) {
                descEl.textContent = 'Press START to play\nUse D-pad to move\nA = Hard Drop';
            } else if (this.paused) {
                descEl.textContent = `Game Paused\nScore: ${this.score}\nPress START to resume`;
            } else {
                descEl.textContent = `Level: ${this.level}\nLines: ${this.lines}\nScore: ${this.score}`;
            }
        }

        const hpFill = document.getElementById('hpFill');
        if (hpFill) {
            const progress = Math.min(100, (this.lines % 10) * 10);
            hpFill.style.width = `${progress}%`;
            hpFill.style.background = 'linear-gradient(90deg, #00FFFF, #0080FF)';
        }

        const levelNumber = document.getElementById('levelNumber');
        if (levelNumber) {
            levelNumber.textContent = this.level;
        }

        const gameScore = document.getElementById('gameScore');
        if (gameScore) {
            gameScore.textContent = this.score;
        }
    }

    gameLoop(time = 0) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.update(deltaTime);
        this.render();
        this.updateDisplay();
        
        if (this.isActive) {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    playSound() {
        if (window.soundManager) {
            window.soundManager.play('click');
        }
    }

    // Public methods
    pause() {
        this.isActive = false;
    }

    resume() {
        this.isActive = true;
        this.gameLoop();
    }
}

// ===== SIMPLE ACHIEVEMENT SYSTEM =====
class SimpleAchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_game',
                name: 'First Game',
                description: 'Start your first Tetris game',
                unlocked: false,
                icon: '🎮'
            },
            {
                id: 'first_line',
                name: 'Line Clear',
                description: 'Clear your first line',
                unlocked: false,
                icon: '📏'
            },
            {
                id: 'high_score',
                name: 'High Score',
                description: 'Score 5000 points',
                unlocked: false,
                icon: '🏆'
            }
        ];
        
        this.loadProgress();
    }

    checkAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            this.showNotification(achievement);
            this.saveProgress();
        }
    }

    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 2rem;
                left: 2rem;
                background: linear-gradient(135deg, #00FFFF 0%, #0080FF 100%);
                color: white;
                padding: 1rem 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: slideInLeft 0.3s ease;
            ">
                <div style="font-weight: bold;">
                    ${achievement.icon} ${achievement.name}
                </div>
                <div style="font-size: 0.9em; opacity: 0.9;">
                    ${achievement.description}
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        
        if (window.soundManager) {
            window.soundManager.play('success');
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('tetris_progress', JSON.stringify(this.achievements));
        } catch (e) {
            console.warn('Could not save progress');
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('tetris_progress');
            if (saved) {
                this.achievements = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load progress');
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const gameDisplay = document.getElementById('gameDisplay');
        if (gameDisplay) {
            try {
                window.tetrisGame = new TetrisGame();
                window.achievementSystem = new SimpleAchievementSystem();
                
                // Track first game
                window.achievementSystem.checkAchievement('first_game');
                
                console.log('✅ Tetris game loaded successfully!');
            } catch (error) {
                console.error('❌ Failed to initialize Tetris:', error);
                
                // Fallback display
                gameDisplay.innerHTML = `
                    <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: white;
                        font-family: monospace;
                        font-size: 12px;
                        text-align: center;
                    ">
                        TETRIS<br>
                        Loading...
                    </div>
                `;
            }
        } else {
            console.error('❌ gameDisplay element not found');
        }
    }, 1000);
});

// Add slideInLeft animation
if (!document.getElementById('tetris-styles')) {
    const style = document.createElement('style');
    style.id = 'tetris-styles';
    style.textContent = `
        @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TetrisGame, SimpleAchievementSystem };
}
