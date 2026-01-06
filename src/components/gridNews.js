import pagination, { nextButton } from "./pagination.js";
import "../style/gridNews.css";
import { PAGINATION } from "../constants/constants.js";

const SUBSCRIBE_BUTTON_TEXT = {
  subscribe: "구독하기",
  unsubscribe: "구독 해지",
};

function createNewsCardContent(item, subscribedNews, currentFilter) {
  const isSubscribed = subscribedNews.has(item.press);

  return /* html */ `
    <a href="${item.mainLink}" target="_blank" rel="noopener" class="news-link">
      <img src="${item.logo}" alt="${item.press}">
    </a>
    <button 
      class="subscribe-btn ${isSubscribed ? "subscribed" : ""}"
      data-press="${item.press}"
      data-logo="${item.logo}"
      data-filter="${currentFilter}"
    >
      ${
        isSubscribed
          ? SUBSCRIBE_BUTTON_TEXT.unsubscribe
          : SUBSCRIBE_BUTTON_TEXT.subscribe
      }
    </button>
  `;
}

function createNewsCard(item, subscribedNews, currentFilter) {
  const hasContent = item !== null;
  const content = hasContent
    ? createNewsCardContent(item, subscribedNews, currentFilter)
    : "";

  return /* html */ `
    <li class="news-card ${hasContent ? "has-content" : ""}">
      ${content}
    </li>
  `;
}

function createNewsCardList(newsItems, subscribedNews, currentFilter) {
  return newsItems
    .map((item) => createNewsCard(item, subscribedNews, currentFilter))
    .join("");
}

function padNewsItems(newsItems) {
  const paddingCount = Math.max(
    0,
    PAGINATION.GRID_PAGE_SIZE - newsItems.length
  );
  return [...newsItems, ...Array(paddingCount).fill(null)];
}

export default function gridNews(
  newsItems = [],
  subscribedNews = new Set(),
  currentFilter = "all"
) {
  const paddedNews = padNewsItems(newsItems);
  const newsCardList = createNewsCardList(
    paddedNews,
    subscribedNews,
    currentFilter
  );

  return /* html */ `
    <div class="grid-pagination-wrapper">
      ${pagination()}
      
      <section class="grid-news-section">
        <ul class="logo-grid">
          ${newsCardList}
        </ul>
      </section>
      
      ${nextButton()}
    </div>
  `;
}
