import { Hero } from "@/components/landing/hero";
import { Examples } from "@/components/landing/examples";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="flex flex-col bg-[#0E0E0E]">
      <Hero />
      <Examples />
      <HowItWorks />
      <Footer />
    </div>
  );
}
