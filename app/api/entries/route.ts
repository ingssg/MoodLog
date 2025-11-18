import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect("/");
  }

  const formData = await request.formData();
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as string;

  // TODO: 실제로는 Supabase에 저장
  // const { error } = await supabase
  //   .from("entries")
  //   .insert({
  //     user_id: user.id,
  //     content,
  //     mood,
  //     date: new Date().toISOString().split("T")[0],
  //   });

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }

  // 임시로 홈으로 리다이렉트
  redirect("/home");
}

