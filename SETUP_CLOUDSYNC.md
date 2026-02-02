# Cloud Sync Setup Instructions

To make the sync work, you need to connect this app to your own Supabase database.
I have already written the code, you just need to plug in the keys!

## Step 1: Get the Keys
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **"New Project"**.
3. Name it: `daily-book-quotes`.
4. Choose a region and password, then **Create**.
5. When the project is ready, go to **Settings (cog icon) -> API**.
6. You will see:
   - **Project URL** (e.g., `https://xyz.supabase.co`)
   - **Project API Keys** (anon / public)

## Step 2: Paste Keys in Code
1. Open the file `scripts/storage.js` on your computer.
2. Paste your URL into `SUPABASE_URL`.
3. Paste your Key into `SUPABASE_KEY`.

## Step 3: Create the Database Table
1. In Supabase, click on **SQL Editor** (on the left sidebar).
2. Click **"New Query"**.
3. Open the file `supabase_schema.sql` I created in your project folder.
4. Copy the code from there and paste it into the Supabase SQL Editor.
5. Click **Run**.

## Done!
Refresh your website. It is now syncing to the cloud!
