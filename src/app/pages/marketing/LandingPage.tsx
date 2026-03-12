import { HeroSection } from "../../components/sections/HeroSection";
import { ServicesGridSection } from "../../components/sections/ServicesGrid";
import { AboutUsSection } from "../../components/sections/AboutUsSection";
import { TeamSection } from "../../components/sections/TeamSection";
import { TestimonialsSection } from "../../components/sections/TestimonialsSection";
import { FAQSection } from "../../components/sections/FAQSection";

export function LandingPage() {
  return (
    <div>
      <HeroSection />
      <ServicesGridSection />
      <AboutUsSection />
      <TeamSection />
      <TestimonialsSection />
      <FAQSection />
    </div>
  );
}
