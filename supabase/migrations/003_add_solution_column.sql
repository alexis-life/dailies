-- Stores the revealed solution (colors for SPOTS, letters for Wordle) when a
-- loss is logged via the "reveal the answer" row, so history can display what
-- the answer actually was. Null for normal wins (no reveal row was used).
alter table spots_games add column if not exists solution jsonb;
alter table dailies_entries add column if not exists solution jsonb;
