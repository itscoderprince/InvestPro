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
        <section className="relative min-h-[800px] flex items-center overflow-hidden bg-slate-50 dark:bg-slate-950 pt-20">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/10 dark:via-transparent dark:to-transparent"></div>
                <div className="absolute h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px] dark:bg-blue-600"></div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Content */}
                    <div className="max-w-3xl flex flex-col items-center lg:items-start text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold tracking-wide text-slate-700 dark:text-slate-300">
                                INSTITUTIONAL INTEGRITY PROTOCOL
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Private Wealth <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                                Tracking & Audit.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            The premium terminal for professional investors to log bank-to-bank settlements and monitor asset growth without intermediaries.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            <Button
                                asChild
                                size="lg"
                                className="h-14 px-8 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-base font-bold shadow-xl shadow-slate-900/10 dark:shadow-white/5 transition-all hover:scale-[1.02]"
                            >
                                <Link href="/register">
                                    Initialize Access
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 rounded-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-base font-bold text-slate-700 dark:text-slate-200"
                            >
                                <Link href="#indices">Explore Markets</Link>
                            </Button>
                        </div>

                        <div className="mt-12 flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-500 animate-in fade-in duration-1000 delay-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-50 dark:border-slate-950 bg-slate-200 dark:bg-slate-800"></div>
                                ))}
                            </div>
                            <p>Trusted by <span className="text-slate-900 dark:text-white font-bold">120k+</span> investors</p>
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-200">
                        <div className="relative z-10 mx-auto w-full max-w-[500px] aspect-square">
                            {/* Glassmorphism Card */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[3rem] shadow-2xl flex flex-col p-8 overflow-hidden">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Balance</div>
                                        <div className="text-3xl font-black text-slate-900 dark:text-white">$12,450,291.00</div>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Fake Chart */}
                                <div className="flex-1 w-full bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden group">
                                    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-blue-500/10 to-transparent"></div>
                                    <div className="absolute inset-0 flex items-end px-4 pb-4 gap-2">
                                        {[40, 65, 45, 80, 55, 90, 75, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400" style={{ height: `${h}%`, opacity: 0.8 }}></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute bottom-8 left-8 right-8 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-100 dark:border-white/5 flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-white">Audit Verified</div>
                                        <div className="text-[10px] text-slate-500">Last check: 2 mins ago</div>
                                    </div>
                                    <div className="ml-auto text-emerald-600 font-bold text-xs">100%</div>
                                </div>
                            </div>

                            {/* Decorative Blobs */}
                            <div className="absolute -top-12 -right-12 h-64 w-64 bg-blue-500/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
                            <div className="absolute -bottom-12 -left-12 h-64 w-64 bg-indigo-500/30 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
