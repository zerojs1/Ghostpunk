import { ImageViewer, ImageFilter } from '../systems/ImageViewer.js';
import { VerdictManager, Classification } from '../systems/VerdictManager.js';

export class GhostOS {
    constructor(app, width, height) {
        this.app = app;
        this.width = width;
        this.height = height;
        this.container = new PIXI.Container();
        this.container.eventMode = 'static';
        this.container.hitArea = new PIXI.Rectangle(0, 0, this.width, this.height);
        
        // Colors - Cyberpunk Neon Palette
        this.colors = {
            background: 0x050810,
            backgroundAlt: 0x0a0f18,
            primary: 0x00ffcc,      // Cyan
            secondary: 0xff00ff,    // Magenta
            accent: 0xffcc00,       // Amber/Yellow
            danger: 0xff3366,       // Red
            text: 0xffffff,
            textDim: 0x8899aa,
            border: 0x1a2a3a,
            borderBright: 0x00ffcc,
            windowBg: 0x0a1015,
            windowHeader: 0x0f1820,
            tabActive: 0x00ffcc,
            tabInactive: 0x1a2a3a
        };
        
        // Animation state
        this.time = 0;
        this.glitchTimer = 0;
        this.cursorBlink = 0;
        this.activeTab = 0;
        this.systemStatus = 'ONLINE';
        
        // System references
        this.caseManager = null;
        this.denoiseSystem = null;
        this.playerState = null;
        this.verdictManager = new VerdictManager();
        this.imageViewer = null;
        this.currentFilter = ImageFilter.STANDARD;
        
        // UI element references
        this.cpuGaugeFill = null;
        this.cpuGaugeText = null;
        this.statusBarText = null;
        this.noiseText = null;
        
        this.init();
    }
    
    init() {
        this.createBackground();
        this.createDesktop();
        this.createTaskbar();
        this.createMainWindow();
        // Removed bottom status indicators / NET light for a cleaner look
        this.createScanlineOverlay();
    }
    
    setCaseManager(caseManager) {
        this.caseManager = caseManager;
        // Initialize verdict manager with current case
        if (caseManager.getCurrentCase()) {
            this.verdictManager.setCase(caseManager.getCurrentCase());
        }
        this.refreshCaseUI();
    }
    
    setDenoiseSystem(denoiseSystem) {
        this.denoiseSystem = denoiseSystem;
    }
    
    setPlayerState(playerState) {
        this.playerState = playerState;
        if (this.statusBarText) {
            this.statusBarText.text = playerState.getStatusText();
        }
    }
    
    refreshCaseUI() {
        if (!this.caseManager) return;
        const c = this.caseManager.getCurrentCase();
        if (!c) return;
        
        // Intel header + body
        if (this.intelCaseIdText) {
            this.intelCaseIdText.text = `CASE ${c.id} // DIFFICULTY: ${c.difficulty}`;
        }
        if (this.intelCaseTitleText) {
            this.intelCaseTitleText.text = c.title || 'UNTITLED CASE';
        }
        if (this.intelBodyText) {
            this.intelBodyText.text = (c.intel && c.intel.content) ? c.intel.content : '—';
        }
        
        // Visuals
        if (this.imageViewer) {
            this.imageViewer.setFilter(ImageFilter.STANDARD);
            this.currentFilter = ImageFilter.STANDARD;
            const img = (c.images && c.images.length) ? c.images[0] : null;
            this.imageViewer.loadImage(img);
        }
    }
    
    // ---- Background ----
    createBackground() {
        // Main background
        const bg = new PIXI.Graphics();
        bg.eventMode = 'none';
        bg.beginFill(this.colors.background);
        bg.drawRect(0, 0, this.width, this.height);
        bg.endFill();
        
        // Grid pattern
        bg.lineStyle(1, this.colors.border, 0.1);
        const gridSize = 32;
        for (let x = 0; x <= this.width; x += gridSize) {
            bg.moveTo(x, 0);
            bg.lineTo(x, this.height);
        }
        for (let y = 0; y <= this.height; y += gridSize) {
            bg.moveTo(0, y);
            bg.lineTo(this.width, y);
        }
        
        this.container.addChild(bg);
        this.background = bg;
    }
    
    // ---- Desktop ----
    createDesktop() {
        const desktop = new PIXI.Container();
        
        // Desktop icons (left side)
        const icons = [
            { name: 'CASES', icon: '\ud83d\udcc1' },
            { name: 'MAIL', icon: '\ud83d\udce7' },
            { name: 'UPGRADES', icon: '\u2699\ufe0f' },
            { name: 'ARCHIVES', icon: '\ud83d\uddc2\ufe0f' }
        ];
        
        // Slightly larger icons so the desktop feels more substantial
        const iconHeight = 100;
        const desktopPadding = 35; // Match taskbar padding for corner clearance
        
        // Center icons vertically on the left
        desktop.position.set(desktopPadding, (this.height - (icons.length * iconHeight)) / 2);
        
        icons.forEach((iconData, i) => {
            const iconContainer = new PIXI.Container();
            iconContainer.position.set(0, i * iconHeight);
            iconContainer.eventMode = 'static';
            iconContainer.cursor = 'pointer';
            iconContainer.hitArea = new PIXI.Rectangle(0, 0, 80, 100);
            iconContainer.on('pointerdown', () => this.onDesktopIcon(iconData.name));
            
            // Icon background
            const iconBg = new PIXI.Graphics();
            iconBg.beginFill(this.colors.windowBg, 0.6);
            iconBg.lineStyle(1, this.colors.border, 0.5);
            iconBg.drawRoundedRect(0, 0, 76, 76, 5);
            iconBg.endFill();
            iconContainer.addChild(iconBg);
            
            // Icon text (emoji placeholder)
            const iconText = new PIXI.Text(iconData.icon, {
                fontFamily: 'Arial',
                fontSize: 32,
                fill: 0xffffff
            });
            iconText.anchor.set(0.5);
            iconText.position.set(38, 34);
            iconContainer.addChild(iconText);
            
            // Label
            const label = new PIXI.Text(iconData.name, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 16,
                fill: this.colors.textDim,
                align: 'center'
            });
            label.anchor.set(0.5, 0);
            label.position.set(38, 82);
            iconContainer.addChild(label);
            
            desktop.addChild(iconContainer);
        });
        
        this.container.addChild(desktop);
        this.desktop = desktop;
    }

    onDesktopIcon(name) {
        if (name === 'CASES') {
            this.switchTab(0);
            return;
        }
        if (name === 'MAIL') {
            this.switchTab(0);
            return;
        }
        if (name === 'UPGRADES') {
            console.log('Upgrades app not implemented yet');
            return;
        }
        if (name === 'ARCHIVES') {
            console.log('Archives app not implemented yet');
        }
    }
    
    // ---- Taskbar ----
    createTaskbar() {
        const taskbar = new PIXI.Container();
        taskbar.position.set(0, 0);
        
        // Taskbar background
        const bg = new PIXI.Graphics();
        bg.eventMode = 'none';
        bg.beginFill(this.colors.windowHeader);
        bg.drawRect(0, 0, this.width, 28);
        bg.endFill();
        
        // Bottom border glow
        bg.lineStyle(1, this.colors.primary, 0.6);
        bg.moveTo(0, 28);
        bg.lineTo(this.width, 28);
        
        taskbar.addChild(bg);
        
        // System logo
        const logo = new PIXI.Text('◈ GHOST//OS v2.1.7', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.primary,
            letterSpacing: 1
        });
        logo.position.set(35, 5); // Pushed in to clear rounded corners
        taskbar.addChild(logo);
        
        // Time display
        this.timeText = new PIXI.Text('03:42:17', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.accent,
            letterSpacing: 2
        });
        this.timeText.anchor.set(1, 0);
        this.timeText.position.set(this.width - 35, 5); // Pushed in to clear rounded corners
        taskbar.addChild(this.timeText);
        
        this.container.addChild(taskbar);
        this.taskbar = taskbar;
    }
    
    // ---- Main Application Window ----
    createMainWindow() {
        const windowContainer = new PIXI.Container();
        
        // Window dimensions - scaled up to fill more of the 1024x768 CRT screen,
        // but narrow enough to leave room for the desktop icon tray on the left
        const winWidth = 890;   // slightly wider than original 860, but leaves icon column
        const winHeight = 720;  // was 640
        
        // Horizontally bias the window slightly to the right so the right edge
        // sits closer to the CRT boundary while still leaving room for desktop icons
        const winX = (this.width - winWidth) / 2 + 40;
        const winY = 28 + (this.height - 28 - winHeight) / 2; // Center in space below taskbar
        
        windowContainer.position.set(winX, winY);
        
        // Window shadow
        const shadow = new PIXI.Graphics();
        shadow.eventMode = 'none';
        shadow.beginFill(0x000000, 0.5);
        shadow.drawRoundedRect(4, 4, winWidth, winHeight, 6);
        shadow.endFill();
        windowContainer.addChild(shadow);
        
        // Window background
        const winBg = new PIXI.Graphics();
        winBg.eventMode = 'none';
        winBg.beginFill(this.colors.windowBg);
        winBg.lineStyle(1, this.colors.border, 0.15); // Very subtle border to not compete with CRT outline
        winBg.drawRoundedRect(0, 0, winWidth, winHeight, 6);
        winBg.endFill();
        windowContainer.addChild(winBg);
        
        // Window header
        const header = new PIXI.Graphics();
        header.eventMode = 'none';
        header.beginFill(this.colors.windowHeader);
        header.drawRoundedRect(0, 0, winWidth, 32, 6);
        // Flatten bottom corners of header
        header.beginFill(this.colors.windowHeader);
        header.drawRect(0, 20, winWidth, 12);
        header.endFill();
        windowContainer.addChild(header);
        
        // Header title
        const title = new PIXI.Text('◈ PARATECH CASE ANALYZER', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.primary,
            letterSpacing: 2
        });
        title.position.set(12, 7);
        windowContainer.addChild(title);
        
        // Window controls (right side of header)
        const controls = new PIXI.Container();
        controls.position.set(winWidth - 80, 8);
        
        ['─', '□', '×'].forEach((symbol, i) => {
            const btn = new PIXI.Text(symbol, {
                fontFamily: 'VT323, monospace',
                fontSize: 18,
                fill: i === 2 ? this.colors.danger : this.colors.textDim
            });
            btn.position.x = i * 25;
            controls.addChild(btn);
        });
        windowContainer.addChild(controls);
        
        // Create tabs
        this.createTabs(windowContainer, winWidth);
        
        // Content area
        const contentY = 72;
        const contentHeight = winHeight - contentY - 40;
        
        // Content background
        const contentBg = new PIXI.Graphics();
        contentBg.eventMode = 'none';
        contentBg.beginFill(this.colors.background, 0.8);
        contentBg.lineStyle(1, this.colors.border, 0.5);
        contentBg.drawRect(10, contentY, winWidth - 20, contentHeight);
        contentBg.endFill();
        windowContainer.addChild(contentBg);
        
        // Tab content containers
        this.tabContents = [];
        
        // Intel Tab Content
        const intelContent = this.createIntelTab(winWidth - 20, contentHeight);
        intelContent.position.set(10, contentY);
        windowContainer.addChild(intelContent);
        this.tabContents.push(intelContent);
        
        // Visuals Tab Content (hidden initially)
        const visualsContent = this.createVisualsTab(winWidth - 20, contentHeight);
        visualsContent.position.set(10, contentY);
        visualsContent.visible = false;
        windowContainer.addChild(visualsContent);
        this.tabContents.push(visualsContent);
        
        // Audio Tab Content (hidden initially)
        const audioContent = this.createAudioTab(winWidth - 20, contentHeight);
        audioContent.position.set(10, contentY);
        audioContent.visible = false;
        windowContainer.addChild(audioContent);
        this.tabContents.push(audioContent);
        
        // Verdict Tab Content (hidden initially)
        const verdictContent = this.createVerdictTab(winWidth - 20, contentHeight);
        verdictContent.position.set(10, contentY);
        verdictContent.visible = false;
        windowContainer.addChild(verdictContent);
        this.tabContents.push(verdictContent);
        
        // Status bar at bottom of window
        this.createWindowStatusBar(windowContainer, winWidth, winHeight);
        
        this.container.addChild(windowContainer);
        this.mainWindow = windowContainer;
    }
    
    // ---- Tab System ----
    createTabs(container, winWidth) {
        const tabContainer = new PIXI.Container();
        tabContainer.position.set(10, 38);
        
        const tabs = ['◈ INTEL', '◈ VISUALS', '◈ AUDIO', '◈ VERDICT'];
        const tabWidth = 140;
        
        this.tabs = [];
        
        tabs.forEach((tabName, i) => {
            const tab = new PIXI.Container();
            tab.position.x = i * (tabWidth + 5);
            
            const isActive = i === 0;
            
            // Tab background
            const tabBg = new PIXI.Graphics();
            tabBg.beginFill(isActive ? this.colors.background : this.colors.windowHeader);
            tabBg.lineStyle(1, isActive ? this.colors.primary : this.colors.border, isActive ? 1 : 0.5);
            tabBg.drawRoundedRect(0, 0, tabWidth, 28, 4);
            
            // Hide bottom border for active tab
            if (isActive) {
                tabBg.beginFill(this.colors.background);
                tabBg.drawRect(1, 24, tabWidth - 2, 5);
            }
            
            tab.addChild(tabBg);
            
            // Tab text
            const tabText = new PIXI.Text(tabName, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 16,
                fill: isActive ? this.colors.primary : this.colors.textDim,
                letterSpacing: 1
            });
            tabText.anchor.set(0.5);
            tabText.position.set(tabWidth / 2, 14);
            tab.addChild(tabText);
            
            // Store references for later updates
            tab.bg = tabBg;
            tab.text = tabText;
            tab.index = i;
            
            // Make interactive
            tab.eventMode = 'static';
            tab.cursor = 'pointer';
            tab.hitArea = new PIXI.Rectangle(0, 0, tabWidth, 28);
            tab.on('pointerdown', () => this.switchTab(i));
            
            tabContainer.addChild(tab);
            this.tabs.push(tab);
        });
        
        container.addChild(tabContainer);
        this.tabContainer = tabContainer;
    }
    
    switchTab(index) {
        if (index === this.activeTab) return;
        
        // Update tab visuals
        this.tabs.forEach((tab, i) => {
            const isActive = i === index;
            tab.bg.clear();
            tab.bg.beginFill(isActive ? this.colors.background : this.colors.windowHeader);
            tab.bg.lineStyle(1, isActive ? this.colors.primary : this.colors.border, isActive ? 1 : 0.5);
            tab.bg.drawRoundedRect(0, 0, 140, 28, 4);
            
            if (isActive) {
                tab.bg.beginFill(this.colors.background);
                tab.bg.drawRect(1, 24, 138, 5);
            }
            
            tab.text.style.fill = isActive ? this.colors.primary : this.colors.textDim;
        });
        
        // Show/hide content
        this.tabContents.forEach((content, i) => {
            content.visible = i === index;
        });
        
        this.activeTab = index;
    }
    
    // ---- Intel Tab ----
    createIntelTab(width, height) {
        const content = new PIXI.Container();
        
        // Case header
        const caseHeader = new PIXI.Graphics();
        caseHeader.beginFill(this.colors.windowHeader, 0.8);
        caseHeader.drawRect(0, 0, width, 45);
        caseHeader.endFill();
        content.addChild(caseHeader);
        
        // Case ID
        this.intelCaseIdText = new PIXI.Text('CASE — // DIFFICULTY: —', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 14,
            fill: this.colors.accent,
            letterSpacing: 1
        });
        this.intelCaseIdText.position.set(10, 5);
        content.addChild(this.intelCaseIdText);
        
        // Case title
        this.intelCaseTitleText = new PIXI.Text('LOADING CASE...', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 22,
            fill: this.colors.primary,
            letterSpacing: 2
        });
        this.intelCaseTitleText.position.set(10, 22);
        content.addChild(this.intelCaseTitleText);
        
        // Divider
        const divider = new PIXI.Graphics();
        divider.lineStyle(1, this.colors.primary, 0.5);
        divider.moveTo(10, 50);
        divider.lineTo(width - 10, 50);
        content.addChild(divider);
        
        const textStyle = {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.text,
            lineHeight: 26,
            wordWrap: true,
            wordWrapWidth: width - 30
        };
        
        this.intelBodyText = new PIXI.Text('…', textStyle);
        this.intelBodyText.position.set(15, 60);
        content.addChild(this.intelBodyText);
        
        // Blinking cursor
        this.cursor = new PIXI.Text('█', {
            fontFamily: 'VT323, monospace',
            fontSize: 16,
            fill: this.colors.primary
        });
        this.cursor.position.set(15, height - 30);
        content.addChild(this.cursor);
        
        return content;
    }
    
    // ---- Visuals Tab ----
    createVisualsTab(width, height) {
        const content = new PIXI.Container();
        
        // Header
        const header = new PIXI.Text('◈ IMAGE ANALYSIS MODULE', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.primary,
            letterSpacing: 1
        });
        header.position.set(10, 10);
        content.addChild(header);
        
        // Create ImageViewer
        const viewerWidth = width - 180;
        const viewerHeight = height - 100;
        this.imageViewer = new ImageViewer(this.app, viewerWidth, viewerHeight);
        this.imageViewer.container.position.set(10, 40);
        content.addChild(this.imageViewer.container);
        
        // Frame around image viewer
        const imageFrame = new PIXI.Graphics();
        imageFrame.lineStyle(2, this.colors.primary, 0.8);
        imageFrame.drawRect(10, 40, viewerWidth, viewerHeight);
        content.addChild(imageFrame);
        
        // Instruction text overlay
        this.noiseText = new PIXI.Text('HOLD SPACE TO DENOISE', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 16,
            fill: this.colors.primary,
            align: 'center'
        });
        this.noiseText.anchor.set(0.5);
        this.noiseText.position.set(10 + viewerWidth / 2, 40 + viewerHeight - 30);
        this.noiseText.alpha = 0.6;
        content.addChild(this.noiseText);
        
        // Filter buttons
        const filterData = [
            { name: 'STANDARD', filter: ImageFilter.STANDARD },
            { name: 'NIGHT VIS', filter: ImageFilter.NIGHT_VISION },
            { name: 'THERMAL', filter: ImageFilter.THERMAL },
            { name: 'UV SPEC', filter: ImageFilter.UV_SPECTRUM }
        ];
        
        const filterPanel = new PIXI.Container();
        filterPanel.position.set(width - 160, 40);
        this.filterButtons = [];
        
        filterData.forEach((filterInfo, i) => {
            const btnContainer = new PIXI.Container();
            btnContainer.position.y = i * 40;
            
            const isActive = i === 0;
            const btn = new PIXI.Graphics();
            btn.beginFill(isActive ? this.colors.primary : this.colors.windowHeader);
            btn.lineStyle(1, this.colors.primary, 0.8);
            btn.drawRoundedRect(0, 0, 145, 32, 4);
            btn.endFill();
            btnContainer.addChild(btn);
            
            const btnText = new PIXI.Text(filterInfo.name, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 14,
                fill: isActive ? 0x000000 : this.colors.primary
            });
            btnText.anchor.set(0.5);
            btnText.position.set(72, 16);
            btnContainer.addChild(btnText);
            
            // Make interactive
            btnContainer.eventMode = 'static';
            btnContainer.cursor = 'pointer';
            btnContainer.on('pointerdown', () => this.switchFilter(i, filterInfo.filter));
            
            // Store references
            btnContainer.bg = btn;
            btnContainer.text = btnText;
            btnContainer.filterType = filterInfo.filter;
            btnContainer.index = i;
            
            filterPanel.addChild(btnContainer);
            this.filterButtons.push(btnContainer);
        });
        
        content.addChild(filterPanel);
        
        // CPU Heat gauge
        const gaugeY = height - 50;
        const gaugeLabel = new PIXI.Text('CPU TEMP:', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 14,
            fill: this.colors.textDim
        });
        gaugeLabel.position.set(10, gaugeY);
        content.addChild(gaugeLabel);
        
        const gaugeBg = new PIXI.Graphics();
        gaugeBg.beginFill(this.colors.border);
        gaugeBg.drawRect(90, gaugeY + 2, 200, 12);
        gaugeBg.endFill();
        content.addChild(gaugeBg);
        
        this.cpuGaugeFill = new PIXI.Graphics();
        this.cpuGaugeFill.position.set(90, gaugeY + 2);
        content.addChild(this.cpuGaugeFill);
        
        // CPU temp text
        this.cpuGaugeText = new PIXI.Text('0°C', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 14,
            fill: this.colors.primary
        });
        this.cpuGaugeText.position.set(300, gaugeY);
        content.addChild(this.cpuGaugeText);
        
        return content;
    }
    
    switchFilter(index, filterType) {
        // Update button visuals
        this.filterButtons.forEach((btn, i) => {
            const isActive = i === index;
            btn.bg.clear();
            btn.bg.beginFill(isActive ? this.colors.primary : this.colors.windowHeader);
            btn.bg.lineStyle(1, this.colors.primary, 0.8);
            btn.bg.drawRoundedRect(0, 0, 145, 32, 4);
            btn.bg.endFill();
            btn.text.style.fill = isActive ? 0x000000 : this.colors.primary;
        });
        
        // Apply filter to image viewer
        if (this.imageViewer) {
            this.imageViewer.setFilter(filterType);
        }
        this.currentFilter = filterType;
    }
    
    // ---- Audio Tab ----
    createAudioTab(width, height) {
        const content = new PIXI.Container();
        
        // Header
        const header = new PIXI.Text('◈ AUDIO SPECTROGRAPH', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.primary,
            letterSpacing: 1
        });
        header.position.set(10, 10);
        content.addChild(header);
        
        // Waveform display
        const waveformBg = new PIXI.Graphics();
        waveformBg.beginFill(0x000000, 0.9);
        waveformBg.lineStyle(1, this.colors.primary, 0.5);
        waveformBg.drawRect(10, 40, width - 20, 80);
        waveformBg.endFill();
        content.addChild(waveformBg);
        
        // Fake waveform
        const waveform = new PIXI.Graphics();
        waveform.lineStyle(2, this.colors.primary, 0.8);
        const waveY = 80;
        waveform.moveTo(15, waveY);
        for (let x = 15; x < width - 15; x += 3) {
            const y = waveY + Math.sin(x * 0.05) * 20 + Math.sin(x * 0.13) * 10 + Math.random() * 8;
            waveform.lineTo(x, y);
        }
        content.addChild(waveform);
        
        // Spectrogram display
        const spectrogramBg = new PIXI.Graphics();
        spectrogramBg.beginFill(0x000000, 0.9);
        spectrogramBg.lineStyle(1, this.colors.primary, 0.5);
        spectrogramBg.drawRect(10, 130, width - 20, 120);
        spectrogramBg.endFill();
        content.addChild(spectrogramBg);
        
        // Fake spectrogram bars
        const spectrogram = new PIXI.Graphics();
        const barWidth = 4;
        const barGap = 2;
        const specY = 245;
        for (let x = 15; x < width - 15; x += barWidth + barGap) {
            const barHeight = Math.random() * 100 + 10;
            const intensity = barHeight / 110;
            const color = this.lerpColor(0x00ffcc, 0xff00ff, intensity);
            spectrogram.beginFill(color, 0.8);
            spectrogram.drawRect(x, specY - barHeight, barWidth, barHeight);
            spectrogram.endFill();
        }
        content.addChild(spectrogram);
        
        // Playback controls
        const controlsY = 265;
        const controls = new PIXI.Container();
        controls.position.set(10, controlsY);
        
        const controlButtons = ['◄◄', '►', '►►', '■', '⟲'];
        controlButtons.forEach((symbol, i) => {
            const btn = new PIXI.Graphics();
            btn.beginFill(this.colors.windowHeader);
            btn.lineStyle(1, this.colors.primary, 0.8);
            btn.drawRoundedRect(i * 50, 0, 42, 32, 4);
            btn.endFill();
            controls.addChild(btn);
            
            const btnText = new PIXI.Text(symbol, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 18,
                fill: this.colors.primary
            });
            btnText.anchor.set(0.5);
            btnText.position.set(i * 50 + 21, 16);
            controls.addChild(btnText);
        });
        
        content.addChild(controls);
        
        // Speed selector
        const speedLabel = new PIXI.Text('SPEED:', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 14,
            fill: this.colors.textDim
        });
        speedLabel.position.set(280, controlsY + 8);
        content.addChild(speedLabel);
        
        const speeds = ['0.25x', '0.5x', '1.0x', '2.0x'];
        speeds.forEach((speed, i) => {
            const isActive = i === 2;
            const speedBtn = new PIXI.Text(speed, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 14,
                fill: isActive ? this.colors.primary : this.colors.textDim
            });
            speedBtn.position.set(340 + i * 50, controlsY + 8);
            content.addChild(speedBtn);
        });
        
        // Frequency filter slider
        const freqY = controlsY + 50;
        const freqLabel = new PIXI.Text('FREQ FILTER: 20Hz ─────●───────────── 20kHz', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 14,
            fill: this.colors.textDim
        });
        freqLabel.position.set(10, freqY);
        content.addChild(freqLabel);
        
        // Timestamp
        const timestamp = new PIXI.Text('00:12.47 / 00:47.00', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 16,
            fill: this.colors.accent
        });
        timestamp.position.set(width - 150, controlsY + 8);
        content.addChild(timestamp);
        
        return content;
    }
    
    // ---- Verdict Tab ----
    createVerdictTab(width, height) {
        const content = new PIXI.Container();
        
        // Header
        const header = new PIXI.Text('◈ CLASSIFICATION DECISION', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.primary,
            letterSpacing: 1
        });
        header.position.set(10, 10);
        content.addChild(header);
        
        // Instructions
        const instructions = new PIXI.Text('SELECT THE CLASSIFICATION THAT BEST FITS THE EVIDENCE:', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 14,
            fill: this.colors.textDim
        });
        instructions.position.set(10, 40);
        content.addChild(instructions);
        
        // Classification options
        const classifications = [
            { 
                name: 'CLASS I - RESIDUAL HAUNTING',
                description: 'Repeating phenomena, no intelligence.\nEnvironmental recording playback.',
                color: 0x00ffcc
            },
            { 
                name: 'CLASS II - INTELLIGENT ENTITY',
                description: 'Aware, interactive presence.\nPossible communication attempts.',
                color: 0xff00ff
            },
            { 
                name: 'CLASS III - MALEVOLENT FORCE',
                description: 'Hostile, dangerous manifestation.\nImmediate containment required.',
                color: 0xff3366
            },
            { 
                name: 'HOAX / EQUIPMENT MALFUNCTION',
                description: 'Natural explanation exists.\nNo paranormal activity detected.',
                color: 0xffcc00
            }
        ];
        
        classifications.forEach((classification, i) => {
            const yPos = 80 + (i * 120);
            
            // Classification card
            const card = new PIXI.Graphics();
            card.beginFill(this.colors.windowBg, 0.8);
            card.lineStyle(2, classification.color, 0.8);
            card.drawRoundedRect(10, yPos, width - 20, 100, 6);
            card.endFill();
            content.addChild(card);
            
            // Classification name
            const nameText = new PIXI.Text(classification.name, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 18,
                fill: classification.color,
                letterSpacing: 1
            });
            nameText.position.set(20, yPos + 10);
            content.addChild(nameText);
            
            // Description
            const descText = new PIXI.Text(classification.description, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 14,
                fill: this.colors.textDim,
                lineHeight: 20
            });
            descText.position.set(20, yPos + 40);
            content.addChild(descText);
            
            // Select button
            const btnWidth = 120;
            const btnX = width - btnWidth - 30;
            const btnY = yPos + 35;
            
            const selectBtn = new PIXI.Graphics();
            selectBtn.beginFill(classification.color, 0.2);
            selectBtn.lineStyle(1, classification.color, 1);
            selectBtn.drawRoundedRect(btnX, btnY, btnWidth, 32, 4);
            selectBtn.endFill();
            content.addChild(selectBtn);
            
            const btnText = new PIXI.Text('SELECT', {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 16,
                fill: classification.color
            });
            btnText.anchor.set(0.5);
            btnText.position.set(btnX + btnWidth / 2, btnY + 16);
            content.addChild(btnText);
            
            // Map UI option to Classification enum
            const classificationMap = [
                Classification.CLASS_I,
                Classification.CLASS_II,
                Classification.CLASS_III,
                Classification.HOAX
            ];
            
            // Make button interactive
            selectBtn.eventMode = 'static';
            selectBtn.cursor = 'pointer';
            selectBtn.on('pointerdown', () => {
                this.submitVerdict(classificationMap[i]);
            });
        });
        
        return content;
    }
    
    // ---- Window Status Bar ----
    createWindowStatusBar(container, winWidth, winHeight) {
        const statusBar = new PIXI.Container();
        statusBar.position.set(0, winHeight - 30);
        
        // Background
        const bg = new PIXI.Graphics();
        bg.beginFill(this.colors.windowHeader);
        bg.drawRoundedRect(0, 0, winWidth, 30, 6);
        bg.beginFill(this.colors.windowHeader);
        bg.drawRect(0, 0, winWidth, 15);
        bg.endFill();
        statusBar.addChild(bg);
        
        // Status text
        this.statusBarText = new PIXI.Text('◉ SYSTEM READY │ CASES PENDING: 7 │ CREDITS: ₵1,847 │ REP: 72%', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 14,
            fill: this.colors.textDim
        });
        this.statusBarText.position.set(15, 8);
        statusBar.addChild(this.statusBarText);
        
        container.addChild(statusBar);
    }
    
    // ---- Status Indicators ----
    createStatusIndicators() {
        const indicators = new PIXI.Container();
        indicators.position.set(this.width - 250, this.height - 40);
        
        // Network activity light
        this.netLight = new PIXI.Graphics();
        this.netLight.beginFill(this.colors.primary);
        this.netLight.drawCircle(0, 0, 4);
        this.netLight.endFill();
        this.netLight.position.set(0, 10);
        indicators.addChild(this.netLight);
        
        const netLabel = new PIXI.Text('NET', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 12,
            fill: this.colors.textDim
        });
        netLabel.position.set(10, 4);
        indicators.addChild(netLabel);
        
        this.container.addChild(indicators);
    }
    
    submitVerdict(classification) {
        console.log(`Submitting verdict: ${classification}`);
        
        // Submit to verdict manager
        const result = this.verdictManager.submitVerdict(classification);
        
        if (!result) {
            console.error('Failed to submit verdict');
            return;
        }
        
        // Update player state
        if (this.playerState) {
            this.playerState.completeCase(result.credits, result.reputation);
        }
        
        // Show results screen
        this.showResults(result);
    }
    
    showResults(result) {
        console.log('Case Result:', result);
        
        // Create simple results overlay
        const overlay = new PIXI.Container();
        
        // Dark background
        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.9);
        bg.drawRect(0, 0, this.width, this.height);
        bg.endFill();
        overlay.addChild(bg);
        
        // Results window
        const winWidth = 600;
        const winHeight = 400;
        const winX = (this.width - winWidth) / 2;
        const winY = (this.height - winHeight) / 2;
        
        const winBg = new PIXI.Graphics();
        winBg.beginFill(this.colors.windowBg);
        winBg.lineStyle(2, result.correct ? this.colors.primary : this.colors.danger, 1);
        winBg.drawRoundedRect(winX, winY, winWidth, winHeight, 8);
        winBg.endFill();
        overlay.addChild(winBg);
        
        // Title
        const title = new PIXI.Text(result.correct ? '◈ VERDICT CONFIRMED' : '◈ VERDICT REJECTED', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 24,
            fill: result.correct ? this.colors.primary : this.colors.danger,
            letterSpacing: 2
        });
        title.anchor.set(0.5, 0);
        title.position.set(this.width / 2, winY + 20);
        overlay.addChild(title);
        
        // Outcome message
        const message = new PIXI.Text(result.message, {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 16,
            fill: this.colors.text,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: winWidth - 40,
            lineHeight: 22
        });
        message.anchor.set(0.5, 0);
        message.position.set(this.width / 2, winY + 80);
        overlay.addChild(message);
        
        // Credits/Rep changes
        const statsY = winY + 200;
        const creditsText = new PIXI.Text(`CREDITS: ${result.credits > 0 ? '+' : ''}${result.credits} ₵`, {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 20,
            fill: result.credits > 0 ? this.colors.primary : this.colors.danger
        });
        creditsText.anchor.set(0.5, 0);
        creditsText.position.set(this.width / 2, statsY);
        overlay.addChild(creditsText);
        
        const repText = new PIXI.Text(`REPUTATION: ${result.reputation > 0 ? '+' : ''}${result.reputation}%`, {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 20,
            fill: result.reputation > 0 ? this.colors.primary : this.colors.danger
        });
        repText.anchor.set(0.5, 0);
        repText.position.set(this.width / 2, statsY + 30);
        overlay.addChild(repText);
        
        // Correct answer reveal
        if (!result.correct) {
            const correctText = new PIXI.Text(`CORRECT CLASSIFICATION: ${result.correctAnswer}`, {
                fontFamily: 'VT323, Share Tech Mono, monospace',
                fontSize: 14,
                fill: this.colors.textDim
            });
            correctText.anchor.set(0.5, 0);
            correctText.position.set(this.width / 2, statsY + 80);
            overlay.addChild(correctText);
        }
        
        // Continue button
        const btnWidth = 200;
        const btnHeight = 40;
        const btnX = (this.width - btnWidth) / 2;
        const btnY = winY + winHeight - 70;
        
        const continueBtn = new PIXI.Graphics();
        continueBtn.beginFill(this.colors.primary, 0.2);
        continueBtn.lineStyle(2, this.colors.primary, 1);
        continueBtn.drawRoundedRect(btnX, btnY, btnWidth, btnHeight, 4);
        continueBtn.endFill();
        overlay.addChild(continueBtn);
        
        const btnText = new PIXI.Text('CONTINUE', {
            fontFamily: 'VT323, Share Tech Mono, monospace',
            fontSize: 18,
            fill: this.colors.primary
        });
        btnText.anchor.set(0.5);
        btnText.position.set(this.width / 2, btnY + btnHeight / 2);
        overlay.addChild(btnText);
        
        // Make button interactive
        continueBtn.eventMode = 'static';
        continueBtn.cursor = 'pointer';
        continueBtn.on('pointerdown', () => {
            this.container.removeChild(overlay);
            if (this.caseManager) {
                const next = this.caseManager.advanceCase();
                if (next) {
                    // Update verdict manager to new case
                    if (this.verdictManager && this.verdictManager.setCase) {
                        this.verdictManager.setCase(next);
                    }
                    // Refresh UI with new case data
                    this.refreshCaseUI();
                    // Return to Intel tab
                    this.switchTab(0);
                }
            }
        });
        
        this.container.addChild(overlay);
    }
    
    updateCPUGauge() {
        if (!this.denoiseSystem || !this.cpuGaugeFill || !this.cpuGaugeText) return;
        
        const heatPercent = this.denoiseSystem.getHeatPercentage();
        const gaugeWidth = 200;
        const fillWidth = (heatPercent / 100) * gaugeWidth;
        
        // Determine color based on heat level
        let fillColor = this.colors.primary; // Cyan (cool)
        if (heatPercent > 80) {
            fillColor = this.colors.danger; // Red (critical)
        } else if (heatPercent > 60) {
            fillColor = this.colors.accent; // Yellow (warning)
        }
        
        // Redraw gauge fill
        this.cpuGaugeFill.clear();
        this.cpuGaugeFill.beginFill(fillColor);
        this.cpuGaugeFill.drawRect(0, 0, fillWidth, 12);
        this.cpuGaugeFill.endFill();
        
        // Update text
        this.cpuGaugeText.text = `${Math.round(heatPercent)}°C`;
        this.cpuGaugeText.style.fill = fillColor;
    }
    
    // ---- Scanline Overlay ----
    createScanlineOverlay() {
        // Additional subtle scanlines rendered on top of UI
        // (The main scanlines are in the CRT shader, this is for extra effect)
        const overlay = new PIXI.Graphics();
        overlay.eventMode = 'none';
        overlay.beginFill(0x000000, 0.03);
        
        for (let y = 0; y < this.height; y += 4) {
            overlay.drawRect(0, y, this.width, 2);
        }
        
        overlay.endFill();
        this.container.addChild(overlay);
    }
    
    // ---- Utilities ----
    lerpColor(color1, color2, t) {
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;
        
        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;
        
        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);
        
        return (r << 16) | (g << 8) | b;
    }
    
    // ---- Update ----
    update(deltaTime) {
        this.time += deltaTime;
        
        // Blink cursor
        this.cursorBlink += deltaTime;
        if (this.cursor) {
            this.cursor.visible = Math.floor(this.cursorBlink / 500) % 2 === 0;
        }
        
        // Network activity blink
        if (this.netLight) {
            const blink = Math.sin(this.time * 0.005) > 0.3;
            this.netLight.alpha = blink ? 1 : 0.3;
        }
        
        // Update time display
        if (this.timeText) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
            this.timeText.text = timeStr;
        }
        
        // Update ImageViewer (if on Visuals tab)
        if (this.imageViewer && this.activeTab === 1) {
            this.imageViewer.update(deltaTime);
            
            // Sync noise level from DenoiseSystem
            if (this.denoiseSystem) {
                const noiseLevel = this.denoiseSystem.getNoiseLevel();
                this.imageViewer.setNoiseLevel(noiseLevel);
            }
        }
        
        // Update CPU gauge
        this.updateCPUGauge();
        
        // Update status bar
        if (this.playerState && this.statusBarText) {
            this.statusBarText.text = this.playerState.getStatusText();
        }
    }
}
