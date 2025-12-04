"use client";

import { useRouter } from "next/navigation";
import { enableDemoMode } from "@/lib/localStorage";

export default function DemoModeButton() {
  const router = useRouter();

  const handleDemoMode = () => {
    enableDemoMode();
    // 체험 모드 쿠키 설정 (미들웨어에서 확인용)
    document.cookie = "moodlog_demo_mode=true; path=/; max-age=31536000"; // 1년
    router.push("/home");
    router.refresh();
  };

  return (
    <button
      onClick={handleDemoMode}
      className="flex w-full max-w-xs items-center justify-center rounded-xl h-11 sm:h-12 px-4 sm:px-5 bg-white dark:bg-card-dark text-primary text-sm sm:text-base font-bold leading-normal tracking-[0.015em] border-2 border-primary shadow-[0_4px_8px_rgba(249,116,49,0.15),0_2px_4px_rgba(249,116,49,0.1)] transition-all hover:bg-primary/5 hover:shadow-[0_6px_12px_rgba(249,116,49,0.2),0_3px_6px_rgba(249,116,49,0.15)] active:scale-[0.98]"
    >
      <span className="truncate">로그인 없이 체험해보기</span>
    </button>
  );
}
