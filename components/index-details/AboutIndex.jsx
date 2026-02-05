"use client";

import { CheckCircle2 } from "lucide-react";

const AboutIndex = () => {
    const features = [
        "Weekly returns of 3-5%",
        "Expert-managed portfolio",
        "Diversified risk management",
        "Transparent performance tracking",
        "Easy withdrawal anytime",
    ];

    return (
        <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-blue-500/5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
                What is Tech Growth Index?
            </h2>

            <div className="space-y-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                <p>
                    The Tech Growth Index focuses on high-growth technology companies with strong fundamentals.
                    Our expert team analyzes market trends weekly to optimize returns while managing risk effectively.
                </p>

                <p>
                    This index is ideal for investors looking for consistent weekly returns with moderate risk exposure.
                    We invest in established tech companies as well as emerging startups with proven track records.
                </p>

                <p>
                    All investments are managed by certified financial experts with 10+ years of experience
                    in technology sector investing. We prioritize capital preservation while capturing the
                    upside of the most innovative sector in the global economy.
                </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutIndex;
