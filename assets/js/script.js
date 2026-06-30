"use strict";

/**
 * NAVBAR TOGGLE FOR MOBILE
 */

const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelector("[data-nav-toggler]");

navToggler.addEventListener("click", function () {
  navbar.classList.toggle("active");
  this.classList.toggle("active");
});

// Close navbar when any nav link is clicked (fixes mobile menu staying open)
document.querySelectorAll(".navbar-link").forEach(function (link) {
  link.addEventListener("click", function () {
    navbar.classList.remove("active");
    navToggler.classList.remove("active");
  });
});

/**
 * HEADER & BACK TOP BTN
 * header and back top btn visible when window scroll down to 200px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const activeElementOnScroll = function () {
  if (window.scrollY > 200) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
};

window.addEventListener("scroll", activeElementOnScroll);

/**
 * REVEAL ON SCROLL
 */

const initRevealAnimations = function () {
  const revealElements = document.querySelectorAll("[data-reveal]");

  if (!revealElements.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  revealElements.forEach(function (element) {
    const delay = element.getAttribute("data-reveal-delay");
    if (delay) {
      element.style.setProperty("--reveal-delay", delay);
    }

    if (reduceMotion) {
      element.classList.add("is-visible");
    }
  });

  if (reduceMotion) return;

  const revealObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach(function (element) {
    revealObserver.observe(element);
  });
};

initRevealAnimations();

/**
 * ANIMATED STAT COUNTERS
 * Reads data-count-to / data-count-prefix / data-count-suffix and counts
 * up from 0 when the element scrolls into view.
 */

const initCounters = function () {
  const counterEls = document.querySelectorAll("[data-count-to]");
  if (!counterEls.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const animateCounter = function (el) {
    const target = parseInt(el.getAttribute("data-count-to"), 10);
    const prefix = el.getAttribute("data-count-prefix") || "";
    const suffix = el.getAttribute("data-count-suffix") || "";
    const duration = 1400;
    const startTime = performance.now();

    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }

    const tick = function (now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(ease * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  counterEls.forEach(function (el) {
    counterObserver.observe(el);
  });
};

initCounters();

/**
 * SLIDER
 */

const sliders = document.querySelectorAll("[data-slider]");

const sliderInit = function (currentSlider) {
  const sliderContainer = currentSlider.querySelector(
    "[data-slider-container]",
  );
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");

  const totalSliderVisibleItems = Number(
    getComputedStyle(currentSlider).getPropertyValue("--slider-item"),
  );
  const totalSliderItems =
    sliderContainer.childElementCount - totalSliderVisibleItems;

  let currentSlidePos = 0;

  const moveSliderItem = function () {
    sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
  };

  /**
   * NEXT SLIDE
   */
  const slideNext = function () {
    const slideEnd = currentSlidePos >= totalSliderItems;

    if (slideEnd) {
      currentSlidePos = 0;
    } else {
      currentSlidePos++;
    }

    moveSliderItem();
  };

  sliderNextBtn.addEventListener("click", slideNext);

  /**
   * PREVIOUS SLIDE
   */
  const slidePrev = function () {
    if (currentSlidePos <= 0) {
      currentSlidePos = totalSliderItems;
    } else {
      currentSlidePos--;
    }

    moveSliderItem();
  };

  sliderPrevBtn.addEventListener("click", slidePrev);

  const dontHaveExtraItem = totalSliderItems <= 0;
  if (dontHaveExtraItem) {
    sliderNextBtn.setAttribute("disabled", "");
    sliderPrevBtn.setAttribute("disabled", "");
  }

  /**
   * AUTO SLIDE
   */
  // Auto slide every 3 seconds, but pause on hover to allow users to interact with the slider
  let autoSlideInterval;

  const startAutoSlide = () =>
    (autoSlideInterval = setInterval(slideNext, 3000)); // Change 3000 to adjust auto-slide speed (in milliseconds)
  startAutoSlide();
  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  currentSlider.addEventListener("mouseover", stopAutoSlide);
  currentSlider.addEventListener("mouseout", startAutoSlide);

  /**
   * RESPONSIVE
   */

  window.addEventListener("resize", moveSliderItem);
};
// Initialize all sliders on the page
for (let i = 0, len = sliders.length; i < len; i++) {
  sliderInit(sliders[i]);
}

/**
 * ACCORDION
 */

const accordions = document.querySelectorAll("[data-accordion]");

let lastActiveAccordion;

const accordionInit = function (currentAccordion) {
  const accordionBtn = currentAccordion.querySelector("[data-accordion-btn]");

  accordionBtn.addEventListener("click", function () {
    if (currentAccordion.classList.contains("active")) {
      currentAccordion.classList.toggle("active");
    } else {
      if (lastActiveAccordion) lastActiveAccordion.classList.remove("active");
      currentAccordion.classList.add("active");
    }

    lastActiveAccordion = currentAccordion;
  });
};

for (let i = 0, len = accordions.length; i < len; i++) {
  accordionInit(accordions[i]);
}

/**
 * SKILLBRIDGE MODALS & CAROUSEL LOGIC
 * Modal HTML is injected into every page via DOMContentLoaded so the
 * "Post a Task" button works site-wide without duplicating markup.
 */

let postTaskModal, swipeModal;

const helpers = [
  {
    name: "John D.",
    img: "avatar-1.webp",
    skill: "Excel & Spreadsheet Expert",
    category: "Coding",
    rate: "$15/hr or Skill Swap",
    jobs: 24,
    rating: "4.9",
    reviews: 21,
    bio: "Quick turnaround on formula fixes, pivot tables, and VBA automation.",
    badge: "Top Rated",
  },
  {
    name: "Sarah M.",
    img: "avatar-2.webp",
    skill: "Graphic Designer",
    category: "Design",
    rate: "$18/hr",
    jobs: 32,
    rating: "4.8",
    reviews: 28,
    bio: "Logos, social media graphics, and branding — delivered same day.",
    badge: "Verified",
  },
  {
    name: "Mike R.",
    img: "avatar-3.webp",
    skill: "Math & Science Tutor",
    category: "Tutoring",
    rate: "Free Community Help",
    jobs: 15,
    rating: "5.0",
    reviews: 14,
    bio: "Postgrad student happy to help with school-level maths and physics.",
    badge: "Community Hero",
  },
  {
    name: "Emma L.",
    img: "avatar-4.webp",
    skill: "Short-form Video Editor",
    category: "Video Editing",
    rate: "$20/hr",
    jobs: 19,
    rating: "4.7",
    reviews: 17,
    bio: "Reels, TikToks, and YouTube Shorts — fast delivery, clean cuts.",
    badge: "Fast Responder",
  },
  {
    name: "Raj P.",
    img: "avatar-5.webp",
    skill: "Pet Walker & Sitter",
    category: "Pet Care",
    rate: "$12/hr",
    jobs: 41,
    rating: "4.9",
    reviews: 38,
    bio: "Trusted dog walker with GPS updates. Available weekdays and weekends.",
    badge: "Top Rated",
  },
  {
    name: "Lina H.",
    img: "avatar-7.webp",
    skill: "Errand Runner & Queue Agent",
    category: "Errands",
    rate: "From $10/task",
    jobs: 54,
    rating: "4.8",
    reviews: 49,
    bio: "I handle clinic queues, ticket bookings, and same-day city errands.",
    badge: "Most Booked",
  },
  {
    name: "Carlos M.",
    img: "avatar-8.webp",
    skill: "Event & Product Photographer",
    category: "Photography",
    rate: "From $25/hr",
    jobs: 22,
    rating: "4.9",
    reviews: 20,
    bio: "DSLR and mirrorless shoots for events, products, and portfolios.",
    badge: "Verified",
  },
  {
    name: "Nyla T.",
    img: "avatar-3.webp",
    skill: "Resume & Career Coach",
    category: "Career Help",
    rate: "Skill Swap or $16/hr",
    jobs: 37,
    rating: "4.8",
    reviews: 33,
    bio: "Interview prep, CV rewrites, and LinkedIn optimization for fresh grads.",
    badge: "Career Expert",
  },
];

let currentHelperIndex = 0;
const passedHelpers = new Set();

document.addEventListener("DOMContentLoaded", function () {
  const modalWrapper = document.createElement("div");
  modalWrapper.innerHTML = `
    <div class="modal-overlay" id="postTaskModal" role="dialog" aria-modal="true" aria-label="Post a Task">
      <div class="sb-modal">
        <button class="sb-modal-close" aria-label="Close modal" onclick="closeModals()">
          <ion-icon name="close-outline"></ion-icon>
        </button>
        <h2 class="headline-md" style="margin-bottom:4px;color:var(--white)">Post a Task</h2>
        <p style="color:var(--cadet-grey);font-size:1.4rem;margin-bottom:14px">Fill in the details and we&#39;ll match you with a nearby helper.</p>

        <label class="sb-label" for="taskTitle">Task Title</label>
        <input type="text" id="taskTitle" class="sb-input" placeholder="e.g. Walk my dog this weekend" />

        <div class="sb-form-row">
          <div>
            <label class="sb-label" for="taskCategory">Category</label>
            <select id="taskCategory" class="sb-input sb-select">
              <option value="">Select category&hellip;</option>
              <option>Design</option>
              <option>Coding &amp; Tech</option>
              <option>Tutoring</option>
              <option>Video Editing</option>
              <option>Photography</option>
              <option>Handyman</option>
              <option>Errands &amp; Delivery</option>
              <option>Pet Care</option>
              <option>Career Help</option>
              <option>Transport</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label class="sb-label" for="taskType">Task Type</label>
            <select id="taskType" class="sb-input sb-select">
              <option value="">Select type&hellip;</option>
              <option>Online / Remote</option>
              <option>In-Person</option>
              <option>Either</option>
            </select>
          </div>
        </div>

        <div class="sb-form-row">
          <div>
            <label class="sb-label" for="taskWhen">When do you need this?</label>
            <select id="taskWhen" class="sb-input sb-select">
              <option value="">Select timing&hellip;</option>
              <option>ASAP (today)</option>
              <option>Tomorrow</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Flexible</option>
            </select>
          </div>
          <div>
            <label class="sb-label" for="taskLocation">Location</label>
            <input type="text" id="taskLocation" class="sb-input" placeholder="Neighbourhood or &apos;Online&apos;" />
          </div>
        </div>

        <label class="sb-label" for="taskDesc">Describe what you need</label>
        <textarea id="taskDesc" class="sb-input sb-textarea" placeholder="Give details so helpers can prepare — the more specific, the faster your match."></textarea>

        <div class="sb-form-row">
          <div>
            <label class="sb-label" for="taskPayType">Payment Type</label>
            <select id="taskPayType" class="sb-input sb-select">
              <option value="">Select payment&hellip;</option>
              <option>Fixed Rate</option>
              <option>Per Hour</option>
              <option>Skill Swap</option>
              <option>Free / Community Help</option>
            </select>
          </div>
          <div>
            <label class="sb-label" for="taskBudget">Budget / Offer</label>
            <input type="text" id="taskBudget" class="sb-input" placeholder="e.g. $20 or Skill Swap" />
          </div>
        </div>

        <button class="btn" style="width:100%;margin-top:10px" onclick="submitTask()">
          Find Helpers &rarr;
        </button>
      </div>
    </div>

    <div class="modal-overlay" id="swipeModal" role="dialog" aria-modal="true" aria-label="Available Helpers">
      <div class="sb-modal">
        <button class="sb-modal-close" aria-label="Close modal" onclick="closeModals()">
          <ion-icon name="close-outline"></ion-icon>
        </button>
        <h2 class="headline-md text-center" style="margin-bottom:4px;color:var(--white)">Available Helpers</h2>
        <p class="helper-counter-text" id="helperCounter">1 of ${helpers.length} helpers nearby</p>

        <div id="helperCarousel"></div>

        <div class="helper-nav-row" id="helperNavRow">
          <button class="helper-nav-btn" id="helperPrevBtn" onclick="navigateHelper(-1)" aria-label="Previous helper">
            <ion-icon name="chevron-back-outline"></ion-icon> Prev
          </button>
          <div class="helper-nav-dots" id="helperDots"></div>
          <button class="helper-nav-btn" id="helperNextBtn" onclick="navigateHelper(1)" aria-label="Next helper">
            Next <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>

        <div class="swipe-actions" id="helperActions">
          <button class="btn-swipe reject" onclick="helperAction(&apos;pass&apos;)" aria-label="Pass on this helper">
            <ion-icon name="close-outline"></ion-icon>
          </button>
          <button class="btn-swipe accept" onclick="helperAction(&apos;connect&apos;)" aria-label="Connect with this helper">
            <ion-icon name="checkmark-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalWrapper);

  postTaskModal = document.getElementById("postTaskModal");
  swipeModal = document.getElementById("swipeModal");

  [postTaskModal, swipeModal].forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModals();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModals();
  });
});

window.openTaskModal = function () {
  postTaskModal.classList.add("active");
  postTaskModal.querySelector(".sb-modal").focus();
};

window.closeModals = function () {
  postTaskModal.classList.remove("active");
  swipeModal.classList.remove("active");
};

function renderCurrentHelper() {
  const helper = helpers[currentHelperIndex];
  const isPassed = passedHelpers.has(currentHelperIndex);

  document.getElementById("helperCarousel").innerHTML = `
    <div class="helper-card-view">
      <div class="helper-card-photo">
        <img src="./assets/images/${helper.img}" alt="${helper.name}" />
        <span class="helper-badge">${helper.badge}</span>
      </div>
      <div class="helper-card-meta">
        <div class="helper-name-row">
          <h3 style="color:var(--white);font-size:var(--title-lg);font-weight:var(--fw-700)">${helper.name}</h3>
          ${isPassed ? '<span class="helper-passed-badge">Passed</span>' : ""}
        </div>
        <p class="helper-skill">${helper.skill}</p>
        <p class="helper-rating">&#9733; ${helper.rating} <span class="helper-rating-detail">(${helper.reviews} reviews &middot; ${helper.jobs} jobs)</span></p>
        <p class="helper-bio">&ldquo;${helper.bio}&rdquo;</p>
        <span class="helper-rate">${helper.rate}</span>
      </div>
    </div>
  `;

  const counterEl = document.getElementById("helperCounter");
  if (counterEl) {
    counterEl.textContent = `${currentHelperIndex + 1} of ${helpers.length} helpers nearby`;
  }

  const dotsEl = document.getElementById("helperDots");
  if (dotsEl) {
    dotsEl.innerHTML = helpers
      .map(
        (_, i) =>
          `<span class="helper-dot${i === currentHelperIndex ? " active" : ""}${passedHelpers.has(i) ? " passed" : ""}"></span>`,
      )
      .join("");
  }

  const prevBtn = document.getElementById("helperPrevBtn");
  const nextBtn = document.getElementById("helperNextBtn");
  if (prevBtn) prevBtn.disabled = currentHelperIndex === 0;
  if (nextBtn) nextBtn.disabled = currentHelperIndex === helpers.length - 1;
}

window.navigateHelper = function (dir) {
  const newIndex = currentHelperIndex + dir;
  if (newIndex < 0 || newIndex >= helpers.length) return;
  currentHelperIndex = newIndex;
  renderCurrentHelper();
};

window.helperAction = function (action) {
  if (action === "pass") {
    passedHelpers.add(currentHelperIndex);
    if (currentHelperIndex < helpers.length - 1) {
      currentHelperIndex++;
      renderCurrentHelper();
    } else {
      document.getElementById("helperCarousel").innerHTML = `
        <div style="text-align:center;padding:28px 0 10px">
          <p style="color:var(--alice-blue-2);font-size:1.5rem;line-height:1.7">
            You&rsquo;ve reviewed all available helpers.<br>
            Use <strong style="color:var(--white)">Prev</strong> to revisit someone,
            or close and refine your task details.
          </p>
        </div>`;
      const actionsEl = document.getElementById("helperActions");
      if (actionsEl) actionsEl.style.display = "none";
    }
  } else {
    const helper = helpers[currentHelperIndex];
    document.getElementById("helperCarousel").innerHTML = `
      <div style="text-align:center;padding:24px 0 10px">
        <ion-icon name="checkmark-circle-outline"
          style="font-size:4rem;color:hsl(146,56%,63%);display:block;margin:0 auto 12px"
        ></ion-icon>
        <h3 style="color:var(--white);margin-bottom:8px">Connected with ${helper.name}!</h3>
        <p style="color:var(--alice-blue-2);font-size:1.4rem;line-height:1.6">
          They&rsquo;ve been notified and will respond shortly.<br>
          Typical match time: <strong style="color:var(--white)">under 15 minutes</strong>.
        </p>
      </div>`;
    const actionsEl = document.getElementById("helperActions");
    if (actionsEl) actionsEl.style.display = "none";
    const navRow = document.getElementById("helperNavRow");
    if (navRow) navRow.style.display = "none";
    const counterEl = document.getElementById("helperCounter");
    if (counterEl) counterEl.textContent = "";

    showToast(
      "Connected with " + helper.name + "! Expect a reply within 15 min.",
    );
  }
};

function openHelperCarousel() {
  postTaskModal.classList.remove("active");
  currentHelperIndex = 0;
  passedHelpers.clear();

  const navRow = document.getElementById("helperNavRow");
  const actionsEl = document.getElementById("helperActions");
  if (navRow) navRow.style.display = "flex";
  if (actionsEl) actionsEl.style.display = "flex";

  renderCurrentHelper();
  swipeModal.classList.add("active");
}

function readTaskForm() {
  const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  };
  return {
    title: val("taskTitle"),
    category: val("taskCategory"),
    type: val("taskType"),
    when: val("taskWhen"),
    location: val("taskLocation"),
    desc: val("taskDesc"),
    payType: val("taskPayType"),
    budget: val("taskBudget"),
  };
}

window.submitTask = async function () {
  const tasks = window.SkillBridgeTasks;
  const authApi = window.SkillBridgeAuth;

  // If Firebase isn't wired up yet, keep the original simulation flow.
  if (!tasks || !tasks.isReady()) {
    openHelperCarousel();
    return;
  }

  // Firebase is live — require a title and a signed-in user, then persist.
  const data = readTaskForm();
  if (!data.title) {
    if (typeof showToast === "function")
      showToast("Please add a task title first.");
    const titleEl = document.getElementById("taskTitle");
    if (titleEl) titleEl.focus();
    return;
  }

  const user = authApi && authApi.getUser();
  if (!user) {
    if (typeof showToast === "function")
      showToast("Please log in to post a task.");
    if (authApi && authApi.isReady()) authApi.openModal("login");
    return;
  }

  try {
    await tasks.createTask(data, user);
    if (typeof showToast === "function")
      showToast("Task posted! Finding helpers nearby…");
    openHelperCarousel();
  } catch (err) {
    console.error("[SkillBridge] createTask failed:", err);
    if (typeof showToast === "function")
      showToast("Could not post your task. Please try again.");
  }
};

// Alias so "Offer Help" cards can open the helper carousel directly (no posting).
window.openSwipeModal = openHelperCarousel;

/**
 * TOAST NOTIFICATION
 * Call showToast(message) to display a brief dismissible confirmation bar.
 */

let _toastTimer;

function showToast(message) {
  let toast = document.getElementById("sbToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "sbToast";
    toast.className = "sb-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.innerHTML =
    '<ion-icon name="checkmark-circle-outline" style="font-size:2rem;flex-shrink:0;color:hsl(146,56%,63%)"></ion-icon>' +
    "<span>" +
    message +
    "</span>";

  clearTimeout(_toastTimer);
  toast.classList.add("is-visible");

  _toastTimer = setTimeout(function () {
    toast.classList.remove("is-visible");
  }, 4500);
}

/**
 * CONTACT FORM EMAILJS
 */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const EMAILJS_PUBLIC_KEY = "gj-E18JRSDyKcCUpy";
  const EMAILJS_SERVICE_ID = "service_oq04ybe";
  const EMAILJS_CONTACT_TEMPLATE_ID = "template_73m38z2";

  const contactStatus = document.getElementById("contactStatus");
  const submitBtn = contactForm.querySelector(".contact-submit");
  const submitLabel = contactForm.querySelector("[data-submit-label]");

  let emailJsReady = false;

  if (window.emailjs && typeof window.emailjs.init === "function") {
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
    emailJsReady = true;
  }

  const setStatus = function (message, type) {
    if (!contactStatus) return;

    contactStatus.textContent = message;
    contactStatus.classList.remove("is-loading", "is-success", "is-error");

    if (type) {
      contactStatus.classList.add(type);
    }
  };

  const setSubmitting = function (isSubmitting) {
    if (submitBtn) {
      submitBtn.disabled = isSubmitting;
      submitBtn.setAttribute("aria-busy", String(isSubmitting));
    }

    if (submitLabel) {
      submitLabel.textContent = isSubmitting ? "Sending..." : "Send Message";
    }
  };

  const isValidEmail = function (email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getErrorStatus = function (error) {
    const maybeStatus = Number(error && (error.status || error.statusCode));
    return Number.isFinite(maybeStatus) ? maybeStatus : 0;
  };

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const website = String(formData.get("website") || "").trim();

    if (website) {
      setStatus("Thanks. Your message has been received.", "is-success");
      contactForm.reset();
      return;
    }

    if (!name || !email || !category || !subject || !message) {
      setStatus("Please complete all required fields.", "is-error");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("Please use a valid email address.", "is-error");
      return;
    }

    if (message.length < 20) {
      setStatus(
        "Please add a bit more detail (at least 20 characters).",
        "is-error",
      );
      return;
    }

    const templateParams = {
      name,
      from_name: name,
      user_name: name,
      email,
      reply_to: email,
      category,
      subject,
      message,
      to_email: "jacobjayenpillai@gmail.com",
      sent_at: new Date().toLocaleString(),
    };

    if (
      !emailJsReady ||
      !window.emailjs ||
      typeof window.emailjs.send !== "function"
    ) {
      setStatus(
        "Email service is not ready. Please try again shortly.",
        "is-error",
      );
      return;
    }

    setSubmitting(true);
    setStatus("Sending your message...", "is-loading");

    try {
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONTACT_TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        },
      );
      setStatus(
        "Message sent. We will get back to you within 24-48 hours.",
        "is-success",
      );
      contactForm.reset();
    } catch (error) {
      const status = getErrorStatus(error);
      const details = String(
        (error && (error.text || error.message)) || "Unknown error",
      );

      console.error("EmailJS contact send failed", { status, details, error });

      if (status === 400) {
        setStatus(
          `Send failed (400): ${details}. Check the template ID, service ID, and template variables in EmailJS.`,
          "is-error",
        );
        return;
      }

      if (status === 401 || status === 403) {
        setStatus(
          "Send failed due to EmailJS authorization settings. Please recheck public key, service ID, and template access.",
          "is-error",
        );
        return;
      }

      setStatus(
        "Message could not be sent right now. Please try again shortly.",
        "is-error",
      );
    } finally {
      setSubmitting(false);
    }
  });
}
