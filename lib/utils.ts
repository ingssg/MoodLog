/**
 * 한국 시간(KST, UTC+9) 기준으로 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getKSTDateString(): string {
  const now = new Date();
  const kstTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const year = kstTime.getFullYear();
  const month = String(kstTime.getMonth() + 1).padStart(2, "0");
  const day = String(kstTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 한국 시간(KST) 기준으로 특정 일수 전 날짜를 YYYY-MM-DD 형식으로 반환
 * @param daysAgo - 며칠 전인지 (기본값: 0, 오늘)
 */
export function getKSTDateStringDaysAgo(daysAgo: number = 0): string {
  const now = new Date();
  const kstTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  kstTime.setDate(kstTime.getDate() - daysAgo);
  const year = kstTime.getFullYear();
  const month = String(kstTime.getMonth() + 1).padStart(2, "0");
  const day = String(kstTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

