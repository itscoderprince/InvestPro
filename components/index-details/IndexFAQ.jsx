"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 dark:border-white/5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-6 text-left group transition-all"
            >
                <span className={cn(
                    "text-base font-bold transition-all",
                    isOpen ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                )}>
                    {question}
                </span>
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-600"
                )}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const IndexFAQ = () => {
    const faqs = [
        {
            question: "What is the minimum investment amount?",
            answer: "The minimum investment for Tech Growth Index is ₹5,000. You can start with this amount and increase your investment at any time.",
        },
        {
            question: "How often are returns credited?",
            answer: "Returns are calculated based on the performance of the underlying assets and are credited to your investment wallet every Friday by 6:00 PM IST.",
        },
        {
            question: "Can I withdraw my investment anytime?",
            answer: "Yes, you can request withdrawal of your principal and accumulated returns anytime. We do not have any lock-in periods for the Tech Growth Index.",
        },
        {
            question: "Are there any charges or fees?",
            answer: "We strive for complete transparency. There are no entry or exit loads. A small management fee of 0.5% per annum is factored into the net weekly returns shown.",
        },
        {
            question: "What if returns are less than promised?",
            answer: "Returns vary between 3-5% weekly based on market conditions. While we target these ranges through active management, they are not guaranteed. We maintain a high transparency standard with live performance tracking.",
        },
        {
            question: "Is my investment safe?",
            answer: "All investments are managed by certified experts and stored in secure smart contract vaults. We perform regular manual audits to ensure capital integrity and adherence to our zero-trust security framework.",
        },
    ];

    return (
        <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-blue-500/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        Frequently Asked Questions
                    </h2>
                </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5">
                {faqs.map((faq, index) => (
                    <FAQItem key={index} {...faq} />
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                <button className="text-sm font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                    Show More FAQs
                </button>
            </div>
        </section>
    );
};

export default IndexFAQ;
