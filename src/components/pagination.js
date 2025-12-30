export default function pagination() {
  return /* html */ `
    <button 
      class="pagination-arrow prev" 
      aria-label="이전 페이지"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
}

export function nextButton() {
  return /* html */ `
    <button 
      class="pagination-arrow next" 
      aria-label="다음 페이지"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;
}
