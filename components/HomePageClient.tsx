"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import MoodForm from "@/components/MoodForm";
import EntryDisplay from "@/components/EntryDisplay";
import {
  isDemoMode,
  getDemoEntries,
  type DemoEntry,
  disableDemoMode,
} from "@/lib/localStorage";
import { getKSTDateString, getKSTDateStringDaysAgo } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type HomePageClientProps = {
  searchParams?: {
    loading?: string;
  };
};

export default function HomePageClient({ searchParams }: HomePageClientProps) {
  const [todayEntry, setTodayEntry] = useState<DemoEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<
    Array<{ date: string; mood: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndLoadData = async () => {
      // 로그인 사용자가 있으면 체험 모드를 사용하지 않음 (Supabase 데이터 사용)
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 로그인 사용자가 있으면 체험 모드 데이터 삭제하고 리다이렉트
        disableDemoMode();
        document.cookie = "moodlog_demo_mode=; path=/; max-age=0";
        window.location.href = "/home";
        return;
      }

      // 체험 모드가 아니면 리다이렉트
      if (!isDemoMode()) {
        window.location.href = "/";
        return;
      }

      const loadData = () => {
        const today = getKSTDateString();
        const oneWeekAgoStr = getKSTDateStringDaysAgo(6);

        const entries = getDemoEntries();
        const todayEntryData = entries.find((e) => e.date === today);
        const recentEntriesData = entries
          .filter((e) => e.date >= oneWeekAgoStr && e.date <= today)
          .map((e) => ({ date: e.date, mood: e.mood }))
          .sort((a, b) => a.date.localeCompare(b.date));

        setTodayEntry(todayEntryData || null);
        setRecentEntries(recentEntriesData);
        setIsLoading(false);
      };

      loadData();
    };

    checkAndLoadData();
  }, [searchParams]);

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

  if (isLoading) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
              <Header showNav currentPage="home" />
              <main className="flex-grow pt-12 pb-8 px-2 sm:px-4 flex items-center justify-center">
                <div className="loader-large" />
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
            <Header showNav currentPage="home" />
            <main className="flex-grow pt-6 sm:pt-12 pb-6 sm:pb-8 px-2 sm:px-4">
              {todayEntry ? (
                <EntryDisplay
                  entry={todayEntry}
                  recentEntries={recentEntries}
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
