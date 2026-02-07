"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Wallet,
    AlertCircle,
    CheckCircle,
    Clock,
    X,
    Info,
    ChevronRight,
    Building2,
    ArrowUpRight,
    ArrowDownRight,
    History,
    CreditCard,
    ArrowLeft,
    Plus,
    Home,
    Loader2,
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useWithdrawals, useAvailableBalance } from "@/hooks/useApi";
import { withdrawalsApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const minWithdrawal = 500;

export default function WithdrawPage() {
    const { user, kycStatus, refreshUser } = useAuthStore();
    const { balance, loading: balanceLoading, refetch: refetchBalance } = useAvailableBalance();
    const { withdrawals, loading: withdrawalsLoading, refetch: refetchWithdrawals } = useWithdrawals();

    const [amount, setAmount] = useState("");
    const [useSavedBank, setUseSavedBank] = useState(true);
    const [bankDetails, setBankDetails] = useState({
        accountHolder: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [requestId, setRequestId] = useState("");
    const [error, setError] = useState(null);

    const availableBalance = balance || 0;
    const savedBankDetails = user?.bankDetails || null;

    const parsedAmount = parseInt(amount.replace(/,/g, "")) || 0;
    const isValidAmount = parsedAmount >= minWithdrawal && parsedAmount <= availableBalance;

    const hasBankDetails = useSavedBank && savedBankDetails ? true : (
        bankDetails.accountHolder.trim() &&
        bankDetails.accountNumber.trim() &&
        bankDetails.ifscCode.trim() &&
        bankDetails.bankName.trim()
    );

    const canSubmit = isValidAmount && hasBankDetails && !isSubmitting && kycStatus === 'approved';

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (value) {
            setAmount(parseInt(value).toLocaleString());
        } else {
            setAmount("");
        }
    };

    const handleWithdrawAll = () => {
        setAmount(availableBalance.toLocaleString());
    };

    const handleBankDetailChange = (field, value) => {
        setBankDetails((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const requestData = {
                amount: parsedAmount,
                bankDetails: useSavedBank && savedBankDetails ? savedBankDetails : bankDetails,
            };

            const result = await withdrawalsApi.createRequest(requestData);
            setRequestId(result.withdrawal?._id || `WD-${Date.now().toString().slice(-8)}`);
            setShowSuccess(true);
            refetchBalance();
            refetchWithdrawals();
            await refreshUser();
        } catch (err) {
            setError(err.message || 'Failed to create withdrawal request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (balanceLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="max-w-md mx-auto py-12">
                <Card className="border-none shadow-2xl text-center p-8 md:p-12 overflow-hidden relative">
                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in-95 duration-500">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Request Processed</h2>
                        <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">Your withdrawal request has been submitted successfully and is currently under review.</p>

                        <div className="bg-gray-50/80 rounded-2xl p-6 mb-10 text-left space-y-4 border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</span>
                                <span className="text-lg font-black text-gray-900">₹{amount}</span>
                            </div>
                            <Separator className="bg-gray-200/50" />
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Request ID</span>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{requestId}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-12 shadow-lg shadow-blue-500/20">
                                <Link href="/withdraw">Track All Withdrawals</Link>
                            </Button>
                            <Button asChild variant="ghost" className="w-full h-12 font-bold text-gray-400">
                                <Link href="/dashboard">Back to Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    const recentWithdrawals = withdrawals.slice(0, 4);

    return (
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pt-0 pb-2 md:pb-4 px-2 md:px-1">
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
                                <Wallet className="w-3.5 h-3.5" />
                                Withdraw Funds
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* KYC Warning */}
            {kycStatus !== 'approved' && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-yellow-800 tracking-tight">KYC Required</p>
                            <p className="text-[11px] text-yellow-700/80">Complete KYC verification to request withdrawals.</p>
                        </div>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-yellow-800 hover:bg-yellow-100 font-bold text-xs shrink-0">
                        <Link href="/kyc">Complete Now</Link>
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Balance Display Card */}
                    <Card className="border-none shadow-sm bg-gray-900 text-white overflow-hidden relative">
                        <CardContent className="p-8">
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Withdrawable Profits</p>
                                    <h2 className="text-5xl font-black tracking-tighter text-white">₹{availableBalance.toLocaleString()}</h2>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Wallet className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <div className="relative z-10 mt-10 flex gap-4">
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest leading-none">Instant Processing Available</p>
                                </div>
                            </div>
                        </CardContent>
                        {/* Background blobs */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                    </Card>

                    {/* Withdrawal Form Card */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="border-b bg-gray-50/30">
                            <CardTitle className="text-lg font-bold">Transfer Details</CardTitle>
                            <CardDescription className="text-xs">Specify the amount and destination for your withdrawal.</CardDescription>
                        </CardHeader>

                        <CardContent className="p-8 space-y-8">
                            {/* Error message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Amount Input */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Withdrawal Amount (INR)</Label>
                                    <Button variant="link" onClick={handleWithdrawAll} className="h-auto p-0 text-blue-600 font-bold text-xs hover:no-underline underline-offset-4">Max Balance</Button>
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-200 group-focus-within:text-blue-500 transition-colors">₹</span>
                                    <Input
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="0"
                                        className="h-20 pl-12 text-4xl font-black border-gray-100 bg-gray-50/30 focus:bg-white focus:border-blue-500 focus:ring-blue-100 rounded-3xl transition-all"
                                    />
                                    {amount && !isValidAmount && (
                                        <p className="mt-2 text-[10px] font-bold text-red-500 flex items-center gap-1.5 ml-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {parsedAmount < minWithdrawal ? `Minimum ₹${minWithdrawal}` : `Exceeds balance`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Bank Account Selection */}
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Destination Account</Label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedBankDetails && (
                                        <div
                                            onClick={() => setUseSavedBank(true)}
                                            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${useSavedBank ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <div className="flex items-start justify-between relative z-10">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Primary Bank</p>
                                                    <p className="text-sm font-bold text-gray-900">{savedBankDetails.bankName}</p>
                                                    <p className="text-xs text-gray-500 font-medium">****{savedBankDetails.accountNumber?.slice(-4)}</p>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${useSavedBank ? 'border-blue-600 bg-blue-600' : 'border-gray-200'}`}>
                                                    {useSavedBank && <CheckCircle className="w-4 h-4 text-white" />}
                                                </div>
                                            </div>
                                            <Building2 className={`absolute -bottom-4 -right-4 w-12 h-12 transition-all ${useSavedBank ? 'text-blue-100' : 'text-gray-50'}`} />
                                        </div>
                                    )}

                                    <div
                                        onClick={() => setUseSavedBank(false)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all border-dashed hover:border-solid group ${!useSavedBank ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <div className="flex items-center justify-between h-full">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-gray-900">New Account</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Add another bank</p>
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!useSavedBank ? 'bg-blue-600' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                                                {!useSavedBank ? <CheckCircle className="w-5 h-5 text-white" /> : <Plus className="w-4 h-4 text-gray-400" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {!useSavedBank && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in slide-in-from-top-2 duration-300">
                                        <Input placeholder="Holder Name" value={bankDetails.accountHolder} onChange={(e) => handleBankDetailChange("accountHolder", e.target.value)} className="h-11 rounded-xl" />
                                        <Input placeholder="Account Number" value={bankDetails.accountNumber} onChange={(e) => handleBankDetailChange("accountNumber", e.target.value)} className="h-11 rounded-xl" />
                                        <Input placeholder="IFSC Code" value={bankDetails.ifscCode} onChange={(e) => handleBankDetailChange("ifscCode", e.target.value.toUpperCase())} className="h-11 rounded-xl" />
                                        <Input placeholder="Bank Name" value={bankDetails.bankName} onChange={(e) => handleBankDetailChange("bankName", e.target.value)} className="h-11 rounded-xl" />
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-gray-100" />

                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-blue-900">Security Note</p>
                                    <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">Funds will only be credited to the bank account held in your verified name. Third-party transfers are strictly prohibited.</p>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-50/50 border-t p-8">
                            <Button
                                onClick={handleSubmit}
                                disabled={!canSubmit}
                                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-lg font-black shadow-xl shadow-blue-500/20 rounded-2xl transition-all"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing Transfer...
                                    </span>
                                ) : (
                                    <>
                                        Confirm Withdrawal
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Right Column - Activity */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Activity Card */}
                    <Card className="border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="border-b bg-gray-50/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-gray-400" />
                                    <CardTitle className="text-base font-bold">Activity Log</CardTitle>
                                </div>
                                <Button variant="ghost" className="h-8 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600">Full History</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {withdrawalsLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto" />
                                </div>
                            ) : recentWithdrawals.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 text-sm">No withdrawal history yet</div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {recentWithdrawals.map((item) => (
                                        <div key={item.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    item.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {item.status === 'approved' ? <ArrowDownRight className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 leading-tight">₹{(item.amount || 0).toLocaleString()}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                                                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className={`font-black text-[9px] uppercase tracking-tighter px-2 h-5 flex items-center justify-center rounded-md ${item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick FAQ / Info */}
                    <div className="p-6 bg-white border border-dashed border-gray-200 rounded-3xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-xs font-bold text-gray-900">Payout Protection</p>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">Your funds are protected by end-to-end encryption. All withdrawals undergo a 3-step fraud prevention check before clearance.</p>
                        <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">Security Policy <ChevronRight className="w-2.5 h-2.5" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    )
}

function ShieldCheck({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
        </svg>
    )
}
