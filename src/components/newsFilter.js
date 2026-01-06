import "../style/newsFilter.css";

const FILTERS = [
  { id: "all", label: "전체 언론사", count: null },
  { id: "favorite", label: "내가 구독한 언론사", count: null },
];

const VIEW_BUTTONS = [
  {
    type: "list",
    label: "리스트 보기",
    svg: `
      <rect x="2" y="3" width="16" height="2" fill="currentColor"/>
      <rect x="2" y="9" width="16" height="2" fill="currentColor"/>
      <rect x="2" y="15" width="16" height="2" fill="currentColor"/>
    `,
  },
  {
    type: "grid",
    label: "그리드 보기",
    svg: `
      <rect x="2" y="2" width="6" height="6" fill="currentColor"/>
      <rect x="12" y="2" width="6" height="6" fill="currentColor"/>
      <rect x="2" y="12" width="6" height="6" fill="currentColor"/>
      <rect x="12" y="12" width="6" height="6" fill="currentColor"/>
    `,
  },
];

function createFilterButton(filter, activeFilter, subscribedCount) {
  const isActive = activeFilter === filter.id;
  const count = filter.id === "favorite" ? subscribedCount : filter.count;

  return /* html */ `
    <button 
      class="filter-btn ${isActive ? "active" : ""}"
      data-filter="${filter.id}"
    >
      ${filter.label}
      ${count ? `<span class="count">${count}</span>` : ""}
    </button>
  `;
}

function createViewButton(view, activeView) {
  const isActive = activeView === view.type;

  return /* html */ `
    <button 
      class="view-btn ${isActive ? "active" : ""}"
      data-view="${view.type}"
      aria-label="${view.label}"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        ${view.svg}
      </svg>
    </button>
  `;
}

export default function newsFilter(
  activeFilter = "all",
  activeView = "grid",
  subscribedCount = 0
) {
  const filterButtons = FILTERS.map((filter) =>
    createFilterButton(filter, activeFilter, subscribedCount)
  ).join("");

  const viewButtons = VIEW_BUTTONS.map((view) =>
    createViewButton(view, activeView)
  ).join("");

  return /* html */ `
    <div class="news-filter-container">
      <div class="news-filter">
        ${filterButtons}
      </div>
      
      <div class="view-toggle">
        ${viewButtons}
      </div>
    </div>
  `;
}
