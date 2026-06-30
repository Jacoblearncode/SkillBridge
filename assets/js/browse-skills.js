"use strict";

const skills = [
  {
    title: "Graphic Design Sprint",
    category: "Design",
    helper: "Ariana V.",
    jobs: 32,
    rate: "From $18/hr",
    tags: ["Branding", "Social Media", "Figma"],
  },
  {
    title: "Excel Automation & Reporting",
    category: "Coding",
    helper: "Daniel P.",
    jobs: 26,
    rate: "From $14/hr",
    tags: ["Excel", "VBA", "Dashboards"],
  },
  {
    title: "Math Tutoring Sessions",
    category: "Tutoring",
    helper: "Meera K.",
    jobs: 41,
    rate: "Skill swap accepted",
    tags: ["Algebra", "Calculus", "Exam Prep"],
  },
  {
    title: "Short-form Video Editing",
    category: "Video Editing",
    helper: "Ishaan R.",
    jobs: 19,
    rate: "From $20/hr",
    tags: ["Reels", "TikTok", "Premiere Pro"],
  },
  {
    title: "Furniture Assembly Help",
    category: "Handyman",
    helper: "Leo S.",
    jobs: 54,
    rate: "From $12/hr",
    tags: ["Assembly", "Fixes", "Home Help"],
  },
  {
    title: "Portfolio & Resume Coaching",
    category: "Career Help",
    helper: "Nyla T.",
    jobs: 37,
    rate: "From $16/hr",
    tags: ["Resume", "Interview", "LinkedIn"],
  },
  {
    title: "Landing Page Prototype",
    category: "Coding",
    helper: "Karan M.",
    jobs: 22,
    rate: "From $25/hr",
    tags: ["HTML", "CSS", "UI"],
  },
  {
    title: "Poster & Event Flyer Design",
    category: "Design",
    helper: "Samira L.",
    jobs: 17,
    rate: "From $15/hr",
    tags: ["Print", "Canva", "Illustrator"],
  },
  {
    title: "Dog Walking & Pet Sitting",
    category: "Pet Care",
    helper: "Raj P.",
    jobs: 41,
    rate: "From $12/hr",
    tags: ["Dog Walking", "Pet Sitting", "Same Day"],
  },
  {
    title: "Flight & Bus Ticket Booking",
    category: "Errands",
    helper: "Lina H.",
    jobs: 54,
    rate: "From $10/task",
    tags: ["Booking", "Travel", "Same Day"],
  },
  {
    title: "Medical Clinic Queue Service",
    category: "Errands",
    helper: "Ali F.",
    jobs: 29,
    rate: "From $8/task",
    tags: ["Queueing", "Clinic", "Government"],
  },
  {
    title: "Grocery & Errand Delivery",
    category: "Errands",
    helper: "Marco T.",
    jobs: 63,
    rate: "From $8/task",
    tags: ["Grocery", "Delivery", "Same Day"],
  },
  {
    title: "Event & Product Photography",
    category: "Photography",
    helper: "Carlos M.",
    jobs: 22,
    rate: "From $25/hr",
    tags: ["DSLR", "Events", "Products"],
  },
  {
    title: "Social Media Content Shoots",
    category: "Photography",
    helper: "Priya K.",
    jobs: 18,
    rate: "From $20/hr",
    tags: ["Instagram", "Reels", "Portraits"],
  },
  {
    title: "Home Wi-Fi & Device Setup",
    category: "Coding",
    helper: "Dev R.",
    jobs: 33,
    rate: "From $20/hr",
    tags: ["IT Help", "Setup", "Troubleshoot"],
  },
  {
    title: "Document Translation (EN↔MS)",
    category: "Tutoring",
    helper: "Amira Z.",
    jobs: 28,
    rate: "From $15/task",
    tags: ["Translation", "Malay", "English"],
  },
];

const searchInput = document.getElementById("skillSearchInput");
const chipsContainer = document.getElementById("skillFilterChips");
const grid = document.getElementById("skillGrid");
const resultsCount = document.getElementById("resultsCount");
const activeFilterLabel = document.getElementById("activeFilterLabel");
const emptyState = document.getElementById("emptyState");

if (
  !searchInput ||
  !chipsContainer ||
  !grid ||
  !resultsCount ||
  !activeFilterLabel ||
  !emptyState
) {
  console.warn(
    "Browse skills UI elements are missing; browse-skills.js was skipped.",
  );
} else {
  let activeFilter = "all";
  let searchTerm = "";

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  }

  function skillCardTemplate(skill) {
    const tagsMarkup = skill.tags
      .filter(Boolean)
      .map((tag) => `<span class="skill-tag">${esc(tag)}</span>`)
      .join("");

    // Live Firestore tasks link to the detail page; seed cards open profile modal.
    const action = skill.taskId
      ? `<a href="./task.html?id=${esc(skill.taskId)}" class="btn">View Task</a>`
      : `<button class="btn" data-profile-btn data-helper="${esc(skill.helper)}"
           data-title="${esc(skill.title)}" data-rate="${esc(skill.rate)}"
           data-tags="${esc(skill.tags.filter(Boolean).join(", "))}"
           data-jobs="${esc(String(skill.jobs))}">See Profile</button>`;

    return `
    <article class="skill-card">
      <h2 class="title-sm">${esc(skill.title)}</h2>
      <p class="skill-meta">${esc(skill.helper)}${skill.jobs ? " • " + skill.jobs + " jobs completed" : ""} • ${esc(skill.rate)}</p>
      <div class="skill-tags">${tagsMarkup}</div>
      ${action}
    </article>
  `;
  }

  // Helper profile modal (for hardcoded seed cards)
  function buildProfileModal() {
    if (document.getElementById("profileModal")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="modal-overlay" id="profileModal" role="dialog" aria-modal="true" aria-label="Helper profile">
        <div class="sb-modal" style="max-width:420px">
          <button class="sb-modal-close" aria-label="Close" id="profileClose">
            <ion-icon name="close-outline"></ion-icon>
          </button>
          <div id="profileBody"></div>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    document.getElementById("profileClose").addEventListener("click", closeProfileModal);
    document.getElementById("profileModal").addEventListener("click", (e) => {
      if (e.target === document.getElementById("profileModal")) closeProfileModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeProfileModal();
    });
  }

  function closeProfileModal() {
    const m = document.getElementById("profileModal");
    if (m) m.classList.remove("active");
  }

  function openProfileModal(data) {
    buildProfileModal();
    const initial = (data.helper || "?").charAt(0).toUpperCase();
    document.getElementById("profileBody").innerHTML = `
      <div style="text-align:center;margin-block-end:18px">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--blue-violet);
          display:flex;align-items:center;justify-content:center;margin:0 auto 10px;
          font-size:2.8rem;font-weight:700;color:var(--white)">${initial}</div>
        <h2 class="title-lg" style="color:var(--white)">${esc(data.helper)}</h2>
        <p style="color:var(--cadet-grey);font-size:1.4rem">${esc(data.title)}</p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-block-end:18px">
        ${data.tags.split(",").map(t => t.trim()).filter(Boolean)
          .map(t => `<span class="skill-tag">${esc(t)}</span>`).join("")}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;
        padding:12px;border-radius:var(--radius-8);background:var(--blue-violet_a10);
        border:1px solid hsla(262,83%,58%,0.3);margin-block-end:18px">
        <span style="color:var(--alice-blue-2);font-size:1.4rem">${data.jobs} jobs completed</span>
        <span style="color:hsl(146,56%,63%);font-weight:600;font-size:1.4rem">${esc(data.rate)}</span>
      </div>
      <a href="./contact.html" class="btn" style="width:100%;text-align:center">Hire via Contact</a>
    `;
    document.getElementById("profileModal").classList.add("active");
  }

  // Delegate profile button clicks on the skill grid
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-profile-btn]");
    if (!btn) return;
    openProfileModal({
      helper: btn.dataset.helper,
      title: btn.dataset.title,
      rate: btn.dataset.rate,
      tags: btn.dataset.tags,
      jobs: btn.dataset.jobs,
    });
  });

  function matchesSearch(skill, term) {
    if (!term) return true;

    const searchable = [
      skill.title,
      skill.category,
      skill.helper,
      skill.rate,
      ...skill.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(term);
  }

  // Live tasks posted through SkillBridge (populated when Firebase is active).
  let liveSkills = [];

  function allSkills() {
    return liveSkills.concat(skills);
  }

  function filteredSkills() {
    return allSkills().filter((skill) => {
      const categoryMatch =
        activeFilter === "all" || skill.category === activeFilter;
      const textMatch = matchesSearch(skill, searchTerm);
      return categoryMatch && textMatch;
    });
  }

  function renderSkills() {
    const filtered = filteredSkills();

    grid.innerHTML = filtered.map(skillCardTemplate).join("");

    resultsCount.textContent = `${filtered.length} skills found`;
    activeFilterLabel.textContent = `Filter: ${activeFilter === "all" ? "All" : activeFilter}`;
    emptyState.hidden = filtered.length > 0;
  }

  function setActiveChip(targetChip) {
    const chips = chipsContainer.querySelectorAll(".skill-chip");
    chips.forEach((chip) => chip.classList.remove("active"));
    targetChip.classList.add("active");
  }

  chipsContainer.addEventListener("click", (event) => {
    const chip = event.target.closest(".skill-chip");
    if (!chip) return;

    activeFilter = chip.dataset.filter;
    setActiveChip(chip);
    renderSkills();
  });

  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderSkills();
  });

  // Map a Firestore task doc onto the card shape this page already renders.
  function taskToSkill(task) {
    return {
      taskId: task.id,
      title: task.title || "Untitled task",
      category: task.category || "Other",
      helper: task.ownerName || "A neighbour",
      jobs: 0,
      rate: task.budget || task.payType || "Open offer",
      tags: [task.payType, task.type, task.location].filter(Boolean),
    };
  }

  // Connect to live tasks once the Firebase bridge is ready (module scripts
  // load after this classic script, so poll briefly for the bridge).
  let liveConnectAttempts = 0;
  function connectLiveSkills() {
    const tasksApi = window.SkillBridgeTasks;
    if (tasksApi && tasksApi.isReady()) {
      tasksApi.watchAll((tasks) => {
        liveSkills = tasks.map(taskToSkill);
        renderSkills();
      });
      return;
    }
    if (liveConnectAttempts++ < 20) setTimeout(connectLiveSkills, 250);
  }
  connectLiveSkills();

  renderSkills();
}
