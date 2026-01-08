import "../style/listNews.css";
import pagination, { nextButton } from "./pagination";

export default function listNews(
  pressData = null,
  currentCategory = "",
  allCategories = [],
  currentPosition = 1,
  totalInCategory = 1,
  subscribedNews = new Set(),
  currentFilter
) {
  if (!pressData) {
    return /* html */ `
      <section class="list-news-section">
        <div class="empty-state">
          <p>언론사 데이터를 불러오는 중입니다...</p>
        </div>
      </section>
    `;
  }

  return /* html */ `
    <section class="list-news-section">
      <div class="list-pagination-wrapper">
        ${pagination()}
        
        <div class="list-content-container">
          ${createCategoryTabs(
            allCategories,
            currentCategory,
            currentPosition,
            totalInCategory,
            subscribedNews,
            pressData
          )}
          ${createPressContent(pressData, subscribedNews, currentFilter)}
        </div>
        
        ${nextButton()}
      </div>
    </section>
  `;
}

function createCategoryTabs(
  categories,
  activeCategory,
  currentPosition,
  total,
  subscribedNews,
  pressData
) {
  const isSubscribed = subscribedNews.has(pressData.press);

  const tabs = categories
    .map((category) => {
      const isActive = category === activeCategory;

      return /* html */ `
      <button 
        class="category-tab ${isActive ? "active" : ""}"
        data-category="${category}"
        ${isActive ? "data-progress-tab" : ""}
      >
        ${
          isActive
            ? `
          <div class="tab-content">
            <span class="tab-name">${category}</span>
            ${
              isSubscribed
                ? `>`
                : `<span class="tab-count">${currentPosition} / ${total}</span>`
            }
          </div>
        `
            : category
        }
      </button>
    `;
    })
    .join("");

  return /* html */ `
    <nav class="category-nav">
      ${tabs}
    </nav>
  `;
}

function createPressContent(pressData, subscribedNews, currentFilter) {
  const isSubscribed = subscribedNews.has(pressData.press);
  const mainArticle = {
    title: pressData.mainTitle,
    link: pressData.mainLink,
    img: pressData.mainImg,
  };
  const relatedArticles = pressData.relatedArticles || [];

  return /* html */ `
    <div class="press-content-wrapper">
      <div class="press-content">
        <div class="press-main-section">
          ${createPressHeader(pressData, isSubscribed, currentFilter)}
          ${createMainArticle(mainArticle)}
        </div>
        
        <div class="press-related-section">
          ${createRelatedArticles(relatedArticles)}
          <p class="press-source">${
            pressData.press
          } 언론사에서 직접 편집한 뉴스입니다.</p>
        </div>
      </div>
    </div>
  `;
}

function createPressHeader(pressData, isSubscribed, currentFilter) {
  return /* html */ `
    <div class="press-header-inline">
      <div>
        <a href="${
          pressData.mainLink
        }" target="_blank" rel="noopener" class="press-name">
        <img src="${pressData.logo}" alt="${pressData.press}">
      </a>
      <time class="press-time">${pressData.time || ""}</time>
      </div>
      ${
        isSubscribed
          ? /* html */ `
          <svg 
            class="subscribe-icon" 
            data-press="${pressData.press}"
            data-logo="${pressData.logo}"
            data-filter="${currentFilter}"
            width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="24" height="24" rx="11.5" fill="white"/>
              <rect x="0.5" y="0.5" width="24" height="24" rx="11.5" stroke="#D2DAE0"/>
              <path d="M9.6 15L9 14.4L11.4 12L9 9.6L9.6 9L12 11.4L14.4 9L15 9.6L12.6 12L15 14.4L14.4 15L12 12.6L9.6 15Z" fill="#879298"/>
            </svg>
          `
          : /* html */ `<button 
        class="subscribe-btn"
        data-press="${pressData.press}"
        data-logo="${pressData.logo}"
        data-filter="${currentFilter}"
      >
        + 구독하기
      </button>`
      }
    </div>
  `;
}

function createMainArticle(article) {
  const hasImage = article.img && article.img !== null;

  return /* html */ `
    <div class="main-article">
      ${
        hasImage
          ? `
        <a href="${article.link}" target="_blank" rel="noopener" class="main-article-image">
          <img src="${article.img}" alt="" loading="lazy">
        </a>
      `
          : ""
      }
      
      <a href="${
        article.link
      }" target="_blank" rel="noopener" class="main-article-title">
        ${article.title}
      </a>
    </div>
  `;
}

function createRelatedArticles(articles) {
  if (articles.length === 0) {
    return "";
  }

  const articleItems = articles
    .map(
      (article) => /* html */ `
    <li class="related-article-item">
      <a href="${article.link}" target="_blank" rel="noopener" class="related-article-link">
        ${article.title}
      </a>
    </li>
  `
    )
    .join("");

  return /* html */ `
    <ul class="related-articles-list">
      ${articleItems}
    </ul>
  `;
}
