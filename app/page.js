import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Ticker from "@/components/landing/Ticker";
import dynamic from 'next/dynamic';

const Features = dynamic(() => import("@/components/landing/Features"));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"));
const IndicesPreview = dynamic(() => import("@/components/landing/IndicesPreview"));
const ProtectiveNode = dynamic(() => import("@/components/landing/ProtectiveNode"));
const Footer = dynamic(() => import("@/components/landing/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 selection:dark:bg-blue-900 selection:dark:text-blue-100 scroll-smooth">
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <Features />
        <HowItWorks />
        <IndicesPreview />
        <ProtectiveNode />
      </main>
      <Footer />
    </div>
  );
}
