# spots.alexischao.com

Personal results tracker for **SPOTS**, a Wordle-style daily color-guessing game (4 colored pegs, up to 10 guesses, feedback pegs for correct color+position vs. correct color wrong position).

Vite + React frontend backed by Supabase. Data entry happens live on the deployed site — no external sync pipeline.

## Stack

- Vite + React (SPA)
- Supabase (Postgres + Auth) — same project as uma.alexischao.com, tables prefixed `spots_`
- Deployed to GitHub Pages at `spots.alexischao.com`

## Setup

### 1. Supabase schema

Run `supabase/schema.sql` once in the Supabase SQL Editor for the project. It creates:

- `spots_games` — one row per logged puzzle (puzzle number, won/lost, guess count, optional note)
- `spots_guesses` — one row per guess within a game (4 colors as jsonb, green/gold peg counts)

Both tables have Row Level Security enabled: anyone can `select` (so stats/history are public), but `insert`/`update`/`delete` require an authenticated session.

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

- Reading stats, distribution, colors-used, and history works for anyone, signed in or not.
- The "Sign in" link lives in the header (not a full-page gate). Signing in unlocks the "Log a game" form and edit/delete controls in History.
- Writes are enforced server-side by RLS policies checking `auth.role() = 'authenticated'` — the anon key alone can never write, even if the client were tampered with.
- Logging a game does two sequential inserts (`spots_games` then `spots_guesses`). If the second insert fails, the app deletes the just-created game row so you don't end up with an orphaned game that has no guesses.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages on every push to `main`. Set these repo secrets before the first deploy:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The `public/CNAME` file points Pages at `spots.alexischao.com` — make sure your DNS has a CNAME record for that subdomain pointing at `<your-github-username>.github.io`, and that GitHub Pages is enabled (Settings → Pages → Source: GitHub Actions) for the repo.

Swap `public/favicon.ico` and `public/apple-touch-icon.png` for your own icons whenever you're ready — placeholders are checked in.
