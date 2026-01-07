import "../style/listNews.css";

export default function listNews(
  pressData = null,
  currentCategory = "",
  allCategories = [],
  currentPosition = 1,
  totalInCategory = 1,
  subscribedNews = new Set()
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
        <button class="pagination-arrow prev" aria-label="이전 언론사">
          <svg width="56" height="100%" viewBox="0 0 56 100" fill="none">
            <path d="M40 25 L16 50 L40 75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <div class="list-content-container">
          ${createCategoryTabs(
            allCategories,
            currentCategory,
            currentPosition,
            totalInCategory
          )}
          ${createPressContent(pressData, subscribedNews)}
        </div>
        
        <button class="pagination-arrow next" aria-label="다음 언론사">
          <svg width="56" height="100%" viewBox="0 0 56 100" fill="none">
            <path d="M16 25 L40 50 L16 75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  `;
}

function createCategoryTabs(
  categories,
  activeCategory,
  currentPosition,
  total
) {
  const tabs = categories
    .map((category) => {
      const isActive = category === activeCategory;

      return /* html */ `
      <button 
        class="category-tab ${isActive ? "active" : ""}"
        data-category="${category}"
      >
        ${
          isActive
            ? `
          <div class="tab-content">
            <span class="tab-name">${category}</span>
            <span class="tab-count">${currentPosition} / ${total}</span>
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

function createPressContent(pressData, subscribedNews) {
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
          ${createPressHeader(pressData, isSubscribed)}
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

function createPressHeader(pressData, isSubscribed) {
  const subscribeIcon = isSubscribed
    ? `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill="white"/>
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#D2DAE0"/>
      <path d="M9.6 15L9 14.4L11.4 12L9 9.6L9.6 9L12 11.4L14.4 9L15 9.6L12.6 12L15 14.4L14.4 15L12 12.6L9.6 15Z" fill="#879298"/>
    </svg>
  `
    : "+ ";

  return /* html */ `
    <div class="press-header-inline">
      <a href="${
        pressData.mainLink
      }" target="_blank" rel="noopener" class="press-name">
        <img src="${pressData.logo}" alt="${pressData.press}">
      </a>
      <time class="press-time">${pressData.time || ""}</time>
      <button 
        class="subscribe-btn-inline ${isSubscribed ? "subscribed" : ""}"
        data-press="${pressData.press}"
        data-logo="${pressData.logo}"
      >
        ${subscribeIcon}구독하기
      </button>
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
