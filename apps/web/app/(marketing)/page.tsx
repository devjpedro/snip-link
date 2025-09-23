import { Header } from "@/components/header";
import { HeroSection } from "./sections/hero";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* <StatsSection /> */}
        {/* <FeaturesSection /> */}
        {/* <CTASection /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
