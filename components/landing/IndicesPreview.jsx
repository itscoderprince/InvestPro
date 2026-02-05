"use client";

import { TrendingUp, BarChart3, Activity, PieChart, Shield, Lock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Sparkline = ({ points, color }) => {
    const width = 100;
    const height = 30;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min;

    const pathData = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const IndexCard = ({ id, name, returns, description, icon: Icon, points, color }) => {
    return (
        <div className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:border-blue-500/20">
            <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                        <Icon size={24} />
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-1.5 text-emerald-500 font-black text-sm">
                            <TrendingUp size={14} />
                            {returns}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            MTD Yield
                        </p>
                    </div>
                </div>

                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {name}
                </h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                    {description}
                </p>

                <div className="mt-auto space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Momentum</span>
                            <Sparkline points={points} color={color} />
                        </div>
                        <div className="h-8 w-px bg-slate-100 dark:bg-white/5 mx-4"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">LIQUID</span>
                        </div>
                    </div>

                    <Button
                        asChild
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                    >
                        <Link href={`/indices/${id}`}>
                            View Index Detail
                            <ArrowUpRight size={14} className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const IndicesPreview = () => {
    const indices = [
        {
            id: "sovereign-core",
            name: "Sovereign Core",
            returns: "+4.25%",
            description: "Baseline volatility protection using bank-to-bank settlement proofs and premium debt instruments.",
            icon: Shield,
            points: [30, 35, 32, 38, 45, 42, 48, 55],
            color: "#3b82f6"
        },
        {
            id: "alpha-venture",
            name: "Alpha Venture",
            returns: "+14.80%",
            description: "Aggressive growth mapping across emerging fintech nodes and high-frequency settlement pools.",
            icon: BarChart3,
            points: [20, 45, 38, 65, 55, 85, 75, 95],
            color: "#10b981"
        },
        {
            id: "tactical-commodity",
            name: "Tactical Commodity",
            returns: "+7.12%",
            description: "Direct tracking of physical commodities using off-chain verification and audited storage logs.",
            icon: Activity,
            points: [50, 45, 55, 52, 60, 58, 62, 65],
            color: "#f59e0b"
        },
        {
            id: "yield-optimizer",
            name: "Yield Optimizer",
            returns: "+6.40%",
            description: "Balanced algorithmic rebalancing across multiple indices to maximize consistent weekly dividends.",
            icon: PieChart,
            points: [40, 42, 41, 44, 46, 45, 48, 50],
            color: "#8b5cf6"
        }
    ];

    return (
        <section id="indices" className="py-24 bg-white dark:bg-slate-950 px-4 md:px-6 relative overflow-hidden">
// ... existing IndicesPreview code ...
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-6">
                            Audit Status: Verified (SEC-1)
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                            Professional <br /> <span className="text-blue-600">Investment Nodes</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium leading-relaxed">
                            Access high-fidelity portfolio tracking across multiple asset classes,
                            rigorously audited for the most demanding institutional standards.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            Live Audits Active
                        </div>
                        <Button variant="outline" className="h-12 border-slate-200 dark:border-white/10 rounded-2xl px-6 font-bold hover:bg-slate-50 dark:hover:bg-white/5">
                            Request Full Registry
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {indices.map((index, idx) => (
                        <IndexCard key={idx} {...index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default IndicesPreview;
