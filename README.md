# CombatScore V1 (MMA + boxing, Europe)

## Setup (30 minutes)
1. Create a free project at supabase.com. In the SQL editor run `supabase/schema.sql`, then `supabase/seed.sql`.
2. Copy `.env.example` to `.env.local` and paste your project URL and anon key (Project settings > API).
3. `npm install && npm run dev`, open http://localhost:3000
4. Push to GitHub, import the repo in Vercel, add the same two env vars, deploy.

## Plan
| Weeks | Goal | Done when |
|---|---|---|
| 1 | Deploy this skeleton; replace sample data with 20 real events and 100 fighters entered in the Supabase table editor | Live URL shows real cards |
| 2-3 | Data pipeline: pick one licensed API per sport, write an import script (Supabase service key, run on a schedule) | New events appear without manual entry |
| 3-4 | Fighter identity: use `fighter_aliases` to merge duplicates across promotions | One profile per fighter |
| 5 | Live: set fight `status='live'` and `current_round` (manual or API poll every 30s); home page already shows live events | Result updates within a minute |
| 6 | Accounts + follow: Supabase Auth (magic link), write to `follows` | Users can follow fighters |
| 7 | Email alerts: scheduled function finds followed fighters with fights in 24h or new results, sends via Resend | Emails arrive |
| 8 | SEO: sitemap, OpenGraph tags, structured data for events | Pages indexed |
| 9-10 | Launch to Swiss/European MMA and boxing communities; track which fighters get followed | 100 users |

Later: comparison page, rankings, CombatScore Rating, premium, more sports.

## Not included yet
Auth/follow UI, email alerts, data import script, rankings, compare page. The schema already supports the first three.
