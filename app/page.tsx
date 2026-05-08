import { Hero } from "@/components/landing/hero";
import { Examples } from "@/components/landing/examples";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-col bg-[#0A0A0A]">
      <Hero />
      <Examples />
      <HowItWorks />
      <Features />
      <Footer />
    </div>
  );
}
