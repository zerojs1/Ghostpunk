# GhostPunk - Paratech Terminal

A cyberpunk paranormal investigation game with a CRT terminal aesthetic. Analyze case files, denoise images, and classify supernatural phenomena.

## Project Structure

```
Ghostpunk/
├── index.html              # Entry point
├── GhostPunk design.md     # Full game design document
├── README.md               # This file
└── src/
    ├── main.js             # Application entry point
    ├── core/               # Core application systems
    │   ├── App.js          # Main application class
    │   └── GameState.js    # Game state management
    ├── ui/                 # User interface
    │   └── GhostOS.js      # Desktop OS UI system
    ├── shaders/            # Visual effects
    │   └── CRTFilter.js    # CRT monitor shader
    └── systems/            # Game systems
        ├── DenoiseSystem.js    # Image denoising mechanic
        └── CaseManager.js      # Case data management
```

## Architecture

### Object-Oriented Design

The codebase uses **ES6 classes** and **modules** for clean separation of concerns:

#### Core Systems

- **`GhostPunkApp`** (`src/core/App.js`)
  - Main application controller
  - Manages PIXI renderer, CRT filter, and game loop
  - Coordinates all subsystems
  - Handles window resize and keyboard input

- **`GameStateManager`** (`src/core/GameState.js`)
  - Finite state machine for game flow
  - States: BOOT, MENU, DESKTOP, INVESTIGATION, VERDICT, etc.
  - Event-based state change notifications

#### UI System

- **`GhostOS`** (`src/ui/GhostOS.js`)
  - Cyberpunk desktop interface
  - Tab-based case analyzer window
  - 4 tabs: Intel, Visuals, Audio, Verdict
  - Retro terminal aesthetics with CRT styling

#### Visual Effects

- **`CRTFilter`** (`src/shaders/CRTFilter.js`)
  - High-quality CRT monitor shader
  - Features:
    - Barrel distortion
    - RGB phosphor mask
    - Scanlines with interlacing
    - Screen curvature
    - Chromatic aberration
    - Vignette and bloom
    - Film grain and flicker

#### Game Systems

- **`DenoiseSystem`** (`src/systems/DenoiseSystem.js`)
  - Core mechanic: Hold SPACE to denoise images
  - CPU heat management
  - Overheating penalties
  - Thermal shutdown at critical temps

- **`CaseManager`** (`src/systems/CaseManager.js`)
  - Loads and manages case data
  - Stores evidence (intel, images, audio)
  - Case validation and scoring

## Controls

- **SPACE**: Hold to denoise images (in Investigation state)
- **Mouse**: Click tabs to switch between Intel/Visuals/Audio/Verdict
- **Click**: Interact with UI elements

## Game Mechanics (from design doc)

### Denoising System
- Hold SPACE to clear image noise
- CPU generates heat while denoising
- Heat dissipates when not denoising
- Overheat (80%) = screen flicker
- Critical (95%) = thermal shutdown & 15s penalty

### Evidence Analysis
- **Intel Tab**: Read case transcripts and notes
- **Visuals Tab**: Denoise images with multiple filters (Standard, Night Vision, Thermal, UV)
- **Audio Tab**: Analyze EVP recordings with spectrograph
- **Verdict Tab**: Submit classification decision

### Classifications
1. **CLASS I** - Residual Haunting (environmental recording)
2. **CLASS II** - Intelligent Entity (aware presence)
3. **CLASS III** - Malevolent Force (dangerous, hostile)
4. **HOAX** - Equipment malfunction or fraud

## Technologies

- **PixiJS v7.3.2**: WebGL rendering
- **ES6 Modules**: Modern JavaScript architecture
- **GLSL Shaders**: Custom CRT effects
- **Web Audio API**: Audio analysis (planned)

## Running the Game

Simply open `index.html` in a modern web browser that supports:
- ES6 modules
- WebGL 2.0
- Modern JavaScript features

No build step required - runs directly in the browser.

## Development Notes

### Adding New Cases

Cases are defined in `src/systems/CaseManager.js`. Each case has:
```javascript
{
  id: "case_001",
  title: "THE NEON NOODLE INCIDENT",
  priority: "STANDARD",
  client: "CORPORATE",
  difficulty: 2,
  payout_base: 400,
  intel: { /* transcript data */ },
  images: [ /* image layers */ ],
  audio: [ /* audio files */ ]
}
```

### Extending Game Systems

To add new systems:
1. Create a new class in `src/systems/`
2. Import and instantiate in `src/core/App.js`
3. Pass references to `GhostOS` if UI integration needed
4. Update game loop in `App.update()` if tick-based

### Customizing CRT Effect

Adjust shader parameters in `src/core/App.js`:
```javascript
this.crtFilter = new CRTFilter({
  barrelDistortion: 0.15,
  scanlineIntensity: 0.12,
  phosphorIntensity: 0.2,
  // ... more parameters
});
```

## Performance

- Target: 60 FPS
- CRT shader optimized for modern GPUs
- Minimal CPU usage when idle
- Render texture used for OS layer to reduce draw calls

## Credits

Based on the GhostPunk design document.
CRT shader inspired by classic cathode ray tube displays.
