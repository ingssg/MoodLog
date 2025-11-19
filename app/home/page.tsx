import Header from "@/components/Header";
import MoodForm from "@/components/MoodForm";
import EntryCard from "@/components/EntryCard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// 감정 값과 이모지 매핑
const moodEmojiMap: Record<string, string> = {
  happy: "😀",
  neutral: "🙂",
  sad: "😢",
  angry: "😡",
  love: "😍",
};

type HomePageProps = {
  searchParams?: {
    loading?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }
  const isLoadingState = searchParams?.loading === "true";

  if (isLoadingState) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
              <Header showNav currentPage="home" />
              <main className="flex-grow pt-12 pb-8 px-2 sm:px-4 flex items-center justify-center">
                <LoadingState />
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 오늘 날짜
  const today = new Date().toISOString().split("T")[0];

  // 오늘의 일기 가져오기
  const { data: todayEntry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  const hasEntryToday = !!todayEntry && !error;

  // 지난 1주일간의 일기 가져오기 (감정 트렌드용)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // 오늘 포함 7일
  const oneWeekAgoStr = oneWeekAgo.toISOString().split("T")[0];

  const { data: recentEntries } = await supabase
    .from("entries")
    .select("date, mood")
    .eq("user_id", user.id)
    .gte("date", oneWeekAgoStr)
    .lte("date", today)
    .order("date", { ascending: true });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
            <Header showNav currentPage="home" />
            <main className="flex-grow pt-6 sm:pt-12 pb-6 sm:pb-8 px-2 sm:px-4">
              {hasEntryToday && todayEntry ? (
                <EntryDisplay
                  entry={todayEntry}
                  recentEntries={recentEntries || []}
                />
              ) : (
                <NoEntryForm />
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntryDisplay({
  entry,
  recentEntries,
}: {
  entry: any;
  recentEntries: any[];
}) {
  // 지난 1주일 날짜 배열 생성 (일~토)
  const getLastWeekDates = () => {
    const dates: Array<{ date: string; dayName: string; mood?: string }> = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
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
        <EntryCard entry={entry} />
      </div>
      <div className="mt-6 sm:mt-8">
        <h4 className="text-base sm:text-lg font-bold text-primary mb-3 sm:mb-4 px-2 sm:px-4 md:px-8">
          지난 일주일의 감정 흐름
        </h4>
        <div className="bg-card-bg dark:bg-card-dark rounded-xl shadow-[0_6px_18px_rgba(180,140,120,0.13)] p-2 sm:p-4 mx-2 sm:mx-4 overflow-x-auto">
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

function NoEntryForm() {
  return (
    <div className="flex flex-1 items-center justify-center px-2 sm:px-4 py-6 sm:py-10">
      <div className="flex w-full max-w-[680px] flex-col items-stretch justify-start rounded-xl bg-card-bg dark:bg-card-dark p-4 sm:p-6 md:p-8 lg:p-12 shadow-[0_8px_24px_rgba(180,140,120,0.18)]">
        <h1 className="mb-6 sm:mb-8 text-center text-xl sm:text-2xl font-bold text-text-main-light dark:text-text-main-dark">
          오늘 하루 어땠나요?
        </h1>
        <MoodForm />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 w-full">
      <div className="loader-large" />
      <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark text-center">
        오늘의 감정을 따뜻하게 정리하고 있어요…
      </p>
    </div>
  );
}
