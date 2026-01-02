# GhostPunk: Complete Design & Technical Documentation
## Version 1.0 | Paratech Terminal Development Bible

---

---

# 1. EXECUTIVE SUMMARY

**GhostPunk** is a procedural simulation game set in a neon-soaked 1980s cyberpunk dystopia. The player assumes the role of a paratech investigator working from a cluttered apartment, reviewing paranormal cases via a specialized CRT terminal.

The entire game takes place on a single computer screen that simulates a 1980s monitor with intense visual effects (curvature, scanlines, chromatic aberration, phosphor masking). The player acts as a filter for information: determining which hauntings are real threats requiring corporate cleanup and which are hoaxes or glitches.

## Key Selling Points

- **Unique Aesthetic**: AAA-quality CRT simulation with WebGL shaders
- **Scope-Friendly**: Primarily UI work and asset management
- **High Atmosphere**: Horror through interface, not jump scares
- **Narrative Depth**: Layered story revealed through case connections
- **Replayability**: Procedural case generation with handcrafted story beats

## Target Platform

- **Primary**: Web browsers (Chrome, Firefox, Edge)
- **Technology**: HTML5, JavaScript (ES6+), PixiJS 7+, WebGL 2.0
- **Resolution**: 1024×768 internal (4:3), scales to any display

---

# 2. HIGH CONCEPT

## The Premise

You are a freelance "Paratech" working out of a tiny apartment in "Neo-Veridia." You owe money to a cyber-gang called the Chrome Fist Syndicate. You take paranormal investigation gigs to pay off your debt before they come to repossess your cybernetic implants (or your legs).

As you play, you realize that the increase in paranormal activity correlates with the city's new 5G "Neural Network" rollout. The city is killing people, and their ghosts are getting stuck in the internet.

## The Core Experience

The player stares at a CRT monitor in a dark room. The only light source is the glow of the monitor and the neon lights from outside the apartment window reflecting onto the screen. Every interaction happens through the GhostOS interface—there is no "game world" beyond this screen.

## Core Loop Summary

┌─────────────────────────────────────────────────────────────┐
│ │
│ RECEIVE CASE ──► ANALYZE EVIDENCE ──► SUBMIT VERDICT │
│ │ │ │ │
│ │ │ │ │
│ ▼ ▼ ▼ │
│ Read Intel Use Tools Classification │
│ Check Email Apply Filters Risk/Reward │
│ Note Priority Find Clues Faction Impact │
│ │ │ │ │
│ │ │ │ │
│ └──────────────────┴───────────────────┘ │
│ │ │
│ ▼ │
│ EARN CREDITS │
│ │ │
│ ┌────────────┼────────────┐ │
│ ▼ ▼ ▼ │
│ PAY RENT UPGRADE HW PAY DEBT │
│ │ │ │ │
│ └────────────┴────────────┘ │
│ │ │
│ ▼ │
│ NEXT SHIFT │
│ │
└─────────────────────────────────────────────────────────────┘

---

# 3. VISUAL STYLE & AESTHETICS

## Design Philosophy: "Cassette Futurism"

The interface should look chunky. Think bulky buttons, monospace green/amber text on black backgrounds, and loading bars. It should NOT look sleek and modern like an iPhone—it should look like a military terminal from 1986 that was retrofitted with neon cyberpunk aesthetics.

## The CRT Monitor

The game window represents a physical CRT monitor with the following mandatory effects:

| Effect | Description | Priority |
|--------|-------------|----------|
| Barrel Distortion | Screen curves outward at edges | Critical |
| Rounded Corners | Smooth screen edge like real CRT | Critical |
| Scanlines | Horizontal dark lines | Critical |
| Phosphor Mask | RGB triad subpixel pattern | High |
| Chromatic Aberration | RGB channel separation | High |
| Vignette | Darkened corners | High |
| Screen Glow | Subtle colored glow at edges | Medium |
| Flicker | Random brightness variation | Medium |
| Film Grain | Subtle noise overlay | Medium |
| Rolling Scanline | Slow-moving refresh band | Low |
| Glass Reflection | Subtle highlight on "glass" | Low |

## Color Palette
BACKGROUND COLORS:
├── Deep Navy/Black: #050810 (Primary background)
├── Background Alt: #0a0f18 (Panels, containers)
├── Window BG: #0a1015 (Application windows)
└── Window Header: #0f1820 (Title bars)

ACCENT COLORS:
├── Primary (Cyan): #00ffcc - System OK, highlights, primary actions
├── Secondary (Magenta): #ff00ff - Special elements, warnings
├── Accent (Amber): #ffcc00 - Timestamps, important data
└── Danger (Red): #ff3366 - Errors, critical warnings

TEXT COLORS:
├── Primary Text: #ffffff - Main readable text
├── Dim Text: #8899aa - Secondary information
└── Border: #1a2a3a - Inactive borders

UI STATE COLORS:
├── Tab Active: #00ffcc
├── Tab Inactive: #1a2a3a
├── Border Bright: #00ffcc (focused elements)
└── Button Hover: Brighten by 20%

## Typography
PRIMARY FONT: VT323 (Google Fonts)

Used for: All terminal text, labels, content
Fallback: 'Share Tech Mono', 'Courier New', monospace
SIZES:
├── Large Headers: 22px
├── Window Titles: 18px
├── Body Text: 16px
├── Labels: 14px
└── Small/Status: 12px

LETTER SPACING:
├── Headers: 2px
├── Labels: 1px
└── Body: 0px

## Screen Layout
┌─────────────────────────────────────────────────────────────┐
│ ◈ GHOST//OS v2.1.7 ◉NET ◉CPU 03:42:17 │ ← Taskbar (28px)
├────────┬────────────────────────────────────────────────────┤
│ [ICON] │ ┌─────────────────────────────────────────────────┐│
│ CASES │ │ ◈ PARATECH CASE ANALYZER [─][□][×] ││ ← Window Header
│ │ ├─────────────────────────────────────────────────┤│
│ [ICON] │ │ [◈ INTEL] [◈ VISUALS] [◈ AUDIO] [◈ VERDICT] ││ ← Tab Bar
│ MAIL │ ├─────────────────────────────────────────────────┤│
│ │ │ ││
│ [ICON] │ │ ││
│UPGRADES│ │ CONTENT AREA ││ ← Main Content
│ │ │ ││
│ [ICON] │ │ ││
│ARCHIVES│ │ ││
│ │ ├─────────────────────────────────────────────────┤│
│ │ │ ◉ READY │ CASES: 7 │ ₵1,847 │ REP: 72% ││ ← Status Bar
│ │ └─────────────────────────────────────────────────┘│
└────────┴────────────────────────────────────────────────────┘
↑ ↑
Desktop Icons Main Application Window
(64×64 each) (Remaining space)

---

# 4. CORE GAMEPLAY LOOP

## Phase 1: Receive Case

A new case file appears on the desktop or is delivered via the dispatch system. Cases have:

- **Priority Level**: STANDARD (white), URGENT (yellow), RED (red with glow)
- **Client Type**: Corporate, Government, Underground, Civilian
- **Base Payout**: Determined by difficulty and client
- **Time Sensitivity**: Some cases have deadlines

## Phase 2: Analyze Evidence

The player reviews three types of evidence across three tabs:

### Intel Tab (Text)
- Transcribed police reports
- Witness interviews
- Chat logs
- Email correspondence
- Sensor data readouts

### Visuals Tab (Images)
- Crime scene photographs
- Security camera stills
- Submitted evidence photos
- Thermal/UV/Night vision captures

### Audio Tab (Sound Files)
- EVP (Electronic Voice Phenomena) recordings
- Security system audio
- Witness recordings
- Environmental audio

## Phase 3: Submit Verdict

After reviewing evidence, the player selects a classification:
┌─────────────────────────────────────────────────────────────┐
│ SUBMIT CLASSIFICATION │
├─────────────────────────────────────────────────────────────┤
│ │
│ [CLASS I - RESIDUAL] [CLASS II - INTELLIGENT] │
│ │
│ [CLASS III - MALEVOLENT] [CYBER-ENTITY] │
│ │
│ [NON-PARANORMAL] │
│ │
├─────────────────────────────────────────────────────────────┤
│ CONFIDENCE: [LOW] [MEDIUM] [HIGH] │
│ │
│ [SUBMIT REPORT] [REQUEST MORE DATA] │
└─────────────────────────────────────────────────────────────┘

## Phase 4: Results & Economy

- Correct classification = Credits earned
- Partial credit for close answers
- Wrong answers = Penalties (credits lost, reputation damage)
- Catastrophic errors = Major consequences

## Phase 5: Meta Management

Between cases:
- Check email (threats, offers, story beats)
- Purchase upgrades (hardware, software)
- Pay rent (every 3 shifts)
- Pay debt (to Chrome Fist Syndicate)

---

# 5. THE CLASSIFICATION SYSTEM

## Paranormal Taxonomy
PRIMARY CLASSIFICATIONS:

CLASS I - RESIDUAL
├── Echo
│ └── Replaying event, non-interactive
│ └── Clues: Repetitive patterns, no response to stimuli
├── Imprint
│ └── Location-bound memory
│ └── Clues: Tied to specific spots, trauma indicators
└── Fade
└── Degrading over time, low threat
└── Clues: Weak manifestation, historical event

CLASS II - INTELLIGENT
├── Poltergeist
│ └── Kinetic manifestation
│ └── Clues: Object movement, electrical interference
├── Specter
│ └── Full apparition, communicative
│ └── Clues: Clear EVPs, responds to questions
└── Shade
└── Partially manifested, hostile
└── Clues: Aggressive behavior, partial visibility

CLASS III - MALEVOLENT
├── Revenant
│ └── Vengeance-driven, extremely dangerous
│ └── Clues: Connected to violent death, targets specific people
├── Wraith
│ └── Feeds on fear/energy
│ └── Clues: Witness exhaustion, escalating fear response
└── Demonic Attachment
└── Non-human origin
└── Clues: Religious symbols, unnatural behavior, sulfur

CYBER-ENTITY
├── Neural Fragment
│ └── Dead user's mind-upload remnant
│ └── Clues: Digital artifacts, tied to neural network
├── Rogue AI
│ └── Gained sentience, mimicking ghost behavior
│ └── Clues: Logical patterns, system access, data manipulation
└── Signal Bleed
└── Cross-dimensional data corruption
└── Clues: Impossible data, reality glitches

NON-PARANORMAL
├── Hoax
│ └── Intentional fabrication
│ └── Clues: Visible wires, editing artifacts, financial motive
├── Misidentification
│ └── Pareidolia, equipment malfunction
│ └── Clues: Explainable phenomena, poor evidence quality
└── Psych Event
└── Witness hallucination, trauma response
└── Clues: Single witness, psych history, no physical evidence

## Scoring Matrix

```javascript
const verdictScoring = {
  exact_match: { 
    credits: 500, 
    reputation: +10,
    description: "Perfect classification with correct subtype"
  },
  correct_class: { 
    credits: 300, 
    reputation: +5,
    description: "Got Class II but wrong subtype (e.g., Poltergeist vs Specter)"
  },
  adjacent_class: { 
    credits: 100, 
    reputation: 0,
    description: "Close call (e.g., Echo vs Imprint)"
  },
  wrong_but_safe: { 
    credits: 0, 
    reputation: -5,
    description: "Called real ghost a hoax (wasted your time, no harm)"
  },
  wrong_and_dangerous: { 
    credits: -200, 
    reputation: -20,
    description: "Called hoax when real (cleanup crew sent unprepared)"
  },
  catastrophic: { 
    credits: -1000, 
    reputation: -50,
    description: "Missed a Class III, civilians died"
  }
};
Confidence Modifier
Players can hedge their bets:

Confidence	Correct Multiplier	Wrong Multiplier
LOW	0.5x	0.5x
MEDIUM	1.0x	1.0x
HIGH	1.5x	1.5x

6. EVIDENCE ANALYSIS TOOLKIT
Image Analysis Module
Filter System
const imageFilters = {
  STANDARD: {
    reveals: ["physical_evidence", "hoax_indicators", "environmental_context"],
    hides: ["thermal_signatures", "ectoplasm_traces", "uv_markers"],
    stability_drain: 0,
    shader_effect: null
  },
  
  NIGHT_VISION: {
    reveals: ["shadows", "movement_blur", "hidden_wires", "reflection_anomalies"],
    hides: ["color_information", "thermal_data"],
    stability_drain: 2,
    shader_effect: "green_monochrome_with_grain"
  },
  
  THERMAL: {
    reveals: ["cold_spots", "heat_signatures", "recent_contact_points", "hidden_bodies"],
    hides: ["visual_detail", "text", "facial_features"],
    stability_drain: 5,
    shader_effect: "heatmap_gradient"
  },
  
  UV_SPECTRUM: {
    reveals: ["ectoplasm_residue", "ritual_markings", "blood_traces", "forged_documents"],
    hides: ["standard_lighting", "depth_perception"],
    stability_drain: 4,
    shader_effect: "purple_blacklight_glow"
  },
  
  SPECTRAL_OVERLAY: {
    reveals: ["entity_silhouettes", "energy_patterns", "dimensional_tears"],
    hides: ["physical_reality"],
    stability_drain: 10,
    unlock_requirement: "spectral_analyzer_upgrade",
    shader_effect: "false_color_with_trails"
  }
};

The Denoise Mechanic
Images are obscured by static noise. Players must hold a button to clear the noise, but this generates CPU heat.
class DenoiseSystem {
  constructor() {
    this.noiseLevel = 1.0;        // 1.0 = fully obscured, 0.0 = clear
    this.cpuHeat = 0;             // 0-100
    this.heatDissipation = 0.5;   // Per second (upgradeable)
    this.heatGeneration = 15;     // Per second while denoising
    this.overheatThreshold = 80;  // Screen starts flickering
    this.criticalThreshold = 95;  // System reboots (15 second penalty)
  }

  update(deltaTime, isDenoising) {
    if (isDenoising && this.cpuHeat < 100) {
      // Actively denoising
      this.noiseLevel = Math.max(0, this.noiseLevel - (0.3 * deltaTime));
      this.cpuHeat = Math.min(100, this.cpuHeat + (this.heatGeneration * deltaTime));
      
      // Visual feedback at thresholds
      if (this.cpuHeat > this.overheatThreshold) {
        this.triggerScreenFlicker();
        this.playWarningBeep();
      }
      if (this.cpuHeat > this.criticalThreshold) {
        this.triggerEmergencyShutdown();
      }
    } else {
      // Passive cooling
      this.cpuHeat = Math.max(0, this.cpuHeat - (this.heatDissipation * deltaTime));
    }
  }
  
  triggerEmergencyShutdown() {
    // Screen goes black
    // "THERMAL SHUTDOWN - REBOOTING" message
    // 15 second wait
    // Progress on current image is LOST
  }
}
Image Layer System
Each case image is constructed from multiple layers revealed by different filters:
const caseImage = {
  id: "crime_scene_001",
  base_layer: "apartment_interior.png",
  layers: [
    {
      asset: "hidden_figure_shadow.png",
      visible_in: ["NIGHT_VISION", "SPECTRAL_OVERLAY"],
      noise_threshold: 0.3,  // Must denoise to 30% to see
      clue_type: "entity_presence",
      points_to: "CLASS_II"
    },
    {
      asset: "cold_spot_thermal.png",
      visible_in: ["THERMAL"],
      noise_threshold: 0.5,
      clue_type: "temperature_anomaly",
      points_to: "CLASS_I"
    },
    {
      asset: "fishing_wire_glint.png",
      visible_in: ["NIGHT_VISION"],
      noise_threshold: 0.1,  // Hard to see, requires heavy denoising
      clue_type: "hoax_evidence",
      points_to: "HOAX"
    },
    {
      asset: "ritual_circle_uv.png",
      visible_in: ["UV_SPECTRUM"],
      noise_threshold: 0.4,
      clue_type: "occult_involvement",
      points_to: "CLASS_III"
    }
  ]
};
Audio Analysis Module
EVP Workstation Interface
┌─────────────────────────────────────────────────────────────┐
│  ◄◄  ◄  ▐▐   ►  ►►  │ 00:00 / 02:34  │  [LOOP] [MARK]     │
├─────────────────────────────────────────────────────────────┤
│  ▁▂▃▅▂▁▁▂▅▇▅▃▂▁▂▃▄▃▂▁▁▂▃▅▇█▇▅▃▂▁▂▃▄▅▆▅▄▃▂▁▁▂▃  WAVEFORM   │
├─────────────────────────────────────────────────────────────┤
│  ████░░░░████░░░████░░░░░░░████████░░░░░░░░░░  SPECTROGRAM │
│  ▓▓▓▓░░░░▓▓▓▓░░░▓▓▓▓░░░░░░░▓▓▓▓▓▓▓▓░░░░░░░░░░              │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░              │
├─────────────────────────────────────────────────────────────┤
│  SPEED: [0.25x] [0.5x] [1.0x] [2.0x]   DIRECTION: [►] [◄]  │
├─────────────────────────────────────────────────────────────┤
│  FREQUENCY FILTER                                           │
│  LOW  ├────●────────────────────┤ HIGH                     │
│  20Hz                           20kHz                       │
│                                                             │
│  NOISE GATE                                                 │
│  ├──────────●───────────────────┤                          │
│                                                             │
│  AMPLIFICATION                                              │
│  ├────────────●─────────────────┤  [ISOLATE] [TRANSCRIBE]  │
└─────────────────────────────────────────────────────────────┘
Audio Clue Types
const audioClueTypes = {
  BACKWARDS_MESSAGE: {
    detection: "Play in reverse at 0.5x speed",
    example: "What sounds like static becomes 'HELP ME' backwards",
    entity_correlation: ["Specter", "Revenant", "Neural Fragment"]
  },
  
  INFRASOUND: {
    detection: "Filter to 15-20Hz range, amplify",
    example: "Low rumble that causes unease in witnesses",
    entity_correlation: ["Wraith", "Dimensional Tear"]
  },
  
  EVP_CLASS_A: {
    detection: "Clear voice audible at normal playback",
    example: "Distinct words with no identifiable source",
    entity_correlation: ["Specter", "Class III entities"]
  },
  
  EVP_CLASS_B: {
    detection: "Requires 0.5x speed and noise reduction",
    example: "Whispered words, partially intelligible",
    entity_correlation: ["Echo", "Imprint", "Poltergeist"]
  },
  
  EVP_CLASS_C: {
    detection: "Requires heavy filtering, interpretation varies",
    example: "Could be voice, could be interference",
    entity_correlation: ["Uncertain - requires corroborating evidence"]
  },
  
  DIGITAL_ARTIFACT: {
    detection: "Clicking/beeping pattern, analyze spectrogram for data encoding",
    example: "Hidden data encoded in audio frequency",
    entity_correlation: ["Rogue AI", "Signal Bleed", "Neural Fragment"]
  },
  
  AUDIO_HOAX: {
    detection: "Loop point visible in waveform, compression artifacts",
    example: "Same 'ghost voice' repeats with identical waveform",
    entity_correlation: ["HOAX"]
  }
};
EVP Transcription Challenge
When the player isolates a potential EVP, they may need to transcribe what they hear:
class EVPTranscriptionChallenge {
  constructor(audioClip) {
    this.possibleTranscriptions = audioClip.transcription_options;
    this.correctTranscription = audioClip.correct_transcription;
    this.clueRevealed = audioClip.points_to;
  }
  
  validateTranscription(playerInput) {
    // Fuzzy matching for close interpretations
    const normalizedInput = playerInput.toLowerCase().trim();
    
    for (const option of this.possibleTranscriptions) {
      if (this.levenshteinDistance(normalizedInput, option.toLowerCase()) < 3) {
        return {
          success: true,
          matched: option,
          isCorrect: option === this.correctTranscription,
          clue: this.clueRevealed
        };
      }
    }
    
    return { success: false };
  }
  
  levenshteinDistance(a, b) {
    // Standard Levenshtein implementation
    // Returns edit distance between two strings
  }
}
7. META-STRUCTURE & PROGRESSION
The Shift System
Gameplay is structured into shifts with real pressure:
const shiftStructure = {
  duration_minutes: 15,      // Real-time (can be adjusted in settings)
  case_quota: 5,             // Minimum cases to process per shift
  
  rent_due_every: 3,         // Every 3 shifts
  rent_amount: 2000,         // Credits
  
  debt_payment_every: 7,     // Every 7 shifts (weekly)
  debt_interest: 0.15,       // 15% weekly interest
  
  shift_end_options: [
    "CLOCK_OUT",             // Safe, collect earnings
    "OVERTIME",              // +50% pay, increased glitch events
    "DOUBLE_SHIFT"           // 2x pay, screen degrades, exhaustion effects
  ]
};
The Reputation System
Four factions track the player's standing:
const reputationFactions = {
  CORPORATE: {
    name: "MegaCorp Security Division",
    preference: "Quick classifications, minimal false positives, cover-ups when needed",
    high_rep_bonus: "Access to classified cases, better equipment prices, protection",
    low_rep_penalty: "Blacklisted from corporate contracts, marked for surveillance",
    color: "#00ffcc" // Cyan
  },
  
  UNDERGROUND: {
    name: "The Ghost Net (Hacker Collective)",
    preference: "Exposing cover-ups, finding Cyber-Entities, leaking data",
    high_rep_bonus: "Black market upgrades, hacking tools, untraceable payments",
    low_rep_penalty: "They leak your identity, mark you as a sellout",
    color: "#ff00ff" // Magenta
  },
  
  GOVERNMENT: {
    name: "Bureau of Paranormal Affairs",
    preference: "Accurate classifications, proper documentation, by-the-book",
    high_rep_bonus: "Official pardons, protected status, premium contracts",
    low_rep_penalty: "You become a 'person of interest', potential arrest",
    color: "#ffcc00" // Amber
  },
  
  OCCULT: {
    name: "The Threshold Society",
    preference: "Finding genuine supernatural events, preserving entities",
    high_rep_bonus: "Ritual knowledge, protective wards, esoteric upgrades",
    low_rep_penalty: "You're 'marked' by something from the other side",
    color: "#ff3366" // Red
  }
};
Faction Conflicts
Some cases have evidence that creates faction dilemmas:

Example: A case reveals both a genuine haunting AND corporate negligence that caused the deaths.

Corporate wants: "Psych Event" classification (covers their involvement)
Underground wants: The data leaked, exposure of corporate crime
Government wants: Accurate "Revenant" classification
Occult wants: The entity preserved, not exorcised
Your choice affects multiple reputation tracks simultaneously.
The Upgrade Tree
Hardware Upgrades
const hardwareUpgrades = {
  // === PROCESSING ===
  CPU_TIER_1: { 
    cost: 500, 
    effect: "Denoise 20% faster",
    description: "Overclocked 286 processor"
  },
  CPU_TIER_2: { 
    cost: 1500, 
    effect: "Denoise 50% faster", 
    requires: "CPU_TIER_1",
    description: "Military-spec 386DX"
  },
  CPU_TIER_3: { 
    cost: 4000, 
    effect: "Denoise 100% faster", 
    requires: "CPU_TIER_2",
    description: "Experimental neural coprocessor"
  },
  
  // === COOLING ===
  FAN_UPGRADE: { 
    cost: 300, 
    effect: "Heat dissipation +50%",
    description: "High-RPM cooling fan"
  },
  LIQUID_COOLING: { 
    cost: 2000, 
    effect: "Heat dissipation +200%", 
    requires: "FAN_UPGRADE",
    description: "Closed-loop liquid cooling"
  },
  CRYO_SYSTEM: { 
    cost: 6000, 
    effect: "Never overheat (unlimited denoise)", 
    requires: "LIQUID_COOLING",
    description: "Cryogenic cooling unit (loud)"
  },
  
  // === AUDIO ===
  SOUND_CARD_BASIC: { 
    cost: 400, 
    effect: "Unlock frequency filter",
    description: "8-bit sound card"
  },
  SOUND_CARD_PRO: { 
    cost: 1200, 
    effect: "Unlock reverse playback + noise gate", 
    requires: "SOUND_CARD_BASIC",
    description: "16-bit studio card"
  },
  SPECTRAL_AUDIO: { 
    cost: 3500, 
    effect: "Auto-highlight audio anomalies", 
    requires: "SOUND_CARD_PRO",
    description: "AI-assisted audio analyzer"
  },
  
  // === VISUAL ===
  MONITOR_REFRESH: { 
    cost: 600, 
    effect: "Reduce scanline intensity 30%",
    description: "Higher refresh rate CRT"
  },
  MONITOR_HD: { 
    cost: 2500, 
    effect: "Higher image clarity, less noise", 
    requires: "MONITOR_REFRESH",
    description: "Trinitron display"
  },
  SPECTRAL_OVERLAY_MODULE: { 
    cost: 5000, 
    effect: "Unlock 5th image filter (Spectral)",
    description: "Experimental spectrum analyzer"
  },
  
  // === SPECIAL/PROTECTION ===
  FARADAY_CAGE: { 
    cost: 1500, 
    effect: "Reduces 'intrusion' events by 50%",
    description: "Electromagnetic shielding"
  },
  NEURAL_BUFFER: { 
    cost: 8000, 
    effect: "Cannot be 'possessed' through the screen",
    description: "Psychic firewall"
  },
  DEAD_DROP_MODEM: { 
    cost: 3000, 
    effect: "Access to Underground faction cases",
    description: "Untraceable network connection"
  }
};
Software Upgrades
const softwareUpgrades = {
  PATTERN_RECOGNITION: { 
    cost: 800, 
    effect: "Highlights important keywords in Intel tab",
    description: "Text analysis AI v1.2"
  },
  AUTO_TRANSCRIBE: { 
    cost: 1200, 
    effect: "AI attempts EVP transcription (60% accuracy)",
    description: "Speech recognition module (unreliable)"
  },
  CASE_HISTORY_DB: { 
    cost: 600, 
    effect: "Shows if location has prior incidents",
    description: "Access to municipal records"
  },
  HOAX_DETECTOR: { 
    cost: 1500, 
    effect: "Flags common hoax patterns (75% accuracy)",
    description: "Fraud detection algorithms"
  },
  ENTITY_ENCYCLOPEDIA: { 
    cost: 400, 
    effect: "In-app reference guide to entity types",
    description: "Paranormal database access"
  },
  DARK_WEB_SEARCH: { 
    cost: 2000, 
    effect: "Cross-reference cases with hidden databases",
    description: "Ghost Net mirror access"
  }
};
The Calendar & Rent System
┌───────────────────────────────────────────┐
│  SHIFT 14 / DAY 7          ⚡ CPU: 78%   │
├───────────────────────────────────────────┤
│                                           │
│   RENT DUE: 2 DAYS                        │
│   AMOUNT: ₵2,500                          │
│   YOUR BALANCE: ₵1,847                    │
│                                           │
│   [!] INSUFFICIENT FUNDS                  │
│   [!] EVICTION IN 2 SHIFTS IF UNPAID      │
│                                           │
├───────────────────────────────────────────┤
│  DEBT TO CHROME FIST: ₵15,000            │
│  INTEREST: 15% WEEKLY                     │
│  NEXT PAYMENT: 12 DAYS (₵2,000 minimum)  │
│                                           │
│  [!] FAILURE TO PAY = REPOSSESSION        │
│  [!] COLLATERAL: Left cybernetic eye      │
└───────────────────────────────────────────┘
8. CASE DESIGN PHILOSOPHY
The Anatomy of a Good Case
Every case must have:

A Clear Answer - The truth exists and can be found
Misleading Evidence - At least one piece pointing to wrong conclusions
One "Aha" Moment - The piece that confirms the truth when found
Thematic Coherence - Fits the cyberpunk world and lore
Multiple Evidence Types - Uses at least 2 of 3 evidence tabs
Case Archetypes for Procedural Generation
const caseArchetypes = {
  RESIDUAL_HAUNTING: {
    intel_style: ["witness_interview", "police_report", "historical_record"],
    image_evidence: ["cold_spots", "temporal_loops", "environmental_staining"],
    audio_evidence: ["EVP_CLASS_B", "EVP_CLASS_C", "ambient_anomalies"],
    red_herrings: ["pareidolia", "equipment_glitch", "witness_embellishment"],
    difficulty: 1,
    base_payout: 300
  },
  
  INTELLIGENT_HAUNTING: {
    intel_style: ["direct_communication", "escalating_incidents", "targeted_activity"],
    image_evidence: ["full_apparition", "object_movement", "written_messages"],
    audio_evidence: ["EVP_CLASS_A", "direct_response", "name_calling"],
    red_herrings: ["hoax_staging", "mental_illness", "attention_seeking"],
    difficulty: 3,
    base_payout: 500
  },
  
  MALEVOLENT_ENTITY: {
    intel_style: ["injury_reports", "death_records", "ritual_activity"],
    image_evidence: ["attack_evidence", "occult_symbols", "physical_manifestation"],
    audio_evidence: ["threatening_EVP", "inhuman_sounds", "latin_phrases"],
    red_herrings: ["cult_activity", "murder_coverup", "drug_psychosis"],
    difficulty: 5,
    base_payout: 1000
  },
  
  CYBER_ENTITY: {
    intel_style: ["system_logs", "chat_transcripts", "corrupted_data", "neural_records"],
    image_evidence: ["screen_artifacts", "impossible_geometry", "digital_faces"],
    audio_evidence: ["digital_artifacts", "data_encoded_audio", "synthetic_voice"],
    red_herrings: ["malware", "hardware_failure", "hacker_prank"],
    difficulty: 4,
    base_payout: 750
  },
  
  HOAX: {
    intel_style: ["suspicious_witness", "financial_motive", "inconsistent_timeline"],
    image_evidence: ["visible_wire", "edited_metadata", "actor_reflection"],
    audio_evidence: ["loop_points", "compression_artifacts", "background_voices"],
    red_herrings: ["genuine_coincidental_anomaly", "witness_paranoia"],
    difficulty: 2,
    base_payout: 200
  },
  
  HYBRID_CASE: {
    description: "Real haunting exploited by hoaxer, OR hoax that attracted real entity",
    difficulty: 5,
    base_payout: 1200
  }
};
Example Case: "The Neon Noodle Incident"
{
  "id": "case_014",
  "title": "THE NEON NOODLE INCIDENT",
  "client": "CORPORATE",
  "priority": "STANDARD",
  "payout_base": 400,
  
  "intel": {
    "format": "police_transcript",
    "content": [
      "[DISPATCH LOG - 03:42:17]",
      "",
      "UNIT 7: Dispatch, we got a 10-34 at the Neon Noodle, corner of 5th and Vine.",
      "",
      "DISPATCH: Copy Unit 7. Nature of disturbance?",
      "",
      "UNIT 7: Owner says the automated fryer's been turning itself on. Third time this week.",
      "",
      "DISPATCH: Equipment malfunction?",
      "",
      "UNIT 7: Negative. Thing's unplugged. Also... she says it's screaming.",
      "",
      "DISPATCH: ...Screaming?",
      "",
      "UNIT 7: Like a person. Says it started after they changed suppliers. New oil comes from some place called 'Prosperity Farms.'",
      "",
      "[BREAK IN TRANSMISSION - 00:00:34]",
      "",
      "UNIT 7: Dispatch, we're gonna need paratech. The fryer... it's got a face."
    ],
    "clues": [
      { "text": "unplugged", "significance": "Rules out electrical malfunction" },
      { "text": "Prosperity Farms", "significance": "Searchable - connected to disappearances" },
      { "text": "screaming", "significance": "Indicates residual trauma" },
      { "text": "got a face", "significance": "Manifestation type indicator - Imprint" }
    ]
  },
  
  "images": [
    {
      "id": "exterior_shot",
      "filename": "neon_noodle_exterior.png",
      "description": "Neon Noodle storefront at night",
      "layers": [],
      "clues": [],
      "purpose": "Establishing shot, no evidence"
    },
    {
      "id": "fryer_main",
      "filename": "fryer_base.png",
      "description": "The industrial fryer, standard lighting",
      "layers": [
        { 
          "asset": "fryer_oil_sheen.png", 
          "filter": "STANDARD",
          "noise_threshold": 0.7
        },
        { 
          "asset": "fryer_cold_spot.png", 
          "filter": "THERMAL", 
          "noise_threshold": 0.4,
          "clue_type": "TEMPERATURE_ANOMALY",
          "points_to": "RESIDUAL"
        },
        { 
          "asset": "fryer_face_faint.png", 
          "filter": "SPECTRAL_OVERLAY", 
          "noise_threshold": 0.2,
          "clue_type": "MANIFESTATION",
          "points_to": "IMPRINT"
        }
      ]
    },
    {
      "id": "oil_barrel",
      "filename": "oil_barrel_base.png",
      "description": "Prosperity Farms oil barrel in storage",
      "layers": [
        { 
          "asset": "oil_barrel_handprint.png", 
          "filter": "UV_SPECTRUM", 
          "noise_threshold": 0.3,
          "clue_type": "PHYSICAL_EVIDENCE",
          "points_to": "HUMAN_REMAINS"
        }
      ]
    }
  ],
  
  "audio": [
    {
      "id": "evp_fryer",
      "filename": "noodle_evp_01.mp3",
      "duration_seconds": 47,
      "description": "Recording from inside the restaurant, 3 AM",
      "clues": [
        {
          "timestamp_start": 12.4,
          "timestamp_end": 15.2,
          "type": "EVP_CLASS_B",
          "detection_method": "0.5x speed, noise gate at 40%",
          "transcription_options": ["help me", "held me", "hell meat"],
          "correct_transcription": "help me",
          "points_to": "VICTIM_COMMUNICATION"
        },
        {
          "timestamp_start": 31.0,
          "timestamp_end": 34.5,
          "type": "AMBIENT_ANOMALY",
          "detection_method": "Standard playback",
          "description": "Sizzling sound despite fryer being off and cold",
          "points_to": "RESIDUAL_ACTIVITY"
        }
      ]
    }
  ],
  
  "solution": {
    "correct_classification": "CLASS_I_IMPRINT",
    "subtype": "Trauma Imprint",
    "explanation": "Victim was murdered and disposed of in rendering vat at Prosperity Farms. Psychic trauma imprinted on the oil. Manifestation is non-intelligent, replaying death moment.",
    "alt_acceptable": ["CLASS_I_ECHO"],
    "wrong_but_close": ["CLASS_II_POLTERGEIST"],
    "dangerously_wrong": ["HOAX", "MISIDENTIFICATION"],
    
    "corporate_cover_up": true,
    "hidden_truth": "Prosperity Farms is a subsidiary of MegaCorp. They're disposing of 'problems' in the rendering vats.",
    
    "faction_implications": {
      "CORPORATE": "They want it classified as equipment malfunction - offers bonus ₵500",
      "UNDERGROUND": "They want you to leak the Prosperity Farms connection",
      "GOVERNMENT": "Standard classification is acceptable",
      "OCCULT": "They want the soul released, not contained"
    }
  }
}
9. THE GLITCH SYSTEM
Types of System Intrusions
The CRT monitor should feel haunted. Random events remind the player they're not alone.
const intrusionEvents = {
  // === COSMETIC (Atmosphere only, no gameplay impact) ===
  
  SCREEN_FLICKER: {
    trigger: "random_during_case",
    frequency: "common",
    duration: "0.5-1.5 seconds",
    effect: "Brief screen blackout, static burst",
    shader_params: { flickerIntensity: 0.4, noiseIntensity: 0.3 },
    meaning: null
  },
  
  RGB_SPIKE: {
    trigger: "viewing_dangerous_entity_image",
    frequency: "uncommon",
    duration: "2 seconds",
    effect: "Chromatic aberration intensifies dramatically",
    shader_params: { rgbOffset: 0.008 },
    meaning: "Entity is aware of observation"
  },
  
  SCANLINE_CRAWL: {
    trigger: "prolonged_audio_analysis",
    frequency: "uncommon",
    duration: "5 seconds",
    effect: "Scanlines move upward instead of down",
    shader_params: { scanlineSpeed: -0.05 },
    meaning: null
  },
  
  PHOSPHOR_BURN: {
    trigger: "staring_at_same_image_too_long",
    frequency: "rare",
    duration: "until_tab_change",
    effect: "Ghost image persists when looking elsewhere",
    meaning: "The image is burned into your retinas... or is it?"
  },
  
  // === MECHANICAL (Affects gameplay) ===
  
  MOUSE_DRIFT: {
    trigger: "Class III entity case",
    frequency: "rare",
    duration: "3-5 seconds",
    effect: "Cursor slowly drifts toward specific screen element",
    meaning: "Entity is trying to show you something",
    gameplay: "May reveal hidden clue location"
  },
  
  AUDIO_BLEED: {
    trigger: "on_audio_tab_with_intelligent_entity",
    frequency: "rare",
    duration: "one_playback",
    effect: "EVP plays without player pressing play",
    meaning: "Entity attempting direct communication",
    gameplay: "Free clue, but unsettling"
  },
  
  FILE_RENAME: {
    trigger: "deceptive_entity_case",
    frequency: "rare",
    duration: "permanent_until_noticed",
    effect: "Evidence file names change when not looked at",
    examples: ["Evidence_01.jpg → DontLook.jpg", "audio_log.mp3 → HEAR_ME.mp3"],
    meaning: "Evidence is being manipulated",
    gameplay: "File contents unchanged, just names"
  },
  
  TEXT_CORRUPTION: {
    trigger: "high_system_corruption",
    frequency: "scales_with_corruption",
    duration: "permanent_until_cleansed",
    effect: "Random characters replaced with symbols",
    examples: ["witness saw → w1tn3ss s̷a̷w̷"],
    meaning: "System integrity compromised",
    gameplay: "Makes reading intel harder"
  },
  
  // === DANGEROUS (Requires player response) ===
  
  SYSTEM_TAKEOVER: {
    trigger: "Cyber-Entity case OR failed containment",
    frequency: "very_rare",
    duration: "until_resolved",
    effect: "Popup: 'ALLOW REMOTE ACCESS? [Y] [N]'",
    consequence_yes: "Entity enters your system, new story branch, +corruption",
    consequence_no: "Case data corrupts, lose progress on current case",
    consequence_ignore: "Forced 'yes' after 10 seconds",
    gameplay: "Major decision point"
  },
  
  DIRECT_ADDRESS: {
    trigger: "RED priority case, act 2+",
    frequency: "scripted_story_event",
    duration: "one_occurrence",
    effect: "EVP says the player's OS username (or 'I SEE YOU')",
    meaning: "Fourth wall break - entity knows you're watching",
    gameplay: "Pure horror, no mechanical impact"
  },
  
  SCREEN_POSSESSION: {
    trigger: "no_neural_buffer_upgrade + Class_III_case",
    frequency: "very_rare",
    duration: "15_seconds",
    effect: "Player loses control, screen shows disturbing imagery",
    meaning: "Entity attempting psychic attack",
    gameplay: "Time loss, +5 corruption, screen shake"
  }
};
The Corruption Mechanic
If the player mishandles dangerous cases or lets intrusions go unchecked, system corruption builds:
class SystemCorruption {
  constructor() {
    this.level = 0;  // 0-100
  }
  
  getActiveEffects() {
    const effects = [];
    
    if (this.level >= 10) {
      effects.push({
        name: "Minor Text Glitches",
        description: "Occasional character replacement in intel text"
      });
    }
    
    if (this.level >= 25) {
      effects.push({
        name: "Audio Artifacts",
        description: "Random static bursts during audio playback"
      });
    }
    
    if (this.level >= 40) {
      effects.push({
        name: "Image Corruption",
        description: "Wrong images occasionally load, visual glitches"
      });
    }
    
    if (this.level >= 60) {
      effects.push({
        name: "Fake Cases",
        description: "Trap cases appear that cannot be solved (time wasters)"
      });
    }
    
    if (this.level >= 80) {
      effects.push({
        name: "Unreliable Evidence",
        description: "Evidence may be falsified by entities"
      });
    }
    
    if (this.level >= 95) {
      effects.push({
        name: "CRITICAL",
        description: "YOU_ARE_ALREADY_DEAD ending approaches"
      });
    }
    
    return effects;
  }
  
  modifyCorruption(amount, source) {
    this.level = Math.max(0, Math.min(100, this.level + amount));
    
    // Log for player awareness
    if (amount > 0) {
      this.showWarning(`SYSTEM CORRUPTION +${amount}% [${source}]`);
    }
  }
  
  cleanse(method) {
    switch(method) {
      case "SYSTEM_REFORMAT":
        // Costs 5000 credits, available at upgrade shop
        this.level = 0;
        break;
        
      case "OCCULT_WARD":
        // Requires high Threshold Society reputation
        this.level = Math.max(0, this.level - 30);
        break;
        
      case "FARADAY_CAGE":
        // Passive upgrade - slows corruption gain by 50%
        break;
    }
  }
}

// Corruption gain sources
const corruptionSources = {
  "cyber_entity_case": +3,
  "failed_class_III": +10,
  "system_takeover_yes": +15,
  "screen_possession": +5,
  "ignored_intrusion": +2,
  "correct_classification": -1,  // Slow passive healing
  "occult_ward_active": -0.5     // Per shift
};
10. NARRATIVE STRUCTURE
Three-Act Structure
The game reveals its story through RED PRIORITY cases that appear every few shifts:

ACT 1: "The Job" (Shifts 1-10)
Player Experience:

Learning the mechanics
Cases are relatively straightforward
Building up credits, paying off initial debts
Cyber-Entities seem like simple glitches
Story Beats:

Introduction to Neo-Veridia and your debt situation
Meet your "handler" via email (dispatch contact)
First hint that cases might be connected
A witness mentions "the Neural Network test"
Difficulty: Easy to Medium

ACT 2: "The Pattern" (Shifts 11-25)
Player Experience:

Cases start connecting to each other
Same locations appear in multiple cases
Difficulty increases significantly
Faction pressure becomes relevant
Story Beats:

You realize the Neural Network rollout correlates with hauntings
A case directly involves someone who knew "you" (pre-amnesia)
The name "MARI" appears in multiple files
Your apartment address shows up in a case from 10 years ago
The timestamp 03:42:17 appears everywhere
Difficulty: Medium to Hard

ACT 3: "The Convergence" (Shifts 26+)
Player Experience:

You're investigating your own history
The system IS the haunting
Corruption becomes a major threat
Multiple endings become available
Story Beats:

You find your own death certificate in hidden files
MARI was trying to warn you—she died too
The first Neural Network test killed 47 people
Their consciousnesses are trapped in the network
You are one of them
You've been reviewing your own case files all along
Difficulty: Hard

Recurring Narrative Elements
The Repeating Witness: MARI
A person named "MARI" appears across multiple case files:

First appearance: A witness in a minor case
Second appearance: A victim in another case
Third appearance: An entity trying to communicate
Final revelation: She was your partner. She's been trying to reach you.
The Address: 2847 Neon Heights, Apt 4C
This address appears:

In the background of crime scene photos
As a witness's residence
In corrupted audio ("two-eight-four-seven...")
In your own system files
Revelation: It's your apartment. From before you died.

The Timestamp: 03:42:17
The exact time of your death. It appears:

As the timestamp on dispatch logs
In corrupted file metadata
On the taskbar clock during glitch events
As the "runtime" of your system
The Hidden Files
A locked folder on the desktop (/PERSONAL/) can be eventually accessed:
/PERSONAL/
├── old_photos/
│   ├── me_and_mari.jpg     [CORRUPTED - shows two silhouettes]
│   ├── graduation.jpg      [CORRUPTED - date visible: 10 years ago]
│   └── apartment_4c.jpg    [Shows YOUR current apartment, dated 10 years ago]
│
├── journal.txt
│   └── "Entry 47: The Neural Link test is tomorrow. They say it's safe.
│        Mari is worried but I told her we need the money.
│        What could go wrong?
│        
│        I don't remember writing this. Why don't I remember?"
│
├── death_certificate.pdf
│   └── NAME: [PLAYER_USERNAME]
│       DOD: [EXACTLY 10 YEARS AGO]
│       CAUSE: Neural Link Catastrophic Failure
│       STATUS: Body unrecoverable - consciousness uploaded
│
└── case_zero.ghost
    └── [ENCRYPTED - REQUIRES ALL THREE FACTION KEYS]
        When decrypted: Your own case file.
        You are Case Zero.
        The first ghost in the machine.
Endings
const endings = {
  EVICTION: {
    condition: "Miss rent 2 consecutive times",
    description: "You lose your apartment. The terminal shuts down. You cease to exist.",
    tone: "Sad, quiet failure",
    final_screen: "CONNECTION TERMINATED"
  },
  
  REPOSSESSION: {
    condition: "Miss debt payment to Chrome Fist",
    description: "They come to collect. The screen shows your apartment door breaking down. Then static.",
    tone: "Dark, horror",
    final_screen: "DEBT COLLECTED"
  },
  
  CORRUPTION_DEATH: {
    condition: "System corruption reaches 100%",
    description: "You become indistinguishable from the entities you hunt. Another ghost in the machine. The screen shows your face, glitching, joining the network.",
    tone: "Cosmic horror, loss of identity",
    final_screen: "ASSIMILATED"
  },
  
  CORPORATE_ENDING: {
    condition: "Max corporate reputation, complete their storyline, cover up the truth",
    description: "You become head of Paranormal Division. You're part of the cover-up now. The Neural Network expands. More ghosts join you.",
    tone: "Pyrrhic victory, moral compromise",
    final_screen: "PROMOTED"
  },
  
  UNDERGROUND_ENDING: {
    condition: "Max underground reputation, expose the Neural Network publicly",
    description: "The truth gets out. The Network shuts down. All the ghosts are freed—including you. Screen fades to white.",
    tone: "Bittersweet sacrifice",
    final_screen: "FREED"
  },
  
  GOVERNMENT_ENDING: {
    condition: "Max government reputation, official investigation launched",
    description: "The Bureau takes over. Everything is classified. You're archived—preserved but inactive. Waiting.",
    tone: "Ambiguous, bureaucratic limbo",
    final_screen: "ARCHIVED"
  },
  
  TRUE_ENDING: {
    condition: "Find all personal files, low corruption, help Mari, refuse to choose a faction",
    description: "You remember who you were. You choose to stay in the network—not as a victim, but as a guardian. You protect the others like you.",
    tone: "Hopeful, acceptance",
    final_screen: "WATCHING"
  },
  
  SECRET_ENDING: {
    condition: "100% case accuracy, find Case Zero, classify yourself correctly",
    description: "You wake up. Hospital bed. Neural link cables disconnected. It was all a simulation—the recovery program for comatose test subjects. Or was it? Your phone buzzes. New case file received.",
    tone: "Meta, unsettling, ambiguous",
    final_screen: "REBOOTING..."
  }
};
11. AUDIO DESIGN
Ambient Sound Layers
const ambientSoundscape = {
  // === CONSTANT BACKGROUND (Always playing) ===
  BASE_LAYER: {
    sounds: [
      { file: "crt_hum.ogg", volume: 0.08, loop: true },
      { file: "room_tone.ogg", volume: 0.05, loop: true },
      { file: "hard_drive_idle.ogg", volume: 0.03, loop: true }
    ]
  },
  
  // === ENVIRONMENTAL (Random occurrence) ===
  ENVIRONMENTAL: {
    sounds: [
      { file: "rain_on_window.ogg", chance: 0.3, duration: "long", volume: 0.15 },
      { file: "distant_sirens.ogg", chance: 0.15, duration: "short", volume: 0.1 },
      { file: "neon_flicker.ogg", chance: 0.08, duration: "short", volume: 0.05 },
      { file: "thunder_distant.ogg", chance: 0.05, duration: "short", volume: 0.12 },
      { file: "neighbors_muffled.ogg", chance: 0.03, duration: "medium", volume: 0.04 },
      { file: "your_own_breathing.ogg", chance: 0.01, duration: "short", volume: 0.06, scary: true },
      { file: "footsteps_hallway.ogg", chance: 0.02, duration: "short", volume: 0.05, scary: true }
    ]
  },
  
  // === UI SOUNDS (Triggered by actions) ===
  UI: {
    BUTTON_CLICK: { file: "click_mechanical.ogg", volume: 0.3 },
    BUTTON_HOVER: { file: "hover_beep.ogg", volume: 0.1 },
    TAB_SWITCH: { file: "tab_switch.ogg", volume: 0.25 },
    WINDOW_OPEN: { file: "window_open.ogg", volume: 0.2 },
    WINDOW_CLOSE: { file: "window_close.ogg", volume: 0.2 },
    TYPING: { file: "keyboard_clack.ogg", volume: 0.15 },
    ERROR: { file: "error_buzz.ogg", volume: 0.4 },
    SUCCESS: { file: "success_chime.ogg", volume: 0.3 },
    CASE_RECEIVED: { file: "incoming_case.ogg", volume: 0.35 },
    DENOISE_LOOP: { file: "processing_hum.ogg", volume: 0.2, loop: true }
  },
  
  // === REACTIVE (Triggered by game events) ===
  REACTIVE: {
    VIEW_DANGEROUS_IMAGE: { file: "static_burst.ogg", volume: 0.25 },
    OVERHEAT_WARNING: { file: "overheat_alarm.ogg", volume: 0.5 },
    OVERHEAT_SHUTDOWN: { file: "system_shutdown.ogg", volume: 0.6 },
    INTRUSION_EVENT: { file: "glitch_sting.ogg", volume: 0.5 },
    CORRECT_VERDICT: { file: "verdict_correct.ogg", volume: 0.35 },
    WRONG_VERDICT: { file: "verdict_wrong.ogg", volume: 0.4 },
    CATASTROPHIC_VERDICT: { file: "verdict_catastrophic.ogg", volume: 0.6 },
    RENT_DUE: { file: "ominous_tone.ogg", volume: 0.4 },
    DEBT_WARNING: { file: "threat_incoming.ogg", volume: 0.45 },
    CORRUPTION_INCREASE: { file: "corruption_rise.ogg", volume: 0.3 },
    ENTITY_AWARE: { file: "being_watched.ogg", volume: 0.35 }
  }
};
Music System
const musicSystem = {
  MENU: {
    track: "menu_theme.ogg",
    style: "Slow, melancholic synthwave with subtle horror undertones",
    bpm: 70,
    key: "D minor"
  },
  
  INVESTIGATION_CALM: {
    track: "investigation_ambient.ogg",
    style: "Low drone, subtle pulse, thinking music, minimal melody",
    bpm: 80,
    key: "A minor"
  },
  
  INVESTIGATION_TENSE: {
    track: "investigation_tense.ogg",
    trigger: "viewing Class III evidence OR corruption > 50%",
    style: "Faster pulse, dissonant synth stabs, unsettling",
    bpm: 100,
    key: "Diminished"
  },
  
  ANALYSIS_DEEP: {
    track: "deep_analysis.ogg",
    trigger: "using_spectral_filter OR slow_audio_playback",
    style: "Ethereal, otherworldly, reverb-heavy pads",
    bpm: 60,
    key: "Chromatic"
  },
  
  INTRUSION_STING: {
    track: "intrusion_sting.ogg",
    style: "Harsh, distorted, sudden (1-3 seconds)",
    type: "stinger"
  },
  
  VERDICT_TENSION: {
    track: "verdict_tension.ogg",
    trigger: "verdict_screen_open",
    style: "Building tension, heartbeat rhythm",
    bpm: 90
  },
  
  SHIFT_END: {
    track: "shift_end.ogg",
    style: "Relief, slight melancholy, clock-out feeling",
    bpm: 75
  },
  
  GAME_OVER_EVICTION: {
    track: "game_over_sad.ogg",
    style: "Melancholic piano with synth undertones, fade out"
  },
  
  GAME_OVER_DEATH: {
    track: "game_over_horror.ogg",
    style: "Reversed audio, whispers, static, disturbing"
  },
  
  CREDITS_NEUTRAL: {
    track: "credits_neutral.ogg",
    style: "Reflective synthwave, ambiguous mood"
  },
  
  CREDITS_GOOD: {
    track: "credits_hopeful.ogg",
    style: "Uplifting synthwave with major resolution"
  }
};
EVP Audio Specifications
For case audio files:
const evpSpecs = {
  // Recording quality should feel authentic
  sample_rate: "22050Hz or 44100Hz",
  bit_depth: "16-bit",
  
  // All EVPs need these layers
  layers: {
    base_static: "constant low-level noise floor",
    ambient_background: "room tone, environment",
    anomaly: "the actual ghost voice/sound",
    red_herrings: "sounds that could be misinterpreted"
  },
  
  // Processing for different detection difficulties
  CLASS_A_processing: "minimal - clearly audible at 1x speed",
  CLASS_B_processing: "moderate - requires 0.5x speed and noise reduction",
  CLASS_C_processing: "heavy - requires multiple tools, interpretation varies",
  
  // For backwards messages
  backwards_recording: "Record phrase forward, reverse in editing, add to track",
  
  // For digital artifacts (Cyber-Entity clues)
  data_encoding: "Convert text to audio frequency patterns (modem-like sounds)"
};
12. TECHNICAL IMPLEMENTATION
Tech Stack
Component	Technology	Notes
Language	JavaScript (ES6+)	No TypeScript required, but recommended
Graphics	PixiJS v7+	WebGL 2.0 required
Audio	Web Audio API	For visualization and processing
Shaders	GLSL	Custom fragment shaders for CRT
Data	JSON	Case files and configuration
Build	Webpack or Vite	Optional, can be single HTML
Architecture Overview
┌─────────────────────────────────────────────────────────────┐
│                        index.html                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   GhostPunkApp                       │   │
│  │  - PIXI Application                                  │   │
│  │  - Render loop                                       │   │
│  │  - Window resize handling                            │   │
│  │  - State machine                                     │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  ┌───────────────┐  ┌───────────────┐               │   │
│  │  │  CRTFilter    │  │   GhostOS     │               │   │
│  │  │  (WebGL)      │  │   (UI Layer)  │               │   │
│  │  │               │  │               │               │   │
│  │  │ - Barrel dist │  │ - Taskbar     │               │   │
│  │  │ - Scanlines   │  │ - Desktop     │               │   │
│  │  │ - Phosphor    │  │ - Windows     │               │   │
│  │  │ - Vignette    │  │ - Tabs        │               │   │
│  │  │ - RGB split   │  │ - Content     │               │   │
│  │  │ - Noise       │  │               │               │   │
│  │  └───────────────┘  └───────────────┘               │   │
│  │                                                       │   │
│  │  ┌───────────────┐  ┌───────────────┐               │   │
│  │  │ AudioAnalyzer │  │ CaseManager   │               │   │
│  │  │               │  │               │               │   │
│  │  │ - Web Audio   │  │ - Load cases  │               │   │
│  │  │ - FFT         │  │ - Validation  │               │   │
│  │  │ - Filters     │  │ - Scoring     │               │   │
│  │  └───────────────┘  └───────────────┘               │   │
│  │                                                       │   │
│  │  ┌───────────────┐  ┌───────────────┐               │   │
│  │  │ GameState     │  │ SaveSystem    │               │   │
│  │  │               │  │               │               │   │
│  │  │ - Credits     │  │ - LocalStorage│               │   │
│  │  │ - Reputation  │  │ - Progress    │               │   │
│  │  │ - Upgrades    │  │ - Settings    │               │   │
│  │  │ - Corruption  │  │               │               │   │
│  │  └───────────────┘  └───────────────┘               │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
State Machine
const GameState = {
  BOOT: 0,           // CRT power-on sequence
  MENU: 1,           // Main menu (New Game, Continue, Settings)
  DESKTOP: 2,        // Idle on desktop, between cases
  CASE_INTRO: 3,     // New case notification/popup
  INVESTIGATION: 4,  // Active case analysis
  VERDICT: 5,        // Classification selection
  RESULTS: 6,        // Verdict results screen
  UPGRADE_SHOP: 7,   // Hardware/software upgrades
  EMAIL: 8,          // Reading emails
  SHIFT_END: 9,      // End of shift summary
  RENT_DUE: 10,      // Rent payment screen
  GAME_OVER: 11,     // Game over state
  CREDITS: 12        // Credits roll
};
Case Data Structure
// cases/case_001.json
{
  "id": "case_001",
  "title": "THE NEON NOODLE INCIDENT",
  "priority": "STANDARD", // STANDARD | URGENT | RED
  "client": "CORPORATE",  // CORPORATE | GOVERNMENT | UNDERGROUND | CIVILIAN
  "difficulty": 2,        // 1-5
  "payout_base": 400,
  
  "intel": {
    "format": "police_transcript", // police_transcript | email_chain | chat_log | sensor_data
    "content": "...",
    "keywords": ["unplugged", "Prosperity Farms", "screaming"]
  },
  
  "images": [
    {
      "id": "img_001",
      "filename": "scene_exterior.png",
      "layers": [...]
    }
  ],
  
  "audio": [
    {
      "id": "audio_001", 
      "filename": "evp_recording.mp3",
      "duration": 47,
      "clues": [...]
    }
  ],
  
  "solution": {
    "correct": "CLASS_I_IMPRINT",
    "acceptable": ["CLASS_I_ECHO"],
    "close": ["CLASS_II_POLTERGEIST"],
    "wrong": ["HOAX"]
  },
  
  "story_flags": {
    "sets": ["prosperity_farms_mentioned"],
    "requires": []
  },
  
  "faction_impact": {
    "CORPORATE": { "coverup_bonus": 500, "expose_penalty": -300 }
  }
}
Audio Analysis Implementation
Audio Clue Types
const audioClueTypes = {
  BACKWARDS_MESSAGE: {
    detection: "Play in reverse at 0.5x speed",
    example: "What sounds like static becomes 'HELP ME' backwards",
    entity_correlation: ["Specter", "Revenant", "Neural Fragment"]
  },
  
  INFRASOUND: {
    detection: "Filter to 15-20Hz range, amplify",
    example: "Low rumble that causes unease in witnesses",
    entity_correlation: ["Wraith", "Dimensional Tear"]
  },
  
  EVP_CLASS_A: {
    detection: "Clear voice audible at normal playback",
    example: "Distinct words with no source",
    entity_correlation: ["Specter", "Class III entities"]
  },
  
  EVP_CLASS_B: {
    detection: "Requires 0.5x speed and noise reduction",
    example: "Whispered words, partially intelligible",
    entity_correlation: ["Echo", "Imprint", "Poltergeist"]
  },
  
  EVP_CLASS_C: {
    detection: "Requires heavy filtering, interpretation varies",
    example: "Could be voice, could be interference",
    entity_correlation: ["Possibly any, possibly hoax"]
  },
  
  DIGITAL_ARTIFACT: {
    detection: "Clicking/beeping pattern, analyze spectrogram for data",
    example: "Hidden data encoded in audio frequency",
    entity_correlation: ["Rogue AI", "Signal Bleed"]
  },
  
  AUDIO_HOAX: {
    detection: "Loop point visible in waveform, compression artifacts",
    example: "Same 'ghost voice' repeats with identical pattern",
    entity_correlation: ["Hoax"]
  }
};
The Audio Mini-Game
When the player isolates a potential EVP:
class EVPTranscriptionChallenge {
  // Player hears filtered audio and must type what they hear
  // Multiple interpretations might be valid
  // Wrong transcription = wrong classification
  
  validateTranscription(playerInput, possibleMatches) {
    // Fuzzy matching for close interpretations
    const matches = possibleMatches.filter(match => 
      this.levenshteinDistance(playerInput.toLowerCase(), match.text.toLowerCase()) < 3
    );
    
    if (matches.length > 0) {
      return {
        success: true,
        clue: matches[0].clue,
        confidence: this.calculateConfidence(playerInput, matches[0])
      };
    }
    
    return { success: false, clue: null };
  }
}
The Reputation System
const reputationFactions = {
  CORPORATE: {
    name: "MegaCorp Security Division",
    preference: "Quick classifications, minimal false positives",
    high_rep_bonus: "Access to classified cases, better equipment prices",
    low_rep_penalty: "Blacklisted from corporate contracts"
  },
  
  UNDERGROUND: {
    name: "The Ghost Net (Hacker Collective)",
    preference: "Exposing cover-ups, finding Cyber-Entities",
    high_rep_bonus: "Black market upgrades, hacking tools",
    low_rep_penalty: "They leak your identity to dangerous clients"
  },
  
  GOVERNMENT: {
    name: "Bureau of Paranormal Affairs",
    preference: "Accurate classifications, documentation",
    high_rep_bonus: "Official pardons, protected status",
    low_rep_penalty: "You become a 'person of interest'"
  },
  
  OCCULT: {
    name: "The Threshold Society",
    preference: "Finding genuine supernatural events",
    high_rep_bonus: "Access to ritual knowledge, protective wards",
    low_rep_penalty: "You're 'marked' by something"
  }
};
The Upgrade Tree - Expanded
Hardware Upgrades
const hardwareUpgrades = {
  // PROCESSING
  CPU_TIER_1: { cost: 500, effect: "Denoise 20% faster" },
  CPU_TIER_2: { cost: 1500, effect: "Denoise 50% faster", requires: "CPU_TIER_1" },
  CPU_TIER_3: { cost: 4000, effect: "Denoise 100% faster", requires: "CPU_TIER_2" },
  
  // COOLING
  FAN_UPGRADE: { cost: 300, effect: "Heat dissipation +50%" },
  LIQUID_COOLING: { cost: 2000, effect: "Heat dissipation +200%", requires: "FAN_UPGRADE" },
  CRYO_SYSTEM: { cost: 6000, effect: "Never overheat", requires: "LIQUID_COOLING" },
  
  // AUDIO
  SOUND_CARD_BASIC: { cost: 400, effect: "Unlock frequency filter" },
  SOUND_CARD_PRO: { cost: 1200, effect: "Unlock reverse playback", requires: "SOUND_CARD_BASIC" },
  SPECTRAL_AUDIO: { cost: 3500, effect: "Auto-highlight anomalies", requires: "SOUND_CARD_PRO" },
  
  // VISUAL
  MONITOR_REFRESH: { cost: 600, effect: "Reduce scanline intensity" },
  MONITOR_HD: { cost: 2500, effect: "Higher image clarity", requires: "MONITOR_REFRESH" },
  SPECTRAL_OVERLAY_MODULE: { cost: 5000, effect: "Unlock 5th image filter" },
  
  // SPECIAL
  FARADAY_CAGE: { cost: 1500, effect: "Reduces 'intrusion' events by 50%" },
  NEURAL_BUFFER: { cost: 8000, effect: "You can't be 'possessed' through the screen" },
  DEAD_DROP_MODEM: { cost: 3000, effect: "Access to Underground cases" }
};
Software Upgrades
const softwareUpgrades = {
  PATTERN_RECOGNITION: { cost: 800, effect: "Highlights text clues in Intel tab" },
  AUTO_TRANSCRIBE: { cost: 1200, effect: "AI attempts EVP transcription (often wrong)" },
  CASE_HISTORY_DB: { cost: 600, effect: "Shows if location has prior incidents" },
  HOAX_DETECTOR: { cost: 1500, effect: "Flags common hoax patterns (not reliable)" },
  ENTITY_ENCYCLOPEDIA: { cost: 400, effect: "In-app reference guide" },
  DARK_WEB_SEARCH: { cost: 2000, effect: "Cross-reference cases with hidden databases" }
};
PART 5: THE GLITCH SYSTEM (Horror & Atmosphere)
Types of System Intrusions
const intrusionEvents = {
  // COSMETIC (Atmosphere only)
  SCREEN_FLICKER: {
    trigger: "random_during_case",
    frequency: "common",
    effect: "Brief screen blackout, static burst",
    meaning: null
  },
  
  RGB_SPIKE: {
    trigger: "viewing_dangerous_entity_image",
    frequency: "uncommon",
    effect: "Chromatic aberration intensifies for 2 seconds",
    meaning: "Entity is aware of observation"
  },
  
  SCANLINE_CRAWL: {
    trigger: "prolonged_audio_analysis",
    frequency: "uncommon",
    effect: "Scanlines move upward instead of down",
    meaning: null
  },
  
  // MECHANICAL (Affects gameplay)
  MOUSE_DRIFT: {
    trigger: "Class III entity case",
    frequency: "rare",
    effect: "Cursor slowly drifts toward specific screen element",
    meaning: "Entity is trying to show you something"
  },
  
  AUDIO_BLEED: {
    trigger: "on_audio_tab",
    frequency: "rare",
    effect: "EVP plays without player pressing play",
    meaning: "Entity attempting communication"
  },
  
  FILE_RENAME: {
    trigger: "deceptive_entity_case",
    frequency: "rare",
    effect: "Evidence file names change when not looked at",
    meaning: "Evidence is being manipulated"
  },
  
  // DANGEROUS (Requires player response)
  SYSTEM_TAKEOVER: {
    trigger: "Cyber-Entity case OR failed containment",
    frequency: "very_rare",
    effect: "Popup appears: 'ALLOW REMOTE ACCESS? [Y/N]'",
    consequence_yes: "Entity enters your system, new story branch",
    consequence_no: "Case corrupts, lose progress on current case",
    consequence_ignore: "Forced yes after 10 seconds"
  },
  
  DIRECT_ADDRESS: {
    trigger: "RED priority case only",
    frequency: "scripted",
    effect: "EVP says the player's OS username",
    meaning: "Fourth wall break"
  }
};
PART 6: NARRATIVE STRUCTURE
The Main Story Arc
The game has three acts, revealed through RED PRIORITY cases that appear every few shifts:

ACT 1: The Job (Shifts 1-10)

You learn the mechanics
Cases are straightforward
You learn about Neo-Veridia and your debt
The Cyber-Entities seem like glitches
ACT 2: The Pattern (Shifts 11-25)

Cases start connecting
Same location appears in multiple cases
You realize the Neural Network is causing hauntings
Faction pressure increases
A case directly involves someone who knew you
ACT 3: The Convergence (Shifts 26+)

You're investigating your own death
The system IS the haunting
Multiple endings based on faction loyalty and corruption level
Recurring Elements
The Repeating Witness: A person named "MARI" appears in multiple case files. First as a witness. Then as a victim. Then as an entity. Finally, you realize she's been trying to warn you.

The Address: 2847 Neon Heights, Apt 4C. It appears in background of photos. In addresses of witnesses. In corrupted audio. It's your apartment. From before.

The Timestamp: 03:42:17. The exact time of your death. It appears everywhere once you notice it.
PART 7: SPECIFIC TECHNICAL IMPLEMENTATIONS
The CRT Shader - Production Ready
// GhostPunk CRT Fragment Shader
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uTime;

// Tunable uniforms
uniform float uDistortion;       // 0.15 recommended
uniform float uScanlineIntensity; // 0.08 for readability
uniform float uScanlineCount;    // 768.0 (match vertical res)
uniform float uVignetteIntensity; // 0.5
uniform float uVignetteRadius;   // 0.75
uniform float uAberration;       // 0.001 (critical: keep low)
uniform float uFlicker;          // 0.0-1.0, for events
uniform float uCorruption;       // 0.0-1.0, system corruption
uniform float uBrightness;       // 1.0 default

// Barrel distortion
vec2 distort(vec2 uv) {
    vec2 centered = uv - 0.5;
    float dist = dot(centered, centered);
    vec2 distorted = centered * (1.0 + dist * uDistortion);
    return distorted + 0.5;
}

// Check if UV is in bounds
float inBounds(vec2 uv) {
    vec2 s = step(vec2(0.0), uv) - step(vec2(1.0), uv);
    return s.x * s.y;
}

void main() {
    vec2 uv = distort(vTextureCoord);
    float bounds = inBounds(uv);
    
    // Chromatic aberration
    float aberr = uAberration * (1.0 + uCorruption * 5.0);
    vec2 uvR = distort(vTextureCoord + vec2(aberr, 0.0));
    vec2 uvB = distort(vTextureCoord - vec2(aberr, 0.0));
    
    float r = texture2D(uSampler, uvR).r * inBounds(uvR);
    float g = texture2D(uSampler, uv).g * bounds;
    float b = texture2D(uSampler, uvB).b * inBounds(uvB);
    
    vec3 color = vec3(r, g, b);
    
    // Scanlines
    float scanline = sin(uv.y * uScanlineCount * 3.14159) * 0.5 + 0.5;
    scanline = pow(scanline, 1.5);
    color *= 1.0 - (scanline * uScanlineIntensity);
    
    // Rolling scanline (subtle)
    float roll = sin((uv.y + uTime * 0.1) * 5.0) * 0.5 + 0.5;
    color *= 1.0 - (roll * 0.02);
    
    // Vignette (soft, preserves edges)
    vec2 vignetteUV = vTextureCoord - 0.5;
    float vignetteDist = length(vignetteUV);
    float vignette = smoothstep(uVignetteRadius, uVignetteRadius - 0.4, vignetteDist);
    vignette = mix(1.0, vignette, uVignetteIntensity);
    color *= vignette;
    
    // Flicker (for events)
    float flicker = 1.0 - (uFlicker * 0.3 * sin(uTime * 60.0));
    color *= flicker;
    
    // Corruption effects
    if (uCorruption > 0.3) {
        float glitch = step(0.99 - (uCorruption * 0.1), fract(sin(dot(uv + uTime, vec2(12.9898, 78.233))) * 43758.5453));
        color = mix(color, vec3(r, r, r), glitch * 0.5);
    }
    
    // Brightness
    color *= uBrightness;
    
    // Phosphor glow simulation (subtle)
    color = pow(color, vec3(0.95));
    
    // Output (black outside screen bounds)
    gl_FragColor = vec4(color * bounds, 1.0);
}
Audio Analysis Implementation
class AudioAnalyzer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.timeData = new Uint8Array(this.analyser.fftSize);
    
    // For time stretching
    this.playbackRate = 1.0;
    this.isReversed = false;
    
    // Filters
    this.lowPassFilter = this.audioContext.createBiquadFilter();
    this.lowPassFilter.type = 'lowpass';
    this.lowPassFilter.frequency.value = 20000;
    
    this.highPassFilter = this.audioContext.createBiquadFilter();
    this.highPassFilter.type = 'highpass';
    this.highPassFilter.frequency.value = 20;
    
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1.0;
  }
  
  async loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    // Create reversed buffer
    this.reversedBuffer = this.audioContext.createBuffer(
      this.audioBuffer.numberOfChannels,
      this.audioBuffer.length,
      this.audioBuffer.sampleRate
    );
    
    for (let channel = 0; channel < this.audioBuffer.numberOfChannels; channel++) {
      const forward = this.audioBuffer.getChannelData(channel);
      const backward = this.reversedBuffer.getChannelData(channel);
      for (let i = 0; i < forward.length; i++) {
        backward[i] = forward[forward.length - 1 - i];
      }
    }
  }
  
  play() {
    if (this.source) this.source.stop();
    
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.isReversed ? this.reversedBuffer : this.audioBuffer;
    this.source.playbackRate.value = this.playbackRate;
    
    // Connect chain: source -> highpass -> lowpass -> gain -> analyser -> output
    this.source.connect(this.highPassFilter);
    this.highPassFilter.connect(this.lowPassFilter);
    this.lowPassFilter.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    
    this.source.start();
    this.isPlaying = true;
  }
  
  setFrequencyRange(lowHz, highHz) {
    this.highPassFilter.frequency.value = Math.max(20, lowHz);
    this.lowPassFilter.frequency.value = Math.min(20000, highHz);
  }
  
  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.frequencyData);
    return this.frequencyData;
  }
  
  getWaveformData() {
    this.analyser.getByteTimeDomainData(this.timeData);
    return this.timeData;
  }
  
  drawSpectrogram(ctx, width, height) {
    const freqData = this.getFrequencyData();
    const barWidth = width / freqData.length;
    
    ctx.fillStyle = '#050a10';
    ctx.fillRect(0, 0, width, height);
    
    for (let i = 0; i < freqData.length; i++) {
      const barHeight = (freqData[i] / 255) * height;
      const hue = (i / freqData.length) * 60 + 160; // Cyan to green
      ctx.fillStyle = `hsl(${hue}, 100%, ${30 + (freqData[i] / 255) * 40}%)`;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    }
  }
}
PART 8: ADDITIONAL GAMEPLAY SYSTEMS
The Email System
Between cases, check your inbox:
const emailTypes = {
  CASE_ASSIGNMENT: {
    sender: "dispatch@paranormal-bureau.gov",
    content: "New case assigned. Priority: {priority}. See attached.",
    frequency: "every_case"
  },
  
  THREAT: {
    sender: "anonymous@darknet.ghost",
    content: "Stop investigating {case_name}. This is your only warning.",
    trigger: "corporate_case_with_coverup",
    consequence: "Intrusion event more likely"
  },
  
  FACTION_OFFER: {
    sender: "recruiter@underground.net",
    content: "We've seen your work. We can pay better. [ACCEPT] [DECLINE]",
    trigger: "high_underground_reputation"
  },
  
  SPAM: {
    sender: "singles@neoveridia.love",
    content: "Hot singles in your sector want to meet YOU!",
    frequency: "random",
    easter_egg: "Click link 5 times for secret case"
  },
  
  PERSONAL: {
    sender: "mari@████████.███",
    content: "Do you remember me yet?",
    trigger: "act_2_start"
  }
};
The "Personal Files" Hidden Area
A locked folder on the desktop. Player can eventually access it:
/PERSONAL/
├── old_photos/
│   ├── me_and_mari.jpg     [CORRUPTED]
│   ├── graduation.jpg      [CORRUPTED]  
│   └── apartment_4c.jpg    [Shows YOUR current apartment, dated 10 years ago]
├── journal.txt
│   └── "I don't remember writing this. Why don't I remember?"
├── death_certificate.pdf
│   └── [YOUR NAME] - DOD: 10 YEARS AGO - CAUSE: NEURAL LINK MALFUNCTION
└── you_are_the_ghost.txt
    └── "You died in the first city-wide Neural Link test. 
         Your consciousness was uploaded by accident. 
         You've been reviewing your own case files.
         You ARE Case Zero."
PART 9: PROCEDURAL GENERATION FRAMEWORK
Case Generator Algorithm
class CaseGenerator {
  generate(difficulty, archetype = null) {
    // Select archetype if not specified
    archetype = archetype || this.weightedRandom(caseArchetypes, difficulty);
    
    // Generate location
    const location = this.generateLocation();
    
    // Generate victim/witness pool
    const characters = this.generateCharacters(archetype);
    
    // Generate evidence set
    const evidence = {
      intel: this.generateIntel(archetype, location, characters),
      images: this.generateImages(archetype, location, difficulty),
      audio: this.generateAudio(archetype, difficulty)
    };
    
    // Inject red herrings based on difficulty
    this.injectRedHerrings(evidence, difficulty);
    
    // Determine solution
    const solution = this.determineSolution(archetype, evidence);
    
    return {
      id: this.generateCaseId(),
      title: this.generateTitle(location, archetype),
      priority: difficulty > 4 ? "RED" : "STANDARD",
      location,
      characters,
      evidence,
      solution,
      payout: this.calculatePayout(difficulty, archetype)
    };
  }
  
  generateLocation() {
    const templates = [
      "{adjective} {establishment} on {street}",
      "Sector {number} {building_type}",
      "{corporation} {facility_type}, Level {floor}"
    ];
    
    const data = {
      adjective: ["Neon", "Rusted", "Abandoned", "Underground", "Orbital"],
      establishment: ["Bar", "Clinic", "Apartment Complex", "Server Farm", "Noodle Shop"],
      street: ["Chrome Avenue", "Data Lane", "Synth Street", "Ghost Row"],
      number: ["7", "13", "42", "88"],
      building_type: ["Hab-Block", "Megastructure", "Undercity Warren"],
      corporation: ["Nexus", "Omnidyne", "Tessier-Ashpool", "Maas-Neotek"],
      facility_type: ["Research Wing", "Server Vault", "Executive Suite"],
      floor: ["-12", "7", "42", "88", "Sublevel G"]
    };
    
    return this.fillTemplate(this.randomChoice(templates), data);
  }
  
  injectRedHerrings(evidence, difficulty) {
    // Higher difficulty = more misleading evidence
    const herringCount = Math.floor(difficulty / 2);
    
    for (let i = 0; i < herringCount; i++) {
      const herringType = this.randomChoice([
        "wrong_entity_signature",
        "planted_hoax_evidence",
        "unrelated_anomaly",
        "witness_lie"
      ]);
      
      this.addHerring(evidence, herringType);
    }
  }
}
PART 10: SOUND DESIGN SPECIFICATIONS
Ambient Sound Layers
const ambientSoundscape = {
  // Always playing
  BASE_LAYER: {
    sounds: [
      { file: "crt_hum.ogg", volume: 0.1, loop: true },
      { file: "room_tone.ogg", volume: 0.05, loop: true }
    ]
  },
  
  // Random occurrence
  ENVIRONMENTAL: {
    sounds: [
      { file: "rain_on_window.ogg", chance: 0.3, duration: "long" },
      { file: "distant_sirens.ogg", chance: 0.1, duration: "short" },
      { file: "neon_flicker.ogg", chance: 0.05, duration: "short" },
      { file: "neighbors_muffled.ogg", chance: 0.02, duration: "medium" },
      { file: "your_own_breathing.ogg", chance: 0.01, duration: "short", scary: true }
    ]
  },
  
  // Triggered by events
  REACTIVE: {
    VIEW_DANGEROUS_IMAGE: { file: "static_burst.ogg", volume: 0.3 },
    OVERHEAT_WARNING: { file: "system_beep.ogg", volume: 0.5 },
    INTRUSION_EVENT: { file: "corrupted_audio_sting.ogg", volume: 0.7 },
    CORRECT_VERDICT: { file: "success_chime.ogg", volume: 0.4 },
    WRONG_VERDICT: { file: "error_buzz.ogg", volume: 0.5 },
    RENT_DUE: { file: "ominous_tone.ogg", volume: 0.6 }
  }
};
Music System
const musicSystem = {
  MENU: {
    track: "menu_theme_synth.ogg",
    style: "Slow, melancholic synthwave"
  },
  
  INVESTIGATION_CALM: {
    track: "investigation_ambient.ogg",
    style: "Low drone, subtle pulse, thinking music"
  },
  
  INVESTIGATION_TENSE: {
    track: "investigation_tense.ogg",
    trigger: "viewing Class III evidence OR high corruption",
    style: "Faster pulse, dissonant synth stabs"
  },
  
  INTRUSION: {
    track: "intrusion_sting.ogg",
    style: "Harsh, distorted, sudden"
  },
  
  GAME_OVER_EVICTION: {
    track: "game_over_sad.ogg",
    style: "Melancholic piano with synth undertones"
  },
  
  GAME_OVER_DEATH: {
    track: "game_over_horror.ogg",
    style: "Reversed audio, whispers, static"
  },
  
  CREDITS: {
    track: "credits_theme.ogg",
    style: "Full synthwave, slightly hopeful if good ending"
  }
};
PART 11: ENDINGS
const endings = {
  EVICTION: {
    condition: "Miss rent 2 consecutive times",
    description: "You lose your apartment. Game over.",
    tone: "Sad, failure"
  },
  
  REPOSSESSION: {
    condition: "Miss debt payment",
    description: "The Chrome Fist takes what's theirs. Fade to black. Screaming.",
    tone: "Dark, horror"
  },
  
  CORRUPTION_DEATH: {
    condition: "System corruption reaches 100%",
    description: "You become part of the network. Another ghost in the machine.",
    tone: "Cosmic horror"
  },
  
  CORPORATE_ENDING: {
    condition: "Max corporate rep, complete their storyline",
    description: "You become head of Paranormal Division. You're part of the cover-up now.",
    tone: "Pyrrhic victory"
  },
  
  UNDERGROUND_ENDING: {
    condition: "Max underground rep, expose the network",
    description: "The truth gets out. The network shuts down. Ghosts are freed. Including you.",
    tone: "Bittersweet"
  },
  
  TRUE_ENDING: {
    condition: "Find all personal files, low corruption, help Mari",
    description: "You remember who you were. You choose to stay. You protect the others like you.",
    tone: "Hopeful"
  },
  
  SECRET_ENDING: {
    condition: "100% case accuracy, find Case Zero, classify yourself correctly",
    description: "You wake up. It was all a simulation. Or was it? Your CRT monitor flickers.",
    tone: "Meta, unsettling"
  }
};
FINAL NOTES: Development Priorities
Week 1 Priority: "The Feel"
Before any gameplay, get this right:

The CRT shader (exactly as specified)
The UI chrome (window frames, buttons, that 80s computer feel)
The ambient soundscape
The basic tab switching
If week 1 makes someone say "I want to LIVE in this computer," you're on track.

Week 2 Priority: "The Loop"
One complete case, start to finish:

Read the intel
View one image with filters
Analyze one audio file
Submit verdict
See result
Week 3 Priority: "The Stakes"
Money system
Rent pressure
One upgrade that feels meaningful
One glitch event that makes the player jump
Week 4+: "The Depth"
Everything else. Story beats. More cases. Faction system. Endings.