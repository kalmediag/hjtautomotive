const root = document.documentElement;
const hero = document.querySelector(".hero");
const header = document.querySelector(".site-header");
const testimonials = document.querySelector(".testimonials");
const cursor = document.querySelector(".cursor");
const interactiveTargets = document.querySelectorAll("a, button, .button, .ghost-button, [role='button'], input, textarea, select");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateHeroFade() {
  if (!hero) {
    return;
  }

  const rect = hero.getBoundingClientRect();
  const scrollableDistance = Math.max(hero.offsetHeight - window.innerHeight, 1);
  const progress = clamp((-rect.top) / scrollableDistance, 0, 1);

  root.style.setProperty("--hero-progress", progress.toFixed(4));
}

function updateHeaderHeight() {
  if (!header) {
    return;
  }

  root.style.setProperty("--header-height", `${header.offsetHeight}px`);
}

function updateTestimonialsProgress() {
  if (!testimonials) {
    return;
  }

  const rect = testimonials.getBoundingClientRect();
  const revealStart = window.innerHeight * 0.92;
  const revealDistance = Math.max(window.innerHeight * 0.8, 1);
  const progress = clamp((revealStart - rect.top) / revealDistance, 0, 1);

  root.style.setProperty("--testimonial-progress", progress.toFixed(4));
}

function setupCursor() {
  if (!cursor || prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  window.addEventListener("pointermove", (event) => {
    cursor.classList.add("is-active");
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  window.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-active");
  });

  interactiveTargets.forEach((element) => {
    element.addEventListener("pointerenter", () => {
      cursor.classList.add("is-hovering");
    });

    element.addEventListener("pointerleave", () => {
      cursor.classList.remove("is-hovering");
    });
  });
}

let ticking = false;

function requestTick() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    updateHeaderHeight();
    updateHeroFade();
    updateTestimonialsProgress();
    ticking = false;
  });
}

window.addEventListener("scroll", requestTick, { passive: true });
window.addEventListener("resize", requestTick);
window.addEventListener("load", () => {
  updateHeaderHeight();
  updateHeroFade();
  updateTestimonialsProgress();
  setupCursor();
});

updateHeaderHeight();
updateHeroFade();
updateTestimonialsProgress();
