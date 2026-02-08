import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Ticker from "@/components/landing/Ticker";
import IndicesPreview from "@/components/landing/IndicesPreview";
import AuthRedirect from "@/components/AuthRedirect";
import dynamic from 'next/dynamic';

const Features = dynamic(() => import("@/components/landing/Features"));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"));
const ProtectiveNode = dynamic(() => import("@/components/landing/ProtectiveNode"));
const Footer = dynamic(() => import("@/components/landing/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 selection:dark:bg-blue-900 selection:dark:text-blue-100 scroll-smooth">
      <AuthRedirect />
      <Navbar />
      <main>
        <Hero />
        <IndicesPreview />
        <Ticker />
        <Features />
        <HowItWorks />
        <ProtectiveNode />
      </main>
      <Footer />
    </div>
  );
}
