import { loadHeadlineNewsData } from "../utils/newsDataManager";

class HeadlineSlider {
  constructor(startIdx, side, delay, sliderManager) {
    this.startIdx = startIdx;
    this.side = side;
    this.currentIdx = startIdx;
    this.animationStartTime = 0;
    this.allNewsData = [];
    this.delay = delay;
    this.animationId = null;
    this.sliderManager = sliderManager;
    this.delayStartTime = 0;
    this.isDelayPhase = true;

    this.sliderManager.sliders.push(this);
  }

  async init() {
    await this.loadInitialData();
    this.renderHeadlines();
    this.setupHoverEvents();
    this.startAnimation();
  }

  async loadInitialData() {
    this.allNewsData = await loadHeadlineNewsData("/headlineNewsData.json");
  }

  createHeadlineItem(news) {
    return /* html */ `
      <div class="rolling-wrapper">
          <div class="headline-content">
              <a href="${news.url}" target="_blank" rel="noopener" class="news-link">
                  ${news.officeName}
              </a>
              <a href="${news.url}" target="_blank" rel="noopener" class="rolling-item">
                  ${news.title}
              </a>
          </div>
      </div>
    `;
  }

  renderHeadlines() {
    const article = document.querySelector(`.headline-${this.side}`);
    const nextIdx = (this.currentIdx + 1) % this.allNewsData.length;

    article.innerHTML =
      this.createHeadlineItem(this.allNewsData[this.currentIdx]) +
      this.createHeadlineItem(this.allNewsData[nextIdx]);
  }

  setupHoverEvents() {
    const li = document.querySelector(`.headline-${this.side}`).closest("li");

    li.addEventListener("mouseenter", () => {
      this.sliderManager.isHovered = true;
    });

    li.addEventListener("mouseleave", () => {
      this.sliderManager.isHovered = false;
      this.sliderManager.sliders.forEach((slider) => {
        slider.isDelayPhase = true;
        slider.delayStartTime = 0;
        slider.animationStartTime = 0;
      });
    });
  }

  startAnimation() {
    const animate = (timeStamp) => {
      if (this.sliderManager.isHovered) {
        this.animationId = requestAnimationFrame(animate);
        return;
      }

      if (this.isDelayPhase) {
        if (!this.delayStartTime) {
          this.delayStartTime = timeStamp;
        }

        if (timeStamp - this.delayStartTime >= this.delay) {
          this.isDelayPhase = false;
          this.delayStartTime = 0;
        }

        this.animationId = requestAnimationFrame(animate);
        return;
      }

      if (!this.animationStartTime) {
        this.animationStartTime = timeStamp;
      }

      const elapsedTime = timeStamp - this.animationStartTime;

      if (elapsedTime >= 5000) {
        this.handleRolling();
        this.animationStartTime = 0;
        this.isDelayPhase = true;
        this.delayStartTime = 0;
      }

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  handleRolling() {
    const article = document.querySelector(`.headline-${this.side}`);
    const wrappers = article.querySelectorAll(".rolling-wrapper");

    const nextIdx = (this.currentIdx + 1) % this.allNewsData.length;
    const afterNextIdx = (this.currentIdx + 2) % this.allNewsData.length;

    wrappers.forEach((wrapper) => wrapper.classList.add("rolling-out"));

    setTimeout(() => {
      wrappers.forEach((wrapper) => wrapper.remove());

      article.innerHTML =
        this.createHeadlineItem(this.allNewsData[nextIdx]) +
        this.createHeadlineItem(this.allNewsData[afterNextIdx]);

      this.currentIdx = nextIdx;
    }, 500);
  }

  getHTML() {
    return /* html */ `
      <ul class="headline-list">
          <li>
              <article class="headline-${this.side}">
              </article>
          </li>
      </ul>
    `;
  }
}

export default function rollingSection(startIdx, side, delay, sliderManager) {
  const slider = new HeadlineSlider(startIdx, side, delay, sliderManager);
  slider.init();
  return slider.getHTML();
}
