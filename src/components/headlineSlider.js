import { ANIMATION, RECENT_NEWS } from "../constants/constants";
import "../style/headelineSlider.css";
import rollingSection from "./rollingSection";

const sliderManager = {
  isHovered: false,
  sliders: [],
};

export default function headelineSlider() {
  return /* html */ `
    <section class="headline-section" aria-label="주요 헤드라인">
      <div class="headline-container">
        ${rollingSection(
          RECENT_NEWS.LEFT_NEWS_START,
          "left",
          ANIMATION.HEADLINE_LEFT_DELAY,
          sliderManager
        )}
        ${rollingSection(
          RECENT_NEWS.RIGHT_NEWS_START,
          "right",
          ANIMATION.HEADLINE_RIGHT_DELAY,
          sliderManager
        )}
      </div>
    </section>
  `;
}
