/**
 * FIREBASE CONFIG
 * -----------------------------------------------------------------------------
 * 1. Create a Firebase project: https://console.firebase.google.com/
 * 2. Build > Authentication > enable "Email/Password" and "Google" providers.
 * 3. Build > Firestore Database > create database.
 * 4. Project settings > Your apps > Web app > copy the config object below.
 * 5. Authentication > Settings > Authorized domains: add
 *      - localhost
 *      - jacoblearncode.github.io
 *
 * NOTE: These values are PUBLIC by design (they ship in client code). Security
 * comes from Firestore rules (see firestore.rules), not from hiding this config.
 *
 * Until real values are pasted below, the whole Firebase layer stays dormant
 * and the site keeps working exactly as before (existing simulation).
 */

const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID",
};

// True only once real values have replaced every PASTE_ placeholder.
export const isConfigured = !Object.values(firebaseConfig).some((value) =>
  String(value).startsWith("PASTE_"),
);

const SDK = "https://www.gstatic.com/firebasejs/11.6.1";

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isConfigured) {
  const { initializeApp } = await import(`${SDK}/firebase-app.js`);
  const { getAuth, GoogleAuthProvider } = await import(`${SDK}/firebase-auth.js`);
  const { getFirestore } = await import(`${SDK}/firebase-firestore.js`);

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} else {
  console.info(
    "[SkillBridge] Firebase not configured yet — running in demo/simulation mode. " +
      "Paste your config into assets/js/firebase-config.js to enable live auth & tasks.",
  );
}

export { app, auth, db, googleProvider, SDK };
