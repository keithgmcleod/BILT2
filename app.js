const viewer = document.querySelector("#obsidian-model");
const stage = document.querySelector(".viewer-stage");
const progressFill = document.querySelector(".progress-fill");
const loadState = document.querySelector(".load-state");

const frontTilt = { yaw: 15, pitch: 15 };
let pointer = { x: 0, y: 0 };
let frame = 0;

viewer.style.transformOrigin = "center center";
viewer.style.transition = "transform 100ms ease-out";

function updateCardTilt() {
  frame = 0;
  const yaw = -pointer.x * frontTilt.yaw;
  const pitch = -pointer.y * frontTilt.pitch;
  viewer.style.transform = "perspective(1200px) rotateX(" + pitch + "deg) rotateY(" + yaw + "deg)";
}

function queueCardTilt() {
  if (!frame) frame = window.requestAnimationFrame(updateCardTilt);
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
  queueCardTilt();
}

function resetCards() {
  if (pointer.x === 0 && pointer.y === 0) return;
  pointer = { x: 0, y: 0 };
  queueCardTilt();
}

window.addEventListener("pointermove", moveWithPointer, { passive: true, capture: true });
stage.addEventListener("pointerleave", resetCards, { passive: true });
window.addEventListener("blur", resetCards);

viewer.addEventListener("progress", (event) => {
  progressFill.style.width = Math.round(event.detail.totalProgress * 100) + "%";
});

viewer.addEventListener("load", () => {
  updateCardTilt();
  progressFill.style.width = "100%";
  window.setTimeout(() => loadState?.setAttribute("hidden", ""), 350);
});

viewer.addEventListener("error", () => {
  const label = loadState?.querySelector("span:last-child");
  if (label) label.textContent = "Model could not be loaded";
});
