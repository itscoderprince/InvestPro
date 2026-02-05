"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Info, ShieldCheck, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import InvestmentFlow from "@/components/index-details/InvestmentFlow";

const InvestPage = ({ params }) => {
    const resolvedParams = use(params);
    const { id } = resolvedParams;

    // Mock data for the index
    const indexData = {
        id: id,
        name: "Tech Growth Index",
        category: "Technology",
        currentReturn: "4.5%",
        minInvestment: "₹5,000",
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 selection:dark:bg-blue-900 selection:dark:text-blue-100">
            <Navbar />

            <main className="pt-24 pb-12">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    {/* Header with Back Button */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-white/5 shadow-sm border border-slate-100 dark:border-white/5" asChild>
                            <Link href={`/indices/${id}`}>
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">
                                Investment Portal
                            </h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Secure Investment Interface
                            </p>
                        </div>
                        <div className="ml-auto flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">SSL Secured</span>
                        </div>
                    </div>


                    {/* Main Investment Flow */}
                    <InvestmentFlow indexData={indexData} />

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default InvestPage;
