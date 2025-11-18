import Logo from "@/components/Logo";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/home");
  }

  const errorMessage = searchParams.message || searchParams.error;

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
                  {errorMessage && (
                    <div className="w-full p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                      <p className="font-semibold">로그인 오류</p>
                      <p className="text-xs mt-1">{errorMessage}</p>
                    </div>
                  )}
                  <GoogleLoginButton />
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

