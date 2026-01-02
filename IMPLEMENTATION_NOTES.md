# GhostPunk Implementation Notes

## Credits Formula (IMPLEMENTED)
**Formula**: `finalCredits = round(payout_base * tierMultiplier * confidenceMultiplier) + tierFlatBonus`

### Verdict Tiers
- **PERFECT_CLASSIFICATION**: multiplier 1.0, flatBonus +200
- **ADJACENT_CLASSIFICATION**: multiplier 0.4, flatBonus 0
- **SAFE_ERROR**: multiplier 0.0, flatBonus 0
- **DANGEROUS_ERROR**: multiplier -0.3, flatBonus 0
- **WRONG_CLASSIFICATION**: multiplier -0.2, flatBonus -50

### Example Calculations
- Case payout_base: 500₵
- Perfect match: `round(500 * 1.0 * 1.0) + 200 = 700₵`
- Adjacent class: `round(500 * 0.4 * 1.0) + 0 = 200₵`
- Dangerous error: `round(500 * -0.3 * 1.0) + 0 = -150₵`

**Location**: `src/systems/VerdictManager.js` lines 13-20, 70-73

---

## Entity Signature System (IMPLEMENTED)
Ensures procedurally generated cases are solvable by mapping required/forbidden clues to classifications.

### Signature Structure
```javascript
{
  name: 'Entity Type',
  correctClassification: 'CLASS_I|CLASS_II|CLASS_III|HOAX',
  requiredClues: [],      // Must appear in evidence
  forbiddenClues: [],     // Must NOT appear
  commonClues: [],        // Usually appear
  commonRedHerrings: [],  // Misleading clues
  minCluesRequired: 2     // Minimum total clues
}
```

### Validation
`validateCaseSolvability()` checks:
1. All required clues present
2. No forbidden clues present
3. Minimum clue count met

**Location**: `src/systems/EntitySignatures.js`

---

## CRT Shader Fixes (IMPLEMENTED)

### Bug Fix: Scanline Count
**Problem**: Used π (3.14159) instead of 2π, producing half the scanlines
**Fix**: Changed to `sin(scanlineY * 6.28318530718)` (2π)
**Location**: `src/shaders/CRTFilter.js` line 159

### Already Implemented
- ✅ Rounded corners (screenMask function with roundBox)
- ✅ Phosphor mask (RGB triad pattern)
- ✅ Barrel distortion
- ✅ Vignette
- ✅ Chromatic aberration

---

## Design Recommendations (NOT YET IMPLEMENTED)

### 1. Confidence Multiplier System
**Status**: Placeholder in VerdictManager.evaluateVerdict()
**TODO**: Implement confidence UI where player can adjust their certainty
- High confidence (1.2x): Risk more credits on being right
- Medium confidence (1.0x): Default
- Low confidence (0.7x): Safer but lower payout

### 2. Corrupted Evidence System
**Recommendation**: Instead of unsolvable trap cases, implement:
- One tab shows "CORRUPTED DATA" warning
- Player must cross-reference other evidence types
- Small penalty for quarantining corrupted evidence vs. using it

### 3. Case Generation Improvements Needed
- Add more clue type variations
- Implement asset pool system for images
- Create audio clip library with actual EVP samples
- Add difficulty scaling (more red herrings at higher difficulty)

---

## Week 1-3 MVP Priorities

### Week 1: "The Feel" ✅ MOSTLY COMPLETE
- [x] CRT filter stack (barrel, vignette, scanlines, RGB split, corners, phosphor)
- [ ] Boot sequence with user gesture for audio
- [x] Window chrome + tab switching
- [x] Desktop icons (clickable but not fully functional)

### Week 2: "The Loop" 🔄 IN PROGRESS
- [x] Case JSON structure
- [x] Intel rendering with keywords
- [x] Visuals tab with filters + denoise mechanic
- [ ] Audio waveform/spectrogram
- [x] Verdict screen + results
- [ ] Case progression (load next case)

### Week 3: "The Stakes" ⏳ PENDING
- [ ] Shift timer
- [ ] Case quota tracking
- [ ] Rent due screen
- [ ] Failure state (eviction)
- [ ] Upgrades affecting mechanics
- [ ] Intrusion events

---

## Technical Debt & Known Issues

1. **No actual image assets**: ImageViewer creates placeholder graphics
2. **No audio system**: Audio tab is UI-only mockup
3. **Case progression**: Results screen "Continue" button doesn't load next case
4. **No persistence**: Player state resets on refresh
5. **Desktop icons**: Only open main window, no actual apps

---

## Web Platform Considerations

### Audio Autoplay Policy
Browsers require user gesture before playing audio. Solution:
```javascript
// On boot screen click
audioContext.resume().then(() => {
  // Start ambient audio
});
```

### Asset Format Recommendations
- **Music/Ambience**: OGG (with AAC/MP4 fallback for Safari)
- **Images**: PNG for UI, WebP for photos (with PNG fallback)
- **Fonts**: WOFF2 (already using web fonts)

### Performance Notes
- CRT filter is GPU-intensive (acceptable for desktop, may struggle on mobile)
- Consider reducing filter complexity on low-end devices
- Use texture atlases for UI elements to reduce draw calls

---

## Code Quality Notes

### Good Practices Implemented
- ✅ Modular ES6 architecture
- ✅ Clear separation of concerns (systems, UI, shaders)
- ✅ Explicit credit formula with documentation
- ✅ Validation system for procedural generation
- ✅ Event-driven UI with proper hit areas

### Areas for Improvement
- Add TypeScript for type safety
- Implement proper state management (Redux/MobX)
- Add unit tests for VerdictManager scoring
- Create integration tests for case generation
- Add error boundaries for graceful degradation
