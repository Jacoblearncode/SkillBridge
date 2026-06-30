/**
 * TASKS (extended)
 * -----------------------------------------------------------------------------
 * Phase 1 + Phase 2 additions:
 *   - watchTask(taskId, cb)       single task listener for task.html
 *   - createRequest(...)          helper "I can help" → requests/ collection
 *   - updateTaskStatus(...)       owner marks task done on Dashboard
 *   - addSubscriber(email)        newsletter form → subscribers/ collection
 */

import { isConfigured, db, SDK } from "./firebase-config.js";

window.SkillBridgeTasks = {
  isReady: () => false,
  createTask: async () => { throw new Error("Firebase not configured"); },
  watchAll: () => () => {},
  watchMine: () => () => {},
  watchTask: () => () => {},
  createRequest: async () => { throw new Error("Firebase not configured"); },
  updateTaskStatus: async () => { throw new Error("Firebase not configured"); },
  addSubscriber: async () => { throw new Error("Firebase not configured"); },
};

if (isConfigured) {
  const {
    collection,
    doc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    setDoc,
    getDocs,
    limit,
  } = await import(`${SDK}/firebase-firestore.js`);

  const tasksCol = collection(db, "tasks");
  const requestsCol = collection(db, "requests");
  const subsCol = collection(db, "subscribers");

  async function createTask(data, user) {
    if (!user) throw new Error("Must be signed in to post a task.");
    return addDoc(tasksCol, {
      title: data.title || "",
      category: data.category || "",
      type: data.type || "",
      when: data.when || "",
      location: data.location || "",
      desc: data.desc || "",
      payType: data.payType || "",
      budget: data.budget || "",
      ownerId: user.uid,
      ownerName: user.displayName || user.email || "Someone",
      status: "open",
      createdAt: serverTimestamp(),
    });
  }

  function watchAll(callback) {
    const q = query(tasksCol, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("[SkillBridge] watchAll failed:", err),
    );
  }

  function watchMine(uid, callback) {
    const q = query(
      tasksCol,
      where("ownerId", "==", uid),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      q,
      (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("[SkillBridge] watchMine failed:", err),
    );
  }

  function watchTask(taskId, callback) {
    const ref = doc(db, "tasks", taskId);
    return onSnapshot(
      ref,
      (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (err) => console.warn("[SkillBridge] watchTask failed:", err),
    );
  }

  async function createRequest(taskId, taskOwnerName, message, user) {
    if (!user) throw new Error("Must be signed in to offer help.");
    return addDoc(requestsCol, {
      taskId,
      taskOwnerName: taskOwnerName || "",
      helperId: user.uid,
      helperName: user.displayName || user.email || "A helper",
      message: message || "",
      status: "pending",
      createdAt: serverTimestamp(),
    });
  }

  async function updateTaskStatus(taskId, status, user) {
    if (!user) throw new Error("Must be signed in.");
    const ref = doc(db, "tasks", taskId);
    return updateDoc(ref, { status, updatedAt: serverTimestamp() });
  }

  async function addSubscriber(email) {
    const emailLower = (email || "").trim().toLowerCase();
    if (!emailLower) throw new Error("Email required.");
    // Use email as doc ID to naturally deduplicate.
    const ref = doc(subsCol, emailLower.replace(/[.#$/[\]]/g, "_"));
    return setDoc(ref, { email: emailLower, subscribedAt: serverTimestamp() }, { merge: true });
  }

  window.SkillBridgeTasks = {
    isReady: () => true,
    createTask,
    watchAll,
    watchMine,
    watchTask,
    createRequest,
    updateTaskStatus,
    addSubscriber,
  };
}
