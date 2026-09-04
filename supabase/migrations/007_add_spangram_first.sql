-- "Spangram first" needs to know solve order, which Strands entries don't
-- otherwise track (no guess-row history like Wordle/Connections) — so it's
-- a simple boolean set at log time, plus a seed counter (like Connections'
-- purple_first_seed) to carry over NYT's own lifetime count.
alter table dailies_entries add column if not exists spangram_first boolean not null default false;

insert into dailies_counters (game, key, value)
values ('strands', 'spangram_first_seed', 8)
on conflict (game, key) do update set value = excluded.value;
