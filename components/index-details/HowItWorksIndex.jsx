"use client";

import { Wallet, TrendingUp, Calendar, ArrowDownCircle } from "lucide-react";
import { motion } from "framer-motion";

const Step = ({ icon: Icon, title, description, stepNumber, isLast }) => (
    <div className="relative flex flex-col items-center group">
        {/* Connector (Desktop) */}
        {!isLast && (
            <div className="hidden lg:block absolute top-10 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-[2px] bg-gradient-to-r from-blue-600/20 via-blue-600/10 to-transparent z-0"></div>
        )}

        <div className="relative z-10 w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/5 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-500">
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center border-4 border-white dark:border-slate-900">
                0{stepNumber}
            </div>
            <Icon className="w-8 h-8 text-blue-600" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
            {description}
        </p>

        {/* Connector (Mobile) */}
        {!isLast && (
            <div className="lg:hidden w-[2px] h-12 bg-gradient-to-b from-blue-600/20 to-transparent my-6"></div>
        )}
    </div>
);

const HowItWorksIndex = () => {
    const steps = [
        {
            icon: Wallet,
            title: "Invest Money",
            description: "Choose your investment amount (min ₹5,000)",
        },
        {
            icon: TrendingUp,
            title: "We Invest",
            description: "Our experts invest in carefully selected opportunities",
        },
        {
            icon: Calendar,
            title: "Weekly Returns",
            description: "Receive 3-5% returns credited every Friday",
        },
        {
            icon: ArrowDownCircle,
            title: "Withdraw Anytime",
            description: "Request withdrawal of principal + returns anytime",
        },
    ];

    return (
        <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-blue-500/5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-12">
                How Your Investment Works
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-4 text-center">
                {steps.map((step, index) => (
                    <Step
                        key={index}
                        {...step}
                        stepNumber={index + 1}
                        isLast={index === steps.length - 1}
                    />
                ))}
            </div>
        </section>
    );
};

export default HowItWorksIndex;
