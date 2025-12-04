-- 종이 일기 이미지 저장을 위한 Supabase Storage bucket 생성
-- Supabase Dashboard > Storage에서 수동으로 생성하거나 아래 SQL 실행

-- Storage bucket 생성 (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('paper-diaries', 'paper-diaries', true)
ON CONFLICT (id) DO NOTHING;

-- Storage 정책: 사용자는 자신의 폴더에만 업로드 가능
CREATE POLICY "Users can upload their own paper diaries"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'paper-diaries' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage 정책: 사용자는 자신의 폴더에서만 읽기 가능
CREATE POLICY "Users can view their own paper diaries"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'paper-diaries' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage 정책: 사용자는 자신의 폴더에서만 삭제 가능
CREATE POLICY "Users can delete their own paper diaries"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'paper-diaries' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- entries 테이블에 paper_diary_image 컬럼 추가
ALTER TABLE entries
ADD COLUMN IF NOT EXISTS paper_diary_image TEXT;

