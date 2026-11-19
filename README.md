# Bill Ledger — Expense Tracker

Scan your grocery, supermarket and textile bills with your phone camera, and see how the price of each item changes month by month and across financial years (April–March).

**Live app:** https://capricarun.github.io/Expense-Tracker/

## What it does

- **Scan bills.** Take a photo of a bill, or pick several photos for a long one. Claude reads the store, date, and every item with its quantity and amount.
- **Check before saving.** Fix anything that was misread. A warning appears if the items don't add up to the bill total.
- **Fair comparisons.** Every price becomes a price per kg, litre, piece or metre, so a 500 g pack and a 1 kg bag compare correctly.
- **One product across bills.** "Track as" groups the same product even when different shops print it differently.
- **Reports.** Compare any month or financial year with another, filter by grocery, supermarket or textiles, and see:
  - price change per item
  - average price change, weighted by what you spend
  - spending over time
- **Item history.** A price chart, averages for each financial year, and every purchase.
- **Cloud backup.** Sign in with email and password and every bill is copied to your private cloud account. If you lose or reset your phone, sign in on any device and everything comes back. It works offline and catches up when you're back online.
- **Export.** Download CSV files for Excel or Google Sheets, plus a full JSON backup and restore.
- **Works like an app.** You can install it on your home screen and it opens offline.

## Use it on your phone

1. Open the live app link on your phone.
2. **Android (Chrome):** tap ⋮ → **Add to Home screen** / **Install app**.
   **iPhone (Safari):** tap Share → **Add to Home Screen**.
3. Open **Settings** (the gear icon) and paste your Anthropic API key so bills can be read from photos. You can create a key at https://console.anthropic.com/settings/keys. Without a key, you can still enter items by hand.
4. Tap **Try with sample data** to see the reports with example bills, then remove the samples from Settings.

## How your data is stored

- **On the phone:** every bill is saved in the browser's storage right away, so the app works offline. The app also asks the browser not to auto-clear this storage.
- **In the cloud (when signed in):** every bill is also copied to your own account in Supabase (a Postgres database). Row Level Security means each account can only ever read or write its own bills.
- **Recovery:** on a new or reset phone, open the app, tap **Sign in to restore your bills**, and everything downloads. Deletions sync too, and if the same bill is edited on two devices, the newest edit wins.
- **Photos** are not stored. They're sent once to the Anthropic API to read the items, then discarded.
- **Your API key** is stored only in your browser.
- **Extra safety:** **Settings → Download backup** still gives you a file copy any time you want one.

## Cloud backup setup (one time, ~5 minutes, free)

1. Create a free account at https://supabase.com and click **New project**. Pick the **Mumbai (ap-south-1)** region.
2. In the project, open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
3. Go to **Authentication → URL Configuration** and set **Site URL** to `https://capricarun.github.io/Expense-Tracker/`. This makes the email confirmation and password reset links open the app.
4. Go to **Project Settings → API Keys** and copy the **Project URL** and the **anon / publishable** key. Paste them into [`config.js`](config.js) and push.
   The anon key is safe to publish, because Row Level Security protects the data.

## Tech

- One static `index.html`: vanilla JavaScript and hand-built SVG charts, with no build step and no dependencies.
- Installable as a PWA (`manifest.webmanifest`, plus `sw.js` for offline use).
- Bill reading uses the Claude Messages API with image input and streaming, called directly from the browser.
- Cloud backup: Supabase Auth (email + password) and Postgres with Row Level Security. Sync is local-first: there's a queue of unsynced changes, deletes are soft (a `deleted` flag) so other devices learn about them, and the newest `updated_at` wins in a conflict.
- Deployed by GitHub Actions to GitHub Pages (`.github/workflows/pages.yml`) on every push to `main`.

## Deploy setup (one time)

In the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. Every push to `main` then publishes the site.

## Roadmap ideas

- A small backend proxy so the API key isn't needed on the phone
- Price alerts when an item you buy often goes up by more than X%
- Store-to-store price comparison for the same item
