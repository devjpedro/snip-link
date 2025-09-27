import { Footer } from "@/components/footer";
import { RedirectToTop } from "@/components/redirect-to-top";
import { getSessionServer } from "../http/get-session-server";
import { CTASection } from "./sections/cta";
import { FeaturesSection } from "./sections/features-section";
import { HeroSection } from "./sections/hero";
import { StatsSection } from "./sections/stats";

export default async function Page() {
  const session = await getSessionServer();

  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection user={session?.user ?? null} />
        <StatsSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
      <RedirectToTop />
    </div>
  );
}
