-- Run this in the Supabase SQL Editor

create table quotes (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  book text,
  author text,
  page text,
  date date,
  notes text,
  ai_tag text,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) if you want to restrict access, 
-- or leave it open if it's just for you.
-- For simplicity, we'll allow public access for now (since you utilize anon key).
alter table quotes enable row level security;

create policy "Allow public read/write"
on quotes
for all
using (true)
with check (true);
