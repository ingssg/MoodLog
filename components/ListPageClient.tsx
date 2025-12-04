"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import FilterableEntries from "@/components/FilterableEntries";
import {
  isDemoMode,
  getDemoEntriesFiltered,
  type DemoEntry,
  disableDemoMode,
} from "@/lib/localStorage";
import { createClient } from "@/lib/supabase/client";

export default function ListPageClient() {
  const [entries, setEntries] = useState<DemoEntry[]>([]);
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
        window.location.href = "/list";
        return;
      }

      // 체험 모드가 아니면 리다이렉트
      if (!isDemoMode()) {
        window.location.href = "/";
        return;
      }

      // 초기 7개만 가져오기
      const initialEntries = getDemoEntriesFiltered(undefined, 0, 7);
      setEntries(initialEntries);
      setIsLoading(false);
    };

    checkAndLoadData();
  }, []);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
              <Header showNav currentPage="list" />
              <main className="flex flex-col flex-1 py-4 sm:py-8 md:py-12 px-2 sm:px-4">
                <div className="text-center py-8 sm:py-12">
                  <div className="loader-large mx-auto"></div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex w-full flex-col max-w-4xl flex-1">
            <Header showNav currentPage="list" />
            <main className="flex flex-col flex-1 py-4 sm:py-8 md:py-12 px-2 sm:px-4">
              <FilterableEntries entries={entries} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

