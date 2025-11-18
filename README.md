# MoodLog

감정 일기 웹앱 - 오늘의 감정을 한 줄로 기록하고 AI의 따뜻한 코멘트를 받아보세요.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres + Auth, Google OAuth)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
moodLog/
├── app/
│   ├── page.tsx              # 랜딩 페이지 (/)
│   ├── home/
│   │   └── page.tsx          # 홈 페이지 (/home)
│   ├── list/
│   │   └── page.tsx          # 지난 기록 페이지 (/list)
│   ├── auth/
│   │   ├── google/           # Google OAuth 로그인
│   │   └── callback/          # OAuth 콜백
│   └── api/
│       └── entries/          # 일기 API
├── components/
│   ├── Header.tsx             # 헤더 컴포넌트
│   ├── Logo.tsx               # 로고 컴포넌트
│   └── MoodForm.tsx           # 감정 선택 폼
├── lib/
│   └── supabase/              # Supabase 클라이언트 설정
└── tailwind.config.ts         # Tailwind 설정
```

## 주요 기능

- ✅ Google OAuth 로그인
- ✅ 감정 선택 및 한 줄 일기 작성
- ✅ 오늘의 기록 확인
- ✅ 지난 기록 목록 보기
- ⏳ AI 코멘트 (더미 데이터로 구현, 추후 OpenAI API 연동 예정)

## 다음 단계

1. Supabase 데이터베이스 스키마 생성
2. OpenAI API 연동
3. 반응형 디자인 (모바일)
4. 다크모드 토글 기능
