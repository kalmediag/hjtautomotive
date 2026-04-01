const root = document.documentElement;
const hero = document.querySelector(".hero");
const header = document.querySelector(".site-header");
const cursorTargets = document.querySelectorAll("body, a, button, [role='button'], input, textarea, select");

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

function applyNativeCursor(cursorValue, pointerValue) {
  cursorTargets.forEach((element) => {
    if (element.matches("a, button, [role='button'], input, textarea, select")) {
      element.style.cursor = pointerValue;
      return;
    }

    element.style.cursor = cursorValue;
  });
}

function setupCursor() {
  const image = new Image();

  image.addEventListener("load", () => {
    const canvas = document.createElement("canvas");
    const width = 36;
    const height = 40;
    const drawWidth = 28;
    const drawHeight = 32;
    const offsetX = 2;
    const offsetY = 2;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, width, height);
    context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    const dataUrl = canvas.toDataURL("image/png");
    const cursorValue = `url("${dataUrl}") 4 4, auto`;
    const pointerValue = `url("${dataUrl}") 4 4, pointer`;

    applyNativeCursor(cursorValue, pointerValue);
  });

  image.addEventListener("error", () => {
    applyNativeCursor("auto", "pointer");
  });

  image.src = "./assets/SVG/cursor-white.svg";
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
  setupCursor();
});

updateHeaderHeight();
updateHeroFade();
