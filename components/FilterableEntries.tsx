"use client";

import { useState, useEffect, useRef } from "react";

// 감정 값과 이모지 매핑
const moodEmojiMap: Record<string, string> = {
  happy: "😊",
  neutral: "🙂",
  sad: "😢",
  angry: "😡",
  love: "🥰",
};

// 이모지와 감정 값 역매핑
const emojiToMoodMap: Record<string, string> = {
  "😊": "happy",
  "🙂": "neutral",
  "😢": "sad",
  "😡": "angry",
  "🥰": "love",
};

// 날짜 포맷팅 함수 (한국어 형식)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

interface Entry {
  id: string;
  date: string;
  content: string;
  mood: string;
  ai_comment?: string;
}

interface FilterableEntriesProps {
  entries: Entry[];
}

export default function FilterableEntries({ entries: initialEntries }: FilterableEntriesProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("전체");
  const [displayedEntries, setDisplayedEntries] = useState<Entry[]>(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialEntries.length >= 7);
  const [offset, setOffset] = useState(initialEntries.length);
  const isInitialMount = useRef(true);

  // 필터 변경 시 초기화 (초기 로드는 제외)
  useEffect(() => {
    // 초기 마운트 시에는 initialEntries를 사용하므로 스킵
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const loadFilteredEntries = async () => {
      setIsLoading(true);
      const mood = selectedFilter === "전체" ? "all" : emojiToMoodMap[selectedFilter];
      
      try {
        const response = await fetch(
          `/api/entries?offset=0&limit=7&mood=${mood}`
        );
        const data = await response.json();
        
        if (data.entries) {
          setDisplayedEntries(data.entries);
          // 7개 미만이면 더 이상 데이터가 없음, 7개면 더 있을 수 있음
          setHasMore(data.entries.length >= 7);
          setOffset(data.entries.length);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFilteredEntries();
  }, [selectedFilter]);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const mood = selectedFilter === "전체" ? "all" : emojiToMoodMap[selectedFilter];
    
    try {
      const response = await fetch(
        `/api/entries?offset=${offset}&limit=7&mood=${mood}`
      );
      const data = await response.json();
      
      if (data.entries && data.entries.length > 0) {
        setDisplayedEntries((prev) => [...prev, ...data.entries]);
        setHasMore(data.entries.length >= 7);
        setOffset((prev) => prev + data.entries.length);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more entries:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="pb-3 mb-4 sm:mb-6">
        <div className="flex justify-center border-b border-[#e6dedb] dark:border-white/10 px-2 sm:px-4 gap-4 sm:gap-6 md:gap-8 overflow-x-auto">
          <FilterTab
            label="전체"
            active={selectedFilter === "전체"}
            onClick={() => setSelectedFilter("전체")}
          />
          <FilterTab
            label="😊"
            active={selectedFilter === "😊"}
            onClick={() => setSelectedFilter("😊")}
          />
          <FilterTab
            label="🙂"
            active={selectedFilter === "🙂"}
            onClick={() => setSelectedFilter("🙂")}
          />
          <FilterTab
            label="😢"
            active={selectedFilter === "😢"}
            onClick={() => setSelectedFilter("😢")}
          />
          <FilterTab
            label="😡"
            active={selectedFilter === "😡"}
            onClick={() => setSelectedFilter("😡")}
          />
          <FilterTab
            label="🥰"
            active={selectedFilter === "🥰"}
            onClick={() => setSelectedFilter("🥰")}
          />
        </div>
      </div>
      <div className="space-y-4 sm:space-y-6">
        {isLoading && displayedEntries.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm sm:text-base">
              로딩 중...
            </p>
          </div>
        ) : displayedEntries && displayedEntries.length > 0 ? (
          displayedEntries.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="text-center py-8 sm:py-12">
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm sm:text-base">
              작성된 일기가 없습니다.
            </p>
          </div>
        )}
      </div>
      {displayedEntries.length > 0 && (
        <div className="flex justify-center mt-8 sm:mt-12">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-primary/10 hover:text-primary h-9 sm:h-10 px-6 sm:px-8 py-2 text-text-secondary-light dark:text-text-secondary-dark dark:border-white/20 dark:hover:bg-primary/20 dark:hover:text-white"
            >
              {isLoading ? "로딩 중..." : "더 보기"}
            </button>
          ) : (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm sm:text-base">
              마지막 일기입니다.
            </p>
          )}
        </div>
      )}
    </>
  );
}

function FilterTab({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center border-b-[3px] pb-2 sm:pb-[13px] pt-2 sm:pt-4 transition-colors ${
        active
          ? "border-b-primary text-text-primary-light dark:text-text-primary-dark"
          : "border-b-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:border-primary/50"
      }`}
    >
      <p
        className={`${
          label.length > 2
            ? "text-xs sm:text-sm font-bold"
            : "text-xl sm:text-2xl font-bold"
        } leading-normal tracking-[0.015em] whitespace-nowrap`}
      >
        {label}
      </p>
    </button>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <div className="p-4 sm:p-6 bg-card-light dark:bg-card-dark rounded-xl shadow-[0_4px_20px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-3 sm:gap-6">
        <div className="flex flex-col items-stretch justify-center gap-3 sm:gap-4 w-full min-w-0">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm font-normal leading-normal">
            {formatDate(entry.date)}
          </p>
          <p className="text-text-primary-light dark:text-text-primary-dark text-base sm:text-lg font-bold leading-tight tracking-[-0.015em] break-words">
            {entry.content}
          </p>
          {entry.ai_comment && (
            <>
              <hr className="border-t-border-light dark:border-white/10 my-2" />
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm sm:text-base font-normal leading-relaxed break-words">
                {entry.ai_comment}
              </p>
            </>
          )}
        </div>
        <p className="text-2xl sm:text-3xl flex-shrink-0">
          {moodEmojiMap[entry.mood] || "😀"}
        </p>
      </div>
    </div>
  );
}

