# Google OAuth 설정 가이드

## 1. Supabase 프로젝트 생성

1. https://supabase.com 접속
2. 새 프로젝트 생성
3. 프로젝트 URL과 anon key 확인:
   - Settings > API
   - Project URL: `https://xxxxx.supabase.co`
   - anon/public key 복사

## 2. Google Cloud Console 설정

### 2-1. OAuth 동의 화면 설정 (앱 이름 설정)

1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services > OAuth consent screen** 이동
4. **User Type** 선택 (External 또는 Internal)
5. **App information** 섹션에서:
   - **App name**: `MoodLog` 입력
   - **User support email**: 본인 이메일 입력
   - **App logo**: (선택사항) 로고 이미지 업로드
   - **App domain**: (선택사항) 도메인 입력
6. **Developer contact information**에 이메일 입력
7. **Save and Continue** 클릭
8. **Scopes** 단계에서 기본값 유지하고 **Save and Continue**
9. **Test users** 단계에서 (테스트 모드인 경우) 테스트할 Google 계정 추가
10. **Save and Continue** 클릭

### 2-2. OAuth 클라이언트 ID 생성

1. **APIs & Services > Credentials** 이동
2. "Create Credentials" > "OAuth client ID" 선택
3. Application type: "Web application"
4. Name: "MoodLog" (원하는 이름)
5. Authorized redirect URIs 추가:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
   예: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
6. **Create** 클릭
7. Client ID와 Client Secret 복사

## 3. Supabase에서 Google Provider 활성화

1. Supabase Dashboard > Authentication > Providers 이동
2. Google Provider 찾기
3. Enable toggle 켜기
4. Client ID (Google에서 복사한 값) 입력
5. Client Secret (Google에서 복사한 값) 입력
6. Save 클릭

## 4. 환경 변수 설정

`.env.local` 파일에 다음 값들을 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. 테스트

1. 개발 서버 실행: `npm run dev`
2. 브라우저에서 http://localhost:3000 접속
3. "Google로 시작하기" 버튼 클릭
4. Google 로그인 진행
5. `/home` 페이지로 리다이렉트되는지 확인

## 문제 해결

- **리다이렉트 URI 오류**: Google Cloud Console의 Authorized redirect URIs에 Supabase 콜백 URL이 정확히 추가되었는지 확인
- **환경 변수 오류**: `.env.local` 파일이 프로젝트 루트에 있고, 서버를 재시작했는지 확인
- **CORS 오류**: Supabase Dashboard > Settings > API에서 CORS 설정 확인
