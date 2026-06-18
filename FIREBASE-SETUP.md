# Firebase Setup (Phase 1 — Auth + Tasks)

The site now ships with a Firebase layer that stays **dormant** until you add
your project config. Until then, everything works exactly as the original
demo/simulation. Once configured, you get real Google + email/password sign-in,
persisted task posting, a live Browse feed, and a personal Dashboard.

## 1. Create the project (~10 min, one time)

1. Go to https://console.firebase.google.com/ and **Add project** (free Spark plan).
2. **Build → Authentication → Get started**, then enable:
   - **Email/Password**
   - **Google**
3. **Build → Firestore Database → Create database** (start in test mode).
4. **Project settings (gear) → Your apps → Web app (`</>`)** → register an app →
   copy the `firebaseConfig` object.
5. **Authentication → Settings → Authorized domains** → add:
   - `localhost`
   - `jacoblearncode.github.io`

## 2. Paste your config

Open `assets/js/firebase-config.js` and replace the `PASTE_*` placeholders in
`firebaseConfig` with the values you copied. That single change activates the
whole feature set. (These values are public by design — safety comes from rules.)

## 3. Publish security rules

In **Firestore Database → Rules**, paste the contents of `firestore.rules` and
**Publish**.

## 4. (Optional) Seed sample tasks for a demo

So Browse looks populated during a pitch:

1. Temporarily add before `</body>` on any page:
   ```html
   <script type="module" src="./assets/js/seed.js"></script>
   ```
2. Open that page, then in the browser dev console run:
   ```js
   await seedSkillBridge()
   ```
3. Remove the temporary script tag.

## What you can demo after setup

- **Log in** (Google one-click or email/password) — header shows your account.
- **Post a Task** (header `+` or hero button) — saves to Firestore.
- **Browse Skills** — your posted task appears live alongside the samples.
- **Dashboard** (`dashboard.html`) — lists the tasks you've posted, in real time.

## What's intentionally still simulated (Phase 2)

- The helper match carousel after posting (real helper responses come later).
- Reviews/ratings, helper profiles, and the "Request Help" → request record.
