"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    CheckCircle2,
    Wallet,
    FileText,
    CreditCard,
    TrendingUp,
    Calendar,
    Clock,
    AlertTriangle,
    Copy,
    ArrowDownCircle,
    Download,
    BadgeCheck,
    Building2,
    MessageSquare,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useIndex } from "@/hooks/useApi";
import { paymentsApi } from "@/lib/api";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import dynamic from 'next/dynamic';
import { useDropzone } from "react-dropzone";

const QRCodeSVG = dynamic(() => import("qrcode.react").then(mod => mod.QRCodeSVG), { ssr: false });

const StepTracker = ({ currentStep }) => {
    const steps = [
        { id: 1, label: "Amount" },
        { id: 2, label: "Review" },
        { id: 3, label: "Payment" },
        { id: 4, label: "Success" },
    ];

    return (
        <div className="w-full py-8 flex justify-between relative mb-12 max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 dark:bg-white/5 -translate-y-1/2 mx-8 z-0"></div>
            <div
                className="absolute top-1/2 left-8 h-[2px] bg-blue-600 transition-all duration-500 -translate-y-1/2 z-0"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 88}%` }}
            ></div>

            {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2",
                            isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                                isActive ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-110" :
                                    "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-400"
                        )}>
                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-black">{step.id}</span>}
                        </div>
                        <span className={cn(
                            "absolute top-12 text-[10px] font-bold whitespace-nowrap uppercase tracking-widest transition-colors",
                            isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"
                        )}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default function InvestPage({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const router = useRouter();
    const { index, loading, error } = useIndex(id);

    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState(25000);
    const [duration, setDuration] = useState("flexible");
    const [acceptedTerms, setAcceptedTerms] = useState({
        varies: false,
        terms: false,
        ownFunds: false,
        risk: false,
    });
    const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
    const [uploadProof, setUploadProof] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentRequestId, setPaymentRequestId] = useState(null);
    const [transactionReference, setTransactionReference] = useState("");

    const currentRate = 0.045; // 4.5%
    const weeklyReturn = Math.round(amount * currentRate);
    const monthlyReturn = weeklyReturn * 4;

    const nextStep = () => {
        setStep(s => Math.min(s + 1, 4));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const prevStep = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleInvest = async () => {
        if (!uploadProof) {
            toast.error("Please upload payment proof first");
            return;
        }

        if (!transactionReference.trim()) {
            toast.error("Please enter transaction reference number");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Create Payment Request
            const response = await paymentsApi.createRequest({
                indexId: index?._id,
                amount,
                duration,
                paymentMethod,
            });

            // Note: backend returns 'id', frontend was looking for '_id'
            const newRequestId = response?.id || response?._id;

            if (newRequestId) {
                setPaymentRequestId(newRequestId);

                // 2. Upload Proof immediately
                const formData = new FormData();
                formData.append('proofDocument', uploadProof); // Backend expects 'proofDocument'
                formData.append('paymentRequestId', newRequestId);
                formData.append('transactionReference', transactionReference);

                const uploadRes = await paymentsApi.uploadProof(formData);

                if (uploadRes) {
                    toast.success("Investment submitted successfully!");
                    nextStep();
                } else {
                    throw new Error("Investment created, but proof upload failed. Please contact support.");
                }
            } else {
                throw new Error("Failed to create request");
            }
        } catch (error) {
            console.error("Investment error:", error);
            toast.error(error.message || "Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        setUploadProof(file);
        // We no longer upload automatically here to ensure it's linked to the request created in handleInvest
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [], 'application/pdf': [] },
        multiple: false
    });

    if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 text-center text-slate-500 font-bold uppercase tracking-widest">Loading...</div>;
    if (error || !index) return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 text-center text-red-500 font-black uppercase tracking-widest">Error Loading Index</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            <Navbar />

            <main className="pt-32 pb-24 px-4 md:px-6">
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <Link
                                href={`/indices/${id}`}
                                className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest transition-colors mb-4"
                            >
                                <ArrowLeft size={14} />
                                Back to {index.name}
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                                Complete Investment
                            </h1>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black px-4 py-2 text-sm h-fit">
                            {index.currentReturnRate}% Weekly Return
                        </Badge>
                    </div>

                    <StepTracker currentStep={step} />

                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-white/5 overflow-hidden">
                        <div className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                                    <Wallet className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                                    Investment Amount
                                                </h3>
                                            </div>

                                            <div className="grid lg:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    <div className="relative">
                                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">₹</span>
                                                        <Input
                                                            type="number"
                                                            value={amount}
                                                            onChange={(e) => setAmount(Number(e.target.value))}
                                                            className="h-20 pl-12 text-3xl font-black rounded-3xl border-slate-200 focus:border-blue-500 bg-slate-50 dark:bg-white/5 transition-all"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-3">
                                                        {[10000, 25000, 50000, 100000, 250000, 500000].map((val) => (
                                                            <button
                                                                key={val}
                                                                onClick={() => setAmount(val)}
                                                                className={cn(
                                                                    "p-4 rounded-2xl border transition-all text-sm font-black text-center",
                                                                    amount === val
                                                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:border-blue-500/50"
                                                                )}
                                                            >
                                                                ₹{(val / 1000).toFixed(0)}K
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <Slider
                                                        value={[amount]}
                                                        onValueChange={(v) => setAmount(v[0])}
                                                        max={1000000}
                                                        min={5000}
                                                        step={5000}
                                                    />
                                                </div>

                                                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
                                                    <h4 className="text-xs font-black opacity-60 uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Estimated Earnings</h4>
                                                    <div className="space-y-8">
                                                        <div>
                                                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Weekly Payout</p>
                                                            <p className="text-4xl font-black text-emerald-400">₹{weeklyReturn.toLocaleString()}</p>
                                                        </div>
                                                        <div className="h-[1px] bg-white/10"></div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Monthly</p>
                                                                <p className="text-xl font-black">₹{monthlyReturn.toLocaleString()}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Yearly (Est)</p>
                                                                <p className="text-xl font-black">₹{(monthlyReturn * 12).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Duration Plan</h3>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {[
                                                    { id: "flexible", label: "Flexible", sub: "Withdraw Anytime", bonus: "Standard" },
                                                    { id: "3m", label: "3 Months Locked", sub: "Priority Returns", bonus: "+0.2% Bonus" },
                                                    { id: "6m", label: "6 Months Locked", sub: "Wealth Builder", bonus: "+0.5% Bonus" }
                                                ].map(d => (
                                                    <button
                                                        key={d.id}
                                                        onClick={() => setDuration(d.id)}
                                                        className={cn(
                                                            "p-6 rounded-3xl border text-left transition-all",
                                                            duration === d.id
                                                                ? "bg-slate-900 dark:bg-white border-transparent shadow-xl"
                                                                : "bg-white dark:bg-slate-800 border-slate-100 dark:border-white/5"
                                                        )}
                                                    >
                                                        <p className={cn("text-lg font-black", duration === d.id ? "text-white dark:text-slate-900" : "text-slate-900 dark:text-white")}>{d.label}</p>
                                                        <p className={cn("text-xs font-bold mt-1", duration === d.id ? "text-slate-400" : "text-slate-500")}>{d.sub}</p>
                                                        <Badge className={cn("mt-4 font-black border-none", duration === d.id ? "bg-blue-500 text-white" : "bg-blue-500/10 text-blue-600")}>{d.bonus}</Badge>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                                Review Investment
                                            </h3>
                                        </div>

                                        <div className="grid lg:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <div className="bg-slate-50 dark:bg-white/2 rounded-3xl p-8 border border-slate-100 dark:border-white/5 space-y-6">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-4">Order Details</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-slate-500">Asset Name</span>
                                                            <span className="text-sm font-black text-slate-900 dark:text-white">{index.name}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-slate-500">Investment</span>
                                                            <span className="text-xl font-black text-slate-900 dark:text-white">₹{amount.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-slate-500">Duration</span>
                                                            <span className="text-sm font-black text-blue-600 uppercase tracking-widest">{duration}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-emerald-500/5 rounded-3xl p-8 border border-emerald-500/10 space-y-6">
                                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-500/10 pb-4">Expected Returns</h4>
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-emerald-700/60">Weekly Payout</span>
                                                            <span className="text-lg font-black text-emerald-600">₹{weeklyReturn.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-emerald-700/60">First Credit</span>
                                                            <span className="text-sm font-black text-emerald-600">Next Friday, 6:00 PM</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-8">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Agreements</h4>
                                                <div className="space-y-4">
                                                    {[
                                                        { id: "varies", label: "Returns vary between 3-5% weekly" },
                                                        { id: "terms", label: "I agree to the Terms & Conditions" },
                                                        { id: "ownFunds", label: "Made with my own legitimate funds" },
                                                        { id: "risk", label: "I acknowledge the market risks" }
                                                    ].map(item => (
                                                        <div
                                                            key={item.id}
                                                            className={cn(
                                                                "flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer group",
                                                                acceptedTerms[item.id] ? "bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20" : "border-slate-100 dark:border-white/5"
                                                            )}
                                                            onClick={() => setAcceptedTerms(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                                        >
                                                            <Checkbox checked={acceptedTerms[item.id]} className="mt-1" />
                                                            <span className={cn(
                                                                "text-xs font-black uppercase tracking-tight transition-colors",
                                                                acceptedTerms[item.id] ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                                                            )}>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                                Payment Method
                                            </h3>
                                        </div>

                                        <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                                            <TabsList className="w-full h-16 bg-slate-100 dark:bg-white/5 rounded-2xl p-2 mb-12">
                                                <TabsTrigger value="bank_transfer" className="rounded-xl font-black text-xs h-full flex-1 uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm">Bank Transfer</TabsTrigger>
                                                <TabsTrigger value="upi" className="rounded-xl font-black text-xs h-full flex-1 uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm">UPI Payment</TabsTrigger>
                                                <TabsTrigger value="other" className="rounded-xl font-black text-xs h-full flex-1 uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm">Other</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="bank_transfer" className="space-y-8 animate-in fade-in duration-500">
                                                <div className="grid lg:grid-cols-2 gap-12">
                                                    <div className="bg-slate-50 dark:bg-white/2 rounded-3xl p-8 border border-slate-100 dark:border-white/5 space-y-6">
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 pb-4">Beneficiary Account</h4>
                                                        <div className="space-y-6">
                                                            {[
                                                                { label: "Account Holder", value: "InvestPro Platform" },
                                                                { label: "Bank Name", value: "HDFC Bank" },
                                                                { label: "Account Number", value: "1234567890", copy: true },
                                                                { label: "IFSC Code", value: "HDFC0001234", copy: true },
                                                            ].map(item => (
                                                                <div key={item.label} className="flex justify-between items-center group">
                                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{item.value}</span>
                                                                        {item.copy && (
                                                                            <button onClick={() => { navigator.clipboard.writeText(item.value); toast.success("Copied"); }} className="text-blue-600 hover:scale-110 transition-transform">
                                                                                <Copy className="w-4 h-4" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/30">
                                                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Total Amount to Pay</p>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-5xl font-black">₹{amount.toLocaleString()}</p>
                                                                <button onClick={() => { navigator.clipboard.writeText(amount.toString()); toast.success("Copied"); }} className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                                                                    <Copy className="w-6 h-6" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-3xl p-6 flex gap-4">
                                                            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                                                            <p className="text-xs font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
                                                                Transfer exact amount. Verification takes 2-4 hours after proof upload.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="upi" className="space-y-8 animate-in fade-in duration-500">
                                                <div className="grid lg:grid-cols-2 gap-12">
                                                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-500/5">
                                                        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-50 mb-8">
                                                            <QRCodeSVG value={`upi://pay?pa=investpro@upi&am=${amount}&tn=INVEST-${id}`} size={180} />
                                                        </div>
                                                        <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-3">investpro@upi</p>
                                                        <Button variant="ghost" onClick={() => { navigator.clipboard.writeText("investpro@upi"); toast.success("Copied"); }} className="text-blue-600 font-black uppercase text-[10px] tracking-widest">
                                                            <Copy className="w-4 h-4 mr-2" />
                                                            Copy UPI ID
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-8">
                                                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/30">
                                                            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Total Amount to Pay</p>
                                                            <p className="text-5xl font-black">₹{amount.toLocaleString()}</p>
                                                        </div>

                                                        <div className="bg-slate-50 dark:bg-white/2 rounded-3xl p-8 border border-slate-100 dark:border-white/5">
                                                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Instructions</h5>
                                                            <ol className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                                <li className="flex gap-3">
                                                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                                                                    <span>Scan QR with any UPI App</span>
                                                                </li>
                                                                <li className="flex gap-3">
                                                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                                                                    <span>Enter Remark: INVEST-{id.substring(0, 5)}</span>
                                                                </li>
                                                                <li className="flex gap-3">
                                                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                                                                    <span>Take screenshot after payment</span>
                                                                </li>
                                                            </ol>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>

                                        <div className="pt-12 border-t border-slate-100 dark:border-white/5 space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Transaction Details</h4>
                                                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Transaction Reference / UTR Number</label>
                                                    <Input
                                                        value={transactionReference}
                                                        onChange={(e) => setTransactionReference(e.target.value)}
                                                        placeholder="Enter 12-digit UTR or Transaction ID"
                                                        className="h-14 rounded-2xl border-slate-200 dark:border-white/10 dark:bg-slate-900 font-bold"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-12 border-t border-slate-100 dark:border-white/5">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Upload Proof</h4>
                                                <div {...getRootProps()} className={cn(
                                                    "p-12 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-center transition-all cursor-pointer group",
                                                    isDragActive ? "border-blue-600 bg-blue-500/5 translate-y-1" : "border-slate-200 dark:border-white/10 hover:border-blue-500/30"
                                                )}>
                                                    <input {...getInputProps()} />
                                                    <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                        <ArrowDownCircle className={cn("w-8 h-8", isDragActive ? "text-blue-600" : "text-slate-300")} />
                                                    </div>
                                                    <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">
                                                        {uploadProof ? uploadProof.name : "Drop receipt here"}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">JPG, PNG or PDF (Max 5MB)</p>
                                                </div>

                                                {uploadProof && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-6 flex items-center justify-between p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                                                                <BadgeCheck className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-emerald-900 dark:text-emerald-400">{uploadProof.name}</p>
                                                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Ready for verification</p>
                                                            </div>
                                                        </div>
                                                        <Button variant="ghost" onClick={() => setUploadProof(null)} className="text-red-500 font-black uppercase text-[10px]">Remove</Button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center text-center py-12 space-y-10"
                                    >
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center relative z-10">
                                                <CheckCircle2 className="w-14 h-14" />
                                            </div>
                                            <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping z-0 scale-150 blur-xl"></div>
                                        </div>

                                        <div>
                                            <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Request Submitted!</h3>
                                            <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">Ref: #INV-{id.substring(0, 8)}</p>
                                        </div>

                                        <div className="w-full max-w-lg bg-slate-50 dark:bg-white/2 rounded-[2.5rem] p-10 border border-slate-100 dark:border-white/5 text-left space-y-8">
                                            <div className="space-y-6">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5 pb-4">Verification Steps</h4>
                                                <div className="space-y-8 relative">
                                                    <div className="absolute left-3.5 top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-white/5"></div>
                                                    {[
                                                        { title: "Reviewing Proof", sub: "Estimated ~4 Hours", icon: Clock, active: true },
                                                        { title: "Fund Activation", sub: "Same Business Day", icon: BadgeCheck, active: false },
                                                        { title: "Yield Credited", sub: "Next Friday, 6:00 PM", icon: TrendingUp, active: false }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex gap-8 relative z-10">
                                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white dark:bg-slate-900", item.active ? "border-emerald-500 text-emerald-500" : "border-slate-100 dark:border-white/5 text-slate-300")}>
                                                                <item.icon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{item.title}</p>
                                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.sub}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                                            <Button asChild className="flex-1 rounded-2xl h-16 font-black bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 text-white shadow-xl text-lg uppercase tracking-widest">
                                                <Link href="/dashboard/investments">Track Investment</Link>
                                            </Button>
                                            <Button variant="outline" className="flex-1 rounded-2xl h-16 font-black border-slate-200 dark:border-white/10 flex items-center gap-2 uppercase tracking-widest">
                                                <Download className="w-5 h-5" />
                                                Receipt
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer Controls */}
                        {step < 4 && (
                            <div className="p-8 md:p-12 bg-slate-50/50 dark:bg-white/2 border-t border-slate-100 dark:border-white/5">
                                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                    {step > 1 && (
                                        <Button
                                            variant="outline"
                                            onClick={prevStep}
                                            className="rounded-2xl h-16 px-10 font-black border-slate-200 dark:border-white/10 text-xs uppercase tracking-widest"
                                        >
                                            Go Back
                                        </Button>
                                    )}
                                    <Button
                                        onClick={step === 3 ? handleInvest : nextStep}
                                        disabled={isSubmitting || (step === 2 && Object.values(acceptedTerms).includes(false)) || (step === 3 && !uploadProof)}
                                        className={cn(
                                            "rounded-2xl h-16 px-12 font-black text-lg uppercase tracking-widest shadow-xl transition-all",
                                            step === 3 ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                                        )}
                                    >
                                        {step === 1 ? "Next Step" : step === 2 ? "Confirm Details" : isSubmitting ? "Processing..." : "I've Paid"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
