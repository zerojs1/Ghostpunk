import { NoiseFilter } from '../shaders/NoiseShader.js';

export const ImageFilter = {
    STANDARD: 'STANDARD',
    NIGHT_VISION: 'NIGHT_VISION',
    THERMAL: 'THERMAL',
    UV_SPECTRUM: 'UV_SPECTRUM'
};

export class ImageViewer {
    constructor(app, width, height) {
        this.app = app;
        this.width = width;
        this.height = height;
        this.container = new PIXI.Container();
        
        this.currentFilter = ImageFilter.STANDARD;
        this.currentImage = null;
        this.noiseFilter = new NoiseFilter();
        
        this.createPlaceholderImage();
    }
    
    createPlaceholderImage() {
        // Create a placeholder evidence image
        const graphics = new PIXI.Graphics();
        
        // Dark background
        graphics.beginFill(0x0a0a12);
        graphics.drawRect(0, 0, this.width, this.height);
        graphics.endFill();
        
        // Grid pattern for "crime scene"
        graphics.lineStyle(1, 0x1a2a3a, 0.3);
        const gridSize = 50;
        for (let x = 0; x <= this.width; x += gridSize) {
            graphics.moveTo(x, 0);
            graphics.lineTo(x, this.height);
        }
        for (let y = 0; y <= this.height; y += gridSize) {
            graphics.moveTo(0, y);
            graphics.lineTo(this.width, y);
        }
        
        // Add some "evidence" shapes
        // Room outline
        graphics.lineStyle(2, 0x00ffcc, 0.5);
        graphics.drawRect(50, 50, this.width - 100, this.height - 100);
        
        // "Furniture" rectangles
        graphics.beginFill(0x1a2a3a, 0.6);
        graphics.drawRect(70, 70, 100, 80); // Table
        graphics.drawRect(this.width - 200, 100, 120, 60); // Chair
        graphics.drawRect(100, this.height - 150, 80, 100); // Object
        graphics.endFill();
        
        // "Anomaly" circle (evidence point)
        graphics.beginFill(0xff00ff, 0.4);
        graphics.drawCircle(this.width / 2, this.height / 2, 40);
        graphics.endFill();
        
        // Convert to texture
        const texture = this.app.renderer.generateTexture(graphics);
        
        // Create sprite
        this.imageSprite = new PIXI.Sprite(texture);
        this.imageSprite.filters = [this.noiseFilter];
        
        this.container.addChild(this.imageSprite);
    }
    
    setNoiseLevel(level) {
        this.noiseFilter.setNoiseLevel(level);
    }
    
    setFilter(filterType) {
        this.currentFilter = filterType;
        this.applyFilterEffect();
    }
    
    applyFilterEffect() {
        // Apply color tint based on filter type
        switch (this.currentFilter) {
            case ImageFilter.NIGHT_VISION:
                this.imageSprite.tint = 0x00ff00; // Green tint
                break;
            case ImageFilter.THERMAL:
                this.imageSprite.tint = 0xff6600; // Orange/red tint
                break;
            case ImageFilter.UV_SPECTRUM:
                this.imageSprite.tint = 0x9900ff; // Purple tint
                break;
            case ImageFilter.STANDARD:
            default:
                this.imageSprite.tint = 0xffffff; // No tint
                break;
        }
    }
    
    update(deltaTime) {
        this.noiseFilter.update(deltaTime);
    }
    
    loadImage(imageData) {
        // TODO: Load actual case image from imageData
        this.currentImage = imageData;
    }
}
