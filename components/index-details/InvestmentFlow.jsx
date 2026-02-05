"use client";

import { useState, useEffect } from "react";
import {
    X,
    Wallet,
    FileText,
    CreditCard,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Info,
    AlertTriangle,
    Copy,
    Download,
    Clock,
    TrendingUp,
    ArrowDownCircle,
    Building2,
    Phone,
    MessageSquare,
    BadgeCheck,
    Share2,
    Calendar,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import dynamic from 'next/dynamic';
import { useDropzone } from "react-dropzone";

const QRCodeSVG = dynamic(() => import("qrcode.react").then(mod => mod.QRCodeSVG), { ssr: false });

const StepTracker = ({ currentStep, steps }) => {
    // ... existing StepTracker code ...
};

const InvestmentFlow = ({ indexData }) => {
    // ... existing state ...
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState(25000);
    const [duration, setDuration] = useState("flexible");
    const [acceptedTerms, setAcceptedTerms] = useState({
        varies: false,
        terms: false,
        ownFunds: false,
        risk: false,
    });
    const [paymentMethod, setPaymentMethod] = useState("bank");
    const [uploadProof, setUploadProof] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { id: 1, label: "Amount" },
        { id: 2, label: "Review" },
        { id: 3, label: "Payment" },
        { id: 4, label: "Done" },
    ];

    const currentRate = 0.045; // 4.5%
    const weeklyReturn = Math.round(amount * currentRate);
    const totalROI = duration === "flexible" ? "Variable" : duration === "3m" ? "58% (Est)" : "125% (Est)";

    const nextStep = () => {
        setStep(s => Math.min(s + 1, 4));
        window.scrollTo({ top: 0, behavior: "auto" });
    };

    const prevStep = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: "auto" });
    };

    const handleInvest = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsSubmitting(false);
        nextStep();
        toast.success("Investment request submitted successfully!");
    };

    const downloadReceipt = async () => {
        const jsPDF = (await import("jspdf")).default;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("InvestPro Investment Receipt", 20, 20);
        doc.setFontSize(12);
        doc.text(`Request ID: #PAY-123456`, 20, 40);
        doc.text(`Index: ${indexData?.name || "Tech Growth Index"}`, 20, 50);
        doc.text(`Amount: INR ${amount.toLocaleString()}`, 20, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
        doc.text(`Status: Pending Verification`, 20, 80);
        doc.save("InvestPro-Receipt.pdf");
    };

    const onDrop = (acceptedFiles) => {
        setUploadProof(acceptedFiles[0]);
        toast.success("Payment proof uploaded!");
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [], 'application/pdf': [] },
        multiple: false
    });
    return (
        <Card className="rounded-xl border-slate-100 dark:border-white/5 shadow-xl shadow-blue-500/5 overflow-hidden border-none gap-0 py-0">
            <CardHeader className="p-6 pb-0 border-b-0 space-y-0">
                <StepTracker currentStep={step} steps={steps} />
            </CardHeader>

            <CardContent className="p-6">
                <AnimatePresence>
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Amount Input Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Investment Amount</h3>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">₹</span>
                                            <Input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(Number(e.target.value))}
                                                className="h-14 pl-10 text-2xl font-bold bg-slate-50 dark:bg-white/5 border-transparent focus:bg-white focus:border-blue-500 transition-all rounded-xl"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                                                {[10000, 25000, 50000].map(val => (
                                                    <button
                                                        key={val}
                                                        onClick={() => setAmount(val)}
                                                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
                                                    >
                                                        {(val / 1000)}k
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <Slider
                                            value={[amount]}
                                            onValueChange={(v) => setAmount(v[0])}
                                            max={500000}
                                            min={5000}
                                            step={5000}
                                            className="py-2"
                                        />
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                            <span>Min: ₹5k</span>
                                            <span>Max: ₹10L</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Summary */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Weekly Payout</p>
                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">₹{weeklyReturn.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Est. Total ROI</p>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalROI}</p>
                                    </div>
                                </div>

                                {/* Lock-in Selection */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Duration Plan</h3>
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {[
                                            { id: "flexible", label: "Flexible", sub: "Withdraw Anytime" },
                                            { id: "3m", label: "3 Months", sub: "Priority (+0.2%)" },
                                            { id: "6m", label: "6 Months", sub: "Protected (+0.5%)" }
                                        ].map(d => (
                                            <button
                                                key={d.id}
                                                onClick={() => setDuration(d.id)}
                                                className={cn(
                                                    "p-3 rounded-xl border text-left transition-all",
                                                    duration === d.id
                                                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg"
                                                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-slate-300"
                                                )}
                                            >
                                                <p className={cn("text-sm font-bold", duration === d.id ? "text-white dark:text-slate-900" : "text-slate-700 dark:text-slate-300")}>{d.label}</p>
                                                <p className={cn("text-[10px] uppercase tracking-wide mt-1", duration === d.id ? "text-slate-400 dark:text-slate-500" : "text-slate-400")}>{d.sub}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-white/2 rounded-xl p-6 border border-slate-100 dark:border-white/5">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-slate-200/50 dark:border-white/5">Investment Summary</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</span>
                                                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">₹{amount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Return</span>
                                                <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    4.5% Weekly
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Limit</span>
                                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{duration}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-white/2 rounded-xl p-6 border border-slate-100 dark:border-white/5">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-slate-200/50 dark:border-white/5">Payout Schedule</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 dark:text-white">Active from: Today</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Initial Processing</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 dark:text-white">First Return: Next Friday</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">₹{weeklyReturn.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 py-4">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Confirm Agreements</h4>
                                    <div className="space-y-4">
                                        {[
                                            { id: "varies", label: "I understand that returns vary between 3-5% weekly" },
                                            { id: "terms", label: "I have read and agree to the Investment Terms & Conditions" },
                                            { id: "ownFunds", label: "This investment is made with my own legitimate funds" },
                                            { id: "risk", label: "I acknowledge the risks associated with index investing" }
                                        ].map(item => (
                                            <div
                                                key={item.id}
                                                className={cn(
                                                    "flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                                                    acceptedTerms[item.id] ? "bg-blue-50/50 dark:bg-blue-500/5 border-blue-200 dark:border-blue-500/20" : "border-slate-100 dark:border-white/5"
                                                )}
                                                onClick={() => setAcceptedTerms(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                            >
                                                <Checkbox checked={acceptedTerms[item.id]} className="mt-0.5" />
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-tight transition-colors",
                                                    acceptedTerms[item.id] ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"
                                                )}>
                                                    {item.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-relaxed">
                                            Funds will be locked for the chosen duration. Early withdrawal may incur a 2% processing fee.
                                        </p>
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
                            className="space-y-8"
                        >
                            <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                                <TabsList className="w-full h-12 bg-slate-100 dark:bg-white/5 rounded-xl p-1 mb-8 flex overflow-x-auto sm:grid sm:grid-cols-3 gap-2 no-scrollbar">
                                    <TabsTrigger value="bank" className="rounded-lg font-bold text-xs h-full flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm">Bank Transfer</TabsTrigger>
                                    <TabsTrigger value="upi" className="rounded-lg font-bold text-xs h-full flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm">UPI Payment</TabsTrigger>
                                    <TabsTrigger value="other" className="rounded-lg font-bold text-xs h-full flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 shadow-sm">Support</TabsTrigger>
                                </TabsList>

                                <TabsContent value="bank" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
                                        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Beneficiary Details</h4>
                                            <Badge variant="outline" className="text-[10px] h-6 border-blue-200 text-blue-700 bg-blue-50">Current Account</Badge>
                                        </div>
                                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                                            {[
                                                { label: "Account Name", value: "InvestPro Platform" },
                                                { label: "Bank Name", value: "HDFC Bank" },
                                                { label: "Account No.", value: "1234567890", copy: true },
                                                { label: "IFSC Code", value: "HDFC0001234", copy: true },
                                            ].map(item => (
                                                <div key={item.label} className="flex justify-between items-center p-3 px-4 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{item.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">{item.value}</span>
                                                        {item.copy && (
                                                            <button onClick={() => { navigator.clipboard.writeText(item.value); toast.success("Copied"); }} className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-colors text-blue-600">
                                                                <Copy className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-500/10 flex justify-between items-center">
                                            <div className="text-xs text-blue-900 dark:text-blue-100">
                                                <span className="font-bold block">Transfer Amount</span>
                                                <span className="opacity-70 text-[10px] uppercase">Exact Value</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-black text-blue-700 dark:text-blue-400">₹{amount.toLocaleString()}</span>
                                                <button onClick={() => { navigator.clipboard.writeText(amount.toString()); toast.success("Copied"); }} className="p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-blue-600">
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="upi" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex flex-col sm:flex-row gap-6 items-center bg-slate-50 dark:bg-white/5 p-6 rounded-xl border border-slate-200 dark:border-white/5">
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 shrink-0">
                                            <QRCodeSVG value={`upi://pay?pa=investpro@upi&am=${amount}&tn=INV-INDEX`} size={140} />
                                        </div>
                                        <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Scan to Pay</p>
                                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">₹{amount.toLocaleString()}</h3>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-white/10 flex justify-between items-center">
                                                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">investpro@upi</span>
                                                <button onClick={() => { navigator.clipboard.writeText("investpro@upi"); toast.success("UPI ID copied"); }} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">
                                                    Copy
                                                </button>
                                            </div>
                                            <div className="flex gap-2 justify-center sm:justify-start">
                                                <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">GPay</Badge>
                                                <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">PhonePe</Badge>
                                                <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">Paytm</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="other" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-8 border border-slate-200 dark:border-white/5 text-center">
                                        <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Traditional Support</h4>
                                        <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto">For high-value transactions (&gt; ₹10L) or cheque deposits, please contact our relationship manager.</p>
                                        <Button variant="outline" className="h-9 text-xs font-bold">Contact Support</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>



                            <div className="mt-12 pt-12 border-t border-slate-100 dark:border-white/5">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Screenshot</h4>
                                <div {...getRootProps()} className={cn(
                                    "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group",
                                    isDragActive ? "border-blue-600 bg-blue-500/5 translate-y-1" : "border-slate-100 dark:border-white/10 hover:border-blue-500/30"
                                )}>
                                    <input {...getInputProps()} />
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <ArrowDownCircle className={cn("w-6 h-6", isDragActive ? "text-blue-600" : "text-slate-300")} />
                                    </div>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">
                                        {uploadProof ? uploadProof.name : "Upload Receipt"}
                                    </p>
                                    <Badge variant="outline" className="border-slate-200 dark:border-white/10 text-[8px] text-slate-400 font-bold uppercase tracking-widest">JPG, PNG, PDF</Badge>
                                </div>
                                {uploadProof && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6 flex items-center justify-between p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[1.5rem]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-emerald-900 dark:text-emerald-400">{uploadProof.name}</p>
                                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Ready for verification</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setUploadProof(null); }} className="text-red-500 font-black uppercase text-[10px] tracking-widest">Remove</Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center py-8"
                        >
                            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Request Received</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">Ref: #INV-2024-889</p>

                            <div className="w-full max-w-lg bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden mb-8">
                                <div className="p-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-white dark:bg-slate-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                            <TrendingUp className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-slate-900 dark:text-white">₹{amount.toLocaleString()}</p>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Investment Value</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-amber-500/10 text-amber-600 border-none font-black text-[9px] px-3 py-1">Reviewing</Badge>
                                </div>
                                <div className="p-5 grid sm:grid-cols-3 gap-6 text-left">
                                    {[
                                        { icon: FileText, title: "Verifying", sub: "~2 Hours" },
                                        { icon: BadgeCheck, title: "Activation", sub: "Today" },
                                        { icon: Wallet, title: "First Payout", sub: "Next Fri" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <item.icon className={cn("w-4 h-4", i === 0 ? "text-blue-600" : "text-slate-300")} />
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{item.title}</p>
                                                <p className="text-[9px] font-semibold text-slate-400">{item.sub}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                                <Button asChild className="flex-1 rounded-xl h-11 font-black bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white shadow-lg text-[10px] uppercase tracking-widest">
                                    <a href="/dashboard/investments">Track Status</a>
                                </Button>
                                <Button variant="outline" onClick={downloadReceipt} className="flex-1 rounded-xl h-11 font-black border-slate-200 dark:border-white/10 text-[10px] uppercase tracking-widest">
                                    <Download className="w-3.5 h-3.5 mr-2" />
                                    Save Receipt
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-white/1">
                <div className="flex flex-col sm:flex-row justify-end gap-4 w-full">
                    {step > 1 && step < 4 && (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="w-full sm:w-auto px-8 rounded-xl h-12 font-black border-slate-200 dark:border-white/10 text-xs uppercase tracking-widest group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Go Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={step === 1 && (amount < 5000 || amount > 1000000)}
                            className="w-full sm:w-auto px-8 rounded-xl h-12 font-black bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg transition-all text-sm uppercase tracking-widest group"
                        >
                            {step === 1 ? `Proceed with ₹${amount.toLocaleString()}` : "Accept & Continue"}
                            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    ) : step === 3 ? (
                        <Button
                            onClick={handleInvest}
                            disabled={isSubmitting || !uploadProof}
                            className="w-full sm:w-auto px-8 rounded-xl h-12 font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all text-sm uppercase tracking-widest group disabled:opacity-50"
                        >
                            {isSubmitting ? "Submitting Proof..." : "Confirm Payment Proof"}
                            {!isSubmitting && <CheckCircle2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setStep(1)}
                            className="w-full sm:w-auto px-8 rounded-xl h-12 font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all text-sm uppercase tracking-widest"
                        >
                            Make Another Investment
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card >
    );
};

export default InvestmentFlow;
