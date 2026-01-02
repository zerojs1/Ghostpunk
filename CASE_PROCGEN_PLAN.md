# GhostPunk Procedural Case Generation Plan

Version: 0.1 (draft)
Owner: Cascade

---

## Objectives
- Procedurally generate replayable cases that are always solvable and align with GhostPunk’s lore and UI.
- Cover all case elements: text (intel, titles, summaries), metadata (status/type/category, client, payout, difficulty), reputation/faction effects, images (base + layered overlays), audio (clips + anomalies metadata).
- Support two content pipelines:
  - Runtime generation (deterministic, seed-based) for instant variety.
  - Offline batch generation (optionally AI-assisted) to produce curated JSON case pools.
- Provide a manual fallback workflow: generate all text/metadata first to JSON, then author images/audio later without breaking the schema.

---

## What already exists (in repo)
- Case scaffolding and runtime generator:
  - `src/systems/CaseGenerator.js` – archetypes, intel templates, basic image/audio metadata.
  - `src/systems/EntitySignatures.js` – required/forbidden/common clues; `validateCaseSolvability()`.
  - `src/systems/CaseManager.js` – keeps a list of cases; currently generates 5 on load.
  - `src/systems/VerdictManager.js` – credit and reputation outcomes by verdict tier.
- UI surfaces: Intel (text), Visuals (image with filters + denoise), Audio (UI stub).

Gaps to address:
- Richer text variety; multi-paragraph intel entries; client/priority/faction hooks.
- Concrete image/audio asset pools and layer/anomaly mappings.
- Export/import of cases as JSON for curation.
- Reputation/faction impact authored per case (not only derived from verdict tier).

---

## Target Case JSON Schema (authoritative)
```json
{
  "id": "CASE_4821",
  "seed": 1735852625,
  "title": "THE NEON NOODLE INCIDENT",
  "archetype": "INTELLIGENT",
  "difficulty": 3,
  "client": "CORPORATE|GOVERNMENT|UNDERGROUND|CIVILIAN",
  "priority": "STANDARD|URGENT|RED",
  "payout_base": 500,
  "time_limit_minutes": 0,
  "correctClassification": "CLASS_I|CLASS_II|CLASS_III|HOAX",
  "factionImpact": { "CORPORATE": 2, "UNDERGROUND": -1, "GOVERNMENT": 1, "OCCULT": 0 },
  "tags": ["restaurant", "equipment_glitch"],

  "intel": {
    "format": "police_report|witness_interview|system_log|historical_record|chat_transcript",
    "content": ["[INCIDENT REPORT #4387]", "LOCATION: ...", "SUMMARY: ..."],
    "keywords": ["wire", "EVP", "loop"],
    "clues": ["evp_class_b", "object_manipulation"]
  },

  "images": [
    {
      "id": "img_201",
      "filename": "apartment_01.png",
      "layers": [
        {
          "asset": "shadow_figure.png",
          "visible_in": ["NIGHT_VISION"],
          "noise_threshold": 0.4,
          "clue_type": "shadow_figure"
        },
        {
          "asset": "wire_glint.png",
          "visible_in": ["NIGHT_VISION"],
          "noise_threshold": 0.2,
          "clue_type": "fishing_wire"
        }
      ]
    }
  ],

  "audio": {
    "id": "audio_77",
    "filename": "evp_recording_01.mp3",
    "duration": 45,
    "anomalies": [
      { "type": "evp_class_b", "frequency": "mid", "detection": "reverse" },
      { "type": "digital_artifact", "frequency": "high", "detection": "spectrogram" }
    ]
  }
}
```
Notes:
- `content` in intel supports an array (multi-line), or a single string; UI should render gracefully.
- `factionImpact` values are authored per case and applied on verdict resolution in addition to tier outcomes (see below).

---

## Generation Strategy

### A. Deterministic Runtime Generation (seeded)
- Inputs: `(seed, desiredDifficulty, optionalClient/priority)`.
- Steps:
  1. Select an archetype near difficulty.
  2. Select an `EntitySignature` valid for the archetype.
  3. Compose a location and title from weighted corpora.
  4. Generate intel using style-specific templates; inject signature-driven clues and keywords.
  5. Choose a base image and create 1–3 overlay layers mapping clues→assets and filters.
  6. Select 1–2 audio anomalies consistent with signature.
  7. Author `client`, `priority`, `time_limit_minutes`, `payout_base` from difficulty/client tables.
  8. Validate with `validateCaseSolvability`.
- Add authoring knobs (weights per archetype, red herring density by difficulty).

### B. Offline Batch Generation (AI-assisted, optional)
- Use an offline script to generate N seeds and produce case JSON files in `cases/generated/`.
- Two variants:
  - Template-driven (no network): richer corpora, Markov-chains/grammars for intel.
  - AI-assisted: feed archetype + signatures to an LLM to draft intel paragraphs and keywords; programmatically post-process to respect schema & solvability.
- Human curation pass: rename titles, tweak intel, set `factionImpact`, then attach/author image overlays and audio files to match clues.

---

## Images & Layers
- Base images: curated pool (e.g., `apartment_01.png`, `office_01.png`, `alley_01.png`).
- Overlays: per `ClueTypes` mapping → asset file; also map to revealing filters:
  - `RITUAL_MARKS` → `ritual_circle_uv.png` → `UV_SPECTRUM`
  - `APPARITION` → `apparition_thermal.png` → `THERMAL`
  - `SHADOW_FIGURE` → `shadow_figure.png` → `NIGHT_VISION`
  - `FISHING_WIRE` → `wire_glint.png` → `NIGHT_VISION`
  - `PROJECTION_DEVICE` → `projector_heat.png` → `THERMAL`
- Authoring rule: ensure at least one required clue from signature appears among overlays; add 0–2 common overlays as space allows.
- Manual path: when only text JSON exists, an artist can later pick `filename` and add overlay `layers` that match the authored clues.

## Audio & Anomalies
- Library-based approach: a pool of dry clips (loopable ambience, room tone) + EVP/FX library.
- Anomaly metadata (already supported): `{type, frequency, detection}`.
- Manual path: once text JSON exists, audio designer produces `filename` and fills `anomalies` to match signature clues.

---

## Reputation & Credits
- Keep existing `VerdictManager` tier math.
- Add authored `factionImpact` per case; apply on result:
  - On perfect/adjacent classifications: add listed deltas.
  - On wrong/dangerous: invert or dampen deltas (configurable table in `VerdictManager` or a new `ReputationSystem`).

---

## Import/Export Workflows

### 1) Runtime JSON import (for playing curated pools)
- Load all `cases/generated/*.json` on boot; randomize or select by seed/difficulty.
- `CaseManager.loadCases()` should first try JSON files; fall back to runtime generation.

### 2) Offline export (batch)
- Node script `tools/generate_cases.mjs`:
  - Imports `CaseGenerator` (or a copy in tools) and `fs`.
  - Args: `--count 50 --difficulty 1..5 --seed 12345`.
  - Writes validated cases to `cases/generated/CASE_XXXX.json`.
- Browser fallback (no Node): in a debug menu, call `CaseGenerator.generate()` N times and `download()` each JSON (data URL) – for quick iteration.

---

## Manual-First Authoring Workflow (fallback)
1. Batch-generate text-only cases (titles, intel, classification, metadata) → JSON.
2. Curate in an editor: adjust `title`, `client`, `priority`, `factionImpact`, keywords.
3. Assign `images[].filename` and add `layers[]` overlays to match clues.
4. Produce audio files; set `audio.filename` and `anomalies` types.
5. Place assets under `assets/images/` and `assets/audio/` following the filenames referenced.
6. Switch CaseManager to import from `cases/generated/`.

### File/Folder conventions
- `cases/generated/CASE_*.json`
- `assets/images/base/` for base scenes
- `assets/images/overlays/` for clue overlays (use exact filenames in schema)
- `assets/audio/` for EVP/ambient/audio clips

---

## Immediate Implementation Plan
- Phase 1 (runtime, 0.5–1 day)
  - Expand `CaseGenerator` corpora and templates (multi-line intel; per-archetype keywords).
  - Add `client`, `priority`, `time_limit_minutes`, `factionImpact`, `tags` to output.
  - Add `seed` and enforce deterministic RNG per case.
  - Add import path in `CaseManager` for JSON files if present; else generate.
- Phase 2 (export, 0.5 day)
  - Add `downloadCaseJSON(case)` helper (browser) and a debug hook to export N cases.
  - Optionally add Node `tools/generate_cases.mjs` for batch export.
- Phase 3 (assets, 1–2 days)
  - Define base image pool and overlay assets; finalize mapping table (already partly in code).
  - Add real audio library and example anomaly clips.
- Phase 4 (reputation tuning, 0.5 day)
  - Apply `factionImpact` during verdict results with outcome-based multipliers.

---

## Example: Generated Case (text-first, ready for manual assets)
```json
{
  "id": "CASE_5742",
  "seed": 9021031,
  "title": "FILE: NEON APARTMENT ON GHOST ROW",
  "archetype": "INTELLIGENT",
  "difficulty": 3,
  "client": "GOVERNMENT",
  "priority": "STANDARD",
  "payout_base": 550,
  "time_limit_minutes": 0,
  "correctClassification": "CLASS_II",
  "factionImpact": { "GOVERNMENT": 2, "CORPORATE": 0, "UNDERGROUND": 1, "OCCULT": 0 },
  "tags": ["apartment", "evp"],
  "intel": {
    "format": "police_report",
    "content": [
      "[INCIDENT REPORT #3947]",
      "LOCATION: Neon Apartment on Ghost Row",
      "OFFICER: K. Deckard",
      "SUMMARY: Multiple reports of intelligent entity activity. Witnesses claim to hear human-like screaming."
    ],
    "keywords": ["responded", "object movement", "EVP"],
    "clues": ["direct_response", "object_manipulation", "evp_class_a"]
  },
  "images": [
    {
      "id": "img_901",
      "filename": "apartment_01.png",
      "layers": []
    }
  ],
  "audio": {
    "id": "audio_133",
    "filename": "evp_recording_01.mp3",
    "duration": 45,
    "anomalies": [
      { "type": "evp_class_a", "frequency": "mid", "detection": "reverse" }
    ]
  }
}
```
This can be loaded immediately (placeholders shown if assets are missing). Artists then add image `layers` and audio details.

---

## AI-Assisted Batch Plan (optional)
- Prompt an LLM with: `(archetype, signature.requiredClues, location seed, faction levers)` to draft:
  - Title, intel paragraphs, keywords, red herrings hints.
- Post-process:
  - Clamp to schema fields, cap lengths, enforce solvability via `validateCaseSolvability()`.
  - Reject outputs that violate forbidden clues.
- Save to `cases/generated/*.json` for review.

---

## Acceptance Criteria
- A case JSON validates with `validateCaseSolvability()`.
- Each case contains at least one required clue across intel/images/audio.
- UI can render intel content (multi-line), placeholder visuals, and audio metadata without errors.
- Cases load from JSON when present; otherwise fall back to runtime generation.

---

## Next Steps (what I can implement next)
- Add `seed`, `client`, `priority`, `factionImpact` to `CaseGenerator` output.
- Add `downloadCaseJSON(cases[])` helper and a temporary hotkey to export N generated cases from the browser as a zip (or individual files).
- Optional: create `tools/generate_cases.mjs` Node script that writes JSON files to `cases/generated/` using the same generation logic.
