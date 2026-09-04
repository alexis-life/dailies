-- Aniguessr is a daily multi-mode hub: five sub-scores contribute to one
-- daily total. It has no win/lose concept (dailies_entries.won is always
-- true for this game) and no guess sequence, so guess_count stays unused (0)
-- like Strands, and each mode gets its own nullable column.
alter table dailies_entries add column if not exists screenshot_score integer;
alter table dailies_entries add column if not exists characters_score integer;
alter table dailies_entries add column if not exists opening_score integer;
alter table dailies_entries add column if not exists ending_score integer;
alter table dailies_entries add column if not exists anidle_score integer;
