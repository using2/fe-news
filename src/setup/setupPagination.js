export default function setupPagination(container, onPageChange) {
  container.addEventListener("click", (e) => {
    const arrow = e.target.closest(".pagination-arrow");
    if (!arrow || arrow.disabled) return;

    const direction = arrow.classList.contains("prev") ? "prev" : "next";
    onPageChange(direction);
  });
}

export function updatePaginationUI(container, currentPage, totalPages) {
  const prevBtn = container.querySelector(".pagination-arrow.prev");
  const nextBtn = container.querySelector(".pagination-arrow.next");

  if (prevBtn) {
    const isFirstPage = currentPage === 0;
    prevBtn.disabled = isFirstPage;
    prevBtn.classList.toggle("hidden", isFirstPage);
  }

  if (nextBtn) {
    const isLastPage = currentPage === totalPages - 1 || totalPages === 0;
    nextBtn.disabled = isLastPage;
    nextBtn.classList.toggle("hidden", isLastPage);
  }
}
