import { Footer } from "@/components/footer";
import { RedirectToTop } from "@/components/redirect-to-top";
import { CTASection } from "./sections/cta";
import { FeaturesSection } from "./sections/features-section";
import { HeroSection } from "./sections/hero";
import { StatsSection } from "./sections/stats";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
      <RedirectToTop />
    </div>
  );
}
