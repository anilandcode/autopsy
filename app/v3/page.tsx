import { HeroV3 } from "@/components/landing-v3/hero-v3";
import { ExamplesV3 } from "@/components/landing-v3/examples-v3";
import { HowItWorksV3 } from "@/components/landing-v3/how-it-works-v3";
import { FeaturesV3 } from "@/components/landing-v3/features-v3";
import { FooterV3 } from "@/components/landing-v3/footer-v3";
import { NavV3 } from "@/components/landing-v3/nav-v3";

export default function HomeV3() {
  return (
    <div className="flex flex-col bg-white">
      <NavV3 />
      <HeroV3 />
      <ExamplesV3 />
      <HowItWorksV3 />
      <FeaturesV3 />
      <FooterV3 />
    </div>
  );
}
