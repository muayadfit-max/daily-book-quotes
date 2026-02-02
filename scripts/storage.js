/**
 * storage.js
 * Handles interactions with Supabase Cloud DB
 */

// TODO: REPLACE THESE with your actual values from Supabase Project Settings > API
const SUPABASE_URL = 'https://wnbxiicjtwxbjdwwxzad.supabase.co';
const SUPABASE_KEY = 'sb_publishable_usjdNJLRxhk5JSl1WcIyYw_S70Enevu';

// Initialize Supabase Client
let supabaseClient = null;
if (window.supabase) {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    } else {
        console.warn('Supabase not configured. Please set API Keys in scripts/storage.js');
    }
} else {
    console.error('Supabase SDK not found in window!');
    // Alert only if we are on a "real" domain (to avoid annoyance if local dev without internet)
    // But for this user, it's critical.
    // We will just log it for now, let the check in save() handle the alert.
}

const Storage = {
    async getAll() {
        if (!supabaseClient) return [];

        const { data, error } = await supabaseClient
            .from('quotes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching quotes:', error);
            if (error.message.includes('Could not find the table')) {
                alert('🚨 Database Missing! \nYou must go to Supabase > SQL Editor and run the "create table" code I gave you.');
            } else {
                alert('Error syncing data: ' + error.message);
            }
            return [];
        }
        return data || [];
    },

    // Migration helper
    async migrateLocalData() {
        const localJSON = localStorage.getItem('quotes-data');
        if (!localJSON) return;

        const localQuotes = JSON.parse(localJSON);
        if (localQuotes.length === 0) return;

        if (!confirm(`Found ${localQuotes.length} quotes on this device. Upload them to Cloud?`)) return;

        let count = 0;
        for (const q of localQuotes) {
            // Check if already exists (simple check by text)
            // Ideally we use ID, but local IDs are random strings, cloud IDs are UUIDs. 
            // We'll just upload.
            const dbRecord = {
                text: q.text,
                book: q.book,
                author: q.author,
                page: q.page,
                date: q.date,
                notes: q.notes,
                ai_tag: q.aiTag
            };
            await this.save(dbRecord);
            count++;
        }
        alert(`Successfully migrated ${count} quotes to the Cloud!`);
        localStorage.removeItem('quotes-data'); // Clear local after upload
        return true;
    },

    async save(quoteData) {
        if (!supabaseClient) {
            if (!window.supabase) {
                alert('CRITICAL ERROR: Supabase SDK not loaded on this device.\nPlease refresh or check your internet connection.');
            } else {
                alert('Cannot save: Database keys not configured in storage.js!');
            }
            return null;
        }

        // Map frontend structure to DB columns if needed (snake_case usually)
        // Our planned schema matches JS pretty well: text, book, author, page, date, notes, ai_tag
        const dbRecord = {
            text: quoteData.text,
            book: quoteData.book,
            author: quoteData.author,
            page: quoteData.page,
            date: quoteData.date || new Date().toISOString(),
            notes: quoteData.notes,
            ai_tag: quoteData.aiTag // JS camelCase -> DB snake_case mapping if needed, but let's assume we created column 'ai_tag'
        };

        const { data, error } = await supabaseClient
            .from('quotes')
            .insert([dbRecord])
            .select();

        if (error) {
            console.error('Error saving quote:', error);
            alert('Save failed: ' + error.message);
            return null;
        }
        return data ? data[0] : null;
    },

    async delete(id) {
        if (!supabaseClient) return;

        const { error } = await supabaseClient
            .from('quotes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting:', error);
            alert('Delete failed: ' + error.message);
        }
    }
};
