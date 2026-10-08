const viewer = document.querySelector("#obsidian-model");
const progressFill = document.querySelector(".progress-fill");
const loadState = document.querySelector(".load-state");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reducedMotion.matches) viewer.removeAttribute("auto-rotate");

viewer.addEventListener("progress", (event) => {
  progressFill.style.width = `${Math.round(event.detail.totalProgress * 100)}%`;
});

viewer.addEventListener("load", () => {
  progressFill.style.width = "100%";
  window.setTimeout(() => loadState?.setAttribute("hidden", ""), 350);
});

viewer.addEventListener("error", () => {
  const label = loadState?.querySelector("span:last-child");
  if (label) label.textContent = "Model could not be loaded";
});
