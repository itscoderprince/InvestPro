"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

const Ticker = () => {
    const items = [
        { name: "BTC/USD", price: "$64,231.40", change: "+4.2%", up: true },
        { name: "ETH/USD", price: "$3,452.12", change: "+2.1%", up: true },
        { name: "SOL/USD", price: "$145.80", change: "+5.6%", up: true },
        { name: "S&P 500", price: "5,234.10", change: "+0.8%", up: true },
        { name: "NASDAQ", price: "18,342.50", change: "+1.2%", up: true },
        { name: "GOLD", price: "$2,340.00", change: "-0.2%", up: false },
        { name: "SOVEREIGN CORE", price: "+4.25%", change: "STABLE", up: true },
        { name: "ALPHA VENTURE", price: "+14.80%", change: "HIGH", up: true },
        { name: "TACTICAL COMMODITY", price: "+7.12%", change: "HEDGE", up: true },
        { name: "YIELD OPTIMIZER", price: "+6.40%", change: "BALANCED", up: true },
    ];

    // Double the items for seamless loop
    const displayItems = [...items, ...items];

    return (
        <section className="w-full bg-[#030806] border-y border-[#1a3327] relative z-20 overflow-hidden select-none">
            <div className="flex whitespace-nowrap py-3 md:py-4 animate-ticker">
                {displayItems.map((item, index) => (
                    <div
                        key={index}
                        className="inline-flex items-center gap-4 md:gap-8 px-8 md:px-12 border-r border-white/5 last:border-0"
                    >
                        <span className="text-emerald-500/50 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                            {item.name}
                        </span>
                        <span className="text-white font-mono text-xs md:text-sm font-bold">
                            {item.price}
                        </span>
                        <div
                            className={`flex items-center gap-1 text-[10px] md:text-xs font-black px-2 py-0.5 rounded-md ${item.up
                                    ? "text-emerald-400 bg-emerald-500/10"
                                    : "text-rose-400 bg-rose-500/10"
                                }`}
                        >
                            {item.up ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {item.change}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Ticker;
