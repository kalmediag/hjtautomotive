const root = document.documentElement;
const hero = document.querySelector(".hero");
const header = document.querySelector(".site-header");
const testimonials = document.querySelector(".testimonials");
const showcaseStage = document.querySelector("[data-showcase-stage]");
const showcaseTiles = document.querySelectorAll(".showcase-tile");
const showcasePopup = document.querySelector("[data-showcase-popup]");
const popupTitle = document.querySelector("[data-popup-title]");
const popupCategory = document.querySelector("[data-popup-category]");
const popupNote = document.querySelector("[data-popup-note]");
const galleryGrids = document.querySelectorAll(".gallery-grid");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktopInteractionMedia = window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)");

function setMenuOpen(isOpen) {
  if (!menuToggle || !menu) {
    return;
  }

  document.body.classList.toggle("is-menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menu.setAttribute("aria-hidden", String(!isOpen));
}

function setupMobileMenu() {
  if (!menuToggle || !menu) {
    return;
  }

  menu.setAttribute("aria-hidden", "true");

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("is-menu-open");
    setMenuOpen(!isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("is-menu-open")) {
      return;
    }

    const target = event.target;

    if (target instanceof Element && !target.closest(".nav")) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

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

function hasDesktopInteractions() {
  return !prefersReducedMotion && desktopInteractionMedia.matches;
}

function syncInteractionMode() {
  document.body.classList.toggle("is-desktop-interactive", hasDesktopInteractions());
}

function openTileLink(tile) {
  const href = tile?.dataset?.href;

  if (href) {
    window.location.href = href;
  }
}

function positionPopup(tile) {
  if (!showcaseStage || !showcasePopup || !tile) {
    return;
  }

  const stageRect = showcaseStage.getBoundingClientRect();
  const tileRect = tile.getBoundingClientRect();
  const popupRect = showcasePopup.getBoundingClientRect();
  const gap = 14;
  const padding = 12;
  const preferredSide = tile.dataset.popupSide || "right";
  const leftOption = tileRect.left - stageRect.left - popupRect.width - gap;
  const rightOption = tileRect.right - stageRect.left + gap;
  const fitsLeft = leftOption >= padding;
  const fitsRight = rightOption + popupRect.width <= showcaseStage.clientWidth - padding;

  let left = preferredSide === "left"
    ? (fitsLeft ? leftOption : rightOption)
    : (fitsRight ? rightOption : leftOption);

  left = clamp(left, padding, showcaseStage.clientWidth - popupRect.width - padding);

  const centeredTop = tileRect.top - stageRect.top + (tileRect.height / 2) - (popupRect.height / 2);
  const maxTop = showcaseStage.clientHeight - popupRect.height - padding;
  const top = clamp(centeredTop, padding, maxTop);

  showcasePopup.style.left = `${left}px`;
  showcasePopup.style.top = `${top}px`;
}

function showPopup(tile) {
  if (!showcasePopup || !tile || !hasDesktopInteractions()) {
    return;
  }

  if (popupTitle) {
    popupTitle.textContent = tile.dataset.title || "";
  }

  if (popupCategory) {
    popupCategory.textContent = tile.dataset.category || "";
  }

  if (popupNote) {
    popupNote.textContent = tile.dataset.note || "";
  }

  if (showcaseStage && showcasePopup.parentElement !== showcaseStage) {
    showcaseStage.appendChild(showcasePopup);
  }

  showcasePopup.classList.add("is-visible");
  showcasePopup.setAttribute("aria-hidden", "false");
  positionPopup(tile);
}

function hidePopup() {
  if (!showcasePopup) {
    return;
  }

  showcasePopup.classList.remove("is-visible");
  showcasePopup.setAttribute("aria-hidden", "true");
}

function setActiveTile(tile) {
  if (!showcaseStage) {
    return;
  }

  showcaseStage.classList.add("is-hovering-tile");
  tile.classList.add("is-active-tile");
}

function clearActiveTile(tile) {
  if (!showcaseStage) {
    return;
  }

  tile.classList.remove("is-active-tile");

  if (!showcaseStage.querySelector(".showcase-tile.is-active-tile")) {
    showcaseStage.classList.remove("is-hovering-tile");
  }
}

function getPageSortRules() {
  const page = window.location.pathname.split("/").pop();

  switch (page) {
    case "automotive.html":
      return [
        /ferrari|328/,
        /porsche|964|997|posche/,
        /s2000|honda/,
        /180sx|nissan/,
        /jaguar/,
        /dream shot|e30/,
        /dsc/,
        /p\d/,
      ];
    case "pets.html":
      return [
        /poppy|pip|betty|biggie|ezra/,
        /random dog|beach/,
        /very cute/,
        /dsc/,
        /pa/,
        /p\d/,
      ];
    case "landscape.html":
      return [
        /aurora|blyth beach aurora/,
        /lighthouse|st mary/,
        /south shields beach|south shields man/,
        /pennines|rainbow|house/,
        /dsc/,
        /p\d/,
      ];
    case "travel.html":
      return [
        /dji/,
        /boat/,
        /mountain|turkey|goat/,
        /pa/,
        /p\d/,
      ];
    case "wildlife.html":
      return [
        /pa151|pa312/,
        /p408|p421|p423/,
        /p714/,
        /p731/,
        /p810|p812|p818/,
        /p917/,
        /img_/,
      ];
    default:
      return [];
  }
}

function getFileNameFromSource(src) {
  const fileName = src.split("/").pop() || "";
  return decodeURIComponent(fileName).toLowerCase();
}

function sortGalleryCards() {
  if (!galleryGrids.length) {
    return;
  }

  const rules = getPageSortRules();

  if (!rules.length) {
    return;
  }

  galleryGrids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".gallery-card"));

    cards
      .sort((a, b) => {
        const aName = getFileNameFromSource(a.querySelector("img")?.getAttribute("src") || "");
        const bName = getFileNameFromSource(b.querySelector("img")?.getAttribute("src") || "");
        const aWeight = rules.findIndex((rule) => rule.test(aName));
        const bWeight = rules.findIndex((rule) => rule.test(bName));
        const normalizedA = aWeight === -1 ? rules.length : aWeight;
        const normalizedB = bWeight === -1 ? rules.length : bWeight;

        if (normalizedA !== normalizedB) {
          return normalizedA - normalizedB;
        }

        return aName.localeCompare(bName);
      })
      .forEach((card) => grid.appendChild(card));
  });
}

function rebalanceGalleryVariety() {
  if (!galleryGrids.length) {
    return;
  }

  galleryGrids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".gallery-card"));

    if (cards.length < 4) {
      return;
    }

    const pendingImages = cards
      .map((card) => card.querySelector("img"))
      .filter(Boolean)
      .filter((image) => !image.complete || !image.naturalWidth);

    if (pendingImages.length) {
      let remaining = pendingImages.length;

      pendingImages.forEach((image) => {
        image.addEventListener("load", () => {
          remaining -= 1;

          if (remaining === 0) {
            rebalanceGalleryVariety();
            layoutGalleryGrid();
          }
        }, { once: true });
      });

      return;
    }

    const remainingCards = [...cards];
    const reordered = [];
    let previousOrientation = "";
    let runLength = 0;

    while (remainingCards.length) {
      let selectedIndex = 0;

      if (runLength >= 2) {
        const oppositeIndex = remainingCards.findIndex((card) => {
          const image = card.querySelector("img");
          const orientation = image && image.naturalWidth > image.naturalHeight ? "landscape" : "portrait";
          return orientation !== previousOrientation;
        });

        if (oppositeIndex !== -1) {
          selectedIndex = oppositeIndex;
        }
      }

      const [selectedCard] = remainingCards.splice(selectedIndex, 1);
      const selectedImage = selectedCard.querySelector("img");
      const orientation = selectedImage && selectedImage.naturalWidth > selectedImage.naturalHeight ? "landscape" : "portrait";

      reordered.push(selectedCard);

      if (orientation === previousOrientation) {
        runLength += 1;
      } else {
        previousOrientation = orientation;
        runLength = 1;
      }
    }

    reordered.forEach((card) => grid.appendChild(card));
  });
}

function layoutGalleryGrid() {
  if (!galleryGrids.length) {
    return;
  }

  galleryGrids.forEach((grid) => {
    const computed = window.getComputedStyle(grid);
    const rowSize = parseFloat(computed.getPropertyValue("grid-auto-rows"));
    const rowGap = parseFloat(computed.getPropertyValue("gap"));

    if (!rowSize) {
      return;
    }

    grid.querySelectorAll(".gallery-card").forEach((card) => {
      const image = card.querySelector("img");

      if (!image) {
        return;
      }

      const applySpan = () => {
        const height = card.getBoundingClientRect().height;

        if (!height) {
          return;
        }

        const span = Math.ceil((height + rowGap) / (rowSize + rowGap));
        card.style.setProperty("--gallery-span", `${span}`);
      };

      if (image.complete) {
        applySpan();
      } else {
        image.addEventListener("load", applySpan, { once: true });
      }
    });
  });
}

function setupGalleryLightbox() {
  const galleryCards = Array.from(document.querySelectorAll(".gallery-card"));

  if (!galleryCards.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="lightbox-button lightbox-close" type="button" aria-label="Close image">&times;</button>
    <button class="lightbox-button lightbox-prev" type="button" aria-label="Previous image">&#8592;</button>
    <div class="lightbox-stage">
      <img class="lightbox-image" src="" alt="">
      <p class="lightbox-counter"></p>
    </div>
    <button class="lightbox-button lightbox-next" type="button" aria-label="Next image">&#8594;</button>
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCounter = lightbox.querySelector(".lightbox-counter");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  let activeIndex = 0;

  function updateLightbox(index) {
    const targetCard = galleryCards[index];
    const targetImage = targetCard?.querySelector("img");

    if (!targetImage || !lightboxImage || !lightboxCounter) {
      return;
    }

    activeIndex = (index + galleryCards.length) % galleryCards.length;
    lightboxImage.src = targetImage.currentSrc || targetImage.src;
    lightboxImage.alt = targetImage.alt || "";
    lightboxCounter.textContent = `${activeIndex + 1} / ${galleryCards.length}`;
  }

  function openLightbox(index) {
    updateLightbox(index);
    document.body.classList.add("lightbox-open");
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    document.body.classList.remove("lightbox-open");
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function moveLightbox(step) {
    updateLightbox(activeIndex + step);
  }

  galleryCards.forEach((card, index) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open image ${index + 1}`);

    card.addEventListener("click", () => {
      openLightbox(index);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton?.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", () => moveLightbox(-1));
  nextButton?.addEventListener("click", () => moveLightbox(1));

  lightbox.addEventListener("click", (event) => {
    const clickedElement = event.target;

    if (
      clickedElement instanceof Element &&
      !clickedElement.closest(".lightbox-image") &&
      !clickedElement.closest(".lightbox-button")
    ) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      moveLightbox(-1);
    }

    if (event.key === "ArrowRight") {
      moveLightbox(1);
    }
  });
}

function setupShowcase() {
  if (!showcaseStage || !showcaseTiles.length) {
    return;
  }

  showcaseTiles.forEach((tile) => {
    tile.addEventListener("click", (event) => {
      event.preventDefault();
      openTileLink(tile);
    });

    tile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openTileLink(tile);
      }
    });

    tile.addEventListener("pointerenter", () => {
      if (!hasDesktopInteractions()) {
        return;
      }

      setActiveTile(tile);
      showPopup(tile);
    });

    tile.addEventListener("pointerleave", () => {
      clearActiveTile(tile);
      hidePopup();
    });

    tile.addEventListener("focus", () => {
      if (!hasDesktopInteractions()) {
        return;
      }

      setActiveTile(tile);
      showPopup(tile);
    });

    tile.addEventListener("blur", () => {
      clearActiveTile(tile);
      hidePopup();
    });
  });

  window.addEventListener("resize", () => {
    syncInteractionMode();
    layoutGalleryGrid();

    if (!hasDesktopInteractions()) {
      hidePopup();
      showcaseStage.classList.remove("is-hovering-tile");
      showcaseTiles.forEach((tile) => tile.classList.remove("is-active-tile"));
    }
  });

  window.addEventListener("scroll", () => {
    const activeTile = showcaseStage.querySelector(".showcase-tile.is-active-tile");

    if (activeTile && showcasePopup.classList.contains("is-visible")) {
      positionPopup(activeTile);
    }
  }, { passive: true });

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
window.addEventListener("resize", () => {
  requestTick();
  syncInteractionMode();

  if (window.innerWidth > 760) {
    setMenuOpen(false);
  }
});

function initializeApp() {
  syncInteractionMode();
  updateHeaderHeight();
  updateHeroFade();
  updateTestimonialsProgress();
  sortGalleryCards();
  rebalanceGalleryVariety();
  layoutGalleryGrid();
  setupMobileMenu();
  setupShowcase();
  setupGalleryLightbox();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}

window.addEventListener("load", requestTick, { once: true });
