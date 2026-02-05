"use client";

import { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { TrendingUp, Award, Target, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const performanceData = [
    { week: "W1", return: 4.1 },
    { week: "W2", return: 4.3 },
    { week: "W3", return: 3.9 },
    { week: "W4", return: 4.5 },
    { week: "W5", return: 4.2 },
    { week: "W6", return: 4.8 },
    { week: "W7", return: 4.4 },
    { week: "W8", return: 4.0 },
    { week: "W9", return: 4.6 },
    { week: "W10", return: 4.3 },
    { week: "W11", return: 4.9 },
    { week: "W12", return: 4.5 },
];

const StatBox = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-500/5">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-opacity-10", colorClass)}>
            <Icon className={cn("w-6 h-6", colorClass.replace("bg-", "text-").replace("/10", ""))} />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{subtext}</p>
    </div>
);

const PerformanceSection = () => {
    const [period, setPeriod] = useState("3M");

    return (
        <section className="mt-16 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-blue-500/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                        Performance Overview
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Historical weekly return data and key volatility metrics.
                    </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
                    {["1M", "3M", "6M", "1Y", "ALL"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={cn(
                                "px-5 py-2.5 rounded-xl text-xs font-black transition-all",
                                period === p
                                    ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Sub-section 1: Return History Chart */}
                <div className="lg:col-span-8">
                    <div className="h-[400px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorReturn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis
                                    dataKey="week"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: "#94a3b8" }}
                                    dy={15}
                                />
                                <YAxis
                                    domain={[0, 6]}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: "#94a3b8" }}
                                    tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "16px",
                                        border: "none",
                                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                                        padding: "12px 16px",
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}
                                    cursor={{ stroke: "#2563eb", strokeOpacity: 0.2, strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="return"
                                    stroke="url(#colorReturn)"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorReturn)"
                                />
                                {/* Average line */}
                                <Line
                                    type="monotone"
                                    dataKey={() => 4.2}
                                    stroke="#94a3b8"
                                    strokeDasharray="5 5"
                                    dot={false}
                                    activeDot={false}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sub-section 2: Key Statistics */}
                <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    <StatBox
                        title="Average Weekly Return"
                        value="4.2%"
                        subtext="Over last 12 weeks"
                        icon={TrendingUp}
                        colorClass="bg-blue-500/10"
                    />
                    <StatBox
                        title="Best Week"
                        value="5.0%"
                        subtext="Week of Jan 15"
                        icon={Award}
                        colorClass="bg-emerald-500/10"
                    />
                    <StatBox
                        title="Consistency Score"
                        value="92/100"
                        subtext="Highly consistent"
                        icon={Target}
                        colorClass="bg-purple-500/10"
                    />
                    <StatBox
                        title="Risk Level"
                        value="Medium"
                        subtext="Stable portfolio"
                        icon={AlertTriangle}
                        colorClass="bg-amber-500/10"
                    />
                </div>
            </div>
        </section>
    );
};

export default PerformanceSection;
