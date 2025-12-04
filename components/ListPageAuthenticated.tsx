"use client";

import Header from "@/components/Header";
import FilterableEntries from "@/components/FilterableEntries";

interface ListPageAuthenticatedProps {
  initialEntries: any[];
}

export default function ListPageAuthenticated({
  initialEntries,
}: ListPageAuthenticatedProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1">
            <Header showNav currentPage="list" />
            <main className="flex flex-col flex-1 py-4 sm:py-8 md:py-12 px-2 sm:px-4">
              <FilterableEntries entries={initialEntries} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

