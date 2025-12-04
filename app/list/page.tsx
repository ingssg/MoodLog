import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FilterableEntries from "@/components/FilterableEntries";
import ListPageClient from "@/components/ListPageClient";
import Header from "@/components/Header";

export default async function ListPage() {
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
      return <ListPageClient />;
    }
    
    redirect("/");
  }

  // 사용자의 최근 7개 일기만 가져오기 (날짜 내림차순)
  const { data: entries, error } = await supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(7);

  if (error) {
    // console.error("Error fetching entries:", error);
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
            <Header showNav currentPage="list" />
            <main className="flex flex-col flex-1 py-4 sm:py-8 md:py-12 px-2 sm:px-4">
              <FilterableEntries entries={entries || []} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
