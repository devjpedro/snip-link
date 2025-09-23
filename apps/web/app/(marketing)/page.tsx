import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CTASection } from "./sections/cta";
import { FeaturesSection } from "./sections/features-section";
import { HeroSection } from "./sections/hero";
import { StatsSection } from "./sections/stats";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
