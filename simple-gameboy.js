// ===== TETRIS GAME ENGINE =====

class TetrisGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        
        // Game board (10 wide x 20 tall)
        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.BLOCK_SIZE = 8;
        
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        
        this.gameState = {
            playing: false,
            paused: false,
            gameOver: false,
            score: 0,
            lines: 0,
            level: 1,
            dropTimer: 0,
            dropInterval: 60, // frames (1 second at 60fps)
            lockDelay: 0,
            lockDelayMax: 30
        };

        // Tetris pieces (tetrominoes)
        this.pieces = {
            I: {
                shape: [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ],
                color: '#00FFFF'
            },
            O: {
                shape: [
                    [1,1],
                    [1,1]
                ],
                color: '#FFFF00'
            },
            T: {
                shape: [
                    [0,1,0],
                    [1,1,1],
                    [0,0,0]
                ],
                color: '#AA00FF'
            },
            S: {
                shape: [
                    [0,1,1],
                    [1,1,0],
                    [0,0,0]
                ],
                color: '#00FF00'
            },
            Z: {
                shape: [
                    [1,1,0],
                    [0,1,1],
                    [0,0,0]
                ],
                color: '#FF0000'
            },
            J: {
                shape: [
                    [1,0,0],
                    [1,1,1],
                    [0,0,0]
                ],
                color: '#0000FF'
            },
            L: {
                shape: [
                    [0,0,1],
                    [1,1,1],
                    [0,0,0]
                ],
                color: '#FF7F00'
            }
        };

        this.pieceTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        this.pieceQueue = [];
        
        this.animationFrame = null;
        this.lastUpdateTime = 0;
        this.isActive = false;
        this.keys = {};
        this.keyRepeatTimer = {};
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupControls();
        this.resetGame();
        this.startGameLoop();
        console.log('🎮 Tetris Game initialized!');
    }

    setupCanvas() {
        const gameDisplay = document.getElementById('gameDisplay');
        if (!gameDisplay) return;

        this.canvas = document.createElement('canvas');
        this.canvas.width = 240;
        this.canvas.height = 160;
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
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
    }

    handleKeyDown(e) {
        const keyMap = {
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'ArrowDown': 'down',
            'ArrowUp': 'up',
            'Space': 'a',
            'Enter': 'start',
            'KeyC': 'b',
            'KeyZ': 'a'
        };

        const action = keyMap[e.code];
        if (action) {
            e.preventDefault();
            this.keys[action] = true;
            this.keyRepeatTimer[action] = 0;
            this.handleInput(action);
        }
    }

    handleKeyUp(e) {
        const keyMap = {
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'ArrowDown': 'down',
            'ArrowUp': 'up',
            'Space': 'a',
            'Enter': 'start',
            'KeyC': 'b',
            'KeyZ': 'a'
        };

        const action = keyMap[e.code];
        if (action) {
            this.keys[action] = false;
            this.keyRepeatTimer[action] = 0;
        }
    }

    handleInput(input) {
        if (this.gameState.gameOver) {
            if (input === 'start' || input === 'a') {
                this.resetGame();
            }
            return;
        }

        if (!this.gameState.playing) {
            if (input === 'start' || input === 'a') {
                this.startGame();
            }
            return;
        }

        if (input === 'start') {
            this.togglePause();
            return;
        }

        if (this.gameState.paused) return;

        switch (input) {
            case 'left':
                this.movePiece(-1, 0);
                break;
            case 'right':
                this.movePiece(1, 0);
                break;
            case 'down':
                this.softDrop();
                break;
            case 'up':
                this.rotatePiece();
                break;
            case 'a':
                this.hardDrop();
                break;
            case 'b':
                this.holdCurrentPiece();
                break;
        }
        
        this.playSound();
    }

    resetGame() {
        // Initialize empty board
        this.board = [];
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            this.board[y] = [];
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                this.board[y][x] = 0;
            }
        }

        this.gameState = {
            playing: false,
            paused: false,
            gameOver: false,
            score: 0,
            lines: 0,
            level: 1,
            dropTimer: 0,
            dropInterval: 60,
            lockDelay: 0,
            lockDelayMax: 30
        };

        this.currentPiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.pieceQueue = [];
        
        this.generatePieceQueue();
        this.spawnNextPiece();
        this.spawnNextPiece(); // Generate next piece
    }

    startGame() {
        this.gameState.playing = true;
        this.gameState.paused = false;
    }

    togglePause() {
        if (this.gameState.playing) {
            this.gameState.paused = !this.gameState.paused;
        }
    }

    generatePieceQueue() {
        // Generate a bag of all piece types (standard Tetris randomization)
        const bag = [...this.pieceTypes];
        
        // Shuffle the bag
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        
        this.pieceQueue.push(...bag);
    }

    spawnNextPiece() {
        if (this.pieceQueue.length < 7) {
            this.generatePieceQueue();
        }

        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece(this.pieceQueue.shift());
        this.canHold = true;

        if (this.currentPiece && !this.isValidPosition(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver();
        }

        this.gameState.lockDelay = 0;
    }

    createPiece(type) {
        const piece = {
            type: type,
            shape: this.copyMatrix(this.pieces[type].shape),
            color: this.pieces[type].color,
            x: Math.floor((this.BOARD_WIDTH - this.pieces[type].shape[0].length) / 2),
            y: 0
        };
        return piece;
    }

    copyMatrix(matrix) {
        return matrix.map(row => [...row]);
    }

    update() {
        if (!this.gameState.playing || this.gameState.paused || this.gameState.gameOver) {
            return;
        }

        // Handle continuous key presses
        this.handleContinuousInput();

        // Update drop timer
        this.gameState.dropTimer++;
        
        if (this.gameState.dropTimer >= this.gameState.dropInterval) {
            this.gameState.dropTimer = 0;
            
            if (this.currentPiece) {
                if (this.isValidPosition(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
                    this.currentPiece.y++;
                    this.gameState.lockDelay = 0;
                } else {
                    this.gameState.lockDelay++;
                    if (this.gameState.lockDelay >= this.gameState.lockDelayMax) {
                        this.lockPiece();
                    }
                }
            }
        }
    }

    handleContinuousInput() {
        // Handle left/right movement with repeat
        ['left', 'right', 'down'].forEach(key => {
            if (this.keys[key]) {
                this.keyRepeatTimer[key]++;
                
                // Initial delay, then repeat every few frames
                const initialDelay = 10;
                const repeatRate = 3;
                
                if (this.keyRepeatTimer[key] === 1 || 
                    (this.keyRepeatTimer[key] > initialDelay && this.keyRepeatTimer[key] % repeatRate === 0)) {
                    
                    switch (key) {
                        case 'left':
                            this.movePiece(-1, 0);
                            break;
                        case 'right':
                            this.movePiece(1, 0);
                            break;
                        case 'down':
                            this.softDrop();
                            break;
                    }
                }
            }
        });
    }

    movePiece(dx, dy) {
        if (!this.currentPiece) return false;

        if (this.isValidPosition(this.currentPiece.x + dx, this.currentPiece.y + dy, this.currentPiece.shape)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this.gameState.lockDelay = 0; // Reset lock delay on successful move
            return true;
        }
        return false;
    }

    rotatePiece() {
        if (!this.currentPiece) return;

        const rotated = this.rotateMatrix(this.currentPiece.shape);
        
        // Try basic rotation
        if (this.isValidPosition(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
            this.gameState.lockDelay = 0;
            return;
        }

        // Try wall kicks (SRS - Super Rotation System)
        const kicks = this.getWallKicks(this.currentPiece.type);
        for (let kick of kicks) {
            if (this.isValidPosition(this.currentPiece.x + kick.x, this.currentPiece.y + kick.y, rotated)) {
                this.currentPiece.x += kick.x;
                this.currentPiece.y += kick.y;
                this.currentPiece.shape = rotated;
                this.gameState.lockDelay = 0;
                return;
            }
        }
    }

    rotateMatrix(matrix) {
        const size = matrix.length;
        const rotated = [];
        
        for (let i = 0; i < size; i++) {
            rotated[i] = [];
            for (let j = 0; j < size; j++) {
                rotated[i][j] = matrix[size - 1 - j][i];
            }
        }
        
        return rotated;
    }

    getWallKicks(pieceType) {
        // Basic wall kicks
        return [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: -1, y: -1 },
            { x: 1, y: -1 }
        ];
    }

    softDrop() {
        if (this.movePiece(0, 1)) {
            this.gameState.score += 1;
        }
    }

    hardDrop() {
        if (!this.currentPiece) return;

        let dropDistance = 0;
        while (this.isValidPosition(this.currentPiece.x, this.currentPiece.y + dropDistance + 1, this.currentPiece.shape)) {
            dropDistance++;
        }

        this.currentPiece.y += dropDistance;
        this.gameState.score += dropDistance * 2;
        this.lockPiece();
    }

    holdCurrentPiece() {
        if (!this.currentPiece || !this.canHold) return;

        if (this.holdPiece === null) {
            this.holdPiece = this.currentPiece.type;
            this.spawnNextPiece();
        } else {
            const temp = this.holdPiece;
            this.holdPiece = this.currentPiece.type;
            this.currentPiece = this.createPiece(temp);
        }

        this.canHold = false;
    }

    isValidPosition(x, y, shape) {
        for (let py = 0; py < shape.length; py++) {
            for (let px = 0; px < shape[py].length; px++) {
                if (shape[py][px]) {
                    const nx = x + px;
                    const ny = y + py;

                    // Check boundaries
                    if (nx < 0 || nx >= this.BOARD_WIDTH || ny >= this.BOARD_HEIGHT) {
                        return false;
                    }

                    // Check collision with placed pieces (ignore negative y for spawn)
                    if (ny >= 0 && this.board[ny][nx]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    lockPiece() {
        if (!this.currentPiece) return;

        // Place piece on board
        for (let py = 0; py < this.currentPiece.shape.length; py++) {
            for (let px = 0; px < this.currentPiece.shape[py].length; px++) {
                if (this.currentPiece.shape[py][px]) {
                    const nx = this.currentPiece.x + px;
                    const ny = this.currentPiece.y + py;
                    
                    if (ny >= 0) {
                        this.board[ny][nx] = this.currentPiece.color;
                    }
                }
            }
        }

        // Check for line clears
        this.clearLines();
        
        // Spawn next piece
        this.spawnNextPiece();
    }

    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                // Line is full, remove it
                this.board.splice(y, 1);
                this.board.unshift(new Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }

        if (linesCleared > 0) {
            this.gameState.lines += linesCleared;
            
            // Score calculation (NES Tetris scoring)
            const lineScores = [0, 40, 100, 300, 1200];
            this.gameState.score += lineScores[linesCleared] * (this.gameState.level + 1);
            
            // Level progression
            this.gameState.level = Math.floor(this.gameState.lines / 10) + 1;
            
            // Increase drop speed
            this.gameState.dropInterval = Math.max(1, 60 - (this.gameState.level - 1) * 5);
        }
    }

    gameOver() {
        this.gameState.gameOver = true;
        this.gameState.playing = false;
    }

    render() {
        if (!this.ctx || !this.isActive) return;

        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.gameState.playing && !this.gameState.gameOver) {
            this.renderStartScreen();
        } else if (this.gameState.gameOver) {
            this.renderGameOverScreen();
        } else if (this.gameState.paused) {
            this.renderPausedScreen();
        } else {
            this.renderGame();
        }

        this.addScanLines();
    }

    renderStartScreen() {
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TETRIS', this.canvas.width / 2, 60);

        this.ctx.font = '10px monospace';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('Press START to play', this.canvas.width / 2, 90);
        this.ctx.fillText('↑ Rotate  ↓ Soft Drop', this.canvas.width / 2, 110);
        this.ctx.fillText('← → Move  A Hard Drop', this.canvas.width / 2, 125);
        this.ctx.fillText('B Hold Piece', this.canvas.width / 2, 140);
    }

    renderGameOverScreen() {
        this.renderGame(); // Show final board state
        
        // Game over overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillStyle = '#FF0000';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, 70);

        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(`Score: ${this.gameState.score}`, this.canvas.width / 2, 95);
        this.ctx.fillText(`Lines: ${this.gameState.lines}`, this.canvas.width / 2, 110);
        this.ctx.fillText(`Level: ${this.gameState.level}`, this.canvas.width / 2, 125);

        this.ctx.font = '10px monospace';
        this.ctx.fillText('Press START to restart', this.canvas.width / 2, 145);
    }

    renderPausedScreen() {
        this.renderGame(); // Show game state
        
        // Pause overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = 'bold 14px monospace';
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, 80);
    }

    renderGame() {
        const offsetX = 10;
        const offsetY = 5;

        // Draw board background
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(offsetX - 1, offsetY - 1, this.BOARD_WIDTH * this.BLOCK_SIZE + 2, this.BOARD_HEIGHT * this.BLOCK_SIZE + 2);

        // Draw placed pieces
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(offsetX + x * this.BLOCK_SIZE, offsetY + y * this.BLOCK_SIZE, this.board[y][x]);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece, offsetX, offsetY);
        }

        // Draw ghost piece (preview of where piece will land)
        if (this.currentPiece) {
            this.drawGhostPiece(this.currentPiece, offsetX, offsetY);
        }

        // Draw UI
        this.renderUI();
    }

    drawPiece(piece, offsetX, offsetY) {
        for (let py = 0; py < piece.shape.length; py++) {
            for (let px = 0; px < piece.shape[py].length; px++) {
                if (piece.shape[py][px]) {
                    const x = offsetX + (piece.x + px) * this.BLOCK_SIZE;
                    const y = offsetY + (piece.y + py) * this.BLOCK_SIZE;
                    
                    if (piece.y + py >= 0) { // Don't draw above visible area
                        this.drawBlock(x, y, piece.color);
                    }
                }
            }
        }
    }

    drawGhostPiece(piece, offsetX, offsetY) {
        let ghostY = piece.y;
        while (this.isValidPosition(piece.x, ghostY + 1, piece.shape)) {
            ghostY++;
        }

        if (ghostY !== piece.y) {
            for (let py = 0; py < piece.shape.length; py++) {
                for (let px = 0; px < piece.shape[py].length; px++) {
                    if (piece.shape[py][px]) {
                        const x = offsetX + (piece.x + px) * this.BLOCK_SIZE;
                        const y = offsetY + (ghostY + py) * this.BLOCK_SIZE;
                        
                        if (ghostY + py >= 0) {
                            this.drawGhostBlock(x, y);
                        }
                    }
                }
            }
        }
    }

    drawBlock(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x, y, this.BLOCK_SIZE - 1, 1);
        this.ctx.fillRect(x, y, 1, this.BLOCK_SIZE - 1);
        
        // Add shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(x + this.BLOCK_SIZE - 1, y, 1, this.BLOCK_SIZE);
        this.ctx.fillRect(x, y + this.BLOCK_SIZE - 1, this.BLOCK_SIZE, 1);
    }

    drawGhostBlock(x, y) {
        this.ctx.strokeStyle = '#666';
        this.ctx.strokeRect(x, y, this.BLOCK_SIZE, this.BLOCK_SIZE);
    }

    renderUI() {
        const uiX = 95;
        
        // Score
        this.ctx.font = '8px monospace';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('SCORE', uiX, 15);
        this.ctx.fillText(this.gameState.score.toString(), uiX, 25);

        // Lines
        this.ctx.fillText('LINES', uiX, 40);
        this.ctx.fillText(this.gameState.lines.toString(), uiX, 50);

        // Level
        this.ctx.fillText('LEVEL', uiX, 65);
        this.ctx.fillText(this.gameState.level.toString(), uiX, 75);

        // Next piece
        if (this.nextPiece) {
            this.ctx.fillText('NEXT', uiX, 90);
            this.drawMiniPiece(this.nextPiece, uiX, 95);
        }

        // Hold piece
        if (this.holdPiece) {
            this.ctx.fillText('HOLD', uiX, 125);
            const holdPieceObj = this.createPiece(this.holdPiece);
            this.drawMiniPiece(holdPieceObj, uiX, 130);
        }
    }

    drawMiniPiece(piece, x, y) {
        const miniBlockSize = 3;
        
        for (let py = 0; py < piece.shape.length; py++) {
            for (let px = 0; px < piece.shape[py].length; px++) {
                if (piece.shape[py][px]) {
                    this.ctx.fillStyle = piece.color;
                    this.ctx.fillRect(
                        x + px * miniBlockSize, 
                        y + py * miniBlockSize, 
                        miniBlockSize, 
                        miniBlockSize
                    );
                }
            }
        }
    }

    addScanLines() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
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
            if (this.gameState.gameOver) {
                descEl.textContent = `Game Over!\nScore: ${this.gameState.score}\nPress START to restart`;
            } else if (!this.gameState.playing) {
                descEl.textContent = 'Welcome to Tetris!\nPress START to begin\nUse D-pad and buttons';
            } else if (this.gameState.paused) {
                descEl.textContent = 'Game Paused\nPress START to resume\nScore: ' + this.gameState.score;
            } else {
                descEl.textContent = `Level: ${this.gameState.level}\nLines: ${this.gameState.lines}\nScore: ${this.gameState.score}`;
            }
        }

        const hpFill = document.getElementById('hpFill');
        if (hpFill) {
            const progress = Math.min(100, (this.gameState.lines % 10) * 10);
            hpFill.style.width = `${progress}%`;
            hpFill.style.background = 'linear-gradient(90deg, #00FFFF, #0080FF)';
        }

        const levelNumber = document.getElementById('levelNumber');
        if (levelNumber) {
            levelNumber.textContent = this.gameState.level;
        }

        const gameScore = document.getElementById('gameScore');
        if (gameScore) {
            gameScore.textContent = this.gameState.score;
        }
    }

    startGameLoop() {
        const gameLoop = (currentTime) => {
            if (currentTime - this.lastUpdateTime >= 16) { // 60 FPS
                this.update();
                this.render();
                this.updateDisplay();
                this.lastUpdateTime = currentTime;
            }
            
            if (this.isActive) {
                this.animationFrame = requestAnimationFrame(gameLoop);
            }
        };
        
        gameLoop(0);
    }

    playSound() {
        if (window.soundManager) {
            window.soundManager.play('click');
        }
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

    getGameState() {
        return { 
            ...this.gameState,
            board: this.board,
            currentPiece: this.currentPiece,
            nextPiece: this.nextPiece,
            holdPiece: this.holdPiece
        };
    }
}

// ===== ACHIEVEMENT SYSTEM =====
class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_game',
                name: 'First Drop',
                description: 'Play your first game of Tetris',
                requirement: { stat: 'gamesStarted', value: 1 },
                icon: '🎮',
                unlocked: false
            },
            {
                id: 'first_line',
                name: 'Line Clearer',
                description: 'Clear your first line',
                requirement: { stat: 'linesCleared', value: 1 },
                icon: '📏',
                unlocked: false
            },
            {
                id: 'tetris_master',
                name: 'Tetris!',
                description: 'Clear 4 lines at once',
                requirement: { stat: 'tetrises', value: 1 },
                icon: '💥',
                unlocked: false
            },
            {
                id: 'score_hunter',
                name: 'Score Hunter',
                description: 'Reach 10,000 points',
                requirement: { stat: 'highScore', value: 10000 },
                icon: '🏆',
                unlocked: false
            },
            {
                id: 'level_up',
                name: 'Speed Demon',
                description: 'Reach level 5',
                requirement: { stat: 'maxLevel', value: 5 },
                icon: '⚡',
                unlocked: false
            },
            {
                id: 'marathon',
                name: 'Marathon',
                description: 'Clear 100 lines',
                requirement: { stat: 'totalLines', value: 100 },
                icon: '🏃',
                unlocked: false
            }
        ];
        
        this.stats = {
            gamesStarted: 0,
            gamesCompleted: 0,
            linesCleared: 0,
            totalLines: 0,
            tetrises: 0,
            highScore: 0,
            maxLevel: 0,
            piecesPlaced: 0
        };
        
        this.init();
    }

    init() {
        this.loadProgress();
        console.log('🏆 Achievement system initialized');
    }

    updateStat(statName, value) {
        this.stats[statName] = Math.max(this.stats[statName] || 0, value);
        this.checkAchievements();
        this.saveProgress();
    }

    addToStat(statName, value) {
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
                background: linear-gradient(135deg, #00FFFF 0%, #0080FF 100%);
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
            localStorage.setItem('tetris_achievements', JSON.stringify({
                achievements: this.achievements,
                stats: this.stats
            }));
        } catch (error) {
            console.warn('Could not save achievement progress');
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('tetris_achievements');
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
    setTimeout(() => {
        if (document.getElementById('gameDisplay')) {
            window.tetrisGame = new TetrisGame();
            window.achievementSystem = new AchievementSystem();
            
            // Track initial game start
            window.achievementSystem.updateStat('gamesStarted', 1);
        }
    }, 500);
});

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TetrisGame, AchievementSystem };
}s
