// 로컬스토리지 기반 체험 모드 데이터 관리

export const DEMO_MODE_KEY = "moodlog_demo_mode";
export const DEMO_ENTRIES_KEY = "moodlog_demo_entries";

export interface DemoEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
  ai_comment?: string;
  paper_diary_image?: string;
}

// 체험 모드 활성화 여부 확인 (클라이언트 사이드만)
export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_MODE_KEY) === "true";
}

// 체험 모드 활성화
export function enableDemoMode(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_MODE_KEY, "true");
}

// 체험 모드 비활성화 및 모든 데이터 삭제
export function disableDemoMode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_MODE_KEY);
  localStorage.removeItem(DEMO_ENTRIES_KEY);
}

// 체험 모드 일기 가져오기
export function getDemoEntries(): DemoEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(DEMO_ENTRIES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as DemoEntry[];
  } catch {
    return [];
  }
}

// 체험 모드 일기 저장
export function saveDemoEntry(entry: DemoEntry): void {
  if (typeof window === "undefined") return;
  const entries = getDemoEntries();
  // 같은 날짜의 일기가 있으면 업데이트, 없으면 새로 생성
  const existingIndex = entries.findIndex(
    (e) => e.id === entry.id || e.date === entry.date
  );

  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.push(entry);
  }

  // 날짜 내림차순 정렬
  entries.sort((a, b) => b.date.localeCompare(a.date));

  localStorage.setItem(DEMO_ENTRIES_KEY, JSON.stringify(entries));
}

// 체험 모드 일기 필터링 및 페이지네이션
export function getDemoEntriesFiltered(
  mood?: string,
  offset: number = 0,
  limit: number = 7
): DemoEntry[] {
  const entries = getDemoEntries();
  let filtered = entries;

  // 감정 필터링
  if (mood && mood !== "all") {
    filtered = entries.filter((e) => e.mood === mood);
  }

  // 페이지네이션
  return filtered.slice(offset, offset + limit);
}

// 체험 모드 일기 개수 (필터링 후)
export function getDemoEntriesCount(mood?: string): number {
  const entries = getDemoEntries();
  if (mood && mood !== "all") {
    return entries.filter((e) => e.mood === mood).length;
  }
  return entries.length;
}
