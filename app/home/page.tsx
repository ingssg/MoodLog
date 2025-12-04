import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HomePageClient from "@/components/HomePageClient";
import Header from "@/components/Header";
import MoodForm from "@/components/MoodForm";
import EntryDisplay from "@/components/EntryDisplay";
import { getKSTDateString, getKSTDateStringDaysAgo } from "@/lib/utils";

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

  // 로그인 사용자가 있으면 체험 모드 쿠키가 있어도 무시하고 Supabase 데이터만 사용
  if (!user) {
    const cookieStore = cookies();
    const demoModeCookie = cookieStore.get("moodlog_demo_mode");

    // 체험 모드일 때만 클라이언트 컴포넌트로 위임
    if (demoModeCookie?.value === "true") {
      return <HomePageClient searchParams={searchParams} />;
    }

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

  // 오늘 날짜 (한국 시간 기준)
  const today = getKSTDateString();

  // 오늘의 일기 가져오기
  const { data: todayEntry, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  const hasEntryToday = !!todayEntry && !error;

  // 지난 1주일간의 일기 가져오기 (감정 트렌드용, 한국 시간 기준)
  const oneWeekAgoStr = getKSTDateStringDaysAgo(6); // 오늘 포함 7일

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

function NoEntryForm() {
  return (
    <div className="flex flex-1 items-center justify-center px-2 sm:px-4 py-6 sm:py-10">
      <div className="flex w-full max-w-[680px] flex-col items-stretch justify-start rounded-xl bg-card-bg dark:bg-card-dark p-4 sm:p-6 md:p-8 lg:p-12 shadow-[0_8px_24px_rgba(180,140,120,0.2),0_4px_8px_rgba(180,140,120,0.15)]">
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
