export const Classification = {
    CLASS_I: 'CLASS_I',
    CLASS_II: 'CLASS_II',
    CLASS_III: 'CLASS_III',
    HOAX: 'HOAX'
};

export class VerdictManager {
    constructor() {
        this.currentCase = null;
        this.submittedVerdict = null;
        
        // Credit formula: finalCredits = round(payout_base * tierMultiplier * confidenceMultiplier) + tierFlatBonus
        this.verdictTiers = {
            PERFECT_CLASSIFICATION: { multiplier: 1.0, flatBonus: 200 },
            ADJACENT_CLASSIFICATION: { multiplier: 0.4, flatBonus: 0 },
            SAFE_ERROR: { multiplier: 0.0, flatBonus: 0 },
            DANGEROUS_ERROR: { multiplier: -0.3, flatBonus: 0 },
            WRONG_CLASSIFICATION: { multiplier: -0.2, flatBonus: -50 }
        };
    }
    
    setCase(caseData) {
        this.currentCase = caseData;
        this.submittedVerdict = null;
    }
    
    submitVerdict(classification) {
        if (!this.currentCase) {
            console.error('No active case to submit verdict for');
            return null;
        }
        
        this.submittedVerdict = classification;
        const result = this.evaluateVerdict(classification);
        return result;
    }
    
    evaluateVerdict(classification, confidenceMultiplier = 1.0) {
        // Get the correct answer from case data
        const correctAnswer = this.currentCase.correctClassification || Classification.CLASS_II;
        const payoutBase = this.currentCase.payout_base || 500;
        
        const isCorrect = classification === correctAnswer;
        const isAdjacent = this.isAdjacentClassification(classification, correctAnswer);
        const isSafeError = this.isSafeError(classification, correctAnswer);
        const isDangerous = this.isDangerousError(classification, correctAnswer);
        
        let outcome = '';
        let reputation = 0;
        
        // Determine outcome tier
        if (isCorrect) {
            outcome = 'PERFECT_CLASSIFICATION';
            reputation = 10;
        } else if (isAdjacent) {
            outcome = 'ADJACENT_CLASSIFICATION';
            reputation = 5;
        } else if (isSafeError) {
            outcome = 'SAFE_ERROR';
            reputation = -5;
        } else if (isDangerous) {
            outcome = 'DANGEROUS_ERROR';
            reputation = -20;
        } else {
            outcome = 'WRONG_CLASSIFICATION';
            reputation = -10;
        }
        
        // Calculate credits using explicit formula:
        // finalCredits = round(payout_base * tierMultiplier * confidenceMultiplier) + tierFlatBonus
        const tier = this.verdictTiers[outcome];
        const credits = Math.round(payoutBase * tier.multiplier * confidenceMultiplier) + tier.flatBonus
        
        return {
            correct: isCorrect,
            classification: classification,
            correctAnswer: correctAnswer,
            credits: credits,
            reputation: reputation,
            outcome: outcome,
            message: this.getOutcomeMessage(outcome, classification, correctAnswer)
        };
    }
    
    isAdjacentClassification(submitted, correct) {
        // CLASS I and CLASS II are adjacent (both ghosts, different types)
        if ((submitted === Classification.CLASS_I && correct === Classification.CLASS_II) ||
            (submitted === Classification.CLASS_II && correct === Classification.CLASS_I)) {
            return true;
        }
        
        // CLASS II and CLASS III are adjacent (intelligent vs malevolent)
        if ((submitted === Classification.CLASS_II && correct === Classification.CLASS_III) ||
            (submitted === Classification.CLASS_III && correct === Classification.CLASS_II)) {
            return true;
        }
        
        return false;
    }
    
    isSafeError(submitted, correct) {
        // Calling a real ghost a hoax - wastes time but no danger
        return submitted === Classification.HOAX && correct !== Classification.HOAX;
    }
    
    isDangerousError(submitted, correct) {
        // Calling a hoax real - cleanup crew sent for nothing (expensive)
        // Or missing a Class III - people could get hurt
        if (submitted !== Classification.HOAX && correct === Classification.HOAX) {
            return true;
        }
        if (submitted !== Classification.CLASS_III && correct === Classification.CLASS_III) {
            return true;
        }
        return false;
    }
    
    getOutcomeMessage(outcome, submitted, correct) {
        const messages = {
            'PERFECT_CLASSIFICATION': [
                'ANALYSIS CONFIRMED. Classification verified by cleanup team.',
                'EXCELLENT WORK. Your assessment matches field results perfectly.',
                'VERIFIED. Corporate sends their regards. Credits deposited.'
            ],
            'ADJACENT_CLASSIFICATION': [
                'PARTIAL CREDIT. Close enough for preliminary assessment.',
                'ACCEPTABLE. Field team reports similar findings with minor variance.',
                'DECENT CALL. Not exact, but within operational parameters.'
            ],
            'SAFE_ERROR': [
                'FALSE NEGATIVE. Field team found no hoax. Time and resources wasted.',
                'INCORRECT. Cleanup crew dispatched for legitimate entity. Reputation hit.',
                'MISCLASSIFICATION. Real phenomena dismissed as fraud. Strike logged.'
            ],
            'DANGEROUS_ERROR': [
                'CRITICAL ERROR. Cleanup team unprepared. Casualties reported.',
                'CATASTROPHIC FAILURE. Entity was CLASS III. Civilian injuries.',
                'MAJOR INCIDENT. Your classification put lives at risk. Severe penalty.'
            ],
            'WRONG_CLASSIFICATION': [
                'INCORRECT ANALYSIS. Field results contradict your findings.',
                'CLASSIFICATION REJECTED. Evidence does not support your conclusion.',
                'ERROR. Cleanup team disputes your assessment. Credits deducted.'
            ]
        };
        
        const pool = messages[outcome] || messages['WRONG_CLASSIFICATION'];
        return pool[Math.floor(Math.random() * pool.length)];
    }
}
