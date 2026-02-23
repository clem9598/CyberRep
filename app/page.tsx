import { BackgroundFX } from "@/components/landing/BackgroundFX";
import { Faq } from "@/components/landing/Faq";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { Security } from "@/components/landing/Security";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#040813]">
      <BackgroundFX />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <HowItWorks />
          <Features />
          <Security />
          <Pricing />
          <Faq />
        </main>
        <Footer />
      </div>
    </div>
  );
}
