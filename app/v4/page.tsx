import { HeroV4 } from "@/components/landing-v4/hero-v4";
import { ExamplesV4 } from "@/components/landing-v4/examples-v4";
import { HowItWorksV4 } from "@/components/landing-v4/how-it-works-v4";
import { FeaturesV4 } from "@/components/landing-v4/features-v4";
import { FooterV4 } from "@/components/landing-v4/footer-v4";
import { NavV4 } from "@/components/landing-v4/nav-v4";

export default function HomeV4() {
  return (
    <div className="flex flex-col bg-[#050505]">
      <NavV4 />
      <HeroV4 />
      <ExamplesV4 />
      <HowItWorksV4 />
      <FeaturesV4 />
      <FooterV4 />
    </div>
  );
}
