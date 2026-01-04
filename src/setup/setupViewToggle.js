export default function setupViewToggle(container, onViewChange) {
  container.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-btn");
    if (viewBtn) {
      const newView = viewBtn.dataset.view;
      onViewChange(newView);
    }
  });
}

export function updateViewUI(container, activeView) {
  container.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.remove("active");
    btn.setAttribute("aria-pressed", "false");
  });

  const activeBtn = container.querySelector(`[data-view="${activeView}"]`);
  activeBtn?.classList.add("active");
  activeBtn?.setAttribute("aria-pressed", "true");
}
