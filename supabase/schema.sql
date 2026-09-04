-- dailies.alexischao.com (SPOTS tab) — run this once in the Supabase SQL
-- Editor for this project. Tables are prefixed with spots_ so they don't
-- collide with other apps (e.g. uma_* from uma.alexischao.com) sharing
-- this same Supabase project. Other game tabs use a separate generic
-- schema — see supabase/migrations/.

create table if not exists spots_games (
  id uuid primary key default gen_random_uuid(),
  puzzle_number integer not null unique,
  won boolean not null default false,
  guess_count integer not null,
  note text,
  is_daily boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists spots_guesses (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references spots_games(id) on delete cascade,
  row_index integer not null,
  colors jsonb not null,
  green_pegs integer not null default 0,
  gold_pegs integer not null default 0
);

alter table spots_games enable row level security;
alter table spots_guesses enable row level security;

-- Public can read everything (viewing stats/history needs no login); only an
-- authenticated session (there will only ever be the one account you
-- create) can write.
create policy "spots_games_public_read" on spots_games for select using (true);
create policy "spots_games_authenticated_insert" on spots_games for insert with check (auth.role() = 'authenticated');
create policy "spots_games_authenticated_update" on spots_games for update using (auth.role() = 'authenticated');
create policy "spots_games_authenticated_delete" on spots_games for delete using (auth.role() = 'authenticated');

create policy "spots_guesses_public_read" on spots_guesses for select using (true);
create policy "spots_guesses_authenticated_insert" on spots_guesses for insert with check (auth.role() = 'authenticated');
create policy "spots_guesses_authenticated_update" on spots_guesses for update using (auth.role() = 'authenticated');
create policy "spots_guesses_authenticated_delete" on spots_guesses for delete using (auth.role() = 'authenticated');
