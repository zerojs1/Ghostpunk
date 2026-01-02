export class PlayerState {
    constructor() {
        this.credits = 1847;
        this.reputation = 72;
        this.debt = 5000;
        this.rentDue = 2000;
        this.shiftsUntilRent = 3;
        this.currentShift = 0;
        this.casesCompleted = 0;
        this.casesThisShift = 0;
        this.shiftQuota = 5;
        
        // Upgrades
        this.upgrades = {
            heatDissipation: 1,
            cpuCooling: 1,
            spectralAnalyzer: false,
            advancedFilters: false
        };
    }
    
    addCredits(amount) {
        this.credits += amount;
        console.log(`Credits: ${this.credits} (${amount > 0 ? '+' : ''}${amount})`);
    }
    
    adjustReputation(amount) {
        this.reputation = Math.max(0, Math.min(100, this.reputation + amount));
        console.log(`Reputation: ${this.reputation}% (${amount > 0 ? '+' : ''}${amount})`);
    }
    
    completeCase(earnedCredits, reputationChange) {
        this.addCredits(earnedCredits);
        this.adjustReputation(reputationChange);
        this.casesCompleted++;
        this.casesThisShift++;
    }
    
    payRent() {
        if (this.credits >= this.rentDue) {
            this.credits -= this.rentDue;
            this.shiftsUntilRent = 3;
            return true;
        }
        return false;
    }
    
    payDebt(amount) {
        const payment = Math.min(amount, this.debt);
        if (this.credits >= payment) {
            this.credits -= payment;
            this.debt -= payment;
            return payment;
        }
        return 0;
    }
    
    endShift() {
        this.currentShift++;
        this.shiftsUntilRent--;
        this.casesThisShift = 0;
        
        return {
            rentDue: this.shiftsUntilRent <= 0,
            quotaMet: this.casesThisShift >= this.shiftQuota
        };
    }
    
    getStatusText() {
        return `◉ SYSTEM READY │ CASES PENDING: ${this.shiftQuota - this.casesThisShift} │ CREDITS: ₵${this.credits.toLocaleString()} │ REP: ${this.reputation}%`;
    }
}
