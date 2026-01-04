export default function setupSubscribe(container, onSubscribeChange) {
  container.addEventListener("click", (e) => {
    const subscribeBtn = e.target.closest(".subscribe-btn");

    if (subscribeBtn) {
      e.preventDefault();
      e.stopPropagation();

      const press = subscribeBtn.dataset.press;
      const currentFilter = subscribeBtn.dataset.filter || "all";
      onSubscribeChange(press, currentFilter);
    }
  });
}

export function loadSubscribedNews() {
  const savedSubscriptions = localStorage.getItem("subscribedNews");
  return savedSubscriptions
    ? new Set(JSON.parse(savedSubscriptions))
    : new Set();
}

export function saveSubscribedNews(subscribedNews) {
  localStorage.setItem("subscribedNews", JSON.stringify([...subscribedNews]));
}
