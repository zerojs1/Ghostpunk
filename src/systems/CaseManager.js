import { CaseGenerator } from './CaseGenerator.js';

export class CaseManager {
    constructor() {
        this.cases = [];
        this.currentCase = null;
        this.isLoaded = false;
        this.generator = new CaseGenerator();
        this.currentIndex = -1;
    }

    async loadCases() {
        // Generate a set of initial cases
        for (let i = 0; i < 5; i++) {
            const difficulty = Math.floor(Math.random() * 5) + 1;
            this.cases.push(this.generator.generate(difficulty));
        }
        
        this.isLoaded = true;
        this.currentIndex = 0;
        this.currentCase = this.cases[0];
    }

    getCurrentCase() {
        return this.currentCase;
    }

    selectCase(id) {
        this.currentCase = this.cases.find(c => c.id === id) || null;
        return this.currentCase;
    }

    hasNextCase() {
        return this.currentIndex < this.cases.length - 1;
    }

    advanceCase() {
        if (!this.isLoaded) return null;
        if (this.hasNextCase()) {
            this.currentIndex += 1;
        } else {
            const difficulty = Math.floor(Math.random() * 5) + 1;
            this.cases.push(this.generator.generate(difficulty));
            this.currentIndex = this.cases.length - 1;
        }
        this.currentCase = this.cases[this.currentIndex];
        return this.currentCase;
    }
}
