import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ListPageClient from "@/components/ListPageClient";
import ListPageAuthenticated from "@/components/ListPageAuthenticated";
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

  return <ListPageAuthenticated initialEntries={entries || []} />;
}
