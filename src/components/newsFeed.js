import newsFilter from "./newsFilter.js";
import gridNews from "./gridNews.js";
import listNews from "./listNews.js";
import setupFilter, { updateFilterUI } from "../setup/setupFilter.js";
import setupViewToggle, { updateViewUI } from "../setup/setupViewToggle.js";
import setupPagination, {
  updatePaginationUI,
} from "../setup/setupPagination.js";
import setupSubscribe, {
  loadSubscribedNews,
  saveSubscribedNews,
} from "../setup/setupSubscribe.js";
import { loadNewsData, paginateNews } from "../utils/newsDataManager.js";
import { PAGINATION } from "../constants/constants.js";

let allNewsData = [];
let paginatedData = [];
let currentFilter = "all";
let currentView = "grid";
let subscribedNews = new Set();
let currentPage = 0;

let cachedDOM = {
  container: null,
  filterContainer: null,
  gridContainer: null,
};

export default function newsFeed() {
  return /* html */ `
    <div class="news-feed-container">
      ${newsFilter("all", "grid", 0)}
      <div id="grid-container">
        ${gridNews([], subscribedNews, currentFilter)}
      </div>
    </div>
  `;
}

export async function initNewsFeed(container) {
  await loadInitialData();
  subscribedNews = loadSubscribedNews();

  cachedDOM.container = container;
  cachedDOM.filterContainer = container.querySelector(".news-filter-container");
  cachedDOM.gridContainer = container.querySelector("#grid-container");

  renderCurrentPage();
  setupAllEventListeners();
  updateAllUI();
}

async function loadInitialData() {
  allNewsData = await loadNewsData("/pressData.json");
  paginatedData = paginateNews(allNewsData, PAGINATION.GRID_PAGE_SIZE);
}

function setupAllEventListeners() {
  setupFilter(cachedDOM.filterContainer, handleFilterChange);
  setupViewToggle(cachedDOM.filterContainer, handleViewChange);
  setupPagination(cachedDOM.container, handlePageChange);
  setupSubscribe(cachedDOM.container, handleSubscribeChange);
}

function handleFilterChange(newFilter) {
  currentFilter = newFilter;
  currentPage = 0;

  const filteredData = getFilteredData(currentFilter);
  paginatedData = paginateNews(filteredData, PAGINATION.GRID_PAGE_SIZE);

  renderCurrentPage();
  updateAllUI();
}

function handleViewChange(newView) {
  currentView = newView;

  renderCurrentPage();
  updateViewUI(cachedDOM.filterContainer, currentView);
  updatePaginationArrowsVisibility();
}

function handlePageChange(direction) {
  const newPage = direction === "prev" ? currentPage - 1 : currentPage + 1;

  if (newPage >= 0 && newPage < paginatedData.length) {
    currentPage = newPage;
    renderCurrentPage();
    updatePaginationUI(cachedDOM.container, currentPage, paginatedData.length);
  }
}

function handleSubscribeChange(press, filter) {
  if (subscribedNews.has(press)) {
    subscribedNews.delete(press);
  } else {
    subscribedNews.add(press);
  }

  saveSubscribedNews(subscribedNews);

  if (filter === "favorite") {
    repaginateForFavorites();
  }

  renderCurrentPage();
  updateAllUI();
}

function renderCurrentPage() {
  const pageData = paginatedData[currentPage] || [];
  const validNewsData = Array.isArray(pageData) ? pageData : [];

  cachedDOM.gridContainer.innerHTML =
    currentView === "grid"
      ? gridNews(validNewsData, subscribedNews, currentFilter)
      : listNews(validNewsData, subscribedNews, currentFilter);
}

function updateAllUI() {
  updateFilterBar();
  updatePaginationUI(cachedDOM.container, currentPage, paginatedData.length);
  updatePaginationArrowsVisibility();
}

function updateFilterBar() {
  if (!cachedDOM.filterContainer) return;

  const newFilterBar = newsFilter(
    currentFilter,
    currentView,
    subscribedNews.size
  );
  cachedDOM.filterContainer.outerHTML = newFilterBar;

  cachedDOM.filterContainer = cachedDOM.container.querySelector(
    ".news-filter-container"
  );

  setupFilter(cachedDOM.filterContainer, handleFilterChange);
  setupViewToggle(cachedDOM.filterContainer, handleViewChange);

  updateFilterUI(cachedDOM.filterContainer, currentFilter);
  updateViewUI(cachedDOM.filterContainer, currentView);
}

function updatePaginationArrowsVisibility() {
  const paginationArrows =
    cachedDOM.container.querySelectorAll(".pagination-arrow");
  const displayValue = currentView === "grid" ? "flex" : "none";

  paginationArrows.forEach((arrow) => {
    arrow.style.display = displayValue;
  });
}

function repaginateForFavorites() {
  const allItems = paginatedData.flat();
  const filteredItems = allItems.filter(
    (item) => item && subscribedNews.has(item.press)
  );

  paginatedData = Array.from(
    { length: Math.ceil(filteredItems.length / PAGINATION.GRID_PAGE_SIZE) },
    (_, i) =>
      filteredItems.slice(
        i * PAGINATION.GRID_PAGE_SIZE,
        (i + 1) * PAGINATION.GRID_PAGE_SIZE
      )
  );

  if (currentPage >= paginatedData.length && paginatedData.length > 0) {
    currentPage = paginatedData.length - 1;
  }
}

function getFilteredData(filter) {
  return filter === "favorite"
    ? allNewsData.filter((item) => subscribedNews.has(item.press))
    : allNewsData;
}
