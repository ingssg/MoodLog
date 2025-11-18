"use client";

import Logo from "./Logo";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  showNav?: boolean;
  currentPage?: "home" | "list";
}

export default function Header({ showNav = false, currentPage }: HeaderProps) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 md:px-6 sm:px-10 py-3">
      <Logo />
      {showNav && (
        <div className="flex flex-1 justify-end items-center gap-4 sm:gap-8">
          <nav className="hidden sm:flex items-center gap-9">
            {currentPage === "home" ? (
              <a
                className="text-text-main-light/70 dark:text-text-main-dark/70 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
                href="/list"
              >
                List
              </a>
            ) : (
              <a
                className="text-primary text-sm font-bold leading-normal"
                href="/home"
              >
                Home
              </a>
            )}
            <button
              onClick={handleLogout}
              className="text-text-main-light/70 dark:text-text-main-dark/70 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
            >
              Logout
            </button>
          </nav>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile"
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            />
          ) : (
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-300"></div>
          )}
        </div>
      )}
    </header>
  );
}
