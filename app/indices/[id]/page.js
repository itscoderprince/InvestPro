"use client";

import { use } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import IndexHero from "@/components/index-details/IndexHero";
import PerformanceSection from "@/components/index-details/PerformanceSection";
import AboutIndex from "@/components/index-details/AboutIndex";
import HowItWorksIndex from "@/components/index-details/HowItWorksIndex";
import ReturnsCalculator from "@/components/index-details/ReturnsCalculator";
import RiskDisclosure from "@/components/index-details/RiskDisclosure";
import InvestorReviews from "@/components/index-details/InvestorReviews";
import IndexFAQ from "@/components/index-details/IndexFAQ";
import SimilarIndices from "@/components/index-details/SimilarIndices";
import IndexStickyBar from "@/components/index-details/IndexStickyBar";
import { ChevronRight, Home, ChevronLeft, Share2, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const IndexDetailsPage = ({ params }) => {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const router = useRouter();

    const handleInvestNavigate = () => {
        router.push(`/indices/${id}/invest`);
    };

    // Mock data for the index
    const indexData = {
        id: "tech-growth",
        name: "Tech Growth Index",
        category: "Technology",
        tagline: "Invest in top-performing technology companies",
        rating: 4.8,
        reviews: 1234,
        currentReturn: "4.5%",
        trend: "+0.3%",
        minInvestment: "₹5,000",
        totalInvestors: "1,234",
        fundSize: "₹1.2 Crore",
    };

    // Mock KYC status for demonstration
    const kycStatus = "missing"; // Can be "missing", "pending", or "verified"

    return (
        <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 selection:dark:bg-blue-900 selection:dark:text-blue-100">
            <Navbar />

            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    {/* KYC Status Banners */}
                    {kycStatus === "missing" && (
                        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <p className="text-sm font-bold text-amber-900 dark:text-amber-200 uppercase tracking-widest">
                                    Complete account verification (KYC) to start investing.
                                </p>
                            </div>
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white rounded-full font-black px-6">
                                Verify Now
                            </Button>
                        </div>
                    )}

                    {kycStatus === "pending" && (
                        <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Info className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-sm font-bold text-blue-900 dark:text-blue-200 uppercase tracking-widest">
                                KYC under review. You can browse indices while we verify your details.
                            </p>
                        </div>
                    )}

                    {/* Breadcrumb & Top Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <Link href="/investments" className="hover:text-blue-600 transition-colors">
                                Investments
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="font-bold text-slate-900 dark:text-white">
                                {indexData.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="rounded-full flex items-center gap-2 pr-4 pl-3" asChild>
                                <Link href="/investments">
                                    <ChevronLeft className="w-4 h-4" />
                                    Back
                                </Link>
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Page Sections */}
                    <IndexHero data={indexData} onInvest={handleInvestNavigate} />
                    <PerformanceSection />

                    <div className="grid lg:grid-cols-12 gap-8 mt-8">
                        <div className="lg:col-span-8 space-y-8">
                            <AboutIndex />
                            <HowItWorksIndex />
                            <InvestorReviews />
                            <IndexFAQ />
                        </div>
                        <div className="lg:col-span-4 space-y-8">
                            <ReturnsCalculator />
                            <RiskDisclosure />
                        </div>
                    </div>

                    <SimilarIndices />
                </div>
            </main>

            <Footer />
            <IndexStickyBar
                name={indexData.name}
                returns={indexData.currentReturn}
                onInvest={handleInvestNavigate}
            />
        </div>
    );
};

export default IndexDetailsPage;
