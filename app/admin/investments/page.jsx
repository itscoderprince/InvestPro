"use client";

import * as React from "react";
import { useState } from "react";
import {
    Search,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Download,
    Eye,
    Plus,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    BadgePercent,
    ArrowUpRight,
    DollarSign,
    Users,
    Info,
    PieChart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

// Sample Investments data
const investmentsData = [
    { id: "INV-5001", user: "Rahul Sharma", plan: "Blue Chip Index", amount: "₹25,000", returns: "+12.5%", status: "active", date: "Jan 12, 2024", maturity: "Jan 12, 2025" },
    { id: "INV-5002", user: "Sneha Patel", plan: "Tech Growth Fund", amount: "₹50,000", returns: "+18.2%", status: "active", date: "Feb 01, 2024", maturity: "Feb 01, 2025" },
    { id: "INV-5003", user: "Amit Kumar", plan: "Conservative Bonds", amount: "₹1,00,000", returns: "+6.8%", status: "completed", date: "Dec 15, 2022", maturity: "Dec 15, 2023" },
    { id: "INV-5004", user: "Priya Singh", plan: "Global Equity", amount: "₹15,000", returns: "+9.4%", status: "active", date: "Jan 28, 2024", maturity: "Jan 28, 2025" },
    { id: "INV-5005", user: "Vikram Roy", plan: "High Yield Index", amount: "₹30,000", returns: "-2.4%", status: "active", date: "Feb 10, 2024", maturity: "Feb 10, 2025" },
    { id: "INV-5006", user: "Karan Mehta", plan: "Blue Chip Index", amount: "₹75,000", returns: "+11.1%", status: "active", date: "Jan 05, 2024", maturity: "Jan 05, 2025" },
];

function StatusBadge({ status }) {
    if (status === "active") {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-medium py-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Active
            </Badge>
        );
    }
    if (status === "completed") {
        return (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 font-medium py-0.5">
                <Clock className="w-3 h-3" />
                Completed
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 gap-1 font-medium py-0.5">
            <XCircle className="w-3 h-3" />
            Closed
        </Badge>
    );
}

// Added CheckCircle2 for the badge
function CheckCircle2(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}

export default function InvestmentsManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedInv, setSelectedInv] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const stats = [
        { title: "Active Assets", value: "₹2.4 Cr", icon: TrendingUp, color: "text-white", bg: "bg-blue-600" },
        { title: "Today's Profit", value: "+₹14,200", icon: BadgePercent, color: "text-white", bg: "bg-green-600" },
        { title: "Total Users", value: "1,240", icon: Users, color: "text-white", bg: "bg-purple-600" },
        { title: "Pending Exit", value: "4", icon: Clock, color: "text-white", bg: "bg-red-600" },
    ];

    const handleViewDetails = (inv) => {
        setSelectedInv(inv);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            <TooltipProvider>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">User Investments</h1>
                        <p className="text-sm text-gray-500 mt-1">Monitor and manage all active investment portfolios.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-9">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button size="sm" className="h-9 bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Entry
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="border-none shadow-sm py-2">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">{stat.title}</p>
                                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <Card className="border-none shadow-sm overflow-hidden py-2">
                    <CardHeader className="bg-white px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
                        <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            Global Portfolios
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full sm:w-60">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <Input
                                    placeholder="Search user or plan..."
                                    className="pl-9 h-9 text-xs border-gray-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="h-9 border-gray-200 text-xs text-gray-600">
                                <Filter className="w-3.5 h-3.5 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase px-6">Investor</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Plan Name</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Principal</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Current ROI</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Status</TableHead>
                                    <TableHead className="text-right px-6 text-xs font-bold text-gray-500 uppercase">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {investmentsData.map((inv) => (
                                    <TableRow key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <TableCell className="px-6">
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{inv.user}</p>
                                                <p className="text-[10px] text-gray-400 font-mono">{inv.id}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-100 uppercase tracking-tight">
                                                {inv.plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-gray-900">{inv.amount}</TableCell>
                                        <TableCell>
                                            <span className={`text-[11px] font-bold ${inv.returns.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                {inv.returns}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={inv.status} />
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                                                            onClick={() => handleViewDetails(inv)}
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px]">Performance Detail</TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600 hover:bg-indigo-50">
                                                            <PieChart className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px]">Rebalance</TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {investmentsData.map((inv) => (
                            <div key={inv.id} className="p-4 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{inv.user}</p>
                                        <p className="text-[10px] text-gray-400 font-mono tracking-tight">{inv.id}</p>
                                    </div>
                                    <StatusBadge status={inv.status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="text-[10px] font-bold bg-blue-50 text-blue-600 border-none px-2 py-0.5">
                                        {inv.plan}
                                    </Badge>
                                    <p className="text-sm font-black text-gray-900">{inv.amount}</p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Growth:</span>
                                        <span className={`text-[11px] font-black ${inv.returns.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                                            {inv.returns}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold" onClick={() => handleViewDetails(inv)}>
                                            Details
                                        </Button>
                                        <Button variant="outline" size="sm" className="h-7 w-7 p-0 flex items-center justify-center text-blue-600">
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <CardFooter className="bg-white border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[11px] text-gray-500 font-medium">
                            Monitoring <span className="text-gray-900 font-bold">452</span> active portfolios
                        </p>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-[11px] font-bold" disabled>
                                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-[11px] font-bold">
                                Next Page
                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </TooltipProvider>

            {/* Investment Detail Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="p-0 sm:max-w-xl border-l overflow-y-auto">
                    {selectedInv && (
                        <div className="flex flex-col h-full bg-slate-50/10">
                            <SheetHeader className="p-6 border-b bg-white">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl rotate-3">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <SheetTitle className="text-xl font-black text-gray-900">{selectedInv.plan}</SheetTitle>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-widest">{selectedInv.id}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <StatusBadge status={selectedInv.status} />
                                            <span className="text-[10px] font-bold text-green-600 px-2 py-0.5 bg-green-50 rounded-full">
                                                ROI: {selectedInv.returns}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="p-6 space-y-6">
                                {/* Profit Card */}
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute right-[-20px] top-[-20px] opacity-10">
                                        <Briefcase className="w-40 h-40" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Current Value</p>
                                        <h2 className="text-3xl font-black tracking-tighter mb-4">₹{(parseInt(selectedInv.amount.replace(/[^0-9]/g, '')) * 1.12).toLocaleString('en-IN')}</h2>
                                        <div className="flex gap-4">
                                            <div className="flex-1 p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                                                <p className="text-[8px] font-bold uppercase opacity-50 mb-1">Invested</p>
                                                <p className="text-sm font-black">{selectedInv.amount}</p>
                                            </div>
                                            <div className="flex-1 p-3 rounded-2xl bg-white/10 backdrop-blur-md">
                                                <p className="text-[8px] font-bold uppercase opacity-50 mb-1">Total ROI</p>
                                                <p className="text-sm font-black text-green-400">{selectedInv.returns}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Breakdown */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <PieChart className="w-3 h-3" />
                                        Portfolio Breakdown
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: "Global Stocks", weight: "45%", color: "bg-blue-600" },
                                            { name: "US Tech", weight: "30%", color: "bg-indigo-600" },
                                            { name: "Emerging Markets", weight: "15%", color: "bg-purple-600" },
                                            { name: "Treasury Bonds", weight: "10%", color: "bg-slate-400" },
                                        ].map((asset) => (
                                            <div key={asset.name} className="flex items-center gap-3">
                                                <div className={`w-1 h-8 rounded-full ${asset.color}`} />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-gray-700">{asset.name}</span>
                                                        <span className="text-xs font-black text-gray-900">{asset.weight}</span>
                                                    </div>
                                                    <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                                                        <div className={`h-full ${asset.color}`} style={{ width: asset.weight }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Investment Lifecycle
                                    </h3>
                                    <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="text-center flex-1">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Start Date</p>
                                                <p className="text-xs font-black text-gray-900">{selectedInv.date}</p>
                                            </div>
                                            <div className="w-8 h-px bg-gray-100" />
                                            <div className="text-center flex-1">
                                                <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Maturity</p>
                                                <p className="text-xs font-black text-gray-900">{selectedInv.maturity}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1.5 px-1">
                                                <span>Days Passed: 24</span>
                                                <span className="text-blue-600">341 Days left</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-gray-50 overflow-hidden border border-gray-100">
                                                <div className="h-full bg-blue-600 rounded-full" style={{ width: "7%" }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Link */}
                                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-700 font-black text-xs shadow-sm">
                                        {selectedInv.user[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-indigo-900">{selectedInv.user}</p>
                                        <p className="text-[10px] text-indigo-600 font-medium">Verified Investor Portfolio</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-indigo-600 group">
                                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </div>
                            </div>

                            {/* Sticky Footer */}
                            <div className="mt-auto p-4 border-t bg-white flex gap-3">
                                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-xs font-black h-12 shadow-[0_8px_30px_rgb(79,70,229,0.15)]">
                                    <BadgePercent className="w-4 h-4 mr-2" />
                                    Add Manual Returns
                                </Button>
                                <Button variant="outline" className="flex-1 text-red-600 border-red-100 hover:bg-red-50 text-xs font-black h-12">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Terminate Plan
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
