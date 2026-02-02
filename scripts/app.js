/**
 * app.js
 * Main entry point
 */

// Imports removed for file:// compatibility (globals used)

document.addEventListener('DOMContentLoaded', async () => {
    // Check Config
    if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
        UI.showAlert('⚠️ Setup Required: Please open "scripts/storage.js" and paste your Supabase keys to enable Sync.');
    }

    // Initial Render
    // Loading State
    const listEl = document.getElementById('quoteList');
    listEl.innerHTML = '<div style="text-align:center; padding:2rem;">Loading synced quotes...</div>';

    let allQuotes = await Storage.getAll();
    UI.renderQuoteList(allQuotes);
    UI.renderStats(allQuotes);

    // Set today's date in form
    const dateInput = document.getElementById('quoteDate');
    if (dateInput) dateInput.valueAsDate = new Date();

    // Form Submission
    const form = document.getElementById('quoteForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Saving...';
            submitBtn.disabled = true;

            // simulated AI analysis
            const aiData = UI.getAIAnalysis();

            const newQuote = {
                text: document.getElementById('quoteText').value,
                book: document.getElementById('bookTitle').value,
                author: document.getElementById('authorName').value,
                page: document.getElementById('pageNumber').value,
                date: document.getElementById('quoteDate').value,
                notes: document.getElementById('notes').value,
                aiTag: aiData.topic
            };

            await Storage.save(newQuote);

            form.reset();
            document.getElementById('quoteDate').valueAsDate = new Date();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Refresh
            allQuotes = await Storage.getAll();
            applyFilters();
            UI.renderStats(allQuotes);
        });
    }

    // Delete Handling
    const listContainer = document.getElementById('quoteList');
    if (listContainer) {
        listContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this quote from Cloud?')) {
                    await Storage.delete(id);
                    allQuotes = await Storage.getAll();
                    applyFilters();
                    UI.renderStats(allQuotes);
                }
            }
        });
    }

    // Search & Filter
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');

    function applyFilters() {
        if (!searchInput || !sortSelect) return;

        const query = searchInput.value.toLowerCase();
        const sortBy = sortSelect.value;

        let filtered = allQuotes.filter(q => {
            return (q.text || '').toLowerCase().includes(query) ||
                (q.book || '').toLowerCase().includes(query) ||
                (q.author || '').toLowerCase().includes(query);
        });

        // Sort
        filtered.sort((a, b) => {
            const dateA = new Date(a.date || a.created_at);
            const dateB = new Date(b.date || b.created_at);

            if (sortBy === 'newest') return dateB - dateA;
            if (sortBy === 'oldest') return dateA - dateB;
            if (sortBy === 'author') return (a.author || '').localeCompare(b.author || '');
            return 0;
        });

        UI.renderQuoteList(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
});
