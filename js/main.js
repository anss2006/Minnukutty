/* ═══════════════════════════════════════════
   main.js — Soft Glow Birthday Site
   Handles: config injection, scroll reveal,
            sparkles, music toggle,
            surprise overlay
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ──────────────────────────────────────
     1. CONFIG INJECTION
     Runs first so all dynamic elements
     exist before IntersectionObserver runs
  ────────────────────────────────────── */
  if (typeof SITE_CONFIG !== "undefined") {

    /* — About You lines — */
    var aboutList = document.querySelector(".about-lines");
    if (aboutList && SITE_CONFIG.aboutLines) {
      aboutList.innerHTML = "";
      SITE_CONFIG.aboutLines.forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = line;
        aboutList.appendChild(li);
      });
    }

    /* — Bento reasons cards — */
    var bentoGrid = document.querySelector(".bento-grid");
    if (bentoGrid && SITE_CONFIG.reasons) {
      bentoGrid.innerHTML = "";
      SITE_CONFIG.reasons.forEach(function (item) {
        var card = document.createElement("div");
        card.className = "bento-card reveal";
        var icon = document.createElement("span");
        icon.className = "bento-icon";
        icon.textContent = item.icon;
        var text = document.createElement("p");
        text.className = "bento-text";
        text.textContent = item.text;
        card.appendChild(icon);
        card.appendChild(text);
        bentoGrid.appendChild(card);
      });
    }

    /* — Surprise subtitle — */
    var surpriseSub = document.querySelector(".surprise-sub");
    if (surpriseSub && SITE_CONFIG.surpriseSubtitle) {
      surpriseSub.innerHTML = SITE_CONFIG.surpriseSubtitle.replace(/\n/g, "<br>");
    }
  }


  /* ──────────────────────────────────────
     2. SCROLL REVEAL
     Runs after injection so dynamic
     elements are already in the DOM
  ────────────────────────────────────── */
  var revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }


  /* ──────────────────────────────────────
     3. HERO SPARKLES
  ────────────────────────────────────── */
  var sparkleContainer = document.querySelector(".hero-sparkles");

  if (sparkleContainer) {
    var SPARKLE_COLORS = ["#D9A7C7", "#BFA3FF", "#FFF4D6", "#F8E9F1", "#ffffff"];

    function makeSparkle() {
      var el = document.createElement("div");
      el.className = "sparkle";
      var size     = Math.random() * 3 + 1;
      var color    = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      var duration = Math.random() * 7 + 5;
      var delay    = Math.random() * 4;
      el.style.cssText = [
        "width:"              + size + "px",
        "height:"             + size + "px",
        "left:"               + (Math.random() * 100) + "%",
        "top:"                + (Math.random() * 100) + "%",
        "background:"         + color,
        "animation-duration:" + duration + "s",
        "animation-delay:"    + delay + "s"
      ].join(";");
      sparkleContainer.appendChild(el);
      var totalMs = (duration + delay) * 1000 + 500;
      setTimeout(function () {
        if (el.parentNode) { el.parentNode.removeChild(el); }
      }, totalMs);
    }

    for (var i = 0; i < 22; i++) {
      setTimeout(makeSparkle, i * 250);
    }
    setInterval(makeSparkle, 380);
  }


  /* ──────────────────────────────────────
     4. MUSIC TOGGLE
  ────────────────────────────────────── */
  var musicBtn = document.getElementById("music-btn");
  var bgAudio  = document.getElementById("bg-audio");

  if (musicBtn && bgAudio) {
    var isPlaying = false;

    function hasAudioSrc() {
      var sourceEl = bgAudio.querySelector("source");
      var src = sourceEl ? sourceEl.getAttribute("src") : "";
      return !!(src && src.trim().length > 0);
    }

    musicBtn.addEventListener("click", function () {
      if (!hasAudioSrc()) {
        musicBtn.style.opacity = "0.4";
        setTimeout(function () { musicBtn.style.opacity = ""; }, 300);
        return;
      }
      if (isPlaying) {
        bgAudio.pause();
        musicBtn.innerHTML = "&#9834;";
        musicBtn.classList.remove("playing");
        isPlaying = false;
      } else {
        bgAudio.play().then(function () {
          musicBtn.innerHTML = "&#9835;";
          musicBtn.classList.add("playing");
          isPlaying = true;
        }).catch(function () {});
      }
    });

    bgAudio.addEventListener("ended", function () {
      isPlaying = false;
      musicBtn.innerHTML = "&#9834;";
      musicBtn.classList.remove("playing");
    });
  }


  /* ──────────────────────────────────────
     5. SURPRISE OVERLAY
  ────────────────────────────────────── */
  var surpriseBtn     = document.getElementById("surprise-btn");
  var surpriseOverlay = document.getElementById("surprise-overlay");
  var surpriseClose   = document.getElementById("surprise-close");

  function openSurprise() {
    if (!surpriseOverlay) { return; }
    surpriseOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    if (typeof startConfetti === "function") { startConfetti(); }
  }

  function closeSurprise() {
    if (!surpriseOverlay) { return; }
    surpriseOverlay.classList.remove("active");
    document.body.style.overflow = "";
    if (typeof stopConfetti === "function") { stopConfetti(); }
  }

  if (surpriseBtn) { surpriseBtn.addEventListener("click", openSurprise); }
  if (surpriseClose) { surpriseClose.addEventListener("click", closeSurprise); }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && surpriseOverlay &&
        surpriseOverlay.classList.contains("active")) {
      closeSurprise();
    }
  });

})();
