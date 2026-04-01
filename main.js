const root = document.documentElement;
const hero = document.querySelector(".hero");
const header = document.querySelector(".site-header");

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

let ticking = false;

function requestTick() {
  if (ticking) {
    return;
  }

  ticking = true;
  window.requestAnimationFrame(() => {
    updateHeaderHeight();
    updateHeroFade();
    ticking = false;
  });
}

window.addEventListener("scroll", requestTick, { passive: true });
window.addEventListener("resize", requestTick);
window.addEventListener("load", () => {
  updateHeaderHeight();
  updateHeroFade();
});

updateHeaderHeight();
updateHeroFade();
