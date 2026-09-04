-- LoLdle's Emoji mode reveals a fixed emoji clue set per champion (e.g.
-- 4️⃣🎭🪷🔫) — worth logging alongside the tries count, purely as flavor text.
alter table dailies_entries add column if not exists emoji_clues text;
