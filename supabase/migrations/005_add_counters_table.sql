-- Generic per-game counters for stats that can't be derived from stored rows
-- alone — e.g. Connections' "purple first" needs a starting value seeded from
-- NYT's own lifetime stats, since backfilled placeholder entries have no real
-- guess-order data to compute it from. New real games logged through the
-- tracker increment the computed count on top of this seed.
create table if not exists dailies_counters (
  game text not null,
  key text not null,
  value integer not null default 0,
  primary key (game, key)
);

alter table dailies_counters enable row level security;

create policy "dailies_counters_public_read" on dailies_counters for select using (true);
create policy "dailies_counters_authenticated_write" on dailies_counters
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into dailies_counters (game, key, value)
values ('connections', 'purple_first_seed', 16)
on conflict (game, key) do update set value = excluded.value;
