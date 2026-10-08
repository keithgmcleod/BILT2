const viewer = document.querySelector("#obsidian-model");
const stage = document.querySelector(".viewer-stage");
const progressFill = document.querySelector(".progress-fill");
const loadState = document.querySelector(".load-state");

const home = { theta: 0, phi: 90, radius: "110%" };
let pointer = { x: 0, y: 0 };

function updateCamera() {
  const theta = home.theta + pointer.x * 16;
  const phi = Math.max(80, Math.min(100, home.phi + pointer.y * 10));
  viewer.setAttribute("camera-orbit", `${theta}deg ${phi}deg ${home.radius}`);
}

function moveWithPointer(event) {
  const bounds = stage.getBoundingClientRect();
  const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
    && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!inside) {
    resetCamera();
    return;
  }

  pointer = {
    x: Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)),
    y: Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)),
  };
  updateCamera();
}

function resetCamera() {
  if (pointer.x === 0 && pointer.y === 0) return;
  pointer = { x: 0, y: 0 };
  updateCamera();
}

window.addEventListener("pointermove", moveWithPointer, { passive: true, capture: true });
stage.addEventListener("pointerleave", resetCamera, { passive: true });

viewer.addEventListener("progress", (event) => {
  progressFill.style.width = `${Math.round(event.detail.totalProgress * 100)}%`;
});

viewer.addEventListener("load", () => {
  const center = viewer.getBoundingBoxCenter();
  viewer.setAttribute("camera-target", `${center.x.toFixed(4)}m ${center.y.toFixed(4)}m ${center.z.toFixed(4)}m`);
  updateCamera();
  progressFill.style.width = "100%";
  window.setTimeout(() => loadState?.setAttribute("hidden", ""), 350);
});

viewer.addEventListener("error", () => {
  const label = loadState?.querySelector("span:last-child");
  if (label) label.textContent = "Model could not be loaded";
});
