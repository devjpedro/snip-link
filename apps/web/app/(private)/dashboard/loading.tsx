/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Necessary index> */

import { Skeleton } from "@snip-link/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@snip-link/ui/components/tabs";
import { Link2, Plus } from "lucide-react";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import { ListSkeleton } from "@/components/skeletons/list-skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-2xl sm:text-3xl">Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Gerencie seus links e acompanhe o desempenho
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`dashboard-stat-skeleton-${index}`}>
              <CardSkeleton />
            </div>
          ))}
        </div>

        <Tabs className="space-y-4 sm:space-y-6" defaultValue="links">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2 sm:mx-0">
            <TabsTrigger
              className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
              value="links"
            >
              <Link2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="xs:inline hidden">Meus </span>Links
            </TabsTrigger>
            <TabsTrigger
              className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
              disabled
              value="create"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="xs:inline hidden">Criar </span>Link
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4 sm:space-y-6" value="links">
            <div className="space-y-6">
              <Skeleton className="h-9 w-full" />

              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <ListSkeleton key={index} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
