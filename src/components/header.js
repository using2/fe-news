export default function header() {
  const now = new Date();
  const koreaTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
  const isoDate = koreaTime.toISOString().split("T")[0];

  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const date = String(koreaTime.getDate()).padStart(2, "0");

  const weekdays = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const weekday = weekdays[koreaTime.getDay()];

  const displayDate = `${year}. ${month}. ${date}. ${weekday}`;

  return /* html */ `
    <header class="news-trend-header">
      <h2>📰 뉴스스탠드</h2>
      <time datetime="${isoDate}">${displayDate}</time>
    </header>
  `;
}
