-- Generic schema for additional daily-game tabs (LoLdle, OnePiecedle,
-- Aniguessr, etc.) added alongside the existing spots_games/spots_guesses
-- tables, which stay untouched — SPOTS keeps using its own tables.
--
-- puzzle_number is unique per game, not globally, since different games'
-- daily numbering will naturally collide (e.g. LoLdle #500 and
-- OnePiecedle #500 are unrelated puzzles).

create table if not exists dailies_entries (
  id uuid primary key default gen_random_uuid(),
  game text not null, -- 'loldle' | 'onepiecedle' | 'aniguessr' | ...
  puzzle_number integer not null,
  won boolean not null default false,
  guess_count integer not null,
  note text,
  is_daily boolean not null default true,
  created_at timestamptz not null default now(),
  unique (game, puzzle_number)
);

create table if not exists dailies_entry_guesses (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references dailies_entries(id) on delete cascade,
  row_index integer not null,
  payload jsonb not null
);

alter table dailies_entries enable row level security;
alter table dailies_entry_guesses enable row level security;

create policy "dailies_entries_public_read" on dailies_entries for select using (true);
create policy "dailies_entries_authenticated_insert" on dailies_entries for insert with check (auth.role() = 'authenticated');
create policy "dailies_entries_authenticated_update" on dailies_entries for update using (auth.role() = 'authenticated');
create policy "dailies_entries_authenticated_delete" on dailies_entries for delete using (auth.role() = 'authenticated');

create policy "dailies_entry_guesses_public_read" on dailies_entry_guesses for select using (true);
create policy "dailies_entry_guesses_authenticated_insert" on dailies_entry_guesses for insert with check (auth.role() = 'authenticated');
create policy "dailies_entry_guesses_authenticated_update" on dailies_entry_guesses for update using (auth.role() = 'authenticated');
create policy "dailies_entry_guesses_authenticated_delete" on dailies_entry_guesses for delete using (auth.role() = 'authenticated');
