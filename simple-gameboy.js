// ===== POKEMON BATTLE GAME ENGINE =====

class PokemonGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = {
            currentScreen: 'title', // title, menu, battle, pokemon, inventory, victory, defeat
            selectedMenuOption: 0,
            battleState: 'select_action', // select_action, select_move, player_turn, enemy_turn, battle_end
            selectedAction: 0,
            selectedMove: 0,
            animations: [],
            messages: [],
            currentMessage: 0,
            messageTimer: 0,
            turn: 0
        };

        this.player = {
            name: 'TRAINER',
            pokemon: [
                {
                    name: 'PIKACHU',
                    type: 'Electric',
                    level: 25,
                    hp: 85,
                    maxHp: 85,
                    attack: 75,
                    defense: 60,
                    speed: 90,
                    sprite: '⚡',
                    color: '#FFD700',
                    moves: [
                        { name: 'THUNDERBOLT', power: 60, type: 'Electric', pp: 15, maxPp: 15 },
                        { name: 'QUICK ATTACK', power: 40, type: 'Normal', pp: 20, maxPp: 20 },
                        { name: 'THUNDER WAVE', power: 0, type: 'Electric', pp: 10, maxPp: 10 },
                        { name: 'TACKLE', power: 35, type: 'Normal', pp: 25, maxPp: 25 }
                    ]
                },
                {
                    name: 'CHARIZARD',
                    type: 'Fire',
                    level: 30,
                    hp: 120,
                    maxHp: 120,
                    attack: 95,
                    defense: 80,
                    speed: 85,
                    sprite: '🔥',
                    color: '#FF6B47',
                    moves: [
                        { name: 'FLAMETHROWER', power: 70, type: 'Fire', pp: 15, maxPp: 15 },
                        { name: 'SLASH', power: 55, type: 'Normal', pp: 20, maxPp: 20 },
                        { name: 'DRAGON RAGE', power: 40, type: 'Dragon', pp: 10, maxPp: 10 },
                        { name: 'EMBER', power: 40, type: 'Fire', pp: 25, maxPp: 25 }
                    ]
                }
            ],
            currentPokemon: 0,
            items: [
                { name: 'POTION', count: 3, description: 'Heals 20 HP' },
                { name: 'SUPER POTION', count: 1, description: 'Heals 50 HP' }
            ]
        };

        this.enemy = {
            name: 'WILD',
            pokemon: {
                name: 'GYARADOS',
                type: 'Water',
                level: 28,
                hp: 110,
                maxHp: 110,
                attack: 90,
                defense: 75,
                speed: 70,
                sprite: '🐉',
                color: '#4ECDC4',
                moves: [
                    { name: 'HYDRO PUMP', power: 80, type: 'Water', pp: 10, maxPp: 10 },
                    { name: 'BITE', power: 60, type: 'Dark', pp: 20, maxPp: 20 },
                    { name: 'THRASH', power: 75, type: 'Normal', pp: 15, maxPp: 15 },
                    { name: 'TACKLE', power: 35, type: 'Normal', pp: 25, maxPp: 25 }
                ]
            }
        };

        this.typeChart = {
            'Electric': { 'Water': 2, 'Flying': 2, 'Ground': 0, 'Electric': 0.5 },
            'Fire': { 'Grass': 2, 'Ice': 2, 'Bug': 2, 'Steel': 2, 'Water': 0.5, 'Fire': 0.5, 'Rock': 0.5, 'Dragon': 0.5 },
            'Water': { 'Fire': 2, 'Ground': 2, 'Rock': 2, 'Water': 0.5, 'Grass': 0.5, 'Dragon': 0.5 },
            'Normal': {},
            'Dragon': { 'Dragon': 2 },
            'Dark': { 'Psychic': 2, 'Ghost': 2 }
        };

        this.menuOptions = ['FIGHT', 'POKEMON', 'ITEM', 'RUN'];
        this.battleActions = ['FIGHT', 'POKEMON', 'ITEM', 'RUN'];
        
        this.animationFrame = null;
        this.lastUpdateTime = 0;
        this.isActive = false;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupControls();
        this.startGameLoop();
        this.addMessage("A wild " + this.enemy.pokemon.name + " appeared!");
        console.log('🎮 Pokemon Battle Game initialized!');
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
            background: #8fbc8f;
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
            'Enter': 'a',
            'Shift': 'b',
            'KeyS': 'start',
            'KeyA': 'select'
        };

        const action = keyMap[e.code];
        if (action) {
            e.preventDefault();
            this.handleInput(action);
        }
    }

    handleInput(input) {
        if (this.gameState.messageTimer > 0) {
            if (input === 'a') {
                this.nextMessage();
            }
            return;
        }

        switch (this.gameState.currentScreen) {
            case 'title':
                this.handleTitleInput(input);
                break;
            case 'battle':
                this.handleBattleInput(input);
                break;
            case 'pokemon':
                this.handlePokemonInput(input);
                break;
            case 'victory':
            case 'defeat':
                this.handleEndInput(input);
                break;
        }
        
        this.playSound();
        this.updateDisplay();
    }

    handleTitleInput(input) {
        if (input === 'a' || input === 'start') {
            this.gameState.currentScreen = 'battle';
            this.gameState.battleState = 'select_action';
        }
    }

    handleBattleInput(input) {
        switch (this.gameState.battleState) {
            case 'select_action':
                this.handleActionSelection(input);
                break;
            case 'select_move':
                this.handleMoveSelection(input);
                break;
            case 'select_pokemon':
                this.handlePokemonSelection(input);
                break;
        }
    }

    handleActionSelection(input) {
        switch (input) {
            case 'up':
                this.gameState.selectedAction = Math.max(0, this.gameState.selectedAction - 2);
                break;
            case 'down':
                this.gameState.selectedAction = Math.min(3, this.gameState.selectedAction + 2);
                break;
            case 'left':
                if (this.gameState.selectedAction % 2 === 1) {
                    this.gameState.selectedAction--;
                }
                break;
            case 'right':
                if (this.gameState.selectedAction % 2 === 0) {
                    this.gameState.selectedAction++;
                }
                break;
            case 'a':
                this.selectAction();
                break;
            case 'b':
                // Back to action selection
                break;
        }
    }

    handleMoveSelection(input) {
        const moves = this.getPlayerPokemon().moves;
        switch (input) {
            case 'up':
                this.gameState.selectedMove = Math.max(0, this.gameState.selectedMove - 2);
                break;
            case 'down':
                this.gameState.selectedMove = Math.min(moves.length - 1, this.gameState.selectedMove + 2);
                break;
            case 'left':
                if (this.gameState.selectedMove % 2 === 1) {
                    this.gameState.selectedMove--;
                }
                break;
            case 'right':
                if (this.gameState.selectedMove % 2 === 0 && this.gameState.selectedMove + 1 < moves.length) {
                    this.gameState.selectedMove++;
                }
                break;
            case 'a':
                this.selectMove();
                break;
            case 'b':
                this.gameState.battleState = 'select_action';
                break;
        }
    }

    handlePokemonSelection(input) {
        switch (input) {
            case 'up':
                this.player.currentPokemon = Math.max(0, this.player.currentPokemon - 1);
                break;
            case 'down':
                this.player.currentPokemon = Math.min(this.player.pokemon.length - 1, this.player.currentPokemon + 1);
                break;
            case 'a':
                this.switchPokemon();
                break;
            case 'b':
                this.gameState.battleState = 'select_action';
                this.gameState.currentScreen = 'battle';
                break;
        }
    }

    handlePokemonInput(input) {
        switch (input) {
            case 'up':
                this.player.currentPokemon = Math.max(0, this.player.currentPokemon - 1);
                break;
            case 'down':
                this.player.currentPokemon = Math.min(this.player.pokemon.length - 1, this.player.currentPokemon + 1);
                break;
            case 'b':
                this.gameState.currentScreen = 'battle';
                break;
        }
    }

    handleEndInput(input) {
        if (input === 'a' || input === 'start') {
            this.resetGame();
        }
    }

    selectAction() {
        const action = this.battleActions[this.gameState.selectedAction];
        
        switch (action) {
            case 'FIGHT':
                this.gameState.battleState = 'select_move';
                this.gameState.selectedMove = 0;
                break;
            case 'POKEMON':
                this.gameState.currentScreen = 'pokemon';
                this.gameState.battleState = 'select_pokemon';
                break;
            case 'ITEM':
                this.addMessage("No items to use!");
                break;
            case 'RUN':
                this.addMessage("Can't escape!");
                break;
        }
    }

    selectMove() {
        const playerPokemon = this.getPlayerPokemon();
        const move = playerPokemon.moves[this.gameState.selectedMove];
        
        if (move.pp <= 0) {
            this.addMessage("No PP left for " + move.name + "!");
            return;
        }

        this.executePlayerTurn(move);
    }

    switchPokemon() {
        const newPokemon = this.player.pokemon[this.player.currentPokemon];
        if (newPokemon.hp <= 0) {
            this.addMessage(newPokemon.name + " is unable to battle!");
            return;
        }

        this.addMessage("Come back!");
        this.addMessage("Go, " + newPokemon.name + "!");
        this.gameState.battleState = 'select_action';
        this.gameState.currentScreen = 'battle';
        this.executeEnemyTurn();
    }

    executePlayerTurn(move) {
        const playerPokemon = this.getPlayerPokemon();
        const enemyPokemon = this.enemy.pokemon;
        
        move.pp--;
        this.addMessage(playerPokemon.name + " used " + move.name + "!");
        
        if (move.power > 0) {
            const damage = this.calculateDamage(playerPokemon, enemyPokemon, move);
            enemyPokemon.hp = Math.max(0, enemyPokemon.hp - damage);
            
            if (damage > 0) {
                this.addMessage("It dealt " + damage + " damage!");
                this.createDamageAnimation(enemyPokemon, damage);
            }
        }

        if (enemyPokemon.hp <= 0) {
            this.addMessage(enemyPokemon.name + " fainted!");
            this.gameState.currentScreen = 'victory';
            return;
        }

        this.executeEnemyTurn();
    }

    executeEnemyTurn() {
        const enemyPokemon = this.enemy.pokemon;
        const playerPokemon = this.getPlayerPokemon();
        
        // Simple AI: pick a random move with PP
        const availableMoves = enemyPokemon.moves.filter(move => move.pp > 0);
        if (availableMoves.length === 0) {
            this.addMessage(enemyPokemon.name + " is out of moves!");
            return;
        }

        const move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        move.pp--;
        
        this.addMessage(enemyPokemon.name + " used " + move.name + "!");
        
        if (move.power > 0) {
            const damage = this.calculateDamage(enemyPokemon, playerPokemon, move);
            playerPokemon.hp = Math.max(0, playerPokemon.hp - damage);
            
            if (damage > 0) {
                this.addMessage("It dealt " + damage + " damage!");
                this.createDamageAnimation(playerPokemon, damage);
            }
        }

        if (playerPokemon.hp <= 0) {
            this.addMessage(playerPokemon.name + " fainted!");
            
            // Check if player has any Pokemon left
            const alivePokemon = this.player.pokemon.filter(p => p.hp > 0);
            if (alivePokemon.length === 0) {
                this.gameState.currentScreen = 'defeat';
            } else {
                this.addMessage("Choose next Pokemon!");
                this.gameState.currentScreen = 'pokemon';
                this.gameState.battleState = 'select_pokemon';
            }
            return;
        }

        this.gameState.battleState = 'select_action';
    }

    calculateDamage(attacker, defender, move) {
        let damage = Math.floor(
            ((2 * attacker.level + 10) / 250) * 
            (attacker.attack / defender.defense) * 
            move.power + 2
        );

        // Type effectiveness
        const effectiveness = this.getTypeEffectiveness(move.type, defender.type);
        damage = Math.floor(damage * effectiveness);

        // Random factor (85-100%)
        damage = Math.floor(damage * (0.85 + Math.random() * 0.15));

        return Math.max(1, damage);
    }

    getTypeEffectiveness(attackType, defenseType) {
        if (this.typeChart[attackType] && this.typeChart[attackType][defenseType]) {
            return this.typeChart[attackType][defenseType];
        }
        return 1;
    }

    createDamageAnimation(pokemon, damage) {
        this.gameState.animations.push({
            type: 'damage',
            target: pokemon,
            damage: damage,
            timer: 30
        });
    }

    addMessage(text) {
        this.gameState.messages.push(text);
        if (this.gameState.messageTimer === 0) {
            this.gameState.messageTimer = 120; // 2 seconds at 60fps
        }
    }

    nextMessage() {
        this.gameState.currentMessage++;
        if (this.gameState.currentMessage >= this.gameState.messages.length) {
            this.gameState.messages = [];
            this.gameState.currentMessage = 0;
            this.gameState.messageTimer = 0;
        } else {
            this.gameState.messageTimer = 120;
        }
    }

    getPlayerPokemon() {
        return this.player.pokemon[this.player.currentPokemon];
    }

    updateDisplay() {
        const playerPokemon = this.getPlayerPokemon();
        
        // Update HTML elements
        const titleEl = document.getElementById('pixelTitle');
        if (titleEl) {
            titleEl.textContent = playerPokemon.name;
        }

        const descEl = document.getElementById('pixelDesc');
        if (descEl) {
            if (this.gameState.currentScreen === 'battle') {
                descEl.textContent = `Battle Mode\nHP: ${playerPokemon.hp}/${playerPokemon.maxHp}\nWhat will you do?`;
            } else {
                descEl.textContent = `${playerPokemon.sprite} ${playerPokemon.type} Type\nLevel ${playerPokemon.level}\nHP: ${playerPokemon.hp}/${playerPokemon.maxHp}`;
            }
        }

        const hpFill = document.getElementById('hpFill');
        if (hpFill) {
            const hpPercent = (playerPokemon.hp / playerPokemon.maxHp) * 100;
            hpFill.style.width = `${hpPercent}%`;
            hpFill.style.background = hpPercent > 50 ? 'linear-gradient(90deg, #4ade80, #22c55e)' : 'linear-gradient(90deg, #f87171, #ef4444)';
        }

        const levelNumber = document.getElementById('levelNumber');
        if (levelNumber) {
            levelNumber.textContent = playerPokemon.level;
        }

        const gameScore = document.getElementById('gameScore');
        if (gameScore) {
            gameScore.textContent = Math.floor((playerPokemon.maxHp - playerPokemon.hp) + (this.enemy.pokemon.maxHp - this.enemy.pokemon.hp));
        }
    }

    render() {
        if (!this.ctx || !this.isActive) return;

        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.gameState.currentScreen) {
            case 'title':
                this.renderTitleScreen();
                break;
            case 'battle':
                this.renderBattleScreen();
                break;
            case 'pokemon':
                this.renderPokemonScreen();
                break;
            case 'victory':
                this.renderVictoryScreen();
                break;
            case 'defeat':
                this.renderDefeatScreen();
                break;
        }

        this.renderAnimations();
        this.renderMessages();
        this.addScanLines();
    }

    renderTitleScreen() {
        // Background
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.font = 'bold 20px monospace';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('POKEMON', this.canvas.width / 2, 60);
        this.ctx.fillText('BATTLE', this.canvas.width / 2, 85);

        // Subtitle
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('Press A to start!', this.canvas.width / 2, 120);
    }

    renderBattleScreen() {
        // Battlefield background
        this.ctx.fillStyle = '#90EE90';
        this.ctx.fillRect(0, 0, this.canvas.width, 100);
        this.ctx.fillStyle = '#8FBC8F';
        this.ctx.fillRect(0, 100, this.canvas.width, 60);

        // Enemy Pokemon
        const enemyPokemon = this.enemy.pokemon;
        this.ctx.font = '24px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = enemyPokemon.color;
        this.ctx.fillText(enemyPokemon.sprite, 180, 50);

        // Enemy Pokemon info
        this.ctx.font = 'bold 12px monospace';
        this.ctx.fillStyle = '#2F4F2F';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(enemyPokemon.name, 10, 20);
        this.ctx.fillText(`Lv.${enemyPokemon.level}`, 10, 35);

        // Enemy HP bar
        this.drawHPBar(10, 40, 80, 6, enemyPokemon.hp, enemyPokemon.maxHp);

        // Player Pokemon
        const playerPokemon = this.getPlayerPokemon();
        this.ctx.font = '20px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = playerPokemon.color;
        this.ctx.fillText(playerPokemon.sprite, 60, 120);

        // Player Pokemon info
        this.ctx.font = 'bold 12px monospace';
        this.ctx.fillStyle = '#2F4F2F';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(playerPokemon.name, 230, 120);
        this.ctx.fillText(`Lv.${playerPokemon.level}`, 230, 135);

        // Player HP bar
        this.drawHPBar(150, 140, 80, 6, playerPokemon.hp, playerPokemon.maxHp);

        // Battle menu
        if (this.gameState.battleState === 'select_action') {
            this.renderBattleMenu();
        } else if (this.gameState.battleState === 'select_move') {
            this.renderMoveMenu();
        }
    }

    renderBattleMenu() {
        // Menu background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(120, 80, 120, 80);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(120, 80, 120, 80);

        // Menu options
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        
        for (let i = 0; i < this.battleActions.length; i++) {
            const x = 130 + (i % 2) * 50;
            const y = 100 + Math.floor(i / 2) * 20;
            
            if (i === this.gameState.selectedAction) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.fillText('▶', x - 15, y);
            }
            
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(this.battleActions[i], x, y);
        }
    }

    renderMoveMenu() {
        const playerPokemon = this.getPlayerPokemon();
        
        // Menu background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 80, 220, 80);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(10, 80, 220, 80);

        // Moves
        this.ctx.font = '10px monospace';
        this.ctx.textAlign = 'left';
        
        for (let i = 0; i < playerPokemon.moves.length; i++) {
            const move = playerPokemon.moves[i];
            const x = 20 + (i % 2) * 100;
            const y = 100 + Math.floor(i / 2) * 25;
            
            if (i === this.gameState.selectedMove) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.fillText('▶', x - 10, y);
            }
            
            // Move name
            this.ctx.fillStyle = move.pp > 0 ? 'white' : '#888';
            this.ctx.fillText(move.name, x, y);
            
            // PP
            this.ctx.fillText(`${move.pp}/${move.maxPp}`, x, y + 12);
        }
    }

    renderPokemonScreen() {
        // Background
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Title
        this.ctx.font = 'bold 16px monospace';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('CHOOSE POKEMON', this.canvas.width / 2, 25);

        // Pokemon list
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'left';
        
        for (let i = 0; i < this.player.pokemon.length; i++) {
            const pokemon = this.player.pokemon[i];
            const y = 50 + i * 30;
            
            if (i === this.player.currentPokemon) {
                this.ctx.fillStyle = '#FFD700';
                this.ctx.fillText('▶', 20, y);
            }
            
            // Pokemon info
            this.ctx.fillStyle = pokemon.hp > 0 ? 'white' : '#888';
            this.ctx.fillText(`${pokemon.sprite} ${pokemon.name}`, 35, y);
            this.ctx.fillText(`Lv.${pokemon.level}`, 35, y + 12);
            
            // HP bar
            if (pokemon.hp > 0) {
                this.drawHPBar(120, y - 8, 80, 6, pokemon.hp, pokemon.maxHp);
            } else {
                this.ctx.fillStyle = '#FF4444';
                this.ctx.fillText('FAINTED', 120, y);
            }
        }
    }

    renderVictoryScreen() {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = 'bold 20px monospace';
        this.ctx.fillStyle = '#4169E1';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.canvas.width / 2, 80);

        this.ctx.font = '12px monospace';
        this.ctx.fillText('You won the battle!', this.canvas.width / 2, 110);
        this.ctx.fillText('Press A to continue', this.canvas.width / 2, 130);
    }

    renderDefeatScreen() {
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = 'bold 20px monospace';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('DEFEAT', this.canvas.width / 2, 80);

        this.ctx.font = '12px monospace';
        this.ctx.fillText('You lost the battle!', this.canvas.width / 2, 110);
        this.ctx.fillText('Press A to try again', this.canvas.width / 2, 130);
    }

    drawHPBar(x, y, width, height, currentHP, maxHP) {
        // Background
        this.ctx.fillStyle = '#2F4F2F';
        this.ctx.fillRect(x, y, width, height);
        
        // HP fill
        const hpPercent = currentHP / maxHP;
        let color = '#4ade80';
        if (hpPercent < 0.5) color = '#fbbf24';
        if (hpPercent < 0.25) color = '#f87171';
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width * hpPercent, height);
        
        // Border
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(x, y, width, height);
    }

    renderAnimations() {
        this.gameState.animations = this.gameState.animations.filter(anim => {
            anim.timer--;
            
            if (anim.type === 'damage') {
                this.ctx.font = 'bold 14px monospace';
                this.ctx.fillStyle = '#FF4444';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`-${anim.damage}`, 120, 80 - (30 - anim.timer));
            }
            
            return anim.timer > 0;
        });
    }

    renderMessages() {
        if (this.gameState.messages.length === 0) return;

        // Message box
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 120, this.canvas.width, 40);
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(0, 120, this.canvas.width, 40);

        // Message text
        this.ctx.font = '12px monospace';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'left';
        
        const currentMsg = this.gameState.messages[this.gameState.currentMessage];
        this.ctx.fillText(currentMsg, 10, 140);

        // Continue indicator
        if (this.gameState.messageTimer < 30) {
            this.ctx.fillText('▼', this.canvas.width - 20, 150);
        }

        this.gameState.messageTimer--;
    }

    addScanLines() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let y = 0; y < this.canvas.height; y += 2) {
            this.ctx.fillRect(0, y, this.canvas.width, 1);
        }
    }

    startGameLoop() {
        const gameLoop = (currentTime) => {
            if (currentTime - this.lastUpdateTime >= 16) { // 60 FPS
                this.render();
                this.lastUpdateTime = currentTime;
            }
            
            if (this.isActive) {
                this.animationFrame = requestAnimationFrame(gameLoop);
            }
        };
        
        gameLoop(0);
    }

    resetGame() {
        // Reset Pokemon HP
        this.player.pokemon.forEach(pokemon => {
            pokemon.hp = pokemon.maxHp;
            pokemon.moves.forEach(move => {
                move.pp = move.maxPp;
            });
        });

        this.enemy.pokemon.hp = this.enemy.pokemon.maxHp;
        this.enemy.pokemon.moves.forEach(move => {
            move.pp = move.maxPp;
        });

        // Reset game state
        this.gameState = {
            currentScreen: 'title',
            selectedMenuOption: 0,
            battleState: 'select_action',
            selectedAction: 0,
            selectedMove: 0,
            animations: [],
            messages: [],
            currentMessage: 0,
            messageTimer: 0,
            turn: 0
        };

        this.player.currentPokemon = 0;
        this.addMessage("A wild " + this.enemy.pokemon.name + " appeared!");
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
        return { ...this.gameState, player: this.player, enemy: this.enemy };
    }
}

// ===== ACHIEVEMENT SYSTEM =====
class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_battle',
                name: 'First Battle',
                description: 'Start your first Pokemon battle',
                requirement: { stat: 'battlesStarted', value: 1 },
                icon: '⚔️',
                unlocked: false
            },
            {
                id: 'first_victory',
                name: 'Victory!',
                description: 'Win your first battle',
                requirement: { stat: 'victories', value: 1 },
                icon: '🏆',
                unlocked: false
            },
            {
                id: 'move_master',
                name: 'Move Master',
                description: 'Use 20 different moves',
                requirement: { stat: 'movesUsed', value: 20 },
                icon: '💫',
                unlocked: false
            },
            {
                id: 'pokemon_trainer',
                name: 'Pokemon Trainer',
                description: 'Switch Pokemon 5 times',
                requirement: { stat: 'pokemonSwitched', value: 5 },
                icon: '🔄',
                unlocked: false
            }
        ];
        
        this.stats = {
            battlesStarted: 0,
            victories: 0,
            defeats: 0,
            movesUsed: 0,
            pokemonSwitched: 0,
            damageDealt: 0,
            damageTaken: 0
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
            localStorage.setItem('pokemon_achievements', JSON.stringify({
                achievements: this.achievements,
                stats: this.stats
            }));
        } catch (error) {
            console.warn('Could not save achievement progress');
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('pokemon_achievements');
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
            window.pokemonGame = new PokemonGame();
            window.achievementSystem = new AchievementSystem();
            
            // Track achievements
            window.achievementSystem.updateStat('battlesStarted', 1);
        }
    }, 500);
});

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PokemonGame, AchievementSystem };
}
