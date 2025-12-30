import newsFilter from "./newsFilter.js";
import gridNews from "./gridNews.js";
import listNews from "./listNews.js";
import setupFilter from "../setup/setupFilter.js";
import setupViewToggle from "../setup/setupViewToggle.js";
import setupPagination from "../setup/setupPagination.js";
import setupSubscribe from "../setup/setupSubscribe.js";
import { loadNewsData, paginateNews } from "../utils/newsDataManager.js";

let allNewsData = [];
let paginatedData = [];
let currentFilter = "all";
let currentView = "grid";
let subscribedNews = new Set();
let currentPage = 0;

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
  allNewsData = await loadNewsData("/pressData.json");
  paginatedData = paginateNews(allNewsData, 24);

  const { subscribedNews: savedSubs } = setupSubscribe(
    container,
    (updatedSubs, filter) => {
      subscribedNews = updatedSubs;
      handleSubscribeChange(container, filter);
    }
  );

  subscribedNews = savedSubs;

  renderView(container, paginatedData[0]);
  updateFilterBar(container);

  const filterContainer = container.querySelector(".news-filter-container");
  
  setupFilter(filterContainer, (newFilter) => {
    currentFilter = newFilter;
    handleFilterChange(container, newFilter);
  });

  setupViewToggle(filterContainer, (newView) => {
    currentView = newView;
    handleViewChange(container);
  });

  setupPagination(container, paginatedData, (newsData, newPage) => {
    currentPage = newPage;
    renderView(container, newsData);
  }, currentPage);
}

function updateFilterBar(container) {
  const filterContainer = container.querySelector('.news-filter-container');
  
  if (filterContainer) {
    const newFilterBar = newsFilter(currentFilter, currentView, subscribedNews.size);
    filterContainer.outerHTML = newFilterBar;
    
    const newFilterContainer = container.querySelector(".news-filter-container");
    
    setupFilter(newFilterContainer, (newFilter) => {
      currentFilter = newFilter;
      handleFilterChange(container, newFilter);
    });

    setupViewToggle(newFilterContainer, (newView) => {
      currentView = newView;
      handleViewChange(container);
    });
  }
}

function renderView(container, newsData) {
  const gridContainer = container.querySelector("#grid-container");

  if (!Array.isArray(newsData)) {
    newsData = [];
  }

  if (currentView === 'grid') {
    gridContainer.innerHTML = gridNews(newsData, subscribedNews, currentFilter);
  } else {
    gridContainer.innerHTML = listNews(newsData, subscribedNews, currentFilter);
  }
  
  const paginationArrows = container.querySelectorAll('.pagination-arrow');
  paginationArrows.forEach(arrow => {
    if (currentView === 'grid') {
      arrow.style.display = 'flex';
    } else {
      arrow.style.display = 'none';
    }
  });
}

function handleViewChange(container) {
  const pageData = paginatedData[currentPage] || [];
  renderView(container, pageData);
}

function handleSubscribeChange(container, filter) {
  if (filter === "favorite") {
    const allItems = paginatedData.flat();
    
    const filteredItems = allItems.filter((item) => {
      return item && subscribedNews.has(item.press);
    });
    
    const pageSize = 24;
    const newPaginatedData = [];
    for (let i = 0; i < filteredItems.length; i += pageSize) {
      newPaginatedData.push(filteredItems.slice(i, i + pageSize));
    }
    
    if (currentPage >= newPaginatedData.length && newPaginatedData.length > 0) {
      currentPage = newPaginatedData.length - 1;
    }
    
    paginatedData = newPaginatedData;
    
    const pageData = paginatedData[currentPage] || [];
    renderView(container, pageData);

    setupPagination(container, paginatedData, (newsData, newPage) => {
      currentPage = newPage;
      renderView(container, newsData);
    }, currentPage);
  } else {
    const pageData = paginatedData[currentPage] || [];
    renderView(container, pageData);
  }
  
  updateFilterBar(container);
}

function handleFilterChange(container, filter) {
  let filteredData = allNewsData;

  if (filter === "favorite") {
    filteredData = allNewsData.filter((item) => subscribedNews.has(item.press));
  }

  paginatedData = paginateNews(filteredData, 24);
  currentPage = 0;

  const pageData = paginatedData[0] || [];
  renderView(container, pageData);

  setupPagination(container, paginatedData, (newsData, newPage) => {
    currentPage = newPage;
    renderView(container, newsData);
  }, currentPage);
  
  updateFilterBar(container);
}