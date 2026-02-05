"use client";

import { ChevronRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SimilarIndexCard = ({ name, returns, minInvest, trend }) => (
    <div className="flex-shrink-0 w-80 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-500/5 group hover:border-blue-500/30 transition-all duration-500">
        <div className="flex justify-between items-start mb-6">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {name}
            </h4>
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:text-blue-600 transition-all">
                <ArrowUpRight className="w-5 h-5" />
            </div>
        </div>

        <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-black text-emerald-500">{returns}</span>
            <span className="text-xs font-bold text-emerald-500 mb-1 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                {trend}
            </span>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-white/5">
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Min. Invest</p>
                <p className="font-black text-slate-900 dark:text-white">{minInvest}</p>
            </div>
            <Button size="sm" variant="ghost" className="rounded-full font-bold text-blue-600 hover:bg-blue-500/10" asChild>
                <Link href={`/indices/${name.toLowerCase().replace(/ /g, "-")}`}>View Details</Link>
            </Button>
        </div>
    </div>
);

const SimilarIndices = () => {
    const indices = [
        { name: "Global Alpha Index", returns: "3.8%", trend: "+0.2%", minInvest: "₹10,000" },
        { name: "Renewable Core", returns: "5.2%", trend: "+0.5%", minInvest: "₹5,000" },
        { name: "Blue Chip Digital", returns: "4.1%", trend: "+0.1%", minInvest: "₹25,000" },
        { name: "Emerging Market Pro", returns: "6.1%", trend: "+0.8%", minInvest: "₹15,000" },
    ];

    return (
        <section className="mt-20">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    You May Also Like
                </h2>
                <div className="flex gap-2">
                    <button className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button className="h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth">
                {indices.map((index, i) => (
                    <SimilarIndexCard key={i} {...index} />
                ))}
            </div>
        </section>
    );
};

export default SimilarIndices;
