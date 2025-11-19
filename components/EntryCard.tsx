// 감정 값과 이모지 매핑
const moodEmojiMap: Record<string, string> = {
  happy: "😊",
  neutral: "🙂",
  sad: "😢",
  angry: "😡",
  love: "🥰",
};

// 날짜 포맷팅 함수 (한국어 형식)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

interface Entry {
  id: string;
  date: string;
  content: string;
  mood: string;
  ai_comment?: string;
}

interface EntryCardProps {
  entry: Entry;
  variant?: "default" | "compact";
}

export default function EntryCard({
  entry,
  variant = "default",
}: EntryCardProps) {
  const isCompact = variant === "compact";

  return (
    <div
      className={`${
        isCompact ? "p-4 sm:p-6" : "p-4 sm:p-6 md:p-8"
      } bg-card-bg dark:bg-card-dark rounded-xl ${
        isCompact
          ? "shadow-[0_8px_20px_rgba(180,140,120,0.25),0_4px_8px_rgba(180,140,120,0.2)]"
          : "shadow-[0_10px_28px_rgba(180,140,120,0.28),0_5px_10px_rgba(180,140,120,0.22)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-6">
        <div className="flex flex-col items-stretch justify-center gap-3 sm:gap-4 w-full min-w-0">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm font-normal leading-normal">
            {formatDate(entry.date)}
          </p>
          <p className="text-[#5A483A] dark:text-text-primary-dark text-sm sm:text-base md:text-lg font-bold leading-tight tracking-[-0.015em] break-words">
            {entry.content}
          </p>
          {entry.ai_comment && (
            <>
              <hr className="border-t-border-light dark:border-white/10 my-2" />
              <p className="text-[#B5542A] dark:text-primary/70 text-[11px] sm:text-xs md:text-sm font-normal leading-relaxed break-words border-l-2 border-primary/40 pl-3 sm:pl-4">
                {entry.ai_comment}
              </p>
            </>
          )}
        </div>
        <p
          className={`${
            isCompact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
          } flex-shrink-0`}
        >
          {moodEmojiMap[entry.mood] || "😀"}
        </p>
      </div>
    </div>
  );
}
