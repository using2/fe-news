export default function setupFilter(element, onFilterChange) {
  element.addEventListener("click", (e) => {
    const filterBtn = e.target.closest(".filter-btn");
    if (filterBtn) {
      const newFilter = filterBtn.dataset.filter;
      onFilterChange(newFilter);
    }
  });
}

export function updateFilterUI(element, activeFilter) {
  element.querySelectorAll(".filter-btn").forEach((btn) => {
    const isActive = btn.dataset.filter === activeFilter;
    btn.classList.toggle("active", isActive);
  });
}
