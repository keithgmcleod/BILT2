const viewer = document.querySelector("#obsidian-model");
const stage = document.querySelector(".viewer-stage");
const progressFill = document.querySelector(".progress-fill");
const loadState = document.querySelector(".load-state");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const home = { theta: 0, phi: 90, radius: "110%" };
let pointer = { x: 0, y: 0 };
let frame = 0;

if (reducedMotion.matches) viewer.removeAttribute("auto-rotate");

function updateCamera() {
  frame = 0;
  const theta = home.theta + pointer.x * 7;
  const phi = Math.max(82, Math.min(98, home.phi + pointer.y * 8));
  viewer.cameraOrbit = `${theta}deg ${phi}deg ${home.radius}`;
}

function moveWithMouse(event) {
  if (reducedMotion.matches) return;
  const bounds = stage.getBoundingClientRect();
  pointer = {
    x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
    y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
  };
  if (!frame) frame = window.requestAnimationFrame(updateCamera);
}

function resetCamera() {
  pointer = { x: 0, y: 0 };
  if (!reducedMotion.matches && !frame) frame = window.requestAnimationFrame(updateCamera);
}

window.addEventListener("mousemove", moveWithMouse, { passive: true });
window.addEventListener("mouseout", (event) => {
  if (!event.relatedTarget) resetCamera();
});

viewer.addEventListener("progress", (event) => {
  progressFill.style.width = `${Math.round(event.detail.totalProgress * 100)}%`;
});

viewer.addEventListener("load", () => {
  const center = viewer.getBoundingBoxCenter();
  viewer.cameraTarget = `${center.x.toFixed(4)}m ${center.y.toFixed(4)}m ${center.z.toFixed(4)}m`;
  updateCamera();
  progressFill.style.width = "100%";
  window.setTimeout(() => loadState?.setAttribute("hidden", ""), 350);
});

viewer.addEventListener("error", () => {
  const label = loadState?.querySelector("span:last-child");
  if (label) label.textContent = "Model could not be loaded";
});
