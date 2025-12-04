# Supabase 테이블 설정 가이드

## 방법 1: Supabase Dashboard SQL Editor 사용 (권장)

1. **Supabase Dashboard 접속**

   - https://supabase.com/dashboard 접속
   - 프로젝트 선택

2. **SQL Editor 열기**

   - 왼쪽 메뉴에서 **SQL Editor** 클릭
   - **New query** 클릭

3. **스키마 실행**

   - `supabase_schema.sql` 파일의 내용을 복사
   - SQL Editor에 붙여넣기
   - **Run** 버튼 클릭 (또는 `Cmd + Enter`)

4. **확인**
   - 왼쪽 메뉴에서 **Table Editor** 클릭
   - `entries` 테이블이 생성되었는지 확인

## 방법 2: Supabase CLI 사용

### CLI 설치 (macOS)

```bash
# Homebrew로 설치 (Command Line Tools 업데이트 필요)
brew install supabase/tap/supabase

# 또는 npm으로 설치 (권한 문제 시)
npm install -g supabase --unsafe-perm=true
```

### CLI로 스키마 적용

```bash
# Supabase 프로젝트에 로그인
supabase login

# 프로젝트 링크 (선택사항 - 로컬 개발용)
supabase link --project-ref your-project-ref

# 스키마 적용
supabase db push
```

## 테이블 구조

생성되는 `entries` 테이블:

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `mood`: TEXT (happy, neutral, sad, angry, love)
- `content`: TEXT (일기 내용)
- `ai_comment`: TEXT (AI 코멘트, 선택사항)
- `date`: DATE (일기 날짜)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## 보안 설정

RLS (Row Level Security)가 활성화되어 있어:

- 사용자는 자신의 일기만 조회/생성/수정/삭제 가능
- 다른 사용자의 일기는 접근 불가
