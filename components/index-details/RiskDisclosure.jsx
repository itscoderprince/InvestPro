"use client";

import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

const RiskDisclosure = () => {
    const points = [
        { label: "Minimum investment period", value: "None (withdraw anytime)" },
        { label: "Withdrawal processing time", value: "24-48 hours" },
        { label: "Entry/Exit Fees", value: "No hidden charges or fees" },
        { label: "Verification Required", value: "KYC verification required" },
    ];

    return (
        <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-blue-500/5">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Important Information
                </h2>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 mb-8">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                    <div>
                        <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest mb-3">Investment Risks:</p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 font-bold">
                            <li>• Past performance does not guarantee future returns</li>
                            <li>• Weekly returns may vary between 3-5%</li>
                            <li>• Market conditions can affect performance</li>
                            <li>• Investments are subject to market risks</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {points.map((point, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 last:border-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{point.label}</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white">{point.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                        Protected by Sovereign Liquidity Node
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RiskDisclosure;
