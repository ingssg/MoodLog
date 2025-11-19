import { createClient } from "@/lib/supabase/server";
import { generateAiComment } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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
    console.error("Error fetching entries:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ entries: entries || [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const content = (formData.get("content") as string)?.trim();
  const mood = formData.get("mood") as string;

  if (!content || !mood) {
    return NextResponse.json(
      { error: "Content and mood are required" },
      { status: 400 }
    );
  }

  // 오늘 날짜 (YYYY-MM-DD 형식)
  const today = new Date().toISOString().split("T")[0];

  // 먼저 오늘의 일기가 있는지 확인
  const { data: existingEntry } = await supabase
    .from("entries")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", today)
    .single();

  const aiComment = await generateAiComment(content, mood);

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
    const { error: insertError } = await supabase
      .from("entries")
      .insert({
        user_id: user.id,
        content,
        mood,
        date: today,
        ai_comment: aiComment,
      });

    error = insertError;
  }

  if (error) {
    console.error("Error saving entry:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

