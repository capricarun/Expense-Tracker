# Bill Ledger — Expense Tracker

Scan your grocery, supermarket and textile bills with your phone camera, and see how the price of each item changes month by month and across financial years (April–March).

**Live app:** https://capricarun.github.io/Expense-Tracker/

## What it does

- **Scan bills.** Take a photo of a bill, or pick several photos for a long one. With several photos, you can remove any wrong ones before the bill is read. Saved bills can have photos added or deleted later. Claude reads the store, date, and every item with its quantity and amount.
- **Categories.** Each bill is sorted automatically into one of these, and you can change it on the review screen:
  - Grocery, Supermarket, Essentials
  - Fashion, Textiles, Eat out
  - Medical, Utilities, Auto, Travel
  - Education, Fitness, Entertainment, Other
  
  Reports can be filtered by any category you have bills in.
- **Check before saving.** After a scan you see a read-only summary of the bill. Tap **Edit** only if something was misread. A warning appears if the items don't add up to the bill total.
- **Duplicate alert.** If a scanned bill looks like one you've already saved, you get a warning and must confirm before saving. A bill counts as a likely duplicate if any of these match:
  - the same bill number
  - the same store, date and total
  - the same items on the same day
  - the same photo, matched by a fingerprint of the cleaned image
- **Swipe to delete.** Swipe a bill left to reveal a red trash icon and **Delete**. An **Undo** button appears for a few seconds afterwards.
- **Fair comparisons.** Every price becomes a price per kg, litre, piece or metre, so a 500 g pack and a 1 kg bag compare correctly.
- **One product across bills.** "Track as" groups the same product even when different shops print it differently.
- **Reports.** Compare any month or financial year with another, filter by grocery, supermarket or textiles, and see:
  - price change per item
  - average price change, weighted by what you spend
  - spending over time
- **Item history.** A price chart, averages for each financial year, and every purchase.
- **Cloud backup.** Sign in with email and password and every bill is copied to your private cloud account. If you lose or reset your phone, sign in on any device and everything comes back. It works offline and catches up when you're back online.
- **Export.** Reports has **Download report ▾** and **Download all purchases ▾** menus. Each offers CSV, Excel (.xlsx) or PDF, filtered by the selected Type. Settings also has a full JSON backup and restore.
- **Works like an app.** You can install it on your home screen and it opens offline.

## Use it on your phone

1. Open the live app link on your phone.
2. **Android (Chrome):** tap ⋮ → **Add to Home screen** / **Install app**.
   **iPhone (Safari):** tap Share → **Add to Home Screen**.
3. Open **Settings** (the gear icon) and paste your Anthropic API key so bills can be read from photos. You can create a key at https://console.anthropic.com/settings/keys. Without a key, you can still enter items by hand.
4. Tap **Try with sample data** to see the reports with example bills, then remove the samples from Settings.

## How your data is stored

- **On the phone:** every bill is saved in the browser's storage right away, so the app works offline. The app also asks the browser not to auto-clear this storage.
- **In the cloud (when signed in):** every bill and its photo is also copied to your own account in **Google Firebase** (Cloud Firestore, Mumbai region), at `users/{your-uid}/bills/{billId}`. The [Firestore security rules](firestore.rules) mean each account can only ever read or write its own bills.
- **Recovery:** on a new or reset phone, open the app, tap **Sign in to restore your bills**, sign in with Google or email, and everything downloads. Deletions sync too, and if the same bill is edited on two devices, the newest edit wins.
- **Bill photos** are kept with each bill as a scanned-document copy:
  - **Cropped:** the bill's edges are found automatically and the table or background is cut away.
  - **Straightened:** a photo taken at an angle is flattened into a rectangle.
  - **Cleaned:** shadows and uneven light are removed, giving white paper with dark grey or black text.
  - **Small:** usually 40–100 KB.
  
  Whenever you add a photo, the **Adjust** screen opens:
  - **Fit to bill:** drag the four corners onto the bill's edges.
  - **Rotate 90°:** turn a sideways photo upright.
  - **Straighten:** fine-tune the angle by up to ±15°; the page grows so nothing is cut off.
  - **Preview:** shows exactly how the bill will be saved. White bills on white tables are trimmed to the printed area. Open a bill and tap its photo to view or zoom. Photos are stored on the phone (IndexedDB) and backed up to Firestore at `users/{uid}/photos/{photoId}`. On a new phone, each photo downloads the first time you open its bill.
- **Your API key** is stored only in your browser.
- **Extra safety:** **Settings → Download backup** gives you a file copy, including photos, any time you want one.

## Cloud backup setup (already done for this repo)

Firebase project `expense-tracker-fef8f` is on the free Spark plan:
1. **Authentication:**
   - Sign-in methods: **Email/Password** and **Google** are enabled.
   - Authorized domains: `capricarun.github.io` is added.
2. **Firestore Database:** Standard edition, location `asia-south1`, production mode.
3. **Rules:** the contents of [`firestore.rules`](firestore.rules) are published in Firestore → Rules.
4. **Web app config:** in [`config.js`](config.js). The values only identify the project and are safe to publish, because the rules protect the data.

To use your own Firebase project instead, repeat these steps and replace the values in `config.js`.

## Tech

- Document scan runs entirely in the browser with no libraries:
  - Finds the bill as the largest "bright and colourless" region (Otsu threshold and connected components), which stays reliable in shadows and on coloured tables.
  - Corner detection, then a perspective warp (homography with bilinear sampling).
  - Background normalisation to remove shadows, plus levels to make the paper white.
- One static `index.html`: vanilla JavaScript and hand-built SVG charts, with no build step and no dependencies.
- Installable as a PWA (`manifest.webmanifest`, plus `sw.js` for offline use).
- Bill reading uses the Claude Messages API with image input and streaming, called directly from the browser.
- Cloud backup: Firebase Authentication (Google or email + password) and Cloud Firestore with per-user security rules. Sync is local-first: there's a queue of unsynced changes, deletes are soft (a `deleted` flag) so other devices learn about them, the newest `updatedAt` wins in a conflict, and writes are batched.
- Deployed by GitHub Actions to GitHub Pages (`.github/workflows/pages.yml`) on every push to `main`.

## Deploy setup (one time)

In the repo, go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. Every push to `main` then publishes the site.

## Roadmap ideas

- A small backend proxy so the API key isn't needed on the phone
- Price alerts when an item you buy often goes up by more than X%
- Store-to-store price comparison for the same item
