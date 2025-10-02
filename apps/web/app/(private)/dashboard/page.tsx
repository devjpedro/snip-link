import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@snip-link/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@snip-link/ui/components/tabs";
import { Link2, Plus } from "lucide-react";
import { getUserLinks } from "@/app/http/get-user-links";
import { getUserStats } from "@/app/http/get-user-stats";
import { RedirectToTop } from "@/components/redirect-to-top";
import { isApiSuccess } from "@/utils/api-guards";
import { mapUserDashboardStats } from "@/utils/map-user-stats";
import { CreateLinkForm } from "./ui/create-link-form";
import { DashboardStats } from "./ui/dashboard-stats";
import { UserLinksListing } from "./ui/user-links-listing";

export default async function DashboardPage() {
  const [resultStats, resultLinks] = await Promise.all([
    getUserStats(),
    getUserLinks(),
  ]);

  const stats = isApiSuccess(resultStats)
    ? mapUserDashboardStats(resultStats.data)
    : null;

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

        <DashboardStats stats={stats} />

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
              value="create"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="xs:inline hidden">Criar </span>Link
            </TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4 sm:space-y-6" value="links">
            <UserLinksListing initialData={resultLinks} />
          </TabsContent>

          <TabsContent className="space-y-4 sm:space-y-6" value="create">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  Criar novo link
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CreateLinkForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <RedirectToTop />
    </main>
  );
}
