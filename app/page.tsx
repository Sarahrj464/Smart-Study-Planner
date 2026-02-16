import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustBar from "@/components/landing/TrustBar";
import Features from "@/components/landing/Features";
import WhyStudyPulse from "@/components/landing/WhyStudyPulse";
import HowItWorks from "@/components/landing/HowItWorks";
import StatsRow from "@/components/landing/StatsRow";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900/40">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <WhyStudyPulse />
      <HowItWorks />
      <StatsRow />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
