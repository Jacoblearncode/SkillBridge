/**
 * SEED (one-time, manual)
 * -----------------------------------------------------------------------------
 * Populates Firestore with sample tasks so Browse looks alive for a pitch/demo.
 *
 * HOW TO RUN (only once, after Firebase is configured):
 *   1. Temporarily add to any page before </body>:
 *        <script type="module" src="./assets/js/seed.js"></script>
 *   2. Open that page in the browser, then in the dev console run:
 *        await seedSkillBridge()
 *   3. Remove the script tag afterwards.
 *
 * Safe to run more than once, but it will add duplicate sample docs each time.
 */

import { isConfigured, db, SDK } from "./firebase-config.js";

const SAMPLE_TASKS = [
  { title: "Graphic Design Sprint", category: "Design", ownerName: "Ariana V.", payType: "Per Hour", budget: "From $18/hr", desc: "Branding, social media graphics, and Figma touch-ups.", location: "Online", type: "Online / Remote", when: "This Week" },
  { title: "Excel Automation & Reporting", category: "Coding & Tech", ownerName: "Daniel P.", payType: "Per Hour", budget: "From $14/hr", desc: "Formula fixes, pivot tables, and VBA automation.", location: "Online", type: "Online / Remote", when: "Flexible" },
  { title: "Math Tutoring Sessions", category: "Tutoring", ownerName: "Meera K.", payType: "Skill Swap", budget: "Skill swap accepted", desc: "Algebra, calculus, and exam prep.", location: "Online", type: "Either", when: "This Week" },
  { title: "Short-form Video Editing", category: "Video Editing", ownerName: "Ishaan R.", payType: "Per Hour", budget: "From $20/hr", desc: "Reels, TikTok, and Premiere Pro edits.", location: "Online", type: "Online / Remote", when: "This Week" },
  { title: "Furniture Assembly Help", category: "Handyman", ownerName: "Leo S.", payType: "Per Hour", budget: "From $12/hr", desc: "Assembly, fixes, and general home help.", location: "Neighbourhood", type: "In-Person", when: "This Week" },
  { title: "Portfolio & Resume Coaching", category: "Career Help", ownerName: "Nyla T.", payType: "Fixed Rate", budget: "From $16/hr", desc: "Resume rewrites, interview prep, and LinkedIn.", location: "Online", type: "Online / Remote", when: "Flexible" },
  { title: "Landing Page Prototype", category: "Coding & Tech", ownerName: "Karan M.", payType: "Per Hour", budget: "From $25/hr", desc: "HTML, CSS, and UI prototyping.", location: "Online", type: "Online / Remote", when: "This Month" },
  { title: "Document Translation (EN↔MS)", category: "Tutoring", ownerName: "Amira Z.", payType: "Fixed Rate", budget: "From $15/task", desc: "English ↔ Malay translation.", location: "Online", type: "Online / Remote", when: "This Week" },
];

window.seedSkillBridge = async function seedSkillBridge() {
  if (!isConfigured) {
    console.warn("[SkillBridge] Configure Firebase first, then re-run.");
    return;
  }
  const { collection, addDoc, serverTimestamp } = await import(
    `${SDK}/firebase-firestore.js`
  );
  const col = collection(db, "tasks");
  for (const t of SAMPLE_TASKS) {
    await addDoc(col, {
      ...t,
      ownerId: "seed",
      status: "open",
      createdAt: serverTimestamp(),
    });
  }
  console.info(`[SkillBridge] Seeded ${SAMPLE_TASKS.length} sample tasks.`);
};

console.info("[SkillBridge] seed ready — run: await seedSkillBridge()");
