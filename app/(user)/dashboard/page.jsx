"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Wallet,
    TrendingUp,
    Coins,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    ChevronRight,
    ExternalLink,
    Clock,
    CheckCircle2,
    Zap,
    Home,
    LayoutDashboard,
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDashboard } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";

// Stats Card Component
function StatsCard({ icon: Icon, iconColor, title, amount, subtext, trend, trendUp }) {
    const textColor = iconColor.replace('bg-', 'text-');
    const tintColor = iconColor.replace('bg-', 'bg-').replace('-600', '-50');

    return (
        <Card className="border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
            <CardContent className="p-0">
                <div className="px-3 py-1 md:px-4 md:py-1.5">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl ${tintColor} flex items-center justify-center shadow-sm`}>
                            <Icon className={`w-5 h-5 ${textColor}`} />
                        </div>
                        {trend && (
                            <Badge variant="outline" className={`${trendUp ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"} font-black text-[10px]`}>
                                {trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                {trend}
                            </Badge>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-1.5 leading-none">{amount}</h3>
                        <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 opacity-70" />
                            {subtext}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Simple Bar Chart Component
function ReturnsChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card className="border-none shadow-sm h-full">
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-gray-400 text-sm">No returns data yet</p>
                </CardContent>
            </Card>
        );
    }

    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-bold text-gray-900">Returns Growth</CardTitle>
                        <CardDescription className="text-[10px]">Weekly profit performance</CardDescription>
                    </div>
                    <Link href="/investments" className="text-[10px] font-bold text-[#2563eb] hover:underline flex items-center gap-1">
                        Analytics
                        <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-end justify-between gap-1 h-32 mt-4">
                    {data.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="w-full max-w-[12px] bg-gradient-to-t from-[#2563eb] to-[#60a5fa] rounded-full transition-all duration-300 hover:scale-x-125 cursor-pointer"
                                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="text-[10px] bg-gray-900 text-white border-none py-1 px-2">
                                        ₹{item.value.toLocaleString()}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <span className="text-[9px] font-bold text-gray-400 group-hover:text-gray-900 transition-colors uppercase">{item.week}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const { user, kycStatus } = useAuthStore();
    const { data: dashboardData, loading, error } = useDashboard();

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Failed to load dashboard</p>
                    <p className="text-sm text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    const summary = dashboardData?.summary || {};
    const pendingItems = dashboardData?.pendingItems || {};
    const recentInvestments = dashboardData?.recentInvestments || [];

    const stats = [
        {
            icon: Wallet,
            iconColor: "bg-blue-600",
            title: "Total Invested",
            amount: `₹${(summary.totalInvested || 0).toLocaleString()}`,
            subtext: `Across ${summary.activeInvestmentsCount || 0} active investments`,
            trend: summary.totalInvested > 0 ? "+12%" : null,
            trendUp: true,
        },
        {
            icon: TrendingUp,
            iconColor: "bg-green-600",
            title: "Total Returns",
            amount: `₹${(summary.totalReturns || 0).toLocaleString()}`,
            subtext: `${((summary.totalReturns / (summary.totalInvested || 1)) * 100).toFixed(1)}% overall ROI`,
            trend: summary.totalReturns > 0 ? `+${((summary.totalReturns / (summary.totalInvested || 1)) * 100).toFixed(1)}%` : null,
            trendUp: true,
        },
        {
            icon: Coins,
            iconColor: "bg-purple-600",
            title: "Wallet Balance",
            amount: `₹${(summary.walletBalance || 0).toLocaleString()}`,
            subtext: "Available for withdrawal",
            trend: null,
        },
        {
            icon: Activity,
            iconColor: "bg-orange-600",
            title: "Active Investments",
            amount: summary.activeInvestmentsCount || 0,
            subtext: `₹${(summary.currentValue || 0).toLocaleString()} current value`,
            trend: null,
        },
    ];

    // Transform recent investments for display
    const investments = recentInvestments.map(inv => ({
        id: inv._id,
        name: inv.index?.name || 'Unknown Index',
        amount: `₹${(inv.amount || 0).toLocaleString()}`,
        weeklyReturn: `₹${(inv.lastWeekReturn || 0).toLocaleString()}`,
        totalEarned: `₹${(inv.totalReturns || 0).toLocaleString()}`,
        status: inv.status === 'active' ? 'Active' : inv.status === 'pending' ? 'Pending' : 'Completed',
        risk: inv.index?.riskLevel || 'medium',
    }));

    // Mock chart data - in production, this would come from returns history
    const chartData = [
        { week: "W1", value: 320 },
        { week: "W2", value: 450 },
        { week: "W3", value: 380 },
        { week: "W4", value: 520 },
        { week: "W5", value: 480 },
        { week: "W6", value: 600 },
        { week: "W7", value: 550 },
        { week: "W8", value: 700 },
    ];

    const showKycAlert = kycStatus !== 'approved';

    return (
        <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto pt-0 pb-2 md:pb-4 px-2 md:px-1">
            {/* Header with Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/" className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
                                <Home className="w-3.5 h-3.5" />
                                Home
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                Dashboard
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-2">
                    <Button asChild size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold shadow-md shadow-blue-500/20 px-4">
                        <Link href="/invest">
                            <Zap className="w-3.5 h-3.5 mr-2" />
                            Invest Now
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="text-xs font-bold border-gray-200">
                        <Link href="/withdraw">
                            <Wallet className="w-3.5 h-3.5 mr-2" />
                            Withdraw
                        </Link>
                    </Button>
                </div>
            </div>

            {/* KYC Alert */}
            {showKycAlert && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-yellow-800 tracking-tight">
                                {kycStatus === 'pending' ? 'KYC Under Review' : kycStatus === 'rejected' ? 'KYC Rejected' : 'KYC Verification Required'}
                            </p>
                            <p className="text-[11px] text-yellow-700/80">
                                {kycStatus === 'pending'
                                    ? 'Your documents are being reviewed. This usually takes 24-48 hours.'
                                    : kycStatus === 'rejected'
                                        ? 'Please resubmit your documents with correct information.'
                                        : 'Submit your documents to unlock full withdrawal limits.'}
                            </p>
                        </div>
                    </div>
                    {kycStatus !== 'pending' && (
                        <Button asChild variant="ghost" size="sm" className="text-yellow-800 hover:bg-yellow-100 font-bold text-xs shrink-0">
                            <Link href="/kyc">{kycStatus === 'rejected' ? 'Resubmit' : 'Complete Now'}</Link>
                        </Button>
                    )}
                </div>
            )}

            {/* Pending Items Alert */}
            {(pendingItems.payments > 0 || pendingItems.withdrawals > 0) && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-blue-800 tracking-tight">Pending Actions</p>
                            <p className="text-[11px] text-blue-700/80">
                                {pendingItems.payments > 0 && `${pendingItems.payments} payment(s) awaiting confirmation. `}
                                {pendingItems.withdrawals > 0 && `${pendingItems.withdrawals} withdrawal(s) processing.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Active Investments */}
                <Card className="xl:col-span-2 border-none shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b flex flex-row items-center justify-between py-4">
                        <div>
                            <CardTitle className="text-sm font-bold text-gray-900">Active Portfolios</CardTitle>
                            <CardDescription className="text-[10px]">Real-time tracking of your capital</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] font-bold text-blue-600" asChild>
                            <Link href="/investments">View All</Link>
                        </Button>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        {investments.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-gray-500 mb-4">No investments yet</p>
                                <Button asChild size="sm" className="bg-[#2563eb]">
                                    <Link href="/invest">Start Investing</Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-white hover:bg-white border-b border-gray-100">
                                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-6 h-10">Asset</TableHead>
                                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest h-10">Amount</TableHead>
                                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest h-10 text-center">Returns</TableHead>
                                        <TableHead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest h-10">Status</TableHead>
                                        <TableHead className="text-right px-6 h-10"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {investments.map((inv) => (
                                        <TableRow key={inv.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0 h-16">
                                            <TableCell className="px-6">
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{inv.name}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0 ${inv.risk === 'low' ? 'bg-green-50 text-green-700 border-green-100' : inv.risk === 'high' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                                            {inv.risk === 'low' ? <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> : <AlertTriangle className="w-2.5 h-2.5 mr-1" />}
                                                            {inv.risk} Risk
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-black text-gray-900 whitespace-nowrap">{inv.amount}</TableCell>
                                            <TableCell className="text-center">
                                                <p className="text-sm font-black text-green-600">{inv.totalEarned}</p>
                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Total Earned</p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-tighter ${inv.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                    {inv.status === 'Active' && <Activity className="w-2.5 h-2.5 mr-1" />}
                                                    {inv.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 transition-colors" asChild>
                                                    <Link href={`/investments/${inv.id}`}>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </Card>

                {/* Growth Chart & Support */}
                <div className="space-y-6">
                    <ReturnsChart data={chartData} />

                    {/* Quick Support Card */}
                    <Card className="border-none shadow-sm bg-[#111827] text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">Our investment experts are here to guide you 24/7.</p>
                            <Button variant="secondary" size="sm" className="w-full text-xs font-bold h-9 bg-white text-gray-900 hover:bg-gray-100" asChild>
                                <Link href="/support">Chat with Support</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
