"use client";

import { Star, Users, Briefcase, TrendingUp, Calculator, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const IndexHero = ({ data, onInvest }) => {
    return (
        <section className="animate-in fade-in duration-700">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Info */}
                <div className="lg:col-span-7 pt-4">
                    <Badge className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-none px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
                        {data.category}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4">
                        {data.name}
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium mb-6">
                        {data.tagline}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < 4 ? "fill-current" : "fill-current opacity-40"}`} />
                            ))}
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold text-lg">{data.rating}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">({data.reviews.toLocaleString()} reviews)</span>
                    </div>
                </div>

                {/* Right Side: Metrics Card */}
                <div className="lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-white/5 relative overflow-hidden"
                    >
                        {/* Top Indicator */}
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">
                                    Current Weekly Return
                                </p>
                                <div className="flex items-end gap-3">
                                    <span className="text-5xl font-black text-emerald-500 leading-none">
                                        {data.currentReturn}
                                    </span>
                                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-sm mb-1 px-2 py-0.5 bg-emerald-500/10 rounded-full">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        {data.trend}
                                    </div>
                                </div>
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                <Briefcase className="w-7 h-7 text-blue-600" />
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Min. Investment
                                </p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">
                                    {data.minInvestment}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Total Investors
                                </p>
                                <p className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    {data.totalInvestors}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Total Fund Size
                                </p>
                                <p className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                                    {data.fundSize}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Badge variant="outline" className="border-blue-600/20 text-blue-600 dark:text-blue-400 font-bold px-3">
                                    Verified Index
                                </Badge>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="space-y-4">
                            <Button onClick={onInvest} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-16 text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                                Invest Now
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white">
                                    <BadgeCheck className="w-4 h-4" />
                                </div>
                            </Button>
                            <Button variant="outline" className="w-full rounded-2xl h-16 font-bold border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex items-center gap-2">
                                <Calculator className="w-4 h-4" />
                                Calculate Returns
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default IndexHero;
