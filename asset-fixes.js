// ===== ASSET FALLBACKS AND FIXES =====

class AssetManager {
    constructor() {
        this.init();
    }

    init() {
        this.createFallbackAvatar();
        this.setupAudioFallbacks();
        this.fixMissingImages();
        this.setupErrorHandling();
        console.log('🔧 Asset Manager initialized - fallbacks ready!');
    }

    createFallbackAvatar() {
        const avatarImg = document.getElementById('trainerAvatar');
        if (avatarImg) {
            // Create SVG avatar as fallback
            const svgAvatar = `
                <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="60" fill="url(#grad1)"/>
                    <circle cx="60" cy="45" r="20" fill="#ffffff" opacity="0.9"/>
                    <circle cx="50" cy="42" r="3" fill="#333"/>
                    <circle cx="70" cy="42" r="3" fill="#333"/>
                    <path d="M 45 50 Q 60 60 75 50" stroke="#333" stroke-width="2" fill="none"/>
                    <circle cx="60" cy="85" r="25" fill="#ffffff" opacity="0.9"/>
                    <text x="60" y="110" font-family="Arial, sans-serif" font-size="8" text-anchor="middle" fill="#333">JRD</text>
                </svg>
            `;
            
            // Convert SVG to data URL
            const svgBlob = new Blob([svgAvatar], { type: 'image/svg+xml' });
            const svgUrl = URL.createObjectURL(svgBlob);
            
            // Set fallback avatar
            avatarImg.onerror = () => {
                avatarImg.src = svgUrl;
                avatarImg.onerror = null; // Prevent infinite loop
            };
            
            // If the image is already broken, set the fallback immediately
            if (avatarImg.complete && avatarImg.naturalWidth === 0) {
                avatarImg.src = svgUrl;
            }
        }
    }

    setupAudioFallbacks() {
        // Create silent audio fallbacks
        const audioElements = ['clickSound', 'hoverSound', 'successSound', 'gameSound'];
        
        audioElements.forEach(id => {
            let audioEl = document.getElementById(id);
            
            if (!audioEl) {
                // Create audio element if it doesn't exist
                audioEl = document.createElement('audio');
                audioEl.id = id;
                audioEl.preload = 'auto';
                document.body.appendChild(audioEl);
            }
            
            // Add error handler
            audioEl.addEventListener('error', () => {
                console.warn(`Audio file missing for ${id}, using silent fallback`);
                // Create silent audio data URL
                const silentAudio = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ4AAAAAAAAAAAAAAAAAAA==';
                audioEl.src = silentAudio;
            });
        });
    }

    fixMissingImages() {
        // Fix all img elements with error handling
        document.querySelectorAll('img').forEach(img => {
            if (!img.onerror) {
                img.onerror = () => {
                    // Create a placeholder SVG
                    const placeholder = this.createPlaceholderImage(img.alt || 'Image');
                    img.src = placeholder;
                    img.onerror = null;
                };
            }
        });
        
        // Fix background images
        document.querySelectorAll('[data-bg]').forEach(el => {
            const bgUrl = el.getAttribute('data-bg');
            if (bgUrl) {
                const testImg = new Image();
                testImg.onload = () => {
                    el.style.backgroundImage = `url(${bgUrl})`;
                };
                testImg.onerror = () => {
                    console.warn(`Background image missing: ${bgUrl}`);
                    el.style.backgroundImage = 'none';
                };
                testImg.src = bgUrl;
            }
        });
    }

    createPlaceholderImage(text) {
        const width = 400;
        const height = 250;
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f3f4f6"/>
                <rect x="1" y="1" width="${width-2}" height="${height-2}" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-dasharray="5,5"/>
                <text x="50%" y="45%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="16">
                    🖼️ ${text}
                </text>
                <text x="50%" y="60%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
                    Image not found
                </text>
            </svg>
        `;
        
        const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
        return URL.createObjectURL(svgBlob);
    }

    setupErrorHandling() {
        // Global error handler for unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message) {
                console.warn('Asset loading error handled:', event.reason.message);
                event.preventDefault(); // Prevent console errors for missing assets
            }
        });
        
        // Console override to filter out common asset errors
        const originalError = console.error;
        console.error = (...args) => {
            const errorStr = args.join(' ');
            
            // Filter out common asset loading errors
            if (errorStr.includes('Failed to load resource') || 
                errorStr.includes('404') || 
                errorStr.includes('net::ERR_FILE_NOT_FOUND')) {
                console.warn('Asset not found (using fallback):', ...args);
                return;
            }
            
            originalError.apply(console, args);
        };
    }

    // Preload critical assets
    preloadCriticalAssets() {
        const criticalAssets = [
            'assets/imgs/favicon.ico',
            'assets/imgs/og-image.png'
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = asset;
            link.onerror = () => {
                console.warn(`Critical asset missing: ${asset}`);
            };
            document.head.appendChild(link);
        });
    }

    // Create manifest icons if missing
    createFallbackIcons() {
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const iconColor = '#667eea';
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Draw icon
            ctx.fillStyle = iconColor;
            ctx.fillRect(0, 0, size, size);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = `${size * 0.6}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🎮', size / 2, size / 2);
            
            // Convert to blob and store
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                console.log(`Fallback icon created for ${size}x${size}: ${url}`);
            });
        });
    }
}

// ===== ENHANCED SOUND MANAGER WITH FALLBACKS =====
class EnhancedSoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3;
        this.fallbackSounds = this.createFallbackSounds();
        this.init();
    }

    init() {
        this.setupSounds();
        this.setupEventListeners();
    }

    createFallbackSounds() {
        // Create Web Audio API fallback sounds
        const audioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContext) return {};

        try {
            const ctx = new audioContext();
            
            return {
                click: () => this.createBeep(ctx, 800, 0.1),
                hover: () => this.createBeep(ctx, 600, 0.05),
                success: () => this.createSuccessChord(ctx),
                error: () => this.createErrorBuzz(ctx)
            };
        } catch (error) {
            console.warn('Web Audio API not available');
            return {};
        }
    }

    createBeep(ctx, frequency, duration) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }

    createSuccessChord(ctx) {
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createBeep(ctx, freq, 0.3);
            }, index * 100);
        });
    }

    createErrorBuzz(ctx) {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(this.volume * 0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
    }

    setupSounds() {
        const soundIds = ['clickSound', 'hoverSound', 'successSound', 'gameSound'];
        
        soundIds.forEach(id => {
            const audioEl = document.getElementById(id);
            if (audioEl) {
                audioEl.volume = this.volume;
                this.sounds[id.replace('Sound', '')] = audioEl;
            }
        });
    }

    setupEventListeners() {
        // Add sound effects to interactive elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, a[href]')) {
                this.play('click');
            }
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('button, .btn, a[href]')) {
                this.play('hover');
            }
        });
    }

    play(soundName) {
        if (!this.enabled) return;

        // Try HTML audio first
        const audioEl = this.sounds[soundName];
        if (audioEl) {
            audioEl.currentTime = 0;
            audioEl.play().catch(() => {
                // Fallback to Web Audio API
                this.playFallback(soundName);
            });
        } else {
            // Use fallback sound
            this.playFallback(soundName);
        }
    }

    playFallback(soundName) {
        if (this.fallbackSounds[soundName]) {
            this.fallbackSounds[soundName]();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        console.log(`🔊 Sound ${this.enabled ? 'enabled' : 'disabled'}`);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            if (sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        });
    }
}

// ===== AUTO-INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize asset manager
    window.assetManager = new AssetManager();
    
    // Replace sound manager with enhanced version
    window.soundManager = new EnhancedSoundManager();
    
    console.log('🔧 Asset fixes and fallbacks initialized!');
});

// ===== EXPORT =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AssetManager,
        EnhancedSoundManager
    };
}
