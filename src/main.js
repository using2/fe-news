import newsstand from "./pages/newsstand.js";
import { initNewsFeed } from "./components/newsFeed.js";

const app = document.querySelector("#app");
app.innerHTML = newsstand();

const newsFeedContainer = app.querySelector(".news-feed-container");
if (newsFeedContainer) {
  initNewsFeed(newsFeedContainer);
}
