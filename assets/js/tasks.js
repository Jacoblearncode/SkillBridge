/**
 * TASKS
 * -----------------------------------------------------------------------------
 * Create tasks in Firestore and read them for Browse + Dashboard.
 *
 * Exposes a global bridge so non-module code (script.js) can persist a task
 * created via the existing "Post a Task" modal:
 *   window.SkillBridgeTasks = { isReady, createTask, watchAll, watchMine }
 *
 * If Firebase isn't configured, isReady() returns false and callers fall back
 * to the existing simulation.
 */

import { isConfigured, db, SDK } from "./firebase-config.js";

window.SkillBridgeTasks = {
  isReady: () => false,
  createTask: async () => {
    throw new Error("Firebase not configured");
  },
  watchAll: () => () => {},
  watchMine: () => () => {},
};

if (isConfigured) {
  const {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
  } = await import(`${SDK}/firebase-firestore.js`);

  const tasksCol = collection(db, "tasks");

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

  // Live stream of all open tasks (newest first). Returns an unsubscribe fn.
  function watchAll(callback) {
    const q = query(tasksCol, orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("[SkillBridge] watchAll failed:", err),
    );
  }

  // Live stream of tasks owned by a given user.
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

  window.SkillBridgeTasks = {
    isReady: () => true,
    createTask,
    watchAll,
    watchMine,
  };
}
