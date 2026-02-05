"use client";

import {
    ArrowRight,
    TrendingUp,
    Shield,
    Activity,
    ShieldCheck,
    Landmark,
    CreditCard,
    BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
    return (
        <section className="relative h-screen min-h-[700px] overflow-hidden bg-white dark:bg-slate-950 px-4 md:px-6 pt-20">
            <div className="relative h-[calc(100vh-80px)] container mx-auto max-w-7xl flex flex-col justify-center py-12">
                {/* Abstract Background */}
                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                    <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
                </div>

                <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center w-full">
                    {/* Left Content */}
                    <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 mx-auto lg:mx-0">
                                <Shield className="w-3 h-3" />
                                Institutional Integrity Protocol
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Private Wealth Tracking <br />
                            <span className="text-gradient-primary">Audited & Immutable.</span>
                        </h1>

                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            The premium terminal for professional investors to log
                            bank-to-bank settlements and monitor offline asset growth without
                            intermediaries.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            <Button
                                asChild
                                size="lg"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full px-8 h-14 shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
                            >
                                <Link href="/register">Initialize Access</Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                size="lg"
                                className="rounded-full px-8 h-14 font-bold border border-slate-200 dark:border-white/10 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5"
                            >
                                <Link href="#indices" className="group">
                                    Explore Markets{" "}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 animate-in fade-in duration-1000 delay-500">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden relative shadow-sm"
                                    >
                                        <div className="flex items-center justify-center h-full w-full bg-blue-100 text-blue-600 font-bold text-xs">
                                            U{i}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Trusted by{" "}
                                <span className="font-bold text-slate-900 dark:text-white">
                                    120k+
                                </span>{" "}
                                private investors
                            </p>
                        </div>

                        {/* Stats Section Integrated */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6 border-t border-slate-200 dark:border-white/5 animate-in fade-in duration-1000 delay-700">
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">
                                    $12.5M+
                                </p>
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-1">
                                    Capital
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">
                                    4.8k
                                </p>
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-1">
                                    Active Nodes
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">
                                    99.9%
                                </p>
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mt-1">
                                    Audit Rate
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="lg:col-span-6 relative hidden lg:block animate-in fade-in zoom-in duration-1000">
                        <div className="relative z-10 p-4">
                            <div className="relative aspect-square max-w-[500px] mx-auto rounded-[3rem] border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl p-12 shadow-2xl overflow-hidden flex items-center justify-center">
                                {/* Abstract Visual Shape */}
                                <div className="relative w-full h-full flex items-center justify-center">
                                    <div className="w-80 h-80 bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
                                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                                        <TrendingUp className="w-48 h-48 text-blue-600/20 absolute" />
                                        <div className="w-full h-full rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-inner flex items-center justify-center overflow-hidden">
                                            <Activity className="w-24 h-24 text-blue-600 opacity-30" />
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Badges */}
                                <div className="absolute top-12 right-12 h-20 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl z-20 backdrop-blur-md animate-bounce duration-[4000ms]">
                                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            SECURE SYNC
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-emerald-500/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-1000"
                                            style={{ width: "88%" }}
                                        ></div>
                                    </div>
                                    <p className="text-[9px] text-slate-500 mt-2 font-mono font-bold">
                                        ID: SEC-NODE-88
                                    </p>
                                </div>

                                <div className="absolute bottom-12 left-12 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl z-20 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                            <Activity className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                                Live Auditing
                                            </p>
                                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">
                                                ACTIVE
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
