const viewer = document.querySelector("#obsidian-model");
const stage = document.querySelector(".viewer-stage");
const progressFill = document.querySelector(".progress-fill");
const loadState = document.querySelector(".load-state");

const rearCard = viewer.querySelector("#rear-card");
const homePitch = -15;
const frontTilt = { yaw: 26, pitch: 20 };
let pointer = { x: 0, y: 0 };

function updateCardTilt() {
  const frontYaw = -pointer.x * frontTilt.yaw;
  const frontPitch = homePitch - pointer.y * frontTilt.pitch;
  const rearYaw = frontYaw * 0.5;
  const rearPitch = homePitch + (frontPitch - homePitch) * 0.5;

  viewer.setAttribute("orientation", `0deg ${frontPitch}deg ${frontYaw}deg`);
  rearCard?.setAttribute("orientation", `0deg ${rearPitch}deg ${rearYaw}deg`);
}

function moveWithPointer(event) {
  const bounds = stage.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
    && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) {
    resetCards();
    return;
  }

  pointer = {
    x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
    y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
  };
  updateCardTilt();
}

function resetCards() {
  if (pointer.x === 0 && pointer.y === 0) return;
  pointer = { x: 0, y: 0 };
  updateCardTilt();
}

window.addEventListener("pointermove", moveWithPointer, { passive: true, capture: true });
stage.addEventListener("pointerleave", resetCards, { passive: true });

viewer.addEventListener("progress", (event) => {
  progressFill.style.width = `${Math.round(event.detail.totalProgress * 100)}%`;
});

viewer.addEventListener("load", () => {
  const center = viewer.getBoundingBoxCenter();
  viewer.setAttribute("camera-target", `${center.x.toFixed(4)}m ${center.y.toFixed(4)}m ${center.z.toFixed(4)}m`);
  updateCardTilt();
  progressFill.style.width = "100%";
  window.setTimeout(() => loadState?.setAttribute("hidden", ""), 350);
});

viewer.addEventListener("error", () => {
  const label = loadState?.querySelector("span:last-child");
  if (label) label.textContent = "Model could not be loaded";
});
