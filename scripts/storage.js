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
            alert('Error syncing data: ' + error.message);
            return [];
        }
        return data || [];
    },

    async save(quoteData) {
        if (!supabaseClient) {
            alert('Cannot save: Database not configured!');
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
