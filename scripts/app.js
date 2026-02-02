/**
 * app.js
 * Main entry point
 */

// Imports removed for file:// compatibility (globals used)

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    let allQuotes = Storage.getAll();
    UI.renderQuoteList(allQuotes);
    UI.renderStats(allQuotes);

    // Set today's date in form
    document.getElementById('quoteDate').valueAsDate = new Date();

    // Form Submission
    const form = document.getElementById('quoteForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // simulated AI analysis
        const aiData = UI.getAIAnalysis();

        const newQuote = {
            text: document.getElementById('quoteText').value,
            book: document.getElementById('bookTitle').value,
            author: document.getElementById('authorName').value,
            page: document.getElementById('pageNumber').value,
            date: document.getElementById('quoteDate').value,
            notes: document.getElementById('notes').value,
            aiTag: aiData.topic // Save the tag
        };

        Storage.save(newQuote);
        form.reset();
        document.getElementById('quoteDate').valueAsDate = new Date(); // Reset date

        // Refresh List & Stats
        allQuotes = Storage.getAll();
        applyFilters();
        UI.renderStats(allQuotes);
    });

    // Delete Handling
    document.getElementById('quoteList').addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Are you sure you want to delete this quote?')) {
                Storage.delete(id);
                allQuotes = Storage.getAll();
                applyFilters();
                UI.renderStats(allQuotes);
            }
        }
    });

    // Search & Filter
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;

        let filtered = allQuotes.filter(q => {
            return (q.text || '').toLowerCase().includes(query) ||
                (q.book || '').toLowerCase().includes(query) ||
                (q.author || '').toLowerCase().includes(query);
        });

        // Sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt);
            const dateB = new Date(b.date || b.createdAt);

            if (sortBy === 'newest') return dateB - dateA;
            if (sortBy === 'oldest') return dateA - dateB;
            if (sortBy === 'author') return a.author.localeCompare(b.author);
            return 0;
        });

        UI.renderQuoteList(filtered);
    }

    searchInput.addEventListener('input', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
});
