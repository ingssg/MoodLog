import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/home");
  }

  return (
    <div className="relative min-h-screen w-full group/design-root overflow-x-hidden">
      <div className="bg-grain fixed inset-0"></div>
      <div className="relative z-10 flex min-h-screen w-full flex-col">
        <div className="flex h-full grow flex-col">
          <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex items-center justify-between whitespace-nowrap py-4">
            <div className="flex items-center gap-4 text-text-primary-light dark:text-text-primary-dark">
              <Logo />
            </div>
            <div className="flex items-center gap-9">
              <a
                className="text-sm font-medium leading-normal hover:text-primary transition-colors"
                href="#features"
              >
                기능 소개
              </a>
              <a
                className="text-sm font-medium leading-normal hover:text-primary transition-colors"
                href="#"
              >
                문의하기
              </a>
            </div>
          </header>
          <main className="flex-grow">
            <section className="text-center py-20 sm:py-24 md:py-28">
              <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-col items-center gap-8">
                <div className="flex flex-col gap-4">
                  <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                    오늘의 감정을 한 줄로 기록해보세요
                  </h1>
                  <h2 className="text-base md:text-lg font-normal leading-normal text-text-secondary-light dark:text-text-secondary-dark max-w-xl mx-auto">
                    기분을 선택하고 한 줄만 적어도 충분해요. AI가 당신의 하루를 따뜻하게 정리해
                    드립니다.
                  </h2>
                </div>
                <div className="flex gap-4 p-3 flex-wrap justify-center">
                  <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-card-dark shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-2xl">😀</p>
                  </div>
                  <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-card-dark shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-2xl">🙂</p>
                  </div>
                  <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-card-dark shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-2xl">😢</p>
                  </div>
                  <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-card-dark shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-2xl">😡</p>
                  </div>
                  <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-card-dark shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-2xl">🥰</p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                  <form action="/auth/google" method="post">
                    <button
                      type="submit"
                      className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-primary text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:brightness-105 transition-all shadow-lg shadow-primary/20"
                    >
                      <svg
                        fill="white"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      <span className="truncate">Google로 시작하기</span>
                    </button>
                  </form>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-normal leading-normal">
                    계정을 만들 필요 없이, Google 계정으로 간편하게 시작해요.
                  </p>
                </div>
                <a
                  className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark underline decoration-dotted underline-offset-4 hover:text-primary transition-colors"
                  href="#features"
                >
                  서비스가 어떻게 동작하는지 구경해보기
                </a>
              </div>
            </section>
            <section
              className="relative bg-[#FFF3E8] dark:bg-card-dark/50 pt-28 sm:pt-32 md:pt-40 pb-20 sm:pb-24 md:pb-32 -mb-16"
              id="features"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] max-w-[100rem]">
                <svg
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 1440 112"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="fill-[#FFF3E8] dark:fill-[rgba(58,42,33,0.5)]"
                    d="M1440 112C1213.92 112 1076.29 28.1818 720 28.1818C363.712 28.1818 226.085 112 0 112V0H1440V112Z"
                  />
                </svg>
              </div>
              <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center p-8 bg-white/70 dark:bg-card-dark rounded-xl shadow-lg transition-shadow hover:shadow-xl">
                    <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined !text-4xl">edit_note</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">감정 선택 & 한 줄 일기</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      그날의 감정을 선택하고, 한 줄만 적으면 기록이 완성됩니다.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 bg-white/70 dark:bg-card-dark rounded-xl shadow-lg transition-shadow hover:shadow-xl">
                    <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined !text-4xl">psychology</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">AI가 남겨주는 따뜻한 코멘트</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      AI가 당신의 하루를 읽고, 따뜻한 응원과 피드백을 건네줍니다.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-8 bg-white/70 dark:bg-card-dark rounded-xl shadow-lg transition-shadow hover:shadow-xl">
                    <div className="flex items-center justify-center h-16 w-16 mb-6 rounded-full bg-primary/10 text-primary">
                      <span className="material-symbols-outlined !text-4xl">auto_stories</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">지난 기록 모아보기</h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      지난 기록들을 한눈에 보며 나의 감정 변화를 돌아볼 수 있어요.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </main>
          <footer className="text-center py-8 border-t border-gray-200/80 dark:border-white/10 mt-16 z-10 bg-transparent">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
              © MoodLog | 개인 프로젝트용 데모 서비스입니다.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

