/**
 * ui.js
 * Handles DOM updates and rendering
 */

// Simulated AI Keywords/Topics
const AI_TOPICS = ['Wisdom', 'Motivation', 'Philosophy', 'Life Lesson', 'Productivity', 'Mindfulness'];
const AI_INSIGHTS = [
    "This quote highlights the importance of consistency.",
    "A profound reflection on human nature.",
    "Calculated simplicity often leads to clarity.",
    "This speaks to the core of personal growth.",
    "A reminder to stay present in the moment."
];

function getRandomAI() {
    const topic = AI_TOPICS[Math.floor(Math.random() * AI_TOPICS.length)];
    // 30% chance to show an insight
    const insight = Math.random() > 0.7 ? AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)] : null;
    return { topic, insight };
}

const UI = {
    renderQuoteList(quotes) {
        const listEl = document.getElementById('quoteList');
        listEl.innerHTML = '';

        if (quotes.length === 0) {
            listEl.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); padding: 2rem;">
                    No quotes found.
                </div>`;
            return;
        }

        quotes.forEach(quote => {
            const card = document.createElement('div');
            card.className = 'quote-card';

            // Format Date
            const dateStr = new Date(quote.date || quote.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // AI Badge
            let aiBadgeHtml = '';
            if (quote.aiTag) {
                aiBadgeHtml = `<div class="ai-badge">✨ ${quote.aiTag}</div>`;
            }

            card.innerHTML = `
                <div class="quote-text">"${quote.text}"</div>
                ${quote.notes ? `<div style="font-size:0.9rem; color:#666; margin-bottom:0.5rem;">📝 ${quote.notes}</div>` : ''}
                
                <div class="quote-meta">
                    <div class="meta-info">
                        <span style="font-weight:600; color:#2c3e50;">${quote.book}</span>
                        <span>by ${quote.author}</span>
                        ${quote.page ? `<span>p. ${quote.page}</span>` : ''}
                    </div>
                    <div>
                        <button class="delete-btn" data-id="${quote.id}" title="Delete Quote">✖</button>
                    </div>
                </div>
                <div style="font-size:0.8rem; color:#999; margin-top:0.5rem; display:flex; justify-content:space-between; align-items:flex-end;">
                   <span>${dateStr}</span>
                   ${aiBadgeHtml}
                </div>
            `;
            listEl.appendChild(card);
        });
    },

    showAlert(message) {
        alert(message);
    },

    getAIAnalysis() {
        return getRandomAI();
    },

    renderStats(quotes) {
        const statsEl = document.getElementById('statsBar');
        if (!statsEl) return;

        const totalQuotes = quotes.length;
        // Normalize strings for unique counting
        const uniqueBooks = new Set(quotes.map(q => (q.book || '').trim().toLowerCase())).size;
        const uniqueAuthors = new Set(quotes.map(q => (q.author || '').trim().toLowerCase())).size;

        statsEl.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${totalQuotes}</div>
                <div class="stat-label">Quotes</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${uniqueBooks}</div>
                <div class="stat-label">Books</div>
            </div>
             <div class="stat-item">
                <div class="stat-value">${uniqueAuthors}</div>
                <div class="stat-label">Authors</div>
            </div>
        `;
    }
};
