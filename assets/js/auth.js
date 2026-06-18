/**
 * AUTH
 * -----------------------------------------------------------------------------
 * Sign up / log in (email+password and Google), log out, and live header state.
 *
 * Loaded as a module on every page. If Firebase isn't configured yet, this
 * module no-ops and leaves the existing header (the placeholder avatar) intact,
 * so the live site is unaffected until you paste your config.
 *
 * Exposes a small global bridge so non-module code (script.js) can react:
 *   window.SkillBridgeAuth = { isReady, getUser, openModal, signOut }
 */

import { isConfigured, auth, googleProvider, SDK } from "./firebase-config.js";

// Public bridge — always defined so callers can feature-detect with isReady().
window.SkillBridgeAuth = {
  isReady: () => false,
  getUser: () => null,
  openModal: () => {},
  signOut: () => {},
};

if (isConfigured) {
  const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
  } = await import(`${SDK}/firebase-auth.js`);
  const { doc, setDoc, serverTimestamp, getFirestore } = await import(
    `${SDK}/firebase-firestore.js`
  );
  const { db } = await import("./firebase-config.js");

  let currentUser = null;

  /* ----------------------------- Auth modal ----------------------------- */

  function buildModal() {
    if (document.getElementById("authModal")) return;

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal-overlay" id="authModal" role="dialog" aria-modal="true" aria-label="Sign in to SkillBridge">
        <div class="sb-modal" style="max-width:420px">
          <button class="sb-modal-close" aria-label="Close" data-auth-close>
            <ion-icon name="close-outline"></ion-icon>
          </button>

          <div class="auth-tabs" role="tablist">
            <button class="auth-tab active" data-auth-tab="login" role="tab">Log in</button>
            <button class="auth-tab" data-auth-tab="signup" role="tab">Sign up</button>
          </div>

          <h2 class="headline-md" data-auth-title style="color:var(--white);margin-bottom:14px">Welcome back</h2>

          <button class="auth-google-btn" type="button" data-auth-google>
            <ion-icon name="logo-google"></ion-icon>
            <span>Continue with Google</span>
          </button>

          <div class="auth-divider"><span>or</span></div>

          <form data-auth-form>
            <div data-auth-name-row hidden>
              <label class="sb-label" for="authName">Name</label>
              <input type="text" id="authName" class="sb-input" autocomplete="name" placeholder="Your name" />
            </div>

            <label class="sb-label" for="authEmail">Email</label>
            <input type="email" id="authEmail" class="sb-input" autocomplete="email" placeholder="you@example.com" required />

            <label class="sb-label" for="authPassword">Password</label>
            <input type="password" id="authPassword" class="sb-input" autocomplete="current-password" placeholder="At least 6 characters" minlength="6" required />

            <p class="auth-status" data-auth-status role="status" aria-live="polite"></p>

            <button class="btn" type="submit" style="width:100%;margin-top:6px" data-auth-submit>Log in</button>
          </form>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    const modal = document.getElementById("authModal");
    const titleEl = modal.querySelector("[data-auth-title]");
    const nameRow = modal.querySelector("[data-auth-name-row]");
    const submitBtn = modal.querySelector("[data-auth-submit]");
    const statusEl = modal.querySelector("[data-auth-status]");
    const form = modal.querySelector("[data-auth-form]");
    let mode = "login";

    function setMode(next) {
      mode = next;
      modal.querySelectorAll(".auth-tab").forEach((t) =>
        t.classList.toggle("active", t.dataset.authTab === next),
      );
      const isLogin = next === "login";
      titleEl.textContent = isLogin ? "Welcome back" : "Create your account";
      nameRow.hidden = isLogin;
      submitBtn.textContent = isLogin ? "Log in" : "Sign up";
      setStatus("");
    }

    function setStatus(msg, type) {
      statusEl.textContent = msg || "";
      statusEl.className = "auth-status" + (type ? " is-" + type : "");
    }

    modal.querySelectorAll("[data-auth-tab]").forEach((tab) =>
      tab.addEventListener("click", () => setMode(tab.dataset.authTab)),
    );
    modal
      .querySelector("[data-auth-close]")
      .addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    modal
      .querySelector("[data-auth-google]")
      .addEventListener("click", async () => {
        setStatus("Opening Google…", "loading");
        try {
          const cred = await signInWithPopup(auth, googleProvider);
          await ensureUserDoc(cred.user);
          closeModal();
        } catch (err) {
          setStatus(friendlyError(err), "error");
        }
      });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = modal.querySelector("#authName").value.trim();
      const email = modal.querySelector("#authEmail").value.trim();
      const password = modal.querySelector("#authPassword").value;

      setStatus(mode === "login" ? "Signing in…" : "Creating account…", "loading");
      submitBtn.disabled = true;
      try {
        if (mode === "login") {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          if (name) await updateProfile(cred.user, { displayName: name });
          await ensureUserDoc(cred.user, name);
        }
        closeModal();
      } catch (err) {
        setStatus(friendlyError(err), "error");
      } finally {
        submitBtn.disabled = false;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    modal._setMode = setMode;
    modal._setStatus = setStatus;
  }

  function openModal(mode = "login") {
    buildModal();
    const modal = document.getElementById("authModal");
    modal._setMode(mode);
    modal.classList.add("active");
    modal.querySelector("#authEmail").focus();
  }

  function closeModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.classList.remove("active");
  }

  /* --------------------------- User profile doc --------------------------- */

  async function ensureUserDoc(user, nameOverride) {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: nameOverride || user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (err) {
      console.warn("[SkillBridge] could not write user doc:", err);
    }
  }

  /* ---------------------------- Header injection -------------------------- */

  function renderHeader(user) {
    document.querySelectorAll(".header-action").forEach((action) => {
      let slot = action.querySelector("[data-auth-slot]");
      if (!slot) {
        slot = document.createElement("div");
        slot.setAttribute("data-auth-slot", "");
        slot.style.display = "flex";
        slot.style.alignItems = "center";
        // Replace the static placeholder avatar button if present.
        const placeholder = action.querySelector(".profil-btn");
        if (placeholder) placeholder.replaceWith(slot);
        else action.insertBefore(slot, action.querySelector(".nav-toggle-btn"));
      }

      if (user) {
        const initial = (user.displayName || user.email || "?")
          .charAt(0)
          .toUpperCase();
        const avatar = user.photoURL
          ? `<img src="${user.photoURL}" alt="" class="img-cover" />`
          : `<span class="auth-avatar-initial">${initial}</span>`;
        slot.innerHTML = `
          <div class="auth-menu">
            <button class="btn-icon profil-btn" data-auth-menu-btn
              aria-label="Account: ${user.displayName || user.email}" aria-haspopup="true" aria-expanded="false">
              ${avatar}
            </button>
            <div class="auth-dropdown" data-auth-dropdown hidden>
              <p class="auth-dropdown-name">${user.displayName || "Signed in"}</p>
              <p class="auth-dropdown-email">${user.email || ""}</p>
              <a href="./dashboard.html" class="auth-dropdown-item">Dashboard</a>
              <button class="auth-dropdown-item" data-auth-logout>Log out</button>
            </div>
          </div>`;
        const btn = slot.querySelector("[data-auth-menu-btn]");
        const dd = slot.querySelector("[data-auth-dropdown]");
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const open = dd.hidden;
          dd.hidden = !open;
          btn.setAttribute("aria-expanded", String(open));
        });
        document.addEventListener("click", () => (dd.hidden = true));
        slot
          .querySelector("[data-auth-logout]")
          .addEventListener("click", () => signOut(auth));
      } else {
        slot.innerHTML = `<button class="btn auth-login-btn" data-auth-open>Log in</button>`;
        slot
          .querySelector("[data-auth-open]")
          .addEventListener("click", () => openModal("login"));
      }
    });
  }

  /* ------------------------------- Wire up -------------------------------- */

  function friendlyError(err) {
    const code = (err && err.code) || "";
    const map = {
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/wrong-password": "Incorrect email or password.",
      "auth/user-not-found": "No account with that email.",
      "auth/email-already-in-use": "That email already has an account — try logging in.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/invalid-email": "That email address looks invalid.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/unauthorized-domain":
        "This domain isn't authorized in Firebase. Add it under Auth > Settings > Authorized domains.",
    };
    return map[code] || "Something went wrong. Please try again.";
  }

  window.SkillBridgeAuth = {
    isReady: () => true,
    getUser: () => currentUser,
    openModal,
    signOut: () => signOut(auth),
  };

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    renderHeader(user);
    document.dispatchEvent(
      new CustomEvent("sb:authchange", { detail: { user } }),
    );
  });
}
