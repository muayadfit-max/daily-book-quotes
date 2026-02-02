/**
 * storage.js
 * Handles all interactions with LocalStorage
 */

const STORAGE_KEY = 'quotes-data';

// Helper to generate a simple unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const Storage = {
    getAll() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Error reading from storage", e);
            return [];
        }
    },

    save(quoteData) {
        const quotes = this.getAll();
        const newQuote = {
            id: generateId(),
            ...quoteData,
            createdAt: new Date().toISOString()
        };
        quotes.unshift(newQuote); // Add to top
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
        return newQuote;
    },

    delete(id) {
        let quotes = this.getAll();
        quotes = quotes.filter(q => q.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    },

    // Optional: Search/Filter could be done here or in UI. 
    // Let's do it in memory for now since dataset is small.
};
