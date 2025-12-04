import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "Entry ID is required" },
      { status: 400 }
    );
  }

  // 먼저 해당 일기가 사용자의 것인지 확인
  const { data: entry, error: selectError } = await supabase
    .from("entries")
    .select("id, paper_diary_image")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (selectError || !entry) {
    return NextResponse.json(
      { error: "Entry not found or unauthorized" },
      { status: 404 }
    );
  }

  // 종이 일기 이미지가 있으면 Storage에서도 삭제
  if (entry.paper_diary_image) {
    try {
      // Storage URL에서 파일 경로 추출
      const url = new URL(entry.paper_diary_image);
      const pathParts = url.pathname.split("/");
      const fileName = pathParts[pathParts.length - 1];
      const filePath = `${user.id}/${fileName}`;

      await supabase.storage.from("paper-diaries").remove([filePath]);
    } catch (error) {
      // Storage 삭제 실패해도 DB 삭제는 진행
    }
  }

  // 일기 삭제
  const { error: deleteError } = await supabase
    .from("entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

