import { createClient } from "@/lib/supabase/server";
import { generateAiComment } from "@/lib/openai";
import { NextResponse } from "next/server";
import { getKSTDateString } from "@/lib/utils";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 사용자가 있으면 Supabase 데이터만 사용 (체험 모드 쿠키 무시)
  if (!user) {
    const cookieStore = cookies();
    const demoModeCookie = cookieStore.get("moodlog_demo_mode");
    
    // 체험 모드일 때는 빈 배열 반환 (클라이언트에서 로컬스토리지에서 읽음)
    if (demoModeCookie?.value === "true") {
      return NextResponse.json({ entries: [] });
    }
    
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "7");
  const mood = searchParams.get("mood"); // 필터링용 감정

  let query = supabase
    .from("entries")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .range(offset, offset + limit - 1);

  // 감정 필터링
  if (mood && mood !== "all") {
    query = query.eq("mood", mood);
  }

  const { data: entries, error } = await query;

  if (error) {
    // console.error("Error fetching entries:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: entries || [] });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const content = (formData.get("content") as string)?.trim();
  const mood = formData.get("mood") as string;

  if (!content || !mood) {
    return NextResponse.json(
      { error: "Content and mood are required" },
      { status: 400 }
    );
  }

  // 오늘 날짜 (한국 시간 기준, YYYY-MM-DD 형식)
  const today = getKSTDateString();

  // AI 코멘트 생성
  const aiComment = await generateAiComment(content, mood);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인 사용자가 있으면 Supabase에 저장 (체험 모드 쿠키 무시)
  if (user) {
    // 먼저 오늘의 일기가 있는지 확인
    const { data: existingEntry } = await supabase
      .from("entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    let error;

    if (existingEntry) {
      // 이미 오늘의 일기가 있으면 업데이트
      const { error: updateError } = await supabase
        .from("entries")
        .update({
          content,
          mood,
          ai_comment: aiComment,
        })
        .eq("id", existingEntry.id);

      error = updateError;
    } else {
      // 오늘의 일기가 없으면 새로 생성
      const { error: insertError } = await supabase.from("entries").insert({
        user_id: user.id,
        content,
        mood,
        date: today,
        ai_comment: aiComment,
      });

      error = insertError;
    }

    if (error) {
      // console.error("Error saving entry:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  // 로그인 사용자가 없으면 체험 모드인지 확인
  const cookieStore = cookies();
  const demoModeCookie = cookieStore.get("moodlog_demo_mode");

  // 체험 모드일 때는 AI 코멘트만 반환 (클라이언트에서 로컬스토리지에 저장)
  if (demoModeCookie?.value === "true") {
    return NextResponse.json({
      success: true,
      aiComment,
      date: today,
    });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

