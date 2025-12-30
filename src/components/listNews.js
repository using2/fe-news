export default function listNews(
  newsItems = [],
  subscribedNews = new Set(),
  currentFilter = "all"
) {
  const items = Array.isArray(newsItems) ? newsItems : [];

  return /* html */ `
    <section class="list-news-section">
      <div>개발 예정</div>
    </section>
  `;
}
