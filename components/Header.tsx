"use client";

import Logo from "./Logo";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { disableDemoMode } from "@/lib/localStorage";

interface HeaderProps {
  showNav?: boolean;
  currentPage?: "home" | "list";
}

export default function Header({ showNav = false, currentPage }: HeaderProps) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Google OAuth의 경우 user_metadata에 avatar_url 또는 picture가 있음
        const profileImage =
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
        setAvatarUrl(profileImage);
      }
    };

    fetchUser();
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    // 로그아웃 시 체험 모드 데이터도 삭제 (혼선 방지)
    disableDemoMode();
    // 쿠키도 삭제
    document.cookie = "moodlog_demo_mode=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  };

  const handleNavigation = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
    router.refresh(); // 서버 컴포넌트 캐시 무시하고 새로고침
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-3 sm:px-4 md:px-6 lg:px-10 py-2 sm:py-3">
      <Logo />
      {showNav && (
        <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4 md:gap-8 relative">
          {/* 데스크탑 네비게이션 */}
          <nav className="hidden sm:flex items-center gap-6 md:gap-9">
            {currentPage === "home" ? (
              <button
                onClick={() => {
                  router.push("/list");
                  router.refresh();
                }}
                className="text-text-main-light/70 dark:text-text-main-dark/70 hover:text-primary dark:hover:text-primary text-xs sm:text-sm font-medium leading-normal"
              >
                List
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/home");
                  router.refresh();
                }}
                className="text-text-main-light/70 dark:text-text-main-dark/70 hover:text-primary dark:hover:text-primary text-xs sm:text-sm font-medium leading-normal"
              >
                Home
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-text-main-light/70 dark:text-text-main-dark/70 hover:text-primary dark:hover:text-primary text-xs sm:text-sm font-medium leading-normal"
            >
              Logout
            </button>
          </nav>

          {/* 프로필 이미지 및 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full transition-transform hover:scale-105"
              aria-label="프로필 메뉴"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 cursor-pointer border-2 border-transparent hover:border-primary/50 transition-colors"
                />
              ) : (
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 bg-gray-300 cursor-pointer border-2 border-transparent hover:border-primary/50 transition-colors"></div>
              )}
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-card-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1.5 z-50 transform transition-all duration-200 ease-out origin-top-right">
                {/* 모바일: 모든 메뉴 표시, 데스크탑: 모든 메뉴 표시 (일관성) */}
                {currentPage === "home" ? (
                  <button
                    onClick={() => handleNavigation("/list")}
                    className="w-full text-left px-3 py-2 text-sm text-text-main-light dark:text-text-main-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md"
                  >
                    List
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation("/home")}
                    className="w-full text-left px-3 py-2 text-sm text-text-main-light dark:text-text-main-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md"
                  >
                    Home
                  </button>
                )}
                <hr className="my-1 border-border-light dark:border-border-dark" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-text-main-light dark:text-text-main-dark hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
