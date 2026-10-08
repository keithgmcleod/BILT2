const viewer = document.querySelector("#obsidian-model");
const stage = document.querySelector(".viewer-stage");
const progressFill = document.querySelector(".progress-fill");
const loadState = document.querySelector(".load-state");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const home = { theta: 25, phi: 72, radius: "110%" };
let pointer = { x: 0, y: 0 };
let frame = 0;

if (reducedMotion.matches) viewer.removeAttribute("auto-rotate");

function updateCamera() {
  frame = 0;
  const theta = home.theta + pointer.x * 3.5;
  const phi = home.phi + pointer.y * 2.5;
  viewer.cameraOrbit = `${theta}deg ${phi}deg ${home.radius}`;
}

stage.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || reducedMotion.matches) return;
  const bounds = stage.getBoundingClientRect();
  pointer = {
    x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
    y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
  };
  if (!frame) frame = window.requestAnimationFrame(updateCamera);
});

stage.addEventListener("pointerleave", () => {
  pointer = { x: 0, y: 0 };
  if (!reducedMotion.matches && !frame) frame = window.requestAnimationFrame(updateCamera);
});

viewer.addEventListener("progress", (event) => {
  progressFill.style.width = `${Math.round(event.detail.totalProgress * 100)}%`;
});

viewer.addEventListener("load", () => {
  const center = viewer.getBoundingBoxCenter();
  viewer.cameraTarget = `${center.x.toFixed(4)}m ${center.y.toFixed(4)}m ${center.z.toFixed(4)}m`;
  viewer.cameraOrbit = `${home.theta}deg ${home.phi}deg ${home.radius}`;
  progressFill.style.width = "100%";
  window.setTimeout(() => loadState?.setAttribute("hidden", ""), 350);
});

viewer.addEventListener("error", () => {
  const label = loadState?.querySelector("span:last-child");
  if (label) label.textContent = "Model could not be loaded";
});
