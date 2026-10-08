const viewer = document.querySelector("#obsidian-model");
const statusText = document.querySelector("#status-text");
const rotateButton = document.querySelector("#rotate-toggle");
const rotateLabel = document.querySelector("#rotate-label");
const rotateIcon = document.querySelector("#rotate-icon");
const resetButton = document.querySelector("#reset-view");
const progressFill = document.querySelector(".progress-fill");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setRotation(enabled) {
  if (enabled) {
    viewer.setAttribute("auto-rotate", "");
  } else {
    viewer.removeAttribute("auto-rotate");
  }
  rotateButton.setAttribute("aria-pressed", String(enabled));
  rotateLabel.textContent = enabled ? "Pause rotation" : "Auto rotate";
  rotateIcon.textContent = enabled ? "Ⅱ" : "▶";
}

setRotation(!reducedMotion.matches);

rotateButton.addEventListener("click", () => {
  setRotation(rotateButton.getAttribute("aria-pressed") !== "true");
});

resetButton.addEventListener("click", () => {
  viewer.cameraOrbit = "25deg 72deg 2m";
  viewer.cameraTarget = "auto auto auto";
});

viewer.addEventListener("progress", (event) => {
  const progress = Math.round(event.detail.totalProgress * 100);
  progressFill.style.width = `${progress}%`;
  statusText.textContent = progress < 100 ? `Loading model ${progress}%` : "Ready to explore";
});

viewer.addEventListener("load", () => {
  progressFill.style.width = "100%";
  statusText.textContent = "Ready to explore";
  window.setTimeout(() => {
    document.querySelector(".load-state")?.setAttribute("hidden", "");
  }, 350);
});

viewer.addEventListener("error", () => {
  statusText.textContent = "Model could not be loaded";
});
