"use client";

import EntryCard from "./EntryCard";
import Link from "next/link";
import { getKSTDateStringDaysAgo } from "@/lib/utils";

// 감정 값과 이모지 매핑
const moodEmojiMap: Record<string, string> = {
  happy: "😀",
  neutral: "🙂",
  sad: "😢",
  angry: "😡",
  love: "😍",
};

interface EntryDisplayProps {
  entry: any;
  recentEntries: any[];
}

export default function EntryDisplay({
  entry,
  recentEntries,
}: EntryDisplayProps) {
  // 지난 1주일 날짜 배열 생성 (일~토, 한국 시간 기준)
  const getLastWeekDates = () => {
    const dates: Array<{ date: string; dayName: string; mood?: string }> = [];

    // 6일 전부터 오늘까지 (과거 -> 현재 순서, 왼쪽 -> 오른쪽)
    for (let i = 6; i >= 0; i--) {
      const dateStr = getKSTDateStringDaysAgo(i);
      const date = new Date(dateStr + "T00:00:00+09:00"); // KST 기준으로 Date 객체 생성
      const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
      const dayName = dayNames[date.getDay()];

      // 해당 날짜의 일기가 있는지 확인
      const entry = recentEntries?.find((e) => e.date === dateStr);

      dates.push({
        date: dateStr,
        dayName,
        mood: entry?.mood,
      });
    }

    return dates;
  };

  const weekDates = getLastWeekDates();

  return (
    <>
      <div className="p-2 sm:p-4 @container">
        <h2 className="text-lg sm:text-xl font-bold text-primary mb-3 sm:mb-4 px-2 sm:px-4">
          오늘의 일기
        </h2>
        <EntryCard
          entry={entry}
          onDelete={() => {
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
        />
      </div>
      <div className="mt-6 sm:mt-8">
        <h4 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4 px-2 sm:px-4 md:px-8">
          지난 일주일의 감정 흐름
        </h4>
        <div className="bg-card-bg dark:bg-card-dark rounded-xl shadow-[0_4px_12px_rgba(180,140,120,0.15),0_2px_4px_rgba(180,140,120,0.1)] p-2 sm:p-4 mx-2 sm:mx-4 overflow-x-auto">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[280px]">
            {weekDates.map((dayData, index) => {
              const dateParts = dayData.date.split("-");
              const month = parseInt(dateParts[1]);
              const day = parseInt(dateParts[2]);
              const dateStr = `${month}/${day}(${dayData.dayName})`;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-center p-1 sm:p-2 border-r border-border-light dark:border-white/10 last:border-r-0"
                >
                  {dayData.mood ? (
                    <>
                      <span className="text-xl sm:text-2xl mb-2 sm:mb-3">
                        {moodEmojiMap[dayData.mood] || "😀"}
                      </span>
                      <span className="text-[10px] sm:text-xs text-text-secondary-light dark:text-text-secondary-dark leading-tight">
                        {dateStr}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl sm:text-2xl mb-2 sm:mb-3 text-text-secondary-light dark:text-text-secondary-dark">
                        ✕
                      </span>
                      <span className="text-[10px] sm:text-xs text-text-secondary-light dark:text-text-secondary-dark leading-tight">
                        {dateStr}
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 sm:mt-8">
        <Link
          href="/list"
          className="text-text-subtle-light dark:text-text-subtle-dark text-xs sm:text-sm font-medium leading-normal pb-3 pt-1 px-2 sm:px-4 hover:underline cursor-pointer block text-right"
        >
          지난 기록 보기 →
        </Link>
      </div>
    </>
  );
}

