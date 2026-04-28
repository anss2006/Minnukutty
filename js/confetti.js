/* ═══════════════════════════════════════════
   confetti.js — Soft Glow Birthday Site
   Elegant slow-fall canvas confetti
   Colors: pink, lavender, gold, white
   ═══════════════════════════════════════════ */

var confettiCanvas = null;
var confettiCtx = null;
var confettiPieces = [];
var confettiRunning = false;
var confettiFrame = null;

var CONFETTI_COLORS = [
  "#D9A7C7",   /* pink */
  "#BFA3FF",   /* lavender */
  "#FFF4D6",   /* gold */
  "#F8E9F1",   /* warm white */
  "#E8C8DF"    /* dusty rose */
];

function startConfetti() {
  confettiCanvas = document.getElementById("surprise-canvas");
  if (!confettiCanvas) { return; }

  confettiCtx = confettiCanvas.getContext("2d");
  confettiPieces = [];
  confettiRunning = true;

  resizeConfettiCanvas();
  window.addEventListener("resize", resizeConfettiCanvas);

  var count = 110;
  for (var i = 0; i < count; i++) {
    confettiPieces.push(createConfettiPiece(true));
  }

  runConfetti();
}

function resizeConfettiCanvas() {
  if (!confettiCanvas) { return; }
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function createConfettiPiece(scatter) {
  var startY = scatter
    ? (Math.random() * -window.innerHeight)
    : -20;

  return {
    x:             Math.random() * window.innerWidth,
    y:             startY,
    w:             Math.random() * 9 + 4,
    h:             Math.random() * 4 + 2,
    color:         CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    speedY:        Math.random() * 0.9 + 0.35,
    drift:         Math.random() * 0.8 - 0.4,
    rotation:      Math.random() * 360,
    rotSpeed:      Math.random() * 1.4 - 0.7,
    opacity:       Math.random() * 0.45 + 0.5,
    wobble:        Math.random() * Math.PI * 2,
    wobbleSpeed:   Math.random() * 0.03 + 0.01
  };
}

function runConfetti() {
  if (!confettiRunning) { return; }
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  var i;
  for (i = 0; i < confettiPieces.length; i++) {
    var p = confettiPieces[i];

    p.y        += p.speedY;
    p.x        += p.drift + Math.sin(p.wobble) * 0.4;
    p.rotation += p.rotSpeed;
    p.wobble   += p.wobbleSpeed;

    /* recycle when off-screen */
    if (p.y > confettiCanvas.height + 20) {
      confettiPieces[i] = createConfettiPiece(false);
    }

    confettiCtx.save();
    confettiCtx.globalAlpha = p.opacity;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rotation * Math.PI / 180);
    confettiCtx.fillStyle = p.color;
    confettiCtx.beginPath();
    confettiCtx.rect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.fill();
    confettiCtx.restore();
  }

  confettiFrame = requestAnimationFrame(runConfetti);
}

function stopConfetti() {
  confettiRunning = false;
  if (confettiFrame) {
    cancelAnimationFrame(confettiFrame);
    confettiFrame = null;
  }
  if (confettiCtx && confettiCanvas) {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }
  window.removeEventListener("resize", resizeConfettiCanvas);
  confettiPieces = [];
}
