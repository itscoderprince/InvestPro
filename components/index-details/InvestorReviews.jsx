"use client";

import { Star, ThumbsUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ReviewCard = ({ name, avatar, rating, investment, text, date, helpful }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-500/5 mb-6 last:mb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden relative shadow-sm">
                    <div className="flex items-center justify-center h-full w-full bg-blue-100 text-blue-600 font-bold text-xs uppercase">
                        {name.split(" ").map(n => n[0]).join("")}
                    </div>
                </div>
                <div>
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight">{name}</h4>
                    <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-current" : "fill-current opacity-20"}`} />
                        ))}
                    </div>
                </div>
            </div>
            <Badge variant="outline" className="border-blue-600/20 bg-blue-600/5 text-blue-600 dark:text-blue-400 font-black rounded-full px-4 py-1">
                Invested {investment}
            </Badge>
        </div>

        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
            "{text}"
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-slate-50 dark:border-white/5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{date}</span>
            <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                {helpful} people found this helpful
            </button>
        </div>
    </div>
);

const InvestorReviews = () => {
    const reviews = [
        {
            name: "Arjun Sharma",
            rating: 5,
            investment: "₹50,000",
            text: "Great returns every week! Very reliable and transparent platform. Customer support is excellent and the dashboard is intuitive.",
            date: "2 weeks ago",
            helpful: 23,
        },
        {
            name: "Priya Patel",
            rating: 5,
            investment: "₹1,20,000",
            text: "I was looking for a consistent yield without deep involvement in daily trading. The Tech Growth Index has been performing exactly as promised.",
            date: "1 month ago",
            helpful: 15,
        },
        {
            name: "Rajiv Malhotra",
            rating: 4,
            investment: "₹25,000",
            text: "Smooth onboarding process. The weekly credits are consistently on time. Would love to see more sectoral indices soon.",
            date: "1 month ago",
            helpful: 8,
        },
    ];

    return (
        <section className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-blue-500/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                        <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                        What Investors Say
                    </h2>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
                ))}
            </div>

            <div className="mt-10 flex justify-center">
                <Button variant="outline" className="rounded-full px-8 py-6 font-bold border-slate-200 dark:border-white/10 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5">
                    Load More Reviews
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </div>
        </section>
    );
};

export default InvestorReviews;
