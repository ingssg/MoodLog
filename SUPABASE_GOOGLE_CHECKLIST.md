# Supabase + Google OAuth 설정 체크리스트

## 🔍 현재 문제

PKCE `code_verifier`가 쿠키에 저장되지 않아 `exchangeCodeForSession`에서 에러 발생

## ✅ Supabase 설정 확인 사항

### 1. Google Provider 설정 확인

- [ ] Supabase Dashboard > Authentication > Providers > Google
- [ ] **Enable** 토글이 켜져 있는지 확인
- [ ] **Client ID**가 올바르게 입력되어 있는지 확인
- [ ] **Client Secret**이 올바르게 입력되어 있는지 확인
- [ ] **Save** 버튼을 눌러 저장했는지 확인

### 2. Supabase 프로젝트 URL 확인

- [ ] Settings > API > Project URL 확인
- [ ] `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`과 일치하는지 확인

### 3. Supabase Site URL 설정 확인

- [ ] Settings > Authentication > URL Configuration
- [ ] **Site URL**이 `http://localhost:3000` (또는 프로덕션 URL)로 설정되어 있는지 확인
- [ ] **Redirect URLs**에 다음이 추가되어 있는지 확인:
  ```
  http://localhost:3000/**
  http://localhost:3000/auth/callback
  ```

### 4. PKCE 설정 확인

- [ ] Supabase는 기본적으로 PKCE를 사용합니다
- [ ] 특별한 설정 변경이 필요하지 않습니다

## ✅ Google Cloud Console 설정 확인 사항

### 1. OAuth 2.0 클라이언트 ID 확인

- [ ] APIs & Services > Credentials
- [ ] OAuth 2.0 클라이언트 ID가 생성되어 있는지 확인
- [ ] **Application type**이 "Web application"인지 확인

### 2. Authorized redirect URIs 확인

- [ ] 다음 URI가 **정확히** 추가되어 있는지 확인:
  ```
  https://[your-project-ref].supabase.co/auth/v1/callback
  ```
- [ ] 예시: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
- [ ] **주의**: `http://localhost:3000/auth/callback`은 추가하지 마세요! (Supabase가 중간에서 처리)

### 3. OAuth 동의 화면 확인

- [ ] APIs & Services > OAuth consent screen
- [ ] **User Type**이 "External"로 설정되어 있는지 확인
- [ ] **Test users**에 테스트할 Google 계정이 추가되어 있는지 확인 (테스트 모드인 경우)

## 🔧 추가로 확인할 사항

### 1. 환경 변수 재확인

```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. 브라우저 쿠키 확인

- [ ] 개발자 도구 > Application > Cookies > `http://localhost:3000`
- [ ] `sb-*-auth-token` 같은 Supabase 쿠키가 있는지 확인
- [ ] 쿠키가 차단되어 있지 않은지 확인 (SameSite, Secure 설정)

### 3. Supabase 로그 확인

- [ ] Supabase Dashboard > Logs > Auth Logs
- [ ] OAuth 시도 시 에러 로그가 있는지 확인

## 🚨 자주 발생하는 문제

1. **리다이렉트 URI 불일치**

   - Google Console의 리다이렉트 URI는 Supabase 콜백 URL이어야 함
   - 앱의 `/auth/callback`이 아님!

2. **Site URL 미설정**

   - Supabase의 Site URL이 설정되지 않으면 리다이렉트가 실패할 수 있음

3. **테스트 사용자 미추가** ⚠️ **중요!**

   - OAuth 동의 화면이 "Testing" 모드인 경우, 테스트 사용자 목록에 계정 추가 **필수**
   - Google Cloud Console > APIs & Services > OAuth consent screen
   - "Test users" 섹션에서 "+ ADD USERS" 클릭
   - 로그인에 사용할 Google 계정 이메일 추가
   - **이것이 설정되지 않으면 로그인이 실패할 수 있습니다!**

4. **쿠키 SameSite 설정**
   - 로컬 개발 환경에서는 `SameSite=Lax`가 필요할 수 있음
