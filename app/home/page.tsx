import Header from "@/components/Header";
import MoodForm from "@/components/MoodForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

// 더미 데이터 - 나중에 Supabase에서 가져올 예정
const hasEntryToday = false; // 실제로는 DB에서 확인
const todayEntry = {
  date: "24 October 2023",
  mood: "😀",
  content: "오늘 정말 기분 좋은 하루였다. 아침에 일어나서 상쾌한 공기를 마시니 저절로 미소가 지어졌다. 하루 종일 긍정적인 생각만 가득했다.",
  aiComment:
    "AI Comment: 정말 기분 좋은 하루를 보내셨군요! 긍정적인 시작이 하루 전체에 좋은 영향을 미친 것 같아요. 내일도 오늘처럼 행복한 하루가 되기를 바랍니다.",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5 px-4 sm:px-8">
          <div className="layout-content-container flex w-full flex-col max-w-[700px] flex-1">
            <Header showNav currentPage="home" />
            <main className="flex-grow pt-12 pb-8 px-2 sm:px-4">
              {hasEntryToday ? (
                <EntryDisplay entry={todayEntry} />
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

function EntryDisplay({ entry }: { entry: typeof todayEntry }) {
  return (
    <>
      <div className="p-4 @container">
        <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-card-light dark:bg-card-dark p-6 sm:p-8">
          <div className="flex w-full flex-col items-stretch justify-center gap-5">
            <div className="flex items-center justify-between">
              <p className="text-text-subtle-light dark:text-text-subtle-dark text-sm font-normal leading-normal">
                {entry.date}
              </p>
              <p className="text-4xl">{entry.mood}</p>
            </div>
            <div className="flex flex-col gap-4 pt-2">
              <p className="text-base font-normal leading-relaxed text-text-main-light dark:text-text-main-dark">
                {entry.content}
              </p>
              <p className="text-base font-normal leading-relaxed text-text-subtle-light dark:text-text-subtle-dark border-l-2 border-primary/50 pl-4">
                {entry.aiComment}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="text-text-subtle-light dark:text-text-subtle-dark text-sm font-bold leading-normal tracking-[0.015em] px-4 py-2 text-center">
          Recent Mood Trends
        </h4>
        <div className="grid grid-cols-5 gap-3 p-4">
          <div className="flex flex-col items-center justify-center text-center bg-card-light dark:bg-card-dark rounded-lg p-3 aspect-square shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <span className="text-3xl">😀</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center bg-card-light dark:bg-card-dark rounded-lg p-3 aspect-square shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <span className="text-3xl">🙂</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center bg-card-light dark:bg-card-dark rounded-lg p-3 aspect-square shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <span className="text-3xl">😢</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center bg-card-light dark:bg-card-dark rounded-lg p-3 aspect-square shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <span className="text-3xl">😡</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center bg-card-light dark:bg-card-dark rounded-lg p-3 aspect-square shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <span className="text-3xl">😍</span>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Link
          href="/list"
          className="text-text-subtle-light dark:text-text-subtle-dark text-sm font-medium leading-normal pb-3 pt-1 px-4 text-center hover:underline cursor-pointer block"
        >
          지난 기록 보기 →
        </Link>
      </div>
    </>
  );
}

function NoEntryForm() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="flex w-full max-w-[680px] flex-col items-stretch justify-start rounded-xl bg-card-light dark:bg-card-dark p-8 shadow-[0_16px_32px_rgba(0,0,0,0.1)] md:p-12">
        <h1 className="mb-8 text-center text-2xl font-bold text-text-main-light dark:text-text-main-dark">
          How are you feeling today?
        </h1>
        <MoodForm />
      </div>
    </div>
  );
}


