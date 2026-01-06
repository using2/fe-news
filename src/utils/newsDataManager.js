import { PAGINATION } from "../../constants/constants";

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function loadHeadlineNewsData(jsonPath) {
  try {
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("헤드라인 뉴스 데이터 로드 실패:", error);
    return [];
  }
}

export async function loadNewsData(jsonPath) {
  try {
    const response = await fetch(jsonPath);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("뉴스 데이터 로드 실패:", error);
    return [];
  }
}

export function paginateNews(newsData, pageSize = PAGINATION.GRID_PAGE_SIZE) {
  const shuffled = shuffleArray(newsData);
  const pages = [];

  for (let i = 0; i < shuffled.length; i += pageSize) {
    pages.push(shuffled.slice(i, i + pageSize));
  }

  return pages;
}
