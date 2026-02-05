"use client";

import { ShieldCheck, Wallet, ChartLine, LockKeyhole, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/button"; // Note: Re-using card-like structure but customized

const FeatureCard = ({ icon: Icon, title, description, colorClass, delay }) => {
    return (
        <div
            className={cn(
                "group relative h-full rounded-[2rem] border border-slate-200/50 dark:border-white/5 bg-[#fafafa] dark:bg-slate-900/50 p-8 transition-all duration-300",
                "hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-500/20 hover:-translate-y-1",
                "animate-in fade-in slide-in-from-bottom-4 duration-700"
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg",
                colorClass,
                "group-hover:scale-110"
            )}>
                <Icon className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                {description}
            </p>
        </div>
    );
};

const Features = () => {
    const features = [
        {
            icon: ShieldCheck,
            title: "Triple-Blind Verification",
            description: "Every transaction undergoes a strict, three-step human-led audit cycle to eliminate digital discrepancies.",
            colorClass: "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10",
            delay: 0
        },
        {
            icon: Wallet,
            title: "Sovereign-Grade Ledger",
            description: "We bypass vulnerable online gateways. Your assets are mapped directly against immutable bank-to-bank proofs.",
            colorClass: "bg-blue-500/10 text-blue-500 shadow-blue-500/10",
            delay: 100
        },
        {
            icon: ChartLine,
            title: "High-Fidelity Analytics",
            description: "Institutional-level reporting with granular weekly performance logs and predictive growth modeling.",
            colorClass: "bg-amber-500/10 text-amber-500 shadow-amber-500/10",
            delay: 200
        },
        {
            icon: LockKeyhole,
            title: "Zero-Trust Architecture",
            description: "A gated investor community protected by multi-vector identity validation and tiered access controls.",
            colorClass: "bg-rose-500/10 text-rose-500 shadow-rose-500/10",
            delay: 300
        }
    ];

    return (
        <section id="features" className="py-24 px-4 md:px-6 bg-white dark:bg-slate-950">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-16">
                    <div className="space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-4">
                            Precision Tracking for <span className="text-blue-600 italic">Professional Wealth</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                            Our platform bridges the gap between offline investments and digital forensic tracking, ensuring absolute auditing rigor for high-value portfolios.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* Institutional Trust Banner */}
                <div className="mt-20 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full -mr-20 -mt-20"></div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                Verification Node
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                                Institutional Precision <br /> meets Forensic Auditing
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                We've stripped away the complexity of traditional finance and the opacity
                                of digital exchanges. What's left is pure, verified performance mapping.
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                {[
                                    "Multi-vector identity check",
                                    "Direct bank proof logs",
                                    "Human-in-the-loop audits",
                                    "Encrypted settlement vault"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                                        <Activity className="w-4 h-4 text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative group">
                            <div className="aspect-video rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center p-8 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
                                <ShieldCheck className="w-24 h-24 text-blue-600 opacity-20 group-hover:scale-110 transition-transform duration-500" />

                                {/* Floating UI Mocks */}
                                <div className="absolute top-4 right-4 p-3 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 animate-bounce duration-[3000ms]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Verified</span>
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

export default Features;
