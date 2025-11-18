import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoodLog - 오늘의 감정을 한 줄로 기록해보세요",
  description:
    "기분을 선택하고 한 줄만 적어도 충분해요. AI가 당신의 하루를 따뜻하게 정리해 드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} bg-gradient-to-b from-[#FFFCFA] to-[#FDF1E8] dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark`}
      >
        {children}
      </body>
    </html>
  );
}
