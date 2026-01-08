import { AutoPageTimer } from "../utils/autoPageTimer.js";
import { AUTO_PAGE } from "../constants/constants.js";

let autoPageTimer = null;
let progressTabElement = null;
let isUserInteracting = false;

const START_COLOR = "#7890E7";
const END_COLOR = "#4362D0";

export function setupAutoPage(
  container,
  onPageChange,
  duration = AUTO_PAGE.DURATION
) {
  if (autoPageTimer) {
    autoPageTimer.destroy();
    autoPageTimer = null;
  }

  progressTabElement = container.querySelector("[data-progress-tab]");
  if (!progressTabElement) {
    return;
  }

  autoPageTimer = new AutoPageTimer(
    duration,
    () => handleAutoPageComplete(onPageChange),
    (progress) => updateProgressGradient(progress)
  );

  setupUserInteractionEvents(container);

  autoPageTimer.start();
}

function handleAutoPageComplete(onPageChange) {
  if (!isUserInteracting) {
    onPageChange("next");
  }
}

function updateProgressGradient(progress) {
  if (!progressTabElement) return;

  const percentage = progress * 100;

  const gradient = `linear-gradient(to right, ${END_COLOR} ${percentage}%, ${START_COLOR} ${percentage}%)`;

  progressTabElement.style.background = gradient;
}

function setupUserInteractionEvents(container) {
  const categoryTabs = container.querySelectorAll(".category-tab");
  categoryTabs.forEach((tab) => {
    tab.addEventListener("click", resetAutoPageTimer);
  });

  const paginationArrows = container.querySelectorAll(".pagination-arrow");
  paginationArrows.forEach((arrow) => {
    arrow.addEventListener("click", resetAutoPageTimer);
  });
}

function resetAutoPageTimer() {
  if (autoPageTimer) {
    autoPageTimer.restart();
  }
}

export function stopAutoPage() {
  if (autoPageTimer) {
    autoPageTimer.stop();
  }
  if (progressTabElement) {
    progressTabElement.style.background = "";
  }
}

export function restartAutoPage() {
  if (autoPageTimer) {
    autoPageTimer.restart();
  }
}

export function getAutoPageState() {
  return autoPageTimer
    ? autoPageTimer.getState()
    : { isRunning: false, isPaused: false };
}

export function cleanupAutoPage() {
  if (autoPageTimer) {
    autoPageTimer.destroy();
    autoPageTimer = null;
  }
  if (progressTabElement) {
    progressTabElement.style.background = "";
  }
  progressTabElement = null;
  isUserInteracting = false;
}
