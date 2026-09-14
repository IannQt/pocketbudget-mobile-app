# PocketBudget

A private expense tracker with real Google Sign-In, multiple labeled
accounts (cash, e-wallets like GCash/Maya/GoTyme, and Philippine banks),
income and expenses, budgets, savings goals, debts, and recurring bills.
Built to be compiled into a real installable Android APK you can send to
friends.

**Important — how sharing this works:** each person who installs the APK
and signs in with Google gets their **own private, local copy** of the data
on their own phone. Signing in with Google here only proves who's using the
app — it does **not** sync your data with your friend's. If you want shared
or synced data across phones, that requires a backend server, which is a
bigger separate project.

**Stack:** React Native · Expo · React Navigation · AsyncStorage (local storage) · `@react-native-google-signin/google-signin` (native Google auth)

---

## Why this is different from before

Google Sign-In requires native code that **doesn't run in Expo Go** — the
app you've been testing with. From here on, you'll build a real custom APK
using Expo's cloud build service (EAS Build) instead. This is a bigger
one-time setup, but the result is a real, shareable, installable app — which
is what you asked for.

There are three stages: **(1)** set up credentials in Google Cloud Console,
**(2)** paste one value into the code, **(3)** run the EAS build.

---

## Stage 1 — Google Cloud Console setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and sign in with the Google account you want to develop with.
2. Create a new project (top-left project dropdown → "New Project"). Name it anything, e.g. "PocketBudget".
3. In the search bar, search for **"OAuth consent screen"** and open it.
   - User type: **External**.
   - Fill in the app name (PocketBudget), your email for support and developer contact.
   - You can leave scopes/test users as default for now and publish, or add yourself as a test user — either works for personal use.
4. In the search bar, search for **"Credentials"** and open it.
5. Click **"+ Create Credentials" → "OAuth client ID"**.
   - Application type: **Web application** (yes, Web — this is required even though the app is Android; the Google Sign-In library needs this "Web client ID" internally).
   - Name it anything, e.g. "PocketBudget Web".
   - Click Create. **Copy the Client ID** that appears (looks like `123456-abc.apps.googleusercontent.com`) — you'll need it in Stage 2.
6. Click **"+ Create Credentials" → "OAuth client ID"** again.
   - Application type: **Android**.
   - Package name: `com.pocketbudget.app` (already set in this project — must match exactly).
   - SHA-1 certificate fingerprint: you'll get this from EAS in Stage 3, **step 2** — come back to add it here once you have it. You can create this Android credential now and edit it later to add the SHA-1, or wait until you have the SHA-1 and create it then.

---

## Stage 2 — Add your Web Client ID to the code

1. Open `context/AuthContext.js` in this project.
2. Find this line near the top:
   ```js
   const WEB_CLIENT_ID = "PASTE_YOUR_WEB_CLIENT_ID_HERE.apps.googleusercontent.com";
   ```
3. Replace the placeholder with the **Web application** Client ID you copied in Stage 1, step 5. Save the file.

---

## Stage 3 — Build the APK with EAS

You'll need Node.js installed (already done) and your Expo account (already logged in from before).

1. Install the EAS CLI and log in:
   ```powershell
   npm install -g eas-cli
   eas login
   ```
2. From inside the project folder, run:
   ```powershell
   eas credentials
   ```
   Choose **Android**, then **preview** (or production), and select "Keystore: Manage everything needed to build your project" → it will generate one automatically the first time. Once generated, this same menu shows you the **SHA-1 fingerprint** — copy it.
3. Go back to Google Cloud Console → Credentials → your **Android** OAuth client from Stage 1, step 6 → paste the SHA-1 there → Save.
4. Now build the APK:
   ```powershell
   eas build --platform android --profile preview
   ```
   This uploads your project and builds it on Expo's servers — takes roughly 10–20 minutes. You'll get a link when it's done (also viewable at [expo.dev](https://expo.dev) under your project's Builds tab).
5. Open that link on your phone, or download the `.apk` file to your computer and transfer it (email, USB, Google Drive, etc.) to any Android phone.

## Installing the APK on a phone

Android blocks installing apps from outside the Play Store by default.

1. Open the `.apk` file on the phone (from the download, file manager, or the link from step 5 above).
2. Android will prompt "Install unknown apps" — allow it for that source (usually the Files app or your browser).
3. Tap Install. Once done, open PocketBudget and sign in with Google.

Your friend does the same with the same APK file — they'll sign in with **their own** Google account, and get their own separate, private data on their own phone.

---

## Features

- **Sign in two ways** — Google Sign-In, or create a local email/password account right on the device (no server, so a local account only works on that one phone — no password recovery, no cross-device login)
- A Profile screen (under More) shows your name, email/photo (if Google), and which method you used, with a working sign-out
- **Accounts** — cash, e-wallets (GCash, Maya, GoTyme, Coins.ph), Philippine banks (Landbank, BDO, BPI, Metrobank, UnionBank, Security Bank, PNB, Chinabank), cards, or other — each with its own balance. This labels and tracks accounts manually; it does **not** connect to or sync with your real bank/e-wallet accounts (see note below).
- **Income & expenses** — logged separately, with a running net worth total
- **Budgets** — monthly limit per expense category, with an over-budget warning
- **Savings goals** — set a target, contribute toward it, track progress
- **Debts** — money owed to you and money you owe, mark settled
- **Recurring bills** — subscriptions and regular payments, shown as "Upcoming" on Home
- **History** — every transaction, filterable
- **Export** — share your transaction history as a CSV file
- Everything (except sign-in) works fully offline

### A note on "connecting" bank accounts

There's no real API access to Landbank, GCash, GoTyme, or any bank/e-wallet
here — that requires a formal partnership or license (similar to how Plaid
works with US banks), which is out of reach for a personal project. What
this app does instead: you pick the right institution when creating an
account (so it shows the right name, icon, and color), and enter/update the
balance yourself. It looks and feels like your real accounts, but the
numbers are only as accurate as what you type in.

## Project structure

```
budget-tracker/
  App.js                        Login gate + navigation (tabs + nested "More" stack)
  eas.json                      Build configuration for the Android APK
  context/
    AuthContext.js               Google Sign-In state + AsyncStorage persistence
    AppContext.js                Budget data (accounts, transactions, budgets, goals, debts, recurring)
  screens/
    LoginScreen.js                Google Sign-In screen
    HomeScreen.js                 Dashboard
    AddTransactionScreen.js       Log income/expense, optionally as recurring
    AccountsScreen.js             Accounts list + balances
    GoalsScreen.js                 Savings goals
    more/
      MoreScreen.js                Hub: Profile, History, Budgets, Debts, Recurring, Export
      ProfileScreen.js             User info + sign out
      HistoryScreen.js
      BudgetsScreen.js
      DebtsScreen.js
      RecurringScreen.js
  components/                    Reusable UI: pickers, progress bars, charts, modals
  utils/                         Categories/institutions, formatting, CSV export
```

## Testing quickly with Expo Go (QR code) before building an APK

Building an APK takes 10-20 minutes each time, so for day-to-day checking
of how things look, use Expo Go like before:
```powershell
npx expo start
```
Scan the QR code as usual. **One thing won't work here: the "Continue with
Google" button.** That's expected — native Google Sign-In only works in a
real built app, not Expo Go. Everything else, including the email/password
"Create account" login, the PDF/CSV export, and every screen and feature,
works normally in Expo Go. Use email/password to log in while testing this
way, and only build the APK when you want to test Google Sign-In itself or
you're ready to share a build.

## App icon / logo

`assets/icon.png`, `assets/adaptive-icon.png`, and `assets/splash-icon.png`
are the app's icon (a wallet mark in the app's pine-and-gold palette),
referenced from `app.json`. The same icon is embedded in the PDF export
header (via `utils/logoBase64.js`) and shown on the Login screen. To change
the logo, replace `assets/icon.png` (and regenerate the other two sized
versions) and re-run the EAS build.

## Rebuilding after code changes

Every time you edit the code and want a new APK, re-run:
```powershell
eas build --platform android --profile preview
```
You do **not** need to repeat the Google Cloud Console setup unless you
change the package name or generate a new keystore.

## What to say about this project in interviews

This version adds authentication (native OAuth via Google, session
persistence, a protected navigation gate), a real native-build pipeline
(EAS Build producing a signed, installable APK — not just Expo Go), and a
domain-specific account model (institution-aware labeling). Good material
for discussing auth flows, build/release pipelines, and the difference
between a managed Expo Go workflow and a custom native build.
