import { HeroV2 } from "@/components/landing-v2/hero-v2";
import { ExamplesV2 } from "@/components/landing-v2/examples-v2";
import { HowItWorksV2 } from "@/components/landing-v2/how-it-works-v2";
import { FeaturesV2 } from "@/components/landing-v2/features-v2";
import { FooterV2 } from "@/components/landing-v2/footer-v2";
import { NavV2 } from "@/components/landing-v2/nav-v2";

export default function HomeV2() {
  return (
    <div className="flex flex-col bg-[#FEFCF5]">
      <NavV2 />
      <HeroV2 />
      <ExamplesV2 />
      <HowItWorksV2 />
      <FeaturesV2 />
      <FooterV2 />
    </div>
  );
}
