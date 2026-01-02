// Entity signature mapping for procedural case generation
// Ensures cases are solvable by guaranteeing required clues appear across evidence types

export const ClueTypes = {
    // Location/Behavior
    LOCATION_BOUND: 'location_bound',
    REPETITION: 'repetition_or_nonresponse',
    DIRECT_RESPONSE: 'direct_response',
    INTELLIGENT_MOVEMENT: 'intelligent_movement',
    VIOLENT_BEHAVIOR: 'violent_behavior',
    
    // Visual Evidence
    APPARITION: 'apparition',
    SHADOW_FIGURE: 'shadow_figure',
    OBJECT_MANIPULATION: 'object_manipulation',
    PHYSICAL_DAMAGE: 'physical_damage',
    RITUAL_MARKS: 'ritual_marks',
    
    // Audio Evidence
    EVP_CLASS_A: 'evp_class_a',
    EVP_CLASS_B: 'evp_class_b',
    EVP_CLASS_C: 'evp_class_c',
    DIGITAL_ARTIFACT: 'digital_artifact',
    MECHANICAL_SOUND: 'mechanical_sound',
    
    // Technical/Digital
    SYSTEM_LOG_ANOMALY: 'system_log_anomaly',
    NETWORK_ACTIVITY: 'network_activity',
    DATA_CORRUPTION: 'data_corruption',
    
    // Red Herrings
    EQUIPMENT_GLITCH: 'equipment_glitch',
    PAREIDOLIA: 'pareidolia',
    ENVIRONMENTAL_NOISE: 'environmental_noise',
    MALWARE: 'malware',
    FISHING_WIRE: 'fishing_wire',
    PROJECTION_DEVICE: 'projection_device'
};

export const EntitySignatures = {
    CLASS_I_RESIDUAL: {
        name: 'Residual Haunting (Imprint)',
        correctClassification: 'CLASS_I',
        requiredClues: [
            ClueTypes.LOCATION_BOUND,
            ClueTypes.REPETITION
        ],
        forbiddenClues: [
            ClueTypes.DIRECT_RESPONSE,
            ClueTypes.INTELLIGENT_MOVEMENT
        ],
        commonClues: [
            ClueTypes.EVP_CLASS_B,
            ClueTypes.SHADOW_FIGURE,
            ClueTypes.APPARITION
        ],
        commonRedHerrings: [
            ClueTypes.EQUIPMENT_GLITCH,
            ClueTypes.PAREIDOLIA
        ],
        minCluesRequired: 2,
        description: 'Non-interactive loop of past trauma'
    },
    
    CLASS_II_INTELLIGENT: {
        name: 'Intelligent Entity',
        correctClassification: 'CLASS_II',
        requiredClues: [
            ClueTypes.DIRECT_RESPONSE,
            ClueTypes.INTELLIGENT_MOVEMENT
        ],
        forbiddenClues: [
            ClueTypes.VIOLENT_BEHAVIOR,
            ClueTypes.PHYSICAL_DAMAGE
        ],
        commonClues: [
            ClueTypes.EVP_CLASS_A,
            ClueTypes.OBJECT_MANIPULATION,
            ClueTypes.APPARITION
        ],
        commonRedHerrings: [
            ClueTypes.ENVIRONMENTAL_NOISE
        ],
        minCluesRequired: 2,
        description: 'Aware entity attempting communication'
    },
    
    CLASS_III_MALEVOLENT: {
        name: 'Malevolent Force',
        correctClassification: 'CLASS_III',
        requiredClues: [
            ClueTypes.VIOLENT_BEHAVIOR,
            ClueTypes.PHYSICAL_DAMAGE
        ],
        forbiddenClues: [],
        commonClues: [
            ClueTypes.RITUAL_MARKS,
            ClueTypes.EVP_CLASS_A,
            ClueTypes.INTELLIGENT_MOVEMENT,
            ClueTypes.SHADOW_FIGURE
        ],
        commonRedHerrings: [],
        minCluesRequired: 3,
        description: 'Hostile entity with intent to harm'
    },
    
    CYBER_ENTITY_NEURAL_FRAGMENT: {
        name: 'Cyber-Entity (Neural Fragment)',
        correctClassification: 'CLASS_II', // Intelligent but digital
        requiredClues: [
            ClueTypes.DIGITAL_ARTIFACT,
            ClueTypes.SYSTEM_LOG_ANOMALY
        ],
        forbiddenClues: [
            ClueTypes.APPARITION,
            ClueTypes.SHADOW_FIGURE
        ],
        commonClues: [
            ClueTypes.NETWORK_ACTIVITY,
            ClueTypes.DATA_CORRUPTION,
            ClueTypes.EVP_CLASS_C
        ],
        commonRedHerrings: [
            ClueTypes.MALWARE
        ],
        minCluesRequired: 2,
        description: 'Digital consciousness in the network'
    },
    
    HOAX_STAGED: {
        name: 'Hoax (Staged)',
        correctClassification: 'HOAX',
        requiredClues: [
            ClueTypes.FISHING_WIRE,
            ClueTypes.PROJECTION_DEVICE
        ],
        forbiddenClues: [
            ClueTypes.EVP_CLASS_A,
            ClueTypes.INTELLIGENT_MOVEMENT
        ],
        commonClues: [
            ClueTypes.MECHANICAL_SOUND,
            ClueTypes.EQUIPMENT_GLITCH
        ],
        commonRedHerrings: [
            ClueTypes.PAREIDOLIA
        ],
        minCluesRequired: 2,
        description: 'Deliberate fabrication for profit/attention'
    },
    
    HOAX_EQUIPMENT: {
        name: 'Hoax (Equipment Malfunction)',
        correctClassification: 'HOAX',
        requiredClues: [
            ClueTypes.EQUIPMENT_GLITCH,
            ClueTypes.ENVIRONMENTAL_NOISE
        ],
        forbiddenClues: [
            ClueTypes.DIRECT_RESPONSE,
            ClueTypes.INTELLIGENT_MOVEMENT
        ],
        commonClues: [
            ClueTypes.PAREIDOLIA
        ],
        commonRedHerrings: [],
        minCluesRequired: 2,
        description: 'Natural phenomena misinterpreted as paranormal'
    }
};

// Validation helper: ensures a case has enough clues to be solvable
export function validateCaseSolvability(caseData, signature) {
    const presentClues = new Set();
    
    // Collect all clues from evidence
    if (caseData.intel && caseData.intel.clues) {
        caseData.intel.clues.forEach(clue => presentClues.add(clue));
    }
    if (caseData.images) {
        caseData.images.forEach(img => {
            if (img.layers) {
                img.layers.forEach(layer => presentClues.add(layer.clue_type));
            }
        });
    }
    if (caseData.audio && caseData.audio.anomalies) {
        caseData.audio.anomalies.forEach(anomaly => presentClues.add(anomaly.type));
    }
    
    // Check required clues are present
    const hasRequiredClues = signature.requiredClues.every(clue => presentClues.has(clue));
    
    // Check forbidden clues are absent
    const hasForbiddenClues = signature.forbiddenClues.some(clue => presentClues.has(clue));
    
    // Check minimum clue count
    const hasEnoughClues = presentClues.size >= signature.minCluesRequired;
    
    return {
        valid: hasRequiredClues && !hasForbiddenClues && hasEnoughClues,
        hasRequiredClues,
        hasForbiddenClues,
        hasEnoughClues,
        presentClues: Array.from(presentClues)
    };
}

// Helper: get signature by classification
export function getSignatureByClassification(classification) {
    return Object.values(EntitySignatures).find(sig => sig.correctClassification === classification);
}
