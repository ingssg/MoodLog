import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// 더미 데이터 - 나중에 Supabase에서 가져올 예정
const entries = [
  {
    id: 1,
    date: "2023년 10월 27일",
    mood: "😊",
    content: "오늘은 기분이 참 좋았다. 산책을 하면서 많은 생각을 정리할 수 있었다.",
    aiComment: "AI 코멘트: 생각을 정리하는 좋은 시간을 보내셨군요. 꾸준한 산책은 마음에 큰 도움이 될 거예요.",
  },
  {
    id: 2,
    date: "2023년 10월 26일",
    mood: "😐",
    content: "업무가 많아서 조금 지쳤지만, 저녁에 친구를 만나서 스트레스를 풀었다.",
    aiComment: "AI 코멘트: 바쁜 하루 속에서도 즐거움을 찾는 모습이 멋져요. 친구와의 시간은 좋은 재충전이 되죠.",
  },
];

export default async function ListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
            <header className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 py-3 border-b border-solid border-[#F5F1F0] dark:border-white/10">
              <Logo size="sm" />
              <div className="flex flex-1 justify-end gap-8">
                <div className="flex items-center gap-9">
                  <a
                    className="text-primary text-sm font-bold leading-normal"
                    href="/home"
                  >
                    Home
                  </a>
                  <a
                    className="text-[#8c6e5f] dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
                    href="#"
                  >
                    Settings
                  </a>
                  <a
                    className="text-[#8c6e5f] dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm font-medium leading-normal"
                    href="#"
                  >
                    Profile
                  </a>
                </div>
              </div>
            </header>
            <main className="flex flex-col flex-1 py-8 md:py-12 px-4">
              <div className="flex flex-wrap justify-center gap-3 p-4 mb-8">
                <p className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em] min-w-72 text-center">
                  지난 기록
                </p>
              </div>
              <div className="pb-3 mb-6">
                <div className="flex justify-center border-b border-[#e6dedb] dark:border-white/10 px-4 gap-8">
                  <FilterTab label="전체" active />
                  <FilterTab label="😊" />
                  <FilterTab label="😐" />
                  <FilterTab label="😢" />
                  <FilterTab label="😡" />
                  <FilterTab label="🥰" />
                </div>
              </div>
              <div className="space-y-6">
                {entries.map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
              <div className="flex justify-center mt-12">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-primary/10 hover:text-primary h-10 px-8 py-2 text-text-secondary-light dark:text-text-secondary-dark dark:border-white/20 dark:hover:bg-primary/20 dark:hover:text-white">
                  더 보기
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterTab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <a
      className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 ${
        active
          ? "border-b-primary text-text-primary-light dark:text-text-primary-dark"
          : "border-b-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:border-primary/50"
      }`}
      href="#"
    >
      <p
        className={`${
          label.length > 2 ? "text-sm font-bold" : "text-2xl font-bold"
        } leading-normal tracking-[0.015em]`}
      >
        {label}
      </p>
    </a>
  );
}

function EntryCard({
  entry,
}: {
  entry: {
    id: number;
    date: string;
    mood: string;
    content: string;
    aiComment: string;
  };
}) {
  return (
    <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl shadow-[0_4px_20px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col items-stretch justify-center gap-4 w-full">
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">
            {entry.date}
          </p>
          <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-tight tracking-[-0.015em]">
            {entry.content}
          </p>
          <hr className="border-t-border-light dark:border-white/10 my-2" />
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-relaxed">
            {entry.aiComment}
          </p>
        </div>
        <p className="text-3xl">{entry.mood}</p>
      </div>
    </div>
  );
}

