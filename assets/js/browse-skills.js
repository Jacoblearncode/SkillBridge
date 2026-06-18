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

  function skillCardTemplate(skill) {
    const tagsMarkup = skill.tags
      .map((tag) => `<span class="skill-tag">${tag}</span>`)
      .join("");

    return `
    <article class="skill-card">
      <h2 class="title-sm">${skill.title}</h2>
      <p class="skill-meta">${skill.helper} • ${skill.jobs} jobs completed • ${skill.rate}</p>
      <div class="skill-tags">${tagsMarkup}</div>
      <a href="./contact.html" class="btn">Request Help</a>
    </article>
  `;
  }

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
