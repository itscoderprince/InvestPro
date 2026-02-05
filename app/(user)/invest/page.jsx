"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Wallet,
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Copy,
    Check,
    ArrowRight,
    Search,
    Info,
    ArrowUpRight,
    Home,
} from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Index data
const indices = [
    {
        id: 1,
        name: "Tech Growth Index",
        description: "High-growth technology stocks focused on innovation and digital transformation leaders.",
        weeklyReturn: "4.5%",
        minInvestment: 5000,
        investors: "1,250+",
        performance: "Performing well",
        gradient: "from-[#2563eb] to-[#7c3aed]",
        accentColor: "bg-[#2563eb]",
        variant: "blue",
    },
    {
        id: 2,
        name: "Stability Index",
        description: "Conservative portfolio focusing on blue-chip stocks with consistent dividend yields.",
        weeklyReturn: "3.2%",
        minInvestment: 10000,
        investors: "2,100+",
        performance: "Stable growth",
        gradient: "from-[#10b981] to-[#059669]",
        accentColor: "bg-[#10b981]",
        variant: "green",
    },
    {
        id: 3,
        name: "High Yield Index",
        description: "Aggressive growth strategy targeting maximum returns with diversified high-potential assets.",
        weeklyReturn: "5.0%",
        minInvestment: 15000,
        investors: "890+",
        performance: "Top performer",
        gradient: "from-[#7c3aed] to-[#c026d3]",
        accentColor: "bg-[#7c3aed]",
        variant: "purple",
    },
    {
        id: 4,
        name: "Balanced Index",
        description: "Mixed portfolio with balanced risk-reward ratio, ideal for medium-term wealth building.",
        weeklyReturn: "3.8%",
        minInvestment: 7500,
        investors: "1,650+",
        performance: "Performing well",
        gradient: "from-[#f59e0b] to-[#ea580c]",
        accentColor: "bg-[#f59e0b]",
        variant: "orange",
    },
];

// Payment details
const paymentDetails = {
    bankName: "State Bank of India",
    accountName: "InvestHub Pvt Ltd",
    accountNumber: "1234567890123456",
    ifsc: "SBIN0001234",
    upiId: "investhub@sbi",
};

export default function InvestPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [amount, setAmount] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [copied, setCopied] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value) {
            setAmount(parseInt(value).toLocaleString());
        } else {
            setAmount("");
        }
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(""), 2000);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setShowSuccess(true);
    };

    const resetForm = () => {
        setSelectedIndex(null);
        setAmount("");
        setAgreeTerms(false);
        setShowSuccess(false);
    };

    if (!mounted) return null;

    const currentMin = selectedIndex?.minInvestment || 0;
    const parsedAmount = parseInt(amount.replace(/,/g, "")) || 0;
    const isValidAmount = parsedAmount >= currentMin;

    return (
        <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto pt-0 pb-2 md:pb-4 px-2 md:px-1">
            {/* Compact Breadcrumb Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Breadcrumb className="px-1">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
                                <Home className="w-3.5 h-3.5" />
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Investment Indices
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="bg-white border rounded-lg px-4 py-1.5 flex items-center gap-3 shadow-sm mr-1">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Your Balance</p>
                        <p className="text-sm font-bold text-gray-900 leading-tight">₹2,800.00</p>
                    </div>
                </div>
            </div>

            {/* Grid of Indices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {indices.map((idx) => (
                    <Card key={idx.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full bg-white">
                        <div className={`h-2 w-full bg-gradient-to-r ${idx.gradient}`} />
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="bg-gray-50 text-gray-600 border-gray-100 font-bold text-[10px]">
                                    {idx.performance}
                                </Badge>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weekly ROI</p>
                                    <p className="text-xl font-black text-green-600 leading-none">{idx.weeklyReturn}</p>
                                </div>
                            </div>
                            <CardTitle className="text-xl font-bold text-gray-900 mt-2">{idx.name}</CardTitle>
                            <CardDescription className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                                {idx.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min. Invest</p>
                                    <p className="text-sm font-bold text-gray-900">₹{idx.minInvestment.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Index</p>
                                    <p className="text-sm font-bold text-gray-900">{idx.investors} Users</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span>Profit is credited to your wallet every Monday.</span>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={() => setSelectedIndex(idx)}
                                        className={`w-full font-bold shadow-md bg-[#2563eb] hover:bg-[#1d4ed8] shadow-blue-500/10 h-11`}
                                    >
                                        Start Investment
                                        <ArrowUpRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
                                    {showSuccess ? (
                                        <div className="p-6 md:p-10 text-center animate-in zoom-in-95 duration-300">
                                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle className="w-10 h-10 text-green-500" />
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
                                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                                Your request to invest in <span className="text-gray-900 font-bold">{selectedIndex?.name}</span> has been received.
                                                Please complete the transfer using the details below.
                                            </p>

                                            <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 text-left space-y-4 mb-8">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4 text-orange-500" />
                                                    Payment Gateway Info
                                                </h3>
                                                <div className="grid grid-cols-2 gap-y-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Bank Name</p>
                                                        <p className="text-gray-900 font-bold uppercase">{paymentDetails.bankName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Account Holder</p>
                                                        <p className="text-gray-900 font-bold">{paymentDetails.accountName}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">Account Number</p>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-lg font-black text-gray-900 tracking-tighter">{paymentDetails.accountNumber}</p>
                                                            <button onClick={() => copyToClipboard(paymentDetails.accountNumber, 'acc')} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                                                                {copied === 'acc' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Separator className="bg-gray-200" />
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">UPI ID</p>
                                                        <p className="text-gray-900 font-bold">{paymentDetails.upiId}</p>
                                                    </div>
                                                    <button onClick={() => copyToClipboard(paymentDetails.upiId, 'upi')} className="flex items-center gap-1.5 bg-white border px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">
                                                        {copied === 'upi' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                                        Copy UPI
                                                    </button>
                                                </div>
                                            </div>

                                            <Button className="w-full bg-gray-900 hover:bg-black font-bold h-12" onClick={resetForm}>
                                                I Have Transferred the Money
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                            <div className="p-6 md:p-8 space-y-6">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-black text-gray-900">Configure Investment</DialogTitle>
                                                    <DialogDescription className="text-sm">
                                                        You are initiating an investment in <span className="text-[#2563eb] font-bold">{selectedIndex?.name}</span>.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="amount" className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Investment Amount (INR)</Label>
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300 group-focus-within:text-[#2563eb]">₹</div>
                                                            <Input
                                                                id="amount"
                                                                value={amount}
                                                                onChange={handleAmountChange}
                                                                placeholder="0"
                                                                className="h-16 pl-10 text-2xl font-black border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/10 rounded-2xl"
                                                            />
                                                        </div>
                                                        {amount && !isValidAmount && (
                                                            <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 pl-1">
                                                                <AlertCircle className="w-3 h-3" />
                                                                Minimum required: ₹{selectedIndex?.minInvestment.toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
                                                        <Info className="w-5 h-5 text-orange-500 shrink-0" />
                                                        <p className="text-[11px] text-orange-800 leading-relaxed">
                                                            <span className="font-bold">Important:</span> This is an offline transaction request. You will need to manually transfer the funds after submitting.
                                                        </p>
                                                    </div>

                                                    <div className="flex items-start space-x-3 pt-2">
                                                        <Checkbox id="terms" checked={agreeTerms} onCheckedChange={setAgreeTerms} className="mt-1" />
                                                        <div className="grid gap-1.5 leading-none">
                                                            <Label htmlFor="terms" className="text-xs font-medium text-gray-500 cursor-pointer">
                                                                I agree to the investment terms and understand the risks involved.
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 p-6 md:p-8 flex flex-col gap-3">
                                                <Button
                                                    disabled={!isValidAmount || !agreeTerms || isSubmitting}
                                                    onClick={handleSubmit}
                                                    className="w-full h-12 bg-[#2563eb] hover:bg-[#1d4ed8] font-bold shadow-lg shadow-blue-500/20"
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Sending Request...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            Confirm Investment
                                                            <ArrowRight className="ml-2 w-4 h-4" />
                                                        </>
                                                    )}
                                                </Button>
                                                <Button variant="ghost" onClick={resetForm} className="text-gray-400 font-bold hover:bg-white">
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Bottom guide section */}
            <div className="bg-[#111827] rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold">New to investing?</h2>
                        <p className="text-gray-400 text-sm max-w-sm">
                            Schedule a free session with our portfolio managers to build a roadmap for your financial goals.
                        </p>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 font-bold h-12 px-8">
                        Speak to an Advisor
                    </Button>
                </div>
                {/* Subtle background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563eb]/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
        </div>
    );
}
