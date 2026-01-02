import { CRTFilter } from '../shaders/CRTFilter.js';
import { GhostOS } from '../ui/GhostOS.js';
import { GameStateManager, GameState } from './GameState.js';
import { DenoiseSystem } from '../systems/DenoiseSystem.js';
import { CaseManager } from '../systems/CaseManager.js';
import { PlayerState } from '../systems/PlayerState.js';

export class GhostPunkApp {
    constructor() {
        // CRT Monitor dimensions (4:3 aspect ratio)
        this.CRT_WIDTH = 1024;
        this.CRT_HEIGHT = 768;
        
        this.gameState = new GameStateManager();
        this.denoiseSystem = new DenoiseSystem();
        this.caseManager = new CaseManager();
        this.playerState = new PlayerState();
        
        // Custom cursor reference
        this.customCursor = null;
        this.cursorLayer = null;
        
        this.init();
    }
    
    async init() {
        // Create PIXI Application
        this.app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: false, // CRT shouldn't be antialiased
            powerPreference: 'high-performance'
        });
        
        const gameContainer = document.getElementById('game-container');
        gameContainer.textContent = '';
        gameContainer.appendChild(this.app.view);
        this.app.view.style.display = 'block';
        this.app.view.style.position = 'fixed';
        this.app.view.style.left = '0';
        this.app.view.style.top = '0';
        this.app.view.style.width = '100%';
        this.app.view.style.height = '100%';
        // Hide system cursor over the game and use a custom in-game cursor
        this.app.view.style.cursor = 'none';
        gameContainer.style.cursor = 'none';
        document.body.style.cursor = 'none';

        const cursorStylesV7 = this.app.renderer?.events?.cursorStyles;
        if (cursorStylesV7) {
            Object.keys(cursorStylesV7).forEach((k) => {
                cursorStylesV7[k] = 'none';
            });
            cursorStylesV7.default = 'none';
            cursorStylesV7.pointer = 'none';
        }

        const cursorStylesV6 = this.app.renderer?.plugins?.interaction?.cursorStyles;
        if (cursorStylesV6) {
            Object.keys(cursorStylesV6).forEach((k) => {
                cursorStylesV6[k] = 'none';
            });
            cursorStylesV6.default = 'none';
            cursorStylesV6.pointer = 'none';
        }
        
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        
        // Load cases
        await this.caseManager.loadCases();
        
        // Create the GhostOS
        this.ghostOS = new GhostOS(this.app, this.CRT_WIDTH, this.CRT_HEIGHT);
        this.ghostOS.setCaseManager(this.caseManager);
        this.ghostOS.setDenoiseSystem(this.denoiseSystem);
        this.ghostOS.setPlayerState(this.playerState);
        
        // Create CRT container without pivot - we'll position it directly
        this.crtContainer = new PIXI.Container();
        this.crtContainer.addChild(this.ghostOS.container);
        
        // Create and apply CRT filter
        this.crtFilter = new CRTFilter({
            barrelDistortion: 0.02,
            vignetteIntensity: 0.35,
            vignetteRoundness: 1.1,
            scanlineIntensity: 0.12,
            scanlineCount: this.CRT_HEIGHT,
            scanlineSpeed: 0.02,
            rgbOffset: 0.0001,
            brightness: 1.5,
            contrast: 1.10,
            saturation: 1.30,
            flickerIntensity: 0.015,
            noiseIntensity: 0.04,
            cornerRadius: 0.104, // Matches 40px radius (40/384 ≈ 0.104)
            cornerSharpness: 0.018,
            phosphorIntensity: 0.15,
            bloomIntensity: 0.24,
            curvatureX: 1.0,
            curvatureY: 1.0,
            screenGlow: 0.9,
            interlaceIntensity: 0.02
        });
        
        this.crtContainer.filters = [this.crtFilter];
        this.crtContainer.filterPadding = 140;
        
        // Add CRT container (content + outline) to stage
        this.app.stage.addChild(this.crtContainer);
        this.createCrtOutline();
        
        // Create ambient glow behind the monitor
        this.createAmbientGlow();
        
        // Create custom neon cursor layer above CRT so it is not distorted by the CRT filter
        this.createCustomCursor();
        
        // Handle resize
        window.addEventListener('resize', () => this.onResize());
        this.onResize();
        
        // Setup keyboard controls
        this.setupControls();
        
        // Start render loop
        this.app.ticker.add((delta) => this.update(delta));
        
        // Initial state
        this.gameState.setState(GameState.BOOT);
        
        // Hide loading screen and start first case
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
            this.gameState.setState(GameState.INVESTIGATION);
            console.log('Game started - Investigation mode active');
        }, 2200);
    }
    
    createAmbientGlow() {
        // Glow behind the CRT monitor
        const glow = new PIXI.Graphics();
        glow.eventMode = 'none';
        glow.beginFill(0x00ffcc, 0.03);
        glow.drawEllipse(0, 0, this.CRT_WIDTH * 0.7, this.CRT_HEIGHT * 0.7);
        glow.endFill();
        
        glow.beginFill(0x00ffcc, 0.02);
        glow.drawEllipse(0, 0, this.CRT_WIDTH * 0.85, this.CRT_HEIGHT * 0.85);
        glow.endFill();
        
        this.ambientGlow = glow;
        this.app.stage.addChildAt(glow, 0);
    }
    
    createCrtOutline() {
        const outline = new PIXI.Graphics();
        outline.eventMode = 'none';
        
        // Single crisp cyan outline with soft glow
        // Outer glow layer (soft)
        outline.lineStyle(8, 0x00ffcc, 0.15, 0.5);
        outline.drawRoundedRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT, 40);
        
        // Middle glow layer
        outline.lineStyle(4, 0x00ffcc, 0.3, 0.5);
        outline.drawRoundedRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT, 40);
        
        // Inner crisp edge
        outline.lineStyle(1.5, 0x00ffcc, 0.9, 0);
        outline.drawRoundedRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT, 40);
        
        this.crtOutline = outline;
        // Add outline into the same CRT container so it shares the CRTFilter distortion
        this.crtContainer.addChild(outline);
    }
    
    createCustomCursor() {
        // Low-res arrow cursor that sits inside the CRT content so it gets distorted/bloomed
        const cursor = new PIXI.Graphics();
        cursor.eventMode = 'none';
        
        // Pixel-art style arrow (small, chunky)
        cursor.beginFill(0x00ffcc, 0.9);
        cursor.lineStyle(1, 0x00ffcc, 1);
        cursor.moveTo(0, 0);
        cursor.lineTo(0, 10);
        cursor.lineTo(3, 7);
        cursor.lineTo(6, 13);
        cursor.lineTo(8, 12);
        cursor.lineTo(5, 6);
        cursor.lineTo(9, 6);
        cursor.closePath();
        cursor.endFill();
        
        // Slight glow behind the arrow for visibility
        const glow = new PIXI.Graphics();
        glow.eventMode = 'none';
        glow.beginFill(0x00ffcc, 0.18);
        glow.drawCircle(4, 7, 7);
        glow.endFill();
        
        const container = new PIXI.Container();
        container.eventMode = 'none';
        container.addChild(glow);
        container.addChild(cursor);
        
        this.customCursor = container;
        this.customCursor.visible = false;
        
        // Add inside CRT so it shares the CRTFilter (distortion, bloom, etc.)
        this.crtContainer.addChild(this.customCursor);
        
        // Track pointer in CRT local coordinates
        this.app.stage.on('pointermove', (event) => {
            const local = this.crtContainer.toLocal(event.global);

            const inside = local.x >= 0 && local.y >= 0 && local.x <= this.CRT_WIDTH && local.y <= this.CRT_HEIGHT;
            if (!inside) {
                this.customCursor.visible = false;
                return;
            }

            const x = Math.max(0, Math.min(this.CRT_WIDTH, local.x));
            const y = Math.max(0, Math.min(this.CRT_HEIGHT, local.y));
            this.customCursor.position.set(x, y);
            this.customCursor.visible = true;
        });
        
        this.app.stage.on('pointerout', () => {
            this.customCursor.visible = false;
        });
    }
    
    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.app.renderer.resize(width, height);
        this.app.view.style.width = `${width}px`;
        this.app.view.style.height = `${height}px`;
        this.app.stage.hitArea = this.app.screen;
        
        // Calculate scale to fit CRT in window while maintaining 4:3 aspect ratio
        const scaleX = width / this.CRT_WIDTH;
        const scaleY = height / this.CRT_HEIGHT;
        const scale = Math.min(scaleX, scaleY);
        
        // Calculate centered position (rounded to whole pixels for symmetry)
        const scaledWidth = this.CRT_WIDTH * scale;
        const scaledHeight = this.CRT_HEIGHT * scale;
        const x = Math.round((width - scaledWidth) / 2);
        const y = Math.round((height - scaledHeight) / 2);
        
        // Position and scale CRT container (content + outline together)
        this.crtContainer.position.set(x, y);
        this.crtContainer.scale.set(scale);
        
        // Update ambient glow
        if (this.ambientGlow) {
            this.ambientGlow.position.set(width / 2, height / 2);
            this.ambientGlow.scale.set(scale * 1.2); // Slightly larger than monitor
        }
        
        // Update CRT filter resolution
        this.crtFilter.setResolution(this.CRT_WIDTH, this.CRT_HEIGHT);
    }
    
    setupControls() {
        // Spacebar to denoise
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.gameState.currentState === GameState.INVESTIGATION) {
                e.preventDefault();
                this.denoiseSystem.startDenoising();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.denoiseSystem.stopDenoising();
            }
        });
    }
    
    update(delta) {
        const deltaMS = delta * (1000 / 60); // Convert to milliseconds
        
        // Update CRT filter
        this.crtFilter.update(deltaMS);
        
        // Update DenoiseSystem
        this.denoiseSystem.update(deltaMS);
        
        // Update GhostOS
        this.ghostOS.update(deltaMS);
    }
}
