import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !session) {
    return NextResponse.json(
      { error: "인증이 필요합니다. 다시 로그인해주세요." },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const date = formData.get("date") as string;
    const mood = (formData.get("mood") as string) || "neutral";
    const imageFile = formData.get("image") as File;

    if (!date || !imageFile) {
      return NextResponse.json(
        { error: "날짜와 이미지 파일이 필요합니다." },
        { status: 400 }
      );
    }

    // 감정 값 검증
    const validMoods = ["happy", "neutral", "sad", "angry", "love"];
    if (!validMoods.includes(mood)) {
      return NextResponse.json(
        { error: "유효하지 않은 감정 값입니다." },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (10MB 제한)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `이미지 파일 크기는 10MB 이하여야 합니다. (현재: ${(
            imageFile.size /
            1024 /
            1024
          ).toFixed(2)}MB)`,
        },
        { status: 400 }
      );
    }

    // 파일 형식 검증
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "지원하는 이미지 형식은 JPEG, PNG, WebP입니다." },
        { status: 400 }
      );
    }

    // 이미지를 Blob으로 변환
    const arrayBuffer = await imageFile.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "image/jpeg" });

    const fileName = `${user.id}/${date}_${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("paper-diaries")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      if (uploadError.message.includes("Bucket not found")) {
        return NextResponse.json(
          {
            error:
              "Storage bucket이 생성되지 않았습니다. Supabase Dashboard에서 'paper-diaries' bucket을 생성해주세요.",
          },
          { status: 400 }
        );
      }
      if (
        uploadError.message.includes("row-level security") ||
        uploadError.message.includes("RLS") ||
        uploadError.message.includes("new row violates") ||
        uploadError.message.includes("permission denied")
      ) {
        return NextResponse.json(
          {
            error:
              "Storage 업로드 권한이 없습니다. Supabase Dashboard > Storage > Policies에서 'Users can upload their own paper diaries' 정책이 활성화되어 있는지 확인해주세요.",
          },
          { status: 403 }
        );
      }
      if (uploadError.message.includes("File size")) {
        return NextResponse.json(
          {
            error: "파일 크기가 너무 큽니다. 더 작은 이미지를 업로드해주세요.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          error: `이미지 업로드 실패: ${uploadError.message}`,
        },
        { status: 500 }
      );
    }

    // Public URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage.from("paper-diaries").getPublicUrl(fileName);

    // entries 테이블에 이미지 URL 저장
    const { data: existingEntry, error: selectError } = await supabase
      .from("entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("date", date)
      .maybeSingle();

    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (existingEntry) {
      // 기존 일기에 이미지 URL 및 감정 추가
      const { error: updateError } = await supabase
        .from("entries")
        .update({
          paper_diary_image: publicUrl,
          mood: mood as "happy" | "neutral" | "sad" | "angry" | "love",
        })
        .eq("id", existingEntry.id)
        .eq("user_id", user.id);

      if (updateError) {
        if (
          updateError.message.includes("column") &&
          updateError.message.includes("does not exist")
        ) {
          return NextResponse.json(
            {
              error:
                "테이블에 paper_diary_image 컬럼이 없습니다. Supabase에서 ALTER TABLE entries ADD COLUMN paper_diary_image TEXT; 를 실행해주세요.",
            },
            { status: 400 }
          );
        }
        if (updateError.message.includes("row-level security")) {
          return NextResponse.json(
            {
              error:
                "RLS 정책 위반: 사용자 인증이 제대로 되지 않았습니다. 다시 로그인해주세요.",
            },
            { status: 403 }
          );
        }
        return NextResponse.json(
          { error: updateError.message, code: updateError.code },
          { status: 500 }
        );
      }
    } else {
      const insertData = {
        user_id: user.id,
        date,
        content: "종이 일기",
        mood: mood as "happy" | "neutral" | "sad" | "angry" | "love",
        paper_diary_image: publicUrl,
      };

      const { error: insertError } = await supabase
        .from("entries")
        .insert(insertData);

      if (insertError) {
        if (
          insertError.message.includes("column") &&
          insertError.message.includes("does not exist")
        ) {
          return NextResponse.json(
            {
              error:
                "테이블에 paper_diary_image 컬럼이 없습니다. Supabase에서 ALTER TABLE entries ADD COLUMN paper_diary_image TEXT; 를 실행해주세요.",
            },
            { status: 400 }
          );
        }
        if (insertError.message.includes("row-level security")) {
          return NextResponse.json(
            {
              error:
                "RLS 정책 위반: 사용자 인증이 제대로 되지 않았습니다. 다시 로그인해주세요.",
            },
            { status: 403 }
          );
        }
        return NextResponse.json(
          { error: insertError.message, code: insertError.code },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, imageUrl: publicUrl });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "이미지 업로드 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
