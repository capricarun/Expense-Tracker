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
- **Export.** Download CSV files for Excel or Google Sheets, plus a full JSON backup and restore.
- **Works like an app.** You can install it on your home screen and it opens offline.

## Use it on your phone

1. Open the live app link on your phone.
2. **Android (Chrome):** tap ⋮ → **Add to Home screen** / **Install app**.
   **iPhone (Safari):** tap Share → **Add to Home Screen**.
3. Open **Settings** (the gear icon) and paste your Anthropic API key so bills can be read from photos. You can create a key at https://console.anthropic.com/settings/keys. Without a key, you can still enter items by hand.
4. Tap **Try with sample data** to see the reports with example bills, then remove the samples from Settings.

## Privacy

- Bills are stored in your browser on that device (localStorage). Nothing is sent to any server except the bill photo, which goes straight to the Anthropic API when you scan.
- Your API key is stored only in your browser.
- Use **Settings → Download backup** regularly. Use **Restore** to move your bills to another device.

## Tech

- One static `index.html`: vanilla JavaScript and hand-built SVG charts, with no build step and no dependencies.
- Installable as a PWA (`manifest.webmanifest`, plus `sw.js` for offline use).
- Bill reading uses the Claude Messages API with image input and streaming, called directly from the browser.
- Deployed by GitHub Actions to GitHub Pages (`.github/workflows/pages.yml`) on every push to `main`.

## Deploy setup (one time)

In the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. Every push to `main` then publishes the site.

## Roadmap ideas

- Cloud sync across devices (e.g. Supabase or Firebase) with login
- A small backend proxy so the API key isn't needed on the phone
- Price alerts when an item you buy often goes up by more than X%
- Store-to-store price comparison for the same item
