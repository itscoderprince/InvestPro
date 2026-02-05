"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Calendar,
    ArrowRight,
    Search,
    Filter,
    Home,
    ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

// Sample Data
const investments = [
    {
        id: "INV-8821",
        indexName: "Tech Growth Index",
        amount: 15000,
        returns: 675,
        growth: "+4.5%",
        status: "active",
        date: "12 Jan 2024",
        nextPayout: "05 Feb 2024",
    },
    {
        id: "INV-7712",
        indexName: "Stability Index",
        amount: 10000,
        returns: 320,
        growth: "+3.2%",
        status: "active",
        date: "05 Jan 2024",
        nextPayout: "05 Feb 2024",
    },
    {
        id: "INV-6654",
        indexName: "High Yield Index",
        amount: 25000,
        returns: 1250,
        growth: "+5.0%",
        status: "pending",
        date: "28 Jan 2024",
        nextPayout: "Pending Verification",
    },
    {
        id: "INV-5541",
        indexName: "Balanced Index",
        amount: 7500,
        returns: 285,
        growth: "+3.8%",
        status: "closed",
        date: "01 Dec 2023",
        nextPayout: "N/A",
    },
];

const statusStyles = {
    active: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    closed: "bg-gray-100 text-gray-500 border-gray-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function InvestmentsPage() {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const filteredInvestments = investments.filter(inv => {
        const matchesSearch = inv.indexName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            inv.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" || inv.status === activeTab;
        return matchesSearch && matchesTab;
    });

    const totalInvested = investments.reduce((acc, inv) => acc + (inv.status !== 'rejected' ? inv.amount : 0), 0);
    const totalReturns = investments.reduce((acc, inv) => acc + (inv.status === 'active' || inv.status === 'closed' ? inv.returns : 0), 0);

    return (
        <div className="space-y-4 md:space-y-6 max-w-7xl mx-auto pt-0 pb-2 md:pb-4 px-2 md:px-1">
            {/* Compact Breadcrumb Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Breadcrumb>
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
                                Investments
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center gap-3">
                    <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 font-black text-[11px] uppercase tracking-wider shadow-md shadow-blue-500/20 h-8 px-4">
                        <Link href="/invest">
                            <ArrowRight className="w-3.5 h-3.5 mr-2" />
                            Invest More
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Pending Investment Card */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-amber-50 dark:bg-amber-500/5 border-2 border-amber-500/20 rounded-[2rem] p-6 md:p-8 relative overflow-hidden group shadow-xl shadow-amber-500/5"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-amber-500 text-white border-none font-black text-[10px] uppercase tracking-widest px-2 h-5">New Request</Badge>
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest px-2 py-0.5 rounded-md bg-amber-500/10">Payment Pending</span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tech Growth Index • ₹25,000</h3>
                            <p className="text-sm font-bold text-amber-700/60 uppercase tracking-widest mt-1">23 hours 45 minutes left to complete payment</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl h-12 px-8 uppercase tracking-widest text-[10px] shadow-lg shadow-amber-500/20" asChild>
                            <Link href="/invest/track/PAY-123456">Upload Payment Proof</Link>
                        </Button>
                        <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50 font-black rounded-xl h-12 px-4" asChild>
                            <Link href="/invest/track/PAY-123456">Details</Link>
                        </Button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white overflow-hidden group p-3">
                    <CardContent className="p-6 py-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Invested</p>
                                <h3 className="text-2xl font-black text-gray-900">₹{totalInvested.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Wallet className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="h-1 w-full bg-blue-600" />
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Accumulated Returns</p>
                                <h3 className="text-2xl font-black text-green-600">₹{totalReturns.toLocaleString()}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="h-1 w-full bg-green-600" />
                </Card>

                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Portfolios</p>
                                <h3 className="text-2xl font-black text-gray-900">{investments.filter(i => i.status === 'active').length}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                    <div className="h-1 w-full bg-purple-600" />
                </Card>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-fit">
                        <TabsList className="bg-gray-100/80 p-1 rounded-xl h-11">
                            <TabsTrigger value="all" className="rounded-lg font-bold px-6 h-9">All</TabsTrigger>
                            <TabsTrigger value="active" className="rounded-lg font-bold px-6 h-9">Active</TabsTrigger>
                            <TabsTrigger value="pending" className="rounded-lg font-bold px-6 h-9">Pending</TabsTrigger>
                            <TabsTrigger value="closed" className="rounded-lg font-bold px-6 h-9">Closed</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search investments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 border-gray-200 rounded-xl"
                        />
                    </div>
                </div>

                <Card className="border-none shadow-sm overflow-hidden bg-white">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="border-none hover:bg-transparent">
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400 py-4">Index Name</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400 py-4">Amount</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400 py-4">Total Returns</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400 py-4 text-center">Status</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400 py-4">Date</TableHead>
                                <TableHead className="font-bold text-[10px] uppercase tracking-widest text-gray-400 py-4 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvestments.length > 0 ? (
                                filteredInvestments.map((inv) => (
                                    <TableRow key={inv.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{inv.indexName}</span>
                                                <span className="text-[10px] font-bold text-gray-400">{inv.id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="font-black text-gray-900 leading-none">₹{inv.amount.toLocaleString()}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-green-600 leading-none">₹{inv.returns.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold text-green-500 bg-green-50 w-fit px-1.5 rounded mt-1">{inv.growth}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            <Badge variant="outline" className={`${statusStyles[inv.status]} font-black text-[9px] uppercase tracking-tighter px-2 h-5 rounded-md`}>
                                                {inv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                {inv.date}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-blue-50 hover:text-blue-600">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Filter className="w-6 h-6 text-gray-200" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-gray-900">No investments found</p>
                                                <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setActiveTab("all"); }} className="font-bold">Clear Filters</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* Payout Information */}
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex gap-5">
                        <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-amber-900">Upcoming Payout Cycle</h2>
                            <p className="text-amber-800/70 text-sm max-w-md mt-1 font-medium italic">
                                Monday, Feb 5th • All weekly profits will be automatically credited to your wallet for withdrawal.
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-amber-200 text-amber-900 hover:bg-amber-100 font-black h-12 px-8">
                        View Payout Schedule
                    </Button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            </div>
        </div>
    );
}
