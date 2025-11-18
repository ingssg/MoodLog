import Logo from "./Logo";

interface HeaderProps {
  showNav?: boolean;
  currentPage?: "home" | "list";
}

export default function Header({ showNav = false, currentPage }: HeaderProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 md:px-6 sm:px-10 py-3 md:py-4">
      <Logo />
      {showNav && (
        <div className="flex flex-1 justify-end items-center gap-4 sm:gap-8">
          <nav className="hidden sm:flex items-center gap-9">
            <a
              className={`text-sm font-medium leading-normal ${
                currentPage === "home"
                  ? "text-primary font-bold"
                  : "text-text-main-light/70 dark:text-text-main-dark/70 hover:text-text-main-light dark:hover:text-text-main-dark"
              }`}
              href="/home"
            >
              Home
            </a>
            <a
              className={`text-sm font-medium leading-normal ${
                currentPage === "list"
                  ? "text-primary font-bold"
                  : "text-text-main-light/70 dark:text-text-main-dark/70 hover:text-text-main-light dark:hover:text-text-main-dark"
              }`}
              href="/list"
            >
              List
            </a>
            <a
              className="text-text-main-light/70 dark:text-text-main-dark/70 hover:text-text-main-light dark:hover:text-text-main-dark text-sm font-medium leading-normal"
              href="#"
            >
              Settings
            </a>
            <a
              className="text-text-main-light/70 dark:text-text-main-dark/70 hover:text-text-main-light dark:hover:text-text-main-dark text-sm font-medium leading-normal"
              href="#"
            >
              Profile
            </a>
          </nav>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-300"></div>
        </div>
      )}
    </header>
  );
}

