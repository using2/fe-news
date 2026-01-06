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
    const isActive = btn.dataset.view === activeView;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive.toString());
  });
}
