import { GhostPunkApp } from './core/App.js';

// Initialize the application
window.addEventListener('DOMContentLoaded', () => {
    const app = new GhostPunkApp();
    // Make it available for debugging if needed
    window.ghostPunk = app;
});
