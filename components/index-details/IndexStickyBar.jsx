"use client";

import { useState, useEffect } from "react";
import { Calculator, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const IndexStickyBar = ({ name, returns, onInvest }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showQuickCalc, setShowQuickCalc] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
                    >
                        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Focusing on</p>
                                    <p className="font-black text-slate-900 dark:text-white">{name}</p>
                                </div>
                                <div className="h-10 w-[1px] bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Weekly Return</p>
                                    <p className="font-black text-emerald-500">{returns}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    className="rounded-full font-bold border-slate-200 dark:border-white/10 hidden md:flex items-center gap-2"
                                    onClick={() => setShowQuickCalc(true)}
                                >
                                    <Calculator className="w-4 h-4" />
                                    Calculate
                                </Button>
                                <Button onClick={onInvest} className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-full px-8 h-12 shadow-lg shadow-blue-500/20">
                                    Invest Now
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button (FAB) */}
            <AnimatePresence>
                {isVisible && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setShowQuickCalc(true)}
                        className="fixed bottom-24 md:bottom-28 right-6 md:right-10 z-40 w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
                    >
                        <Calculator className="w-6 h-6" />
                        <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                            Quick Calculator
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Quick Calculator Modal Placeholder */}
            <AnimatePresence>
                {showQuickCalc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                            onClick={() => setShowQuickCalc(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-white/5 pb-6">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Quick ROI Calculator</h3>
                                <button onClick={() => setShowQuickCalc(false)} className="h-10 w-10 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="bg-blue-500/5 rounded-3xl p-6 border border-blue-500/10 mb-8">
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                    This is a simplified version of our returns tool. Use this to quickly estimate your potential gains.
                                </p>
                            </div>

                            {/* Simplified Calculator Logic or just point to main one */}
                            <p className="text-center text-slate-400 font-bold mb-8">
                                Calculator controls would be here...
                            </p>

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl h-14"
                                onClick={() => {
                                    setShowQuickCalc(false);
                                    window.scrollTo({ top: document.querySelector('#calculator').offsetTop - 100, behavior: 'smooth' });
                                }}
                            >
                                Use Full Calculator
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default IndexStickyBar;
