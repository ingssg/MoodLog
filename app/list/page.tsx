import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FilterableEntries from "@/components/FilterableEntries";

export default async function ListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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
    console.error("Error fetching entries:", error);
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
