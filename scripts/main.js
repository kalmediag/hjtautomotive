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
const mobileBrandMedia = window.matchMedia("(max-width: 760px)");
const siteContent = window.HJTAUT_DATA?.getSiteContent ? window.HJTAUT_DATA.getSiteContent() : null;
const DEFAULT_GALLERY_ORDER_OVERRIDES = {
  automotive: [
    "./assets/optimized/Automotive/328%20Ferrari%20Sunset.jpg",
    "./assets/optimized/Automotive/Porsche%20997.jpg",
    "./assets/optimized/Automotive/Porsche%20964%2002%2014-10-24.jpg",
    "./assets/optimized/Automotive/Porsche%20964%2007%2014-10-24.jpg",
    "./assets/optimized/Automotive/Porsche%20964%2009%2014-10-24.jpg",
    "./assets/optimized/Automotive/Porsche%20964%2017%2014-10-24.jpg",
    "./assets/optimized/Automotive/Porsche%20964%20KS25-01%2021_06_25.jpg",
    "./assets/optimized/Automotive/Posche%20964%2038%2014-10-24.jpg",
    "./assets/optimized/Automotive/Dream%20Shot%20E30%20&%20964.jpg",
    "./assets/optimized/Automotive/DSC08637.jpg",
    "./assets/optimized/Automotive/P8271246.jpg",
    "./assets/optimized/Automotive/P8271962.jpg",
    "./assets/optimized/Automotive/P8272114.jpg",
    "./assets/optimized/Automotive/P8272120.jpg",
    "./assets/optimized/Automotive/P8272194.jpg",
    "./assets/optimized/Automotive/P8302297.jpg",
    "./assets/optimized/Automotive/P8302319.jpg",
    "./assets/optimized/Automotive/P9203226.jpg",
    "./assets/optimized/Automotive/P9203332.jpg",
    "./assets/optimized/Automotive/P9203339.jpg",
    "./assets/optimized/Automotive/P7226892.jpg",
    "./assets/optimized/Automotive/P7226899.jpg",
    "./assets/optimized/Automotive/P7277199.jpg",
    "./assets/optimized/Automotive/P7277244.jpg",
    "./assets/optimized/Automotive/S2000%2005%2023-10-24.jpg",
    "./assets/optimized/Automotive/S2000%2009%2023-10-24.jpg",
    "./assets/optimized/Automotive/S2000%2010%2023-10-24.jpg",
    "./assets/optimized/Automotive/Honda%20S2000%2001%2030-10-24.jpg",
    "./assets/optimized/Automotive/Honda%20S2000%2002%2019-10-24.jpg",
    "./assets/optimized/Automotive/Honda%20S2000%2003%2021-10-24.jpg",
    "./assets/optimized/Automotive/Honda%20S2000%2007%2030-10-24.jpg",
    "./assets/optimized/Automotive/Dam_s%20S2000%2019-10-24%2002.jpg",
    "./assets/optimized/Automotive/Dan%20S2000%2017%2021_04_25.jpg",
    "./assets/optimized/Automotive/Dan%20S2000%2018%2021_04_25.jpg",
    "./assets/optimized/Automotive/Dans%20Honda%20Sage%2003.jpg",
    "./assets/optimized/Automotive/180SX%20KS25-20%2021_06_25.jpg",
    "./assets/optimized/Automotive/180SX%20KS25-22%2021_06_25.jpg",
    "./assets/optimized/Automotive/Nissan%2002%2024-08-24.jpg",
    "./assets/optimized/Automotive/Nissan%2004%2024-08-24.jpg",
    "./assets/optimized/Automotive/Jaguar%2005.jpg",
    "./assets/optimized/Automotive/Jaguar%2006.jpg",
    "./assets/optimized/Automotive/DSC00770.jpg",
    "./assets/optimized/Automotive/DSC00899.jpg",
    "./assets/optimized/Automotive/DSC01182.jpg",
    "./assets/optimized/Automotive/DSC02358.jpg",
    "./assets/optimized/Automotive/DSC02389.jpg",
    "./assets/optimized/Automotive/DSC02521.jpg",
    "./assets/optimized/Automotive/DSC02908.jpg",
    "./assets/optimized/Automotive/DSC03013.jpg",
    "./assets/optimized/Automotive/DSC03165.jpg",
    "./assets/optimized/Automotive/DSC04300.jpg",
    "./assets/optimized/Automotive/DSC06349.jpg",
    "./assets/optimized/Automotive/DSC06362.jpg",
    "./assets/optimized/Automotive/DSC06566.jpg",
    "./assets/optimized/Automotive/DSC06648.jpg",
    "./assets/optimized/Automotive/DSC06676.jpg",
    "./assets/optimized/Automotive/DSC08360.jpg",
    "./assets/optimized/Automotive/DSC08578.jpg",
    "./assets/optimized/Automotive/P6211521.jpg",
    "./assets/optimized/Automotive/P7226584.jpg",
  ],
};
let galleryLayoutFrame = 0;
let galleryResizeObserver = null;

function getCardMedia(card) {
  return card.querySelector("img, video");
}

function getCardAspectRatio(card) {
  const ratioFromData = card?.dataset?.aspectRatio;
  const ratioFromStyle = card ? window.getComputedStyle(card).aspectRatio : "";
  const ratio = ratioFromData || ratioFromStyle;

  if (!ratio || !ratio.includes("/")) {
    return null;
  }

  const [width, height] = ratio.split("/").map((value) => Number(value.trim()));

  if (!width || !height) {
    return null;
  }

  return { width, height };
}

function getMediaDimensions(media, card) {
  if (!media) {
    return getCardAspectRatio(card);
  }

  if (media.tagName === "VIDEO") {
    if (media.videoWidth && media.videoHeight) {
      return { width: media.videoWidth, height: media.videoHeight };
    }

    return getCardAspectRatio(card);
  }

  if (media.naturalWidth && media.naturalHeight) {
    return { width: media.naturalWidth, height: media.naturalHeight };
  }

  return null;
}

function getGalleryStorageKey(grid) {
  const key = grid.dataset.galleryKey || window.location.pathname.split("/").pop() || "gallery";
  return `hjtaut-gallery-order-${key}`;
}

function getCardSource(card) {
  return card.querySelector("img")?.getAttribute("src") || "";
}

function applyGalleryOrder(grid, orderedSources) {
  if (!Array.isArray(orderedSources) || !orderedSources.length) {
    return false;
  }

  const cards = Array.from(grid.querySelectorAll(".gallery-card"));
  const cardMap = new Map(cards.map((card) => [getCardSource(card), card]));
  const reordered = [];

  orderedSources.forEach((src) => {
    const card = cardMap.get(src);

    if (card) {
      reordered.push(card);
      cardMap.delete(src);
    }
  });

  if (!reordered.length) {
    return false;
  }

  [...reordered, ...cardMap.values()].forEach((card) => grid.appendChild(card));
  grid.dataset.customOrdered = "true";
  grid.dataset.layoutReady = "false";
  return true;
}

function applySavedOrDefaultGalleryOrders() {
  galleryGrids.forEach((grid) => {
    const stored = window.localStorage.getItem(getGalleryStorageKey(grid));

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (applyGalleryOrder(grid, parsed)) {
          return;
        }
      } catch (error) {
      }
    }

    const key = grid.dataset.galleryKey;
    const defaultOrder = key ? DEFAULT_GALLERY_ORDER_OVERRIDES[key] : null;

    if (defaultOrder) {
      applyGalleryOrder(grid, defaultOrder);
    }
  });
}

function scheduleGalleryLayout() {
  if (galleryLayoutFrame) {
    return;
  }

  galleryLayoutFrame = window.requestAnimationFrame(() => {
    galleryLayoutFrame = 0;
    layoutGalleryGrid();
  });
}

function setupGalleryLayoutObservers() {
  if (!galleryGrids.length || !("ResizeObserver" in window)) {
    return;
  }

  if (galleryResizeObserver) {
    galleryResizeObserver.disconnect();
  }

  galleryResizeObserver = new ResizeObserver(() => {
    scheduleGalleryLayout();
  });

  galleryGrids.forEach((grid) => {
    galleryResizeObserver.observe(grid);
  });
}

function setupGalleryVideoCards() {
  const videoCards = Array.from(document.querySelectorAll(".gallery-card-video"));

  if (!videoCards.length) {
    return;
  }

  videoCards.forEach((card) => {
    const video = card.querySelector("video");
    const fallbackRatio = card.dataset.aspectRatio || "4/5";
    card.style.setProperty("--video-aspect", fallbackRatio.replace("/", " / "));

    if (!video) {
      return;
    }

    const applyActualRatio = () => {
      if (!video.videoWidth || !video.videoHeight) {
        return;
      }

      const actualRatio = `${video.videoWidth}/${video.videoHeight}`;
      card.dataset.aspectRatio = actualRatio;
      card.style.setProperty("--video-aspect", `${video.videoWidth} / ${video.videoHeight}`);
      scheduleGalleryLayout();
    };

    if (video.readyState >= 1) {
      applyActualRatio();
      return;
    }

    video.addEventListener("loadedmetadata", applyActualRatio, { once: true });
  });
}

function setupGallerySwitcher() {
  const switchers = document.querySelectorAll("[data-gallery-switcher]");

  switchers.forEach((switcher) => {
    const buttons = Array.from(switcher.querySelectorAll("[data-gallery-button]"));
    const panels = Array.from(switcher.querySelectorAll("[data-gallery-panel]"));

    if (!buttons.length || !panels.length) {
      return;
    }

    const setActivePanel = (key) => {
      buttons.forEach((button) => {
        const isActive = button.dataset.galleryButton === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = panel.dataset.galleryPanel === key;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setActivePanel(button.dataset.galleryButton || "");
      });
    });
  });
}

function setupTestimonialsScroller() {
  const scroller = document.querySelector("[data-testimonial-scroller]");
  const track = scroller?.querySelector(".marquee-track");

  if (!scroller || !track) {
    return;
  }

  if (!track.dataset.loopReady) {
    const originals = Array.from(track.querySelectorAll(".testimonial-pill:not([data-clone='true'])"));

    if (!originals.length) {
      return;
    }

    // Prepend one clone-set and append one clone-set for seamless left/right looping.
    const prependFragment = document.createDocumentFragment();
    const appendFragment = document.createDocumentFragment();

    originals.forEach((pill) => {
      const leftClone = pill.cloneNode(true);
      leftClone.dataset.clone = "true";
      leftClone.setAttribute("aria-hidden", "true");
      prependFragment.appendChild(leftClone);
    });

    originals.forEach((pill) => {
      const rightClone = pill.cloneNode(true);
      rightClone.dataset.clone = "true";
      rightClone.setAttribute("aria-hidden", "true");
      appendFragment.appendChild(rightClone);
    });

    track.prepend(prependFragment);
    track.append(appendFragment);

    track.dataset.originalCount = String(originals.length);
    track.dataset.loopReady = "true";
  }

  let loopSpan = 0;
  let rafId = 0;
  let lastFrameTime = 0;
  let resumeTimer = 0;
  let paused = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartScroll = 0;
  let scrollCarry = 0;
  const autoSpeedPxPerSecond = 72;

  const measureLoopSpan = () => {
    const originalCount = Number(track.dataset.originalCount || 0);
    const firstOriginalIndex = originalCount;
    const firstOriginal = track.children[firstOriginalIndex];
    const firstCloneAfterOriginals = track.children[firstOriginalIndex + originalCount];

    if (firstOriginal && firstCloneAfterOriginals) {
      loopSpan = firstCloneAfterOriginals.offsetLeft - firstOriginal.offsetLeft;
    } else {
      loopSpan = track.scrollWidth / 3;
    }

    if (!Number.isFinite(loopSpan) || loopSpan <= 0) {
      loopSpan = 0;
    }

    if (loopSpan > 0 && scroller.scrollLeft === 0) {
      // Start on the middle/original set so dragging left and right works immediately.
      scroller.scrollLeft = loopSpan;
    }
  };

  const normalizeLoopPosition = () => {
    if (!loopSpan) {
      return;
    }

    while (scroller.scrollLeft >= loopSpan * 2) {
      scroller.scrollLeft -= loopSpan;
    }

    while (scroller.scrollLeft < loopSpan) {
      scroller.scrollLeft += loopSpan;
    }
  };

  const pauseTemporarily = (ms = 450) => {
    paused = true;
    if (resumeTimer) {
      window.clearTimeout(resumeTimer);
    }

    resumeTimer = window.setTimeout(() => {
      paused = false;
    }, ms);
  };

  const handleDragStart = (event) => {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    isDragging = true;
    paused = true;
    dragStartX = event.clientX;
    dragStartScroll = scroller.scrollLeft;
    scroller.classList.add("is-dragging");
    scroller.setPointerCapture?.(event.pointerId);
  };

  const handleDragMove = (event) => {
    if (!isDragging) {
      return;
    }

    const deltaX = event.clientX - dragStartX;
    scroller.scrollLeft = dragStartScroll - deltaX;
    normalizeLoopPosition();
  };

  const handleDragEnd = () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    scroller.classList.remove("is-dragging");
    pauseTemporarily(350);
  };

  scroller.addEventListener("pointerdown", handleDragStart);
  scroller.addEventListener("pointermove", handleDragMove);
  scroller.addEventListener("pointerup", handleDragEnd);
  scroller.addEventListener("pointercancel", handleDragEnd);
  scroller.addEventListener("mouseleave", handleDragEnd);

  const animate = (time) => {
    if (!lastFrameTime) {
      lastFrameTime = time;
    }

    const delta = (time - lastFrameTime) / 1000;
    lastFrameTime = time;

    if (!loopSpan) {
      measureLoopSpan();
    }

    if (!paused && !document.hidden && loopSpan > 0) {
      scrollCarry += autoSpeedPxPerSecond * delta;
      const step = Math.trunc(scrollCarry);

      if (step !== 0) {
        scroller.scrollLeft += step;
        scrollCarry -= step;
        normalizeLoopPosition();
      }
    }

    rafId = window.requestAnimationFrame(animate);
  };

  measureLoopSpan();
  rafId = window.requestAnimationFrame(animate);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      lastFrameTime = 0;
      measureLoopSpan();
    }
  });

  window.addEventListener("resize", () => {
    measureLoopSpan();
  });

  window.addEventListener("load", () => {
    measureLoopSpan();
  }, { once: true });

  window.addEventListener("beforeunload", () => {
    if (resumeTimer) {
      window.clearTimeout(resumeTimer);
    }

    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
  });
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element && typeof value === "string") {
    element.textContent = value;
  }
}

function setInputLink(selector, type, value) {
  const element = document.querySelector(selector);

  if (!element || typeof value !== "string" || !value) {
    return;
  }

  if (type === "email") {
    element.setAttribute("href", `mailto:${value}`);
  }

  if (type === "phone") {
    element.setAttribute("href", `tel:${value}`);
  }
}

function updateResponsiveBrandText() {
  document.querySelectorAll(".brand, .hero h1").forEach((element) => {
    const fullBrandText = element.dataset.fullBrandText || element.textContent || "HJTAUTOMOTIVE";
    if (!element.dataset.fullBrandText) {
      element.dataset.fullBrandText = fullBrandText;
    }
    element.textContent = mobileBrandMedia.matches ? "HJT" : fullBrandText;
  });
}

function applyBrandingContent() {
  if (!siteContent?.branding?.brandText) {
    return;
  }

  document.querySelectorAll(".brand, .hero h1").forEach((element) => {
    element.textContent = siteContent.branding.brandText;
    element.dataset.fullBrandText = siteContent.branding.brandText;
  });
}

function applyHomeContent() {
  if (!siteContent?.home) {
    return;
  }

  setText(".eyebrow", siteContent.home.eyebrow);
  setText(".hero-description", siteContent.home.description);
  setText(".testimonials .section-heading h2", siteContent.home.testimonialsHeading);
  setText(".testimonials .section-intro", siteContent.home.testimonialsIntro);
  setText(".contact .section-heading h2", siteContent.home.contactHeading);
  setText(".contact-panel p", siteContent.home.contactCopy);
  setInputLink('.contact-actions a[href^="mailto:"]', "email", siteContent.home.contactEmail);
  setInputLink('.contact-actions a[href^="tel:"]', "phone", siteContent.home.contactPhone);

  const track = document.querySelector(".marquee-track");

  if (track && Array.isArray(siteContent.home.testimonials) && siteContent.home.testimonials.length) {
    const items = [...siteContent.home.testimonials, ...siteContent.home.testimonials];
    track.innerHTML = items.map((item) => `
      <article class="testimonial-pill">
        <span>"${item.quote}"</span>
        <strong>${item.author}</strong>
      </article>
    `).join("");
  }
}

function applyWorkContent() {
  if (!siteContent?.work?.tiles?.length) {
    return;
  }

  siteContent.work.tiles.forEach((tileContent) => {
    const tile = document.querySelector(`.showcase-tile[data-tile-key="${tileContent.key}"]`);

    if (!tile) {
      return;
    }

    const label = tile.querySelector(".showcase-tile-label");
    const image = tile.querySelector("img");

    tile.dataset.title = tileContent.title || "";
    tile.dataset.category = tileContent.category || "";
    tile.dataset.note = tileContent.note || "";

    if (tileContent.href) {
      tile.dataset.href = tileContent.href;
    }

    if (label && tileContent.label) {
      label.textContent = tileContent.label;
    }

    if (image && tileContent.image) {
      image.src = tileContent.image;
    }
  });
}

function applyGalleryContent() {
  if (!siteContent?.galleries) {
    return;
  }

  galleryGrids.forEach((grid) => {
    const key = grid.dataset.galleryKey;
    const order = key ? siteContent.galleries[key] : null;

    if (!key || !Array.isArray(order) || !order.length) {
      return;
    }

    const cards = Array.from(grid.querySelectorAll(".gallery-card"));
    const cardMap = new Map(cards.map((card) => {
      const image = card.querySelector("img");
      const src = image?.getAttribute("src");
      return [src, card];
    }));

    const reordered = [];

    order.forEach((src) => {
      const card = cardMap.get(src);

      if (card) {
        reordered.push(card);
        cardMap.delete(src);
      }
    });

    [...reordered, ...cardMap.values()].forEach((card) => grid.appendChild(card));
    grid.dataset.customOrdered = "true";
  });

  const projectCards = document.querySelectorAll(".project-card");

  if (projectCards.length && Array.isArray(siteContent.galleries.othersProjects)) {
    projectCards.forEach((card, index) => {
      const content = siteContent.galleries.othersProjects[index];

      if (!content) {
        return;
      }

      const image = card.querySelector("img");
      const kicker = card.querySelector(".project-card-kicker");
      const title = card.querySelector(".project-card-title");
      const note = card.querySelector(".project-card-note");

      if (image && content.image) {
        image.src = content.image;
      }

      if (kicker && content.kicker) {
        kicker.textContent = content.kicker;
      }

      if (title && content.title) {
        title.textContent = content.title;
      }

      if (note && content.note) {
        note.textContent = content.note;
      }
    });
  }
}

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
    if (grid.dataset.customOrdered === "true") {
      return;
    }

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

    grid.dataset.layoutReady = "false";
  });
}

function rebalanceGalleryVariety() {
  if (!galleryGrids.length) {
    return;
  }

  galleryGrids.forEach((grid) => {
    if (grid.dataset.customOrdered === "true") {
      return;
    }

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
            scheduleGalleryLayout();
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
    grid.dataset.layoutReady = "false";
  });
}

function layoutGalleryGrid() {
  if (!galleryGrids.length) {
    return;
  }

  galleryGrids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".gallery-card"));
    const computed = window.getComputedStyle(grid);
    const rowGap = parseFloat(computed.getPropertyValue("gap"));
    const columns = Math.max(1, parseInt(computed.getPropertyValue("--gallery-columns"), 10) || 1);
    const gridWidth = grid.clientWidth;

    if (!gridWidth) {
      return;
    }

    const roundedWidth = Math.round(gridWidth);
    const cardCount = cards.length;
    const lastWidth = Number(grid.dataset.layoutWidth || 0);
    const lastCount = Number(grid.dataset.layoutCount || 0);

    const pendingCards = cards
      .map((card) => ({
        card,
        media: getCardMedia(card),
        dimensions: getMediaDimensions(getCardMedia(card), card),
      }))
      .filter((entry) => !entry.dimensions && entry.media);

    if (pendingCards.length) {
      let remaining = pendingCards.length;
      const handleMediaReady = () => {
        remaining -= 1;

        if (remaining === 0) {
          scheduleGalleryLayout();
        }
      };

      pendingCards.forEach(({ media }) => {
        if (media.tagName === "VIDEO") {
          media.addEventListener("loadedmetadata", handleMediaReady, { once: true });
          media.addEventListener("error", handleMediaReady, { once: true });
        } else {
          media.addEventListener("load", handleMediaReady, { once: true });
          media.addEventListener("error", handleMediaReady, { once: true });
        }
      });

      return;
    }

    if (lastWidth === roundedWidth && lastCount === cardCount && grid.dataset.layoutReady === "true") {
      return;
    }

    const columnWidth = (gridWidth - (rowGap * (columns - 1))) / columns;
    const columnHeights = new Array(columns).fill(0);
    const lockOrder = grid.dataset.lockOrder === "true";

    grid.classList.add("is-masonry");
    grid.style.setProperty("--gallery-item-width", `${columnWidth}px`);

    cards.forEach((card, index) => {
      const media = getCardMedia(card);
      const dimensions = getMediaDimensions(media, card);

      if (!dimensions || !dimensions.width || !dimensions.height) {
        return;
      }

      const cardStyles = window.getComputedStyle(card);
      const borderTop = parseFloat(cardStyles.borderTopWidth) || 0;
      const borderBottom = parseFloat(cardStyles.borderBottomWidth) || 0;
      const renderedImageHeight = columnWidth * (dimensions.height / dimensions.width);
      const cardHeight = renderedImageHeight + borderTop + borderBottom;
      const columnIndex = lockOrder
        ? index % columns
        : columnHeights.indexOf(Math.min(...columnHeights));
      const left = columnIndex * (columnWidth + rowGap);
      const top = columnHeights[columnIndex];

      card.style.width = `${columnWidth}px`;
      card.style.setProperty("--gallery-x", `${left}px`);
      card.style.setProperty("--gallery-y", `${top}px`);
      columnHeights[columnIndex] = top + cardHeight + rowGap;
    });

    const maxHeight = Math.max(...columnHeights, 0);
    grid.style.height = `${Math.max(0, maxHeight - rowGap)}px`;
    grid.dataset.layoutWidth = String(roundedWidth);
    grid.dataset.layoutCount = String(cardCount);
    grid.dataset.layoutReady = "true";
  });
}

function setupGalleryLightbox() {
  const getGalleryCards = () => (
    Array.from(document.querySelectorAll(".gallery-card"))
      .filter((card) => Boolean(card.querySelector("img")))
  );
  const galleryCards = getGalleryCards();

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
  let requestToken = 0;

  function getLightboxSourceCandidates(targetImage) {
    const currentSource = targetImage.currentSrc || targetImage.src || "";
    const explicitFull = targetImage.dataset.fullsrc;
    const fullCandidate = currentSource.includes("/assets/optimized/")
      ? currentSource.replace("/assets/optimized/", "/assets/full/")
      : "";

    return [explicitFull, fullCandidate, currentSource].filter((value, index, array) => (
      Boolean(value) && array.indexOf(value) === index
    ));
  }

  function loadBestLightboxSource(targetImage) {
    const candidates = getLightboxSourceCandidates(targetImage);

    if (!candidates.length) {
      return Promise.resolve(targetImage.currentSrc || targetImage.src || "");
    }

    return new Promise((resolve) => {
      const tryCandidate = (index) => {
        if (index >= candidates.length) {
          resolve(targetImage.currentSrc || targetImage.src || "");
          return;
        }

        const probe = new Image();
        probe.onload = () => resolve(candidates[index]);
        probe.onerror = () => tryCandidate(index + 1);
        probe.src = candidates[index];
      };

      tryCandidate(0);
    });
  }

  function updateLightbox(index) {
    const currentCards = getGalleryCards();
    const targetCard = currentCards[index];
    const targetImage = targetCard?.querySelector("img");

    if (!targetImage || !lightboxImage || !lightboxCounter) {
      return;
    }

    activeIndex = (index + currentCards.length) % currentCards.length;
    lightboxImage.alt = targetImage.alt || "";
    lightboxCounter.textContent = `${activeIndex + 1} / ${currentCards.length}`;
    const currentRequest = ++requestToken;

    loadBestLightboxSource(targetImage).then((resolvedSource) => {
      if (currentRequest !== requestToken) {
        return;
      }

      lightboxImage.src = resolvedSource;
    });
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
      if (card.closest(".gallery-grid")?.classList.contains("is-editing")) {
        return;
      }

      openLightbox(getGalleryCards().indexOf(card));
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        if (card.closest(".gallery-grid")?.classList.contains("is-editing")) {
          return;
        }

        openLightbox(getGalleryCards().indexOf(card));
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
    scheduleGalleryLayout();

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
const needsScrollTick = Boolean(hero || testimonials || header);

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

if (needsScrollTick) {
  window.addEventListener("scroll", requestTick, { passive: true });
}

window.addEventListener("resize", () => {
  if (needsScrollTick) {
    requestTick();
  }

  syncInteractionMode();
  updateResponsiveBrandText();
  scheduleGalleryLayout();

  if (window.innerWidth > 760) {
    setMenuOpen(false);
  }
});

function initializeApp() {
  applyBrandingContent();
  applyHomeContent();
  applyWorkContent();
  applyGalleryContent();
  applySavedOrDefaultGalleryOrders();
  updateResponsiveBrandText();
  syncInteractionMode();
  if (needsScrollTick) {
    updateHeaderHeight();
    updateHeroFade();
    updateTestimonialsProgress();
  }
  sortGalleryCards();
  rebalanceGalleryVariety();
  setupGalleryVideoCards();
  setupGalleryLayoutObservers();
  scheduleGalleryLayout();
  setupGallerySwitcher();
  setupTestimonialsScroller();
  setupMobileMenu();
  setupShowcase();
  setupGalleryLightbox();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}

if (needsScrollTick) {
  window.addEventListener("load", requestTick, { once: true });
}
