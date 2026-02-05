"use client";

import { use, useState, useEffect } from "react";
import {
    ChevronLeft,
    Copy,
    Clock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    RefreshCcw,
    Download,
    PhoneCall,
    ArrowDownCircle,
    FileText,
    BadgeCheck,
    Building2,
    TrendingUp,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

export default function TrackingPage({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const [status, setStatus] = useState("pending"); // pending, verifying, verified, rejected
    const [timeLeft, setTimeLeft] = useState(80100); // ~22 hours
    const [uploadProof, setUploadProof] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const onDrop = (acceptedFiles) => {
        setUploadProof(acceptedFiles[0]);
        setStatus("verifying");
        toast.success("Proof uploaded! Status updated to verifying.");
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [], 'application/pdf': [] },
        multiple: false
    });

    const StatusBanner = () => {
        switch (status) {
            case "pending":
                return (
                    <div className="bg-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-black">Awaiting Payment Completion</p>
                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Please transfer ₹25,000 to reserve your slot</p>
                            </div>
                        </div>
                        <Button className="bg-white text-amber-600 hover:bg-white/90 font-black rounded-2xl h-12 px-8 uppercase tracking-widest text-[10px]">Upload Proof</Button>
                    </div>
                );
            case "verifying":
                return (
                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <RefreshCcw className="w-6 h-6 animate-spin" />
                            </div>
                            <div>
                                <p className="text-xl font-black">Verification in Progress</p>
                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Our team is verifying your payment. ETA: 2-4 hours</p>
                            </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-none font-black px-4 py-2 uppercase tracking-widest text-[10px]">Under Review</Badge>
                    </div>
                );
            case "verified":
                return (
                    <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-black">Payment Verified!</p>
                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Your investment in Tech Growth Index is now active.</p>
                            </div>
                        </div>
                        <Button className="bg-white text-emerald-600 hover:bg-white/90 font-black rounded-2xl h-12 px-8 uppercase tracking-widest text-[10px]" asChild>
                            <Link href="/dashboard/investments">View Investment</Link>
                        </Button>
                    </div>
                );
            case "rejected":
                return (
                    <div className="bg-red-500 rounded-3xl p-6 text-white shadow-xl shadow-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <XCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xl font-black">Verification Failed</p>
                                <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Amount mismatch/Invalid proof. Please check notes or contact support.</p>
                            </div>
                        </div>
                        <Button className="bg-white text-red-600 hover:bg-white/90 font-black rounded-2xl h-12 px-8 uppercase tracking-widest text-[10px]">Contact Support</Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] dark:bg-slate-950 pb-20 pt-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <Link href="/dashboard" className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Payment Request Detail</h1>
                            <div className="px-3 py-1 bg-blue-600/10 border border-blue-600/20 rounded-full flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                {id}
                                <button onClick={() => { navigator.clipboard.writeText(id); toast.success("Copied ID"); }}>
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Remaining to Complete Payment</p>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8 space-y-8">
                        <StatusBanner />

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 shadow-2xl shadow-blue-500/5">
                            <div className="flex items-center justify-between mb-8 border-b border-slate-50 dark:border-white/5 pb-6">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Investment Summary</h3>
                                <Badge className="bg-blue-600 text-white border-none font-black px-4 py-1.5 uppercase tracking-widest text-[8px]">Standard Flexible</Badge>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Index</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">Tech Growth Index</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600/5 flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Principal Amount</p>
                                            <p className="text-2xl font-black text-slate-900 dark:text-white">₹25,000</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 space-y-4">
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-slate-500 uppercase tracking-widest">Submission Date</span>
                                            <span className="text-slate-900 dark:text-white">Feb 5, 2024, 02:30 PM</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-slate-500 uppercase tracking-widest">Payment Method</span>
                                            <span className="text-slate-900 dark:text-white">Bank-to-Bank Transfer</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-slate-500 uppercase tracking-widest">Reference ID</span>
                                            <span className="text-slate-900 dark:text-white">PAY-123456</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 shadow-2xl shadow-blue-500/5">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-50 dark:border-white/5 pb-6">Payment Proof</h3>

                            {!uploadProof ? (
                                <div {...getRootProps()} className={cn(
                                    "p-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-center transition-all cursor-pointer group",
                                    isDragActive ? "border-blue-600 bg-blue-500/5" : "border-slate-200 dark:border-white/10 hover:border-blue-500/30"
                                )}>
                                    <input {...getInputProps()} />
                                    <ArrowDownCircle className={cn("w-12 h-12 mb-4 transition-colors", isDragActive ? "text-blue-600" : "text-slate-300 group-hover:text-blue-500")} />
                                    <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">Drag & Drop Proof</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Click to upload bank receipt, screenshot or PDF<br />(Max size 5MB)</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-blue-600/5 border border-blue-600/10 rounded-3xl gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden">
                                                <FileText className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{uploadProof.name}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{(uploadProof.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="rounded-xl px-4 font-black text-[10px] uppercase tracking-widest border-slate-200 dark:border-white/10 h-10">View Full Size</Button>
                                            <Button variant="outline" onClick={() => setUploadProof(null)} className="rounded-xl px-4 font-black text-[10px] uppercase tracking-widest border-red-200 text-red-500 h-10 hover:bg-red-50">Remove</Button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                                            <BadgeCheck className="w-4 h-4" />
                                        </div>
                                        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                                            Proof of payment is being reviewed by our compliance team. Please do not re-upload unless requested.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 p-8 shadow-2xl shadow-blue-500/5">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 border-b border-slate-50 dark:border-white/5 pb-4">Verification Timeline</h3>
                            <div className="space-y-10 relative">
                                <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-slate-50 dark:bg-white/2"></div>

                                {[
                                    {
                                        title: "Request Created",
                                        time: "Feb 5, 02:30 PM",
                                        status: "completed",
                                        icon: FileText,
                                        desc: "Initial investment request initiated"
                                    },
                                    {
                                        title: "Payment Proof",
                                        time: status === "pending" ? "Awaiting..." : "Feb 5, 02:45 PM",
                                        status: status === "pending" ? "active" : "completed",
                                        icon: ExternalLink,
                                        desc: "User uploads transaction screenshot"
                                    },
                                    {
                                        title: "Compliance Review",
                                        time: "Pending",
                                        status: status === "verifying" ? "active" : "pending",
                                        icon: BadgeCheck,
                                        desc: "Manual verification by admin team"
                                    },
                                    {
                                        title: "Investment Active",
                                        time: "Awaiting",
                                        status: status === "verified" ? "completed" : "pending",
                                        icon: TrendingUp,
                                        desc: "Investment starts generating returns"
                                    }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 relative z-10">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                                            step.status === "completed" ? "bg-blue-600 border-blue-600 text-white" :
                                                step.status === "active" ? "bg-white dark:bg-slate-900 border-blue-600 text-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" :
                                                    "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-300"
                                        )}>
                                            <step.icon className="w-3 h-3" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className={cn("text-sm font-black uppercase tracking-tight leading-none", step.status === "pending" ? "text-slate-300" : "text-slate-900 dark:text-white")}>{step.title}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.time}</p>
                                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed max-w-[180px]">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-white/5 space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Need Assistance?</h4>
                            <div className="grid grid-cols-1 gap-2">
                                <Button variant="outline" className="h-14 rounded-2xl border-slate-100 dark:border-white/5 flex items-center justify-between px-6 group">
                                    <div className="flex items-center gap-3">
                                        <PhoneCall className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-black uppercase tracking-widest">Priority Call</span>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black text-[8px]">Active</Badge>
                                </Button>
                                <Button variant="outline" className="h-14 rounded-2xl border-slate-100 dark:border-white/5 flex items-center justify-between px-6 group">
                                    <div className="flex items-center gap-3">
                                        <Download className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-black uppercase tracking-widest">Payment Guide</span>
                                    </div>
                                    <FileText className="w-4 h-4 text-slate-300" />
                                </Button>
                            </div>
                        </div>

                        <Button variant="ghost" className="w-full text-red-500 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl hover:bg-red-50">
                            Cancel Investment Request
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
