-- Distinguish the daily SPOTS puzzle from archive puzzles played out of
-- order, so streak math (which assumes consecutive puzzle numbers =
-- consecutive days) can exclude archive entries.
alter table spots_games add column if not exists is_daily boolean not null default true;
