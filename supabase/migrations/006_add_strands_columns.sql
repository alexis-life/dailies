-- Strands is outcome-only (no guess sequence), so it needs its own columns
-- rather than overloading guess_count to secretly mean "hints used."
-- guess_count stays unused (0) for this game.
alter table dailies_entries add column if not exists theme_title text;
alter table dailies_entries add column if not exists hints_used integer;
