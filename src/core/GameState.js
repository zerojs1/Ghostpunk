export const GameState = {
    BOOT: 'BOOT',           // CRT power-on sequence
    MENU: 'MENU',           // Main menu (New Game, Continue, Settings)
    DESKTOP: 'DESKTOP',     // Idle on desktop, between cases
    CASE_INTRO: 'CASE_INTRO', // New case notification/popup
    INVESTIGATION: 'INVESTIGATION', // Active case analysis
    VERDICT: 'VERDICT',      // Classification selection
    RESULTS: 'RESULTS',      // Verdict results screen
    UPGRADE_SHOP: 'UPGRADE_SHOP', // Hardware/software upgrades
    EMAIL: 'EMAIL',          // Reading emails
    SHIFT_END: 'SHIFT_END',  // End of shift summary
    RENT_DUE: 'RENT_DUE',    // Rent payment screen
    GAME_OVER: 'GAME_OVER',  // Game over state
    CREDITS: 'CREDITS'       // Credits roll
};

export class GameStateManager {
    constructor() {
        this.currentState = GameState.BOOT;
        this.previousState = null;
        this.listeners = [];
    }

    setState(newState) {
        if (this.currentState === newState) return;
        
        console.log(`State change: ${this.currentState} -> ${newState}`);
        this.previousState = this.currentState;
        this.currentState = newState;
        
        this.notifyListeners(newState);
    }

    onStateChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(state) {
        this.listeners.forEach(listener => listener(state));
    }
}
