-- OnePiecedle's Devil Fruit mode names a devil fruit each day (e.g. "Inu Inu
-- no Mi, Model: Okuchi no Makami") and asks which character ate it — worth
-- logging alongside the tries count, same shape as LoLdle Emoji's clues.
alter table dailies_entries add column if not exists devil_fruit text;
