export class DenoiseSystem {
    constructor() {
        this.noiseLevel = 1.0;        // 1.0 = fully obscured, 0.0 = clear
        this.cpuHeat = 0;             // 0-100
        this.heatDissipation = 0.5;   // Per second
        this.heatGeneration = 15;     // Per second while denoising
        this.overheatThreshold = 80;  // Screen starts flickering
        this.criticalThreshold = 95;  // System reboots
        this.isDenoising = false;
        this.isOverheated = false;
        this.rebootTimer = 0;
        this.isRebooting = false;
    }

    update(deltaTimeMS) {
        const deltaTime = deltaTimeMS / 1000;

        if (this.isRebooting) {
            this.rebootTimer -= deltaTime;
            if (this.rebootTimer <= 0) {
                this.isRebooting = false;
                this.cpuHeat = 0;
                console.log("System rebooted.");
            }
            return;
        }

        if (this.isDenoising && this.cpuHeat < 100) {
            // Actively denoising
            this.noiseLevel = Math.max(0, this.noiseLevel - (0.3 * deltaTime));
            this.cpuHeat = Math.min(100, this.cpuHeat + (this.heatGeneration * deltaTime));
            
            // Visual feedback at thresholds
            if (this.cpuHeat > this.overheatThreshold) {
                this.isOverheated = true;
            } else {
                this.isOverheated = false;
            }

            if (this.cpuHeat > this.criticalThreshold) {
                this.triggerEmergencyShutdown();
            }
        } else {
            // Passive cooling
            this.cpuHeat = Math.max(0, this.cpuHeat - (this.heatDissipation * deltaTime));
            this.isOverheated = this.cpuHeat > this.overheatThreshold;
        }
    }

    startDenoising() {
        if (!this.isRebooting) {
            this.isDenoising = true;
        }
    }

    stopDenoising() {
        this.isDenoising = false;
    }

    triggerEmergencyShutdown() {
        this.isRebooting = true;
        this.rebootTimer = 15; // 15 second penalty
        this.isDenoising = false;
        this.noiseLevel = 1.0; // Progress lost
        console.warn("THERMAL SHUTDOWN - REBOOTING...");
    }

    getHeatPercentage() {
        return this.cpuHeat;
    }

    getNoiseLevel() {
        return this.noiseLevel;
    }
}
