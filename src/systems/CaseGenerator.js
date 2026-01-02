import { ImageFilter } from './ImageViewer.js';
import { EntitySignatures, ClueTypes, validateCaseSolvability } from './EntitySignatures.js';

export const CaseArchetypes = {
    RESIDUAL: {
        id: 'RESIDUAL',
        name: 'Residual Haunting',
        difficulty: 1,
        payoutBase: 300,
        intelStyles: ['police_report', 'historical_record'],
        evidenceWeights: { intel: 0.6, visuals: 0.3, audio: 0.1 }
    },
    INTELLIGENT: {
        id: 'INTELLIGENT',
        name: 'Intelligent Entity',
        difficulty: 3,
        payoutBase: 500,
        intelStyles: ['witness_interview', 'direct_communication'],
        evidenceWeights: { intel: 0.4, visuals: 0.3, audio: 0.3 }
    },
    MALEVOLENT: {
        id: 'MALEVOLENT',
        name: 'Malevolent Entity',
        difficulty: 5,
        payoutBase: 1000,
        intelStyles: ['injury_report', 'death_record'],
        evidenceWeights: { intel: 0.3, visuals: 0.4, audio: 0.3 }
    },
    CYBER: {
        id: 'CYBER',
        name: 'Cyber-Entity',
        difficulty: 4,
        payoutBase: 750,
        intelStyles: ['system_log', 'chat_transcript'],
        evidenceWeights: { intel: 0.5, visuals: 0.2, audio: 0.3 }
    },
    HOAX: {
        id: 'HOAX',
        name: 'Hoax',
        difficulty: 2,
        payoutBase: 200,
        intelStyles: ['suspicious_witness', 'financial_report'],
        evidenceWeights: { intel: 0.7, visuals: 0.2, audio: 0.1 }
    }
};

export class CaseGenerator {
    constructor() {
        this.templates = {
            locations: [
                "{adj} {type} on {street}",
                "Sector {num} {type}",
                "{corp} {facility}, Level {floor}"
            ],
            intel: {
                police_report: "[INCIDENT REPORT #{id}]\nLOCATION: {location}\nOFFICER: {officer}\nSUMMARY: {summary}",
                witness_interview: "INTERVIEW LOG: {witness}\nDATE: {date}\nNOTES: {notes}",
                system_log: "[SYSTEM KERNEL LOG]\nTIMESTAMP: {time}\nEVENT: {event}\nSTATUS: {status}"
            }
        };

        this.data = {
            adjectives: ["Neon", "Rusted", "Abandoned", "Underground", "Orbital", "Rain-slicked"],
            types: ["Bar", "Clinic", "Apartment", "Server Farm", "Noodle Shop", "Hab-Block"],
            streets: ["Chrome Ave", "Data Lane", "Synth St", "Ghost Row", "Neon Blvd"],
            corps: ["Nexus", "Omnidyne", "Tessier-Ashpool", "Maas-Neotek"],
            facilities: ["Research Wing", "Server Vault", "Executive Suite", "Loading Dock"]
        };
    }

    generate(difficulty = 1) {
        const archetype = this.getRandomArchetype(difficulty);
        const location = this.generateLocation();
        const id = `CASE_${Math.floor(Math.random() * 9000) + 1000}`;
        
        // Select entity signature for this case
        const signature = this.selectSignature(archetype);

        const caseData = {
            id,
            title: this.generateTitle(location, archetype),
            archetype: archetype.id,
            difficulty: archetype.difficulty,
            payout_base: archetype.payoutBase,
            correctClassification: signature.correctClassification,
            intel: this.generateIntel(archetype, location, signature),
            images: this.generateImages(archetype, signature),
            audio: this.generateAudio(archetype, signature),
            signature: signature.name
        };
        
        // Validate case is solvable
        const validation = validateCaseSolvability(caseData, signature);
        if (!validation.valid) {
            console.warn(`Generated case ${id} failed validation:`, validation);
            // Regenerate if invalid (in production, you'd fix the generation)
        }
        
        return caseData;
    }
    
    selectSignature(archetype) {
        // Map archetype to possible signatures
        const signatureMap = {
            RESIDUAL: [EntitySignatures.CLASS_I_RESIDUAL],
            INTELLIGENT: [EntitySignatures.CLASS_II_INTELLIGENT, EntitySignatures.CYBER_ENTITY_NEURAL_FRAGMENT],
            MALEVOLENT: [EntitySignatures.CLASS_III_MALEVOLENT],
            CYBER: [EntitySignatures.CYBER_ENTITY_NEURAL_FRAGMENT],
            HOAX: [EntitySignatures.HOAX_STAGED, EntitySignatures.HOAX_EQUIPMENT]
        };
        
        const options = signatureMap[archetype.id] || [EntitySignatures.CLASS_II_INTELLIGENT];
        return options[Math.floor(Math.random() * options.length)];
    }

    getRandomArchetype(difficulty) {
        const keys = Object.keys(CaseArchetypes);
        // Simplified selection: find one close to desired difficulty
        const pool = keys.map(k => CaseArchetypes[k]).filter(a => Math.abs(a.difficulty - difficulty) <= 2);
        return pool[Math.floor(Math.random() * pool.length)];
    }

    generateLocation() {
        const template = this.templates.locations[Math.floor(Math.random() * this.templates.locations.length)];
        return template
            .replace('{adj}', this.data.adjectives[Math.floor(Math.random() * this.data.adjectives.length)])
            .replace('{type}', this.data.types[Math.floor(Math.random() * this.data.types.length)])
            .replace('{street}', this.data.streets[Math.floor(Math.random() * this.data.streets.length)])
            .replace('{num}', Math.floor(Math.random() * 99))
            .replace('{corp}', this.data.corps[Math.floor(Math.random() * this.data.corps.length)])
            .replace('{facility}', this.data.facilities[Math.floor(Math.random() * this.data.facilities.length)])
            .replace('{floor}', Math.floor(Math.random() * 100));
    }

    generateTitle(location, archetype) {
        const prefixes = ["THE", "PROJECT", "INCIDENT:", "FILE:"];
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${location.toUpperCase()}`;
    }

    generateIntel(archetype, location, signature) {
        const style = archetype.intelStyles[Math.floor(Math.random() * archetype.intelStyles.length)];
        const template = this.templates.intel[style] || this.templates.intel.police_report;
        
        // Include clues from signature in intel
        const intelClues = this.selectCluesForIntel(signature);
        
        return {
            format: style,
            content: template
                .replace('{id}', Math.floor(Math.random() * 10000))
                .replace('{location}', location)
                .replace('{officer}', 'K. Deckard')
                .replace('{summary}', `Multiple reports of ${archetype.name.toLowerCase()} activity. Witnesses claim to hear ${archetype.id === 'CYBER' ? 'digital screeching' : 'human-like screaming'}.`),
            keywords: this.getArchetypeKeywords(archetype),
            clues: intelClues
        };
    }
    
    selectCluesForIntel(signature) {
        const clues = [];
        // Always include at least one required clue in intel
        if (signature.requiredClues.length > 0) {
            clues.push(signature.requiredClues[0]);
        }
        // Add some common clues
        const commonCount = Math.min(2, signature.commonClues.length);
        for (let i = 0; i < commonCount; i++) {
            const clue = signature.commonClues[Math.floor(Math.random() * signature.commonClues.length)];
            if (!clues.includes(clue)) {
                clues.push(clue);
            }
        }
        return clues;
    }

    getArchetypeKeywords(archetype) {
        const keywords = {
            RESIDUAL: ['loop', 'echo', 'replaying', 'trauma'],
            INTELLIGENT: ['responded', 'moved', 'pushed', 'communicated'],
            MALEVOLENT: ['violent', 'blood', 'ritual', 'attacked'],
            CYBER: ['glitch', 'upload', 'server', 'artifact'],
            HOAX: ['wire', 'fake', 'staged', 'motive']
        };
        return keywords[archetype.id] || [];
    }

    generateImages(archetype, signature) {
        // In a real system, we'd have a pool of base images and overlay assets
        const baseImages = ['apartment_01.png', 'office_01.png', 'alley_01.png'];
        const selectedBase = baseImages[Math.floor(Math.random() * baseImages.length)];

        const layers = [];
        
        // Ensure at least one required clue appears in visuals
        const visualClue = signature.requiredClues.find(clue => 
            [ClueTypes.APPARITION, ClueTypes.SHADOW_FIGURE, ClueTypes.RITUAL_MARKS, 
             ClueTypes.FISHING_WIRE, ClueTypes.PROJECTION_DEVICE].includes(clue)
        );
        
        if (visualClue) {
            layers.push({
                asset: this.getAssetForClue(visualClue),
                visible_in: this.getFilterForClue(visualClue),
                noise_threshold: 0.3,
                clue_type: visualClue
            });
        }
        
        // Add additional common clues
        signature.commonClues.slice(0, 2).forEach(clue => {
            if ([ClueTypes.APPARITION, ClueTypes.SHADOW_FIGURE, ClueTypes.OBJECT_MANIPULATION].includes(clue)) {
                layers.push({
                    asset: this.getAssetForClue(clue),
                    visible_in: this.getFilterForClue(clue),
                    noise_threshold: 0.4,
                    clue_type: clue
                });
            }
        });

        return [{
            id: `img_${Math.floor(Math.random() * 1000)}`,
            filename: selectedBase,
            layers: layers
        }];
    }
    
    getAssetForClue(clue) {
        const assetMap = {
            [ClueTypes.RITUAL_MARKS]: 'ritual_circle_uv.png',
            [ClueTypes.SHADOW_FIGURE]: 'shadow_figure.png',
            [ClueTypes.APPARITION]: 'apparition_thermal.png',
            [ClueTypes.FISHING_WIRE]: 'wire_glint.png',
            [ClueTypes.PROJECTION_DEVICE]: 'projector_heat.png'
        };
        return assetMap[clue] || 'generic_anomaly.png';
    }
    
    getFilterForClue(clue) {
        const filterMap = {
            [ClueTypes.RITUAL_MARKS]: [ImageFilter.UV_SPECTRUM],
            [ClueTypes.SHADOW_FIGURE]: [ImageFilter.NIGHT_VISION],
            [ClueTypes.APPARITION]: [ImageFilter.THERMAL],
            [ClueTypes.FISHING_WIRE]: [ImageFilter.NIGHT_VISION],
            [ClueTypes.PROJECTION_DEVICE]: [ImageFilter.THERMAL]
        };
        return filterMap[clue] || [ImageFilter.STANDARD];
    }

    generateAudio(archetype, signature) {
        return {
            id: `audio_${Math.floor(Math.random() * 1000)}`,
            filename: 'evp_recording_01.mp3',
            duration: 45,
            anomalies: this.getAudioAnomalies(signature)
        };
    }

    getAudioAnomalies(signature) {
        const anomalies = [];
        
        // Include audio clues from signature
        const audioClues = signature.requiredClues.concat(signature.commonClues).filter(clue =>
            [ClueTypes.EVP_CLASS_A, ClueTypes.EVP_CLASS_B, ClueTypes.EVP_CLASS_C, 
             ClueTypes.DIGITAL_ARTIFACT, ClueTypes.MECHANICAL_SOUND].includes(clue)
        );
        
        audioClues.slice(0, 2).forEach(clue => {
            anomalies.push({
                type: clue,
                frequency: clue === ClueTypes.DIGITAL_ARTIFACT ? 'high' : 'mid',
                detection: clue.startsWith('EVP') ? 'reverse' : 'spectrogram'
            });
        });
        
        return anomalies;
    }
}
