# dailies.alexischao.com

Personal results tracker for daily puzzle games, organized as one tab per game. Currently tracks:

- **SPOTS** — a Wordle-style daily color-guessing game (4 colored pegs, up to 10 guesses, feedback pegs for correct color+position vs. correct color wrong position).

More game tabs (LoLdle Classic, OnePiecedle Classic, Aniguessr) are planned — see the plan history for the schema design.

Vite + React frontend backed by Supabase. Data entry happens live on the deployed site — no external sync pipeline.

## Stack

- Vite + React (SPA), one component tree per tab under `src/tabs/`
- Supabase (Postgres + Auth) — same project as uma.alexischao.com. SPOTS keeps its own `spots_`-prefixed tables; other game tabs share a generic `dailies_entries`/`dailies_entry_guesses` schema (see `supabase/migrations/`)
- Deployed to GitHub Pages at `dailies.alexischao.com`

## Setup

### 1. Supabase schema

Run `supabase/schema.sql` once in the Supabase SQL Editor for the project, then apply any files in `supabase/migrations/` in order. Together they create:

- `spots_games` / `spots_guesses` — SPOTS' own tables (puzzle number, won/lost, guess count, note; per-guess colors + green/gold peg counts)
- `dailies_entries` / `dailies_entry_guesses` — generic tables for other game tabs, keyed by a `game` column, with a jsonb `payload` per guess whose shape is defined per game

All tables have Row Level Security enabled: anyone can `select` (so stats/history are public), but `insert`/`update`/`delete` require an authenticated session.

### 2. Auth

This is a single-user app — sign-in gates writes only, not reads. Create the one Supabase Auth user (Authentication → Users → Add user) with the email/password you want to sign in with. There's no public sign-up flow.

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project URL and anon key:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```
npm install
npm run dev
```

## How sign-in / RLS works

- Reading stats, distribution, colors-used, and history works for anyone, signed in or not, on every tab.
- The sign-in link lives in the header (not a full-page gate) and applies across all tabs. Signing in unlocks each tab's "Log a game" form and edit/delete controls in its history.
- Writes are enforced server-side by RLS policies checking `auth.role() = 'authenticated'` — the anon key alone can never write, even if the client were tampered with.
- Logging a SPOTS game does two sequential inserts (`spots_games` then `spots_guesses`). If the second insert fails, the app deletes the just-created game row so you don't end up with an orphaned game that has no guesses. Other game tabs follow the same pattern against `dailies_entries`/`dailies_entry_guesses`.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. Set these repo secrets before the first deploy:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The `public/CNAME` file points Pages at `dailies.alexischao.com` — make sure your DNS has a CNAME record for that subdomain pointing at `<your-github-username>.github.io`, and that GitHub Pages is enabled (Settings → Pages → Source: GitHub Actions) for the repo.

Swap `public/favicon.ico` and `public/apple-touch-icon.png` for your own icons whenever you're ready — placeholders are checked in.
