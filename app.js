const viewer = document.querySelector("#obsidian-model");
const frontCard = document.querySelector("#front-card");
const stage = document.querySelector(".viewer-stage");
const progressFill = document.querySelector(".progress-fill");
const loadState = document.querySelector(".load-state");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const homePitch = -15;
const homeYaw = -15;
const frontTilt = { yaw: 15, pitch: 15 };
const cameraTarget = "0.0960m -0.0629m -0.0104m";
let pointer = { x: 0, y: 0 };
let sceneReady = false;
let frame = 0;

function updateCardTilt() {
  frame = 0;
  if (!sceneReady || reducedMotion.matches) return;

  const frontYaw = homeYaw - pointer.x * frontTilt.yaw;
  const frontPitch = homePitch - pointer.y * frontTilt.pitch;
  frontCard.setAttribute("orientation", "0deg " + frontPitch + "deg " + frontYaw + "deg");
}

function queueCardTilt() {
  if (!frame) frame = window.requestAnimationFrame(updateCardTilt);
}

function moveWithPointer(event) {
  if (event.pointerType === "touch" || reducedMotion.matches) return;
  const bounds = stage.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;

  pointer = {
    x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
    y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
  };
  queueCardTilt();
}

function resetCards() {
  if (pointer.x === 0 && pointer.y === 0) return;
  pointer = { x: 0, y: 0 };
  queueCardTilt();
}

stage.addEventListener("pointermove", moveWithPointer, { passive: true });
stage.addEventListener("pointerleave", resetCards, { passive: true });
window.addEventListener("blur", resetCards);

viewer.addEventListener("progress", (event) => {
  const progress = event.detail.totalProgress;
  progressFill.style.width = Math.round(progress * 100) + "%";
  if (progress >= 1 && !sceneReady) {
    sceneReady = true;
    updateCardTilt();
  }
});

viewer.addEventListener("load", () => {
  viewer.setAttribute("camera-target", cameraTarget);
  progressFill.style.width = "100%";
  window.setTimeout(() => loadState?.setAttribute("hidden", ""), 350);
});

viewer.addEventListener("error", () => {
  const label = loadState?.querySelector("span:last-child");
  if (label) label.textContent = "Model could not be loaded";
});
