# MoodLog

감정 일기 웹앱 - 오늘의 감정을 한 줄로 기록하고 AI의 따뜻한 코멘트를 받아보세요.

## 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres + Auth, Google OAuth)
- **OpenAI GPT-4o mini** (AI 코멘트 생성)

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
│   │   └── callback/         # OAuth 콜백
│   └── api/
│       ├── entries/          # 일기 API (GET, POST)
│       │   └── [id]/        # 일기 삭제 API (DELETE)
│       ├── paper-diary/       # 종이 일기 업로드 API (POST)
│       └── auth/
│           └── logout/       # 로그아웃 API
├── components/
│   ├── Header.tsx            # 헤더 컴포넌트 (네비게이션 포함)
│   ├── Logo.tsx              # 로고 컴포넌트
│   ├── GoogleLoginButton.tsx # Google 로그인 버튼
│   ├── DemoModeButton.tsx   # 체험 모드 버튼
│   ├── MoodForm.tsx          # 감정 선택 및 일기 작성 폼
│   ├── EntryCard.tsx         # 일기 카드 컴포넌트
│   ├── FilterableEntries.tsx # 필터링 및 페이지네이션 컴포넌트
│   ├── PaperDiaryUpload.tsx  # 종이 일기 업로드 컴포넌트
│   ├── EntryDisplay.tsx      # 일기 표시 컴포넌트 (홈 페이지용)
│   ├── HomePageClient.tsx   # 체험 모드 홈 페이지 클라이언트
│   └── ListPageClient.tsx   # 체험 모드 리스트 페이지 클라이언트
├── lib/
│   ├── supabase/             # Supabase 클라이언트 설정
│   │   ├── client.ts         # 브라우저 클라이언트
│   │   ├── server.ts         # 서버 클라이언트
│   │   └── middleware.ts     # 미들웨어 설정
│   ├── openai.ts             # OpenAI API 연동
│   ├── localStorage.ts       # 로컬스토리지 기반 체험 모드 데이터 관리
│   └── utils.ts              # 유틸리티 함수 (한국 시간 기준 날짜 계산)
├── middleware.ts             # Next.js 미들웨어 (인증 처리)
└── tailwind.config.ts        # Tailwind 설정
```

## 주요 기능

- ✅ **Google OAuth 로그인** - 간편한 소셜 로그인
- ✅ **감정 선택 및 한 줄 일기 작성** - 5가지 감정(😊 행복, 🙂 보통, 😢 슬픔, 😡 화남, 🥰 사랑) 선택 가능
- ✅ **오늘의 기록 확인** - 오늘 작성한 일기와 AI 코멘트 확인
- ✅ **지난 기록 목록 보기** - 과거 일기 목록 조회
- ✅ **AI 코멘트** - OpenAI GPT-4o mini를 활용한 자연스러운 AI 응답
- ✅ **감정별 필터링** - 전체/행복/보통/슬픔/화남/사랑으로 일기 필터링
- ✅ **페이지네이션** - 일기 목록을 7개씩 로드하고 "더 보기"로 추가 로드
- ✅ **지난 1주일간의 감정 흐름** - 홈 페이지에서 최근 7일간의 감정 변화 시각화
- ✅ **종이 일기 업로드** - 날짜 선택, 감정 선택, 이미지 미리보기 및 업로드 기능
- ✅ **일기 삭제 기능** - 드롭다운 메뉴를 통한 일기 삭제 (로그인/데모 모드 모두 지원)
- ✅ **한국 시간 기준 날짜 계산** - KST(UTC+9) 기준으로 정확한 날짜 처리
- ✅ **반응형 디자인** - 모바일, 태블릿, 데스크톱 지원
- ✅ **체험 모드** - 로그인 없이 로컬스토리지 기반으로 서비스 체험 가능

## 배포

🌐 [https://mood-log-amber.vercel.app/](https://mood-log-amber.vercel.app/)
