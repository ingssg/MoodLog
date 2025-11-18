# MoodLog

감정 일기 웹앱 - 오늘의 감정을 한 줄로 기록하고 AI의 따뜻한 코멘트를 받아보세요.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres + Auth, Google OAuth)

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
