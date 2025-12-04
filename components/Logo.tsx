"use client";

import { useRouter } from "next/navigation";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const router = useRouter();
  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/home");
    router.refresh(); // 서버 컴포넌트 캐시 무시하고 새로고침
  };

  return (
    <a
      href="/home"
      onClick={handleClick}
      className={`flex items-center gap-4 ${className} cursor-pointer hover:opacity-80 transition-opacity`}
    >
      <div className="h-6 w-6 text-primary">
        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            clipRule="evenodd"
            d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
            fillRule="evenodd"
          />
        </svg>
      </div>
      <h2 className={`${textSize[size]} font-bold leading-tight tracking-[-0.015em] text-text-primary-light dark:text-text-primary-dark`}>
        MoodLog
      </h2>
    </a>
  );
}
