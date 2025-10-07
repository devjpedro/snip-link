/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Necessary index> */

import { Skeleton } from "@snip-link/ui/components/skeleton";

import { CardSkeleton } from "@/components/skeletons/card-skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl">Analytics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Acompanhe o desempenho dos seus links
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`dashboard-stat-skeleton-${index}`}>
              <CardSkeleton />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[396px] w-full rounded-xl" />
          <Skeleton className="h-[396px] w-full rounded-xl" />
        </div>

        <Skeleton className="h-[560px] w-full rounded-xl" />
      </div>
    </main>
  );
}
