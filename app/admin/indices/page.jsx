"use client";

import * as React from "react";
import { useState } from "react";
import {
    Search,
    Database,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Plus,
    Edit,
    Trash2,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Layers,
    Activity,
    Eye,
    ChevronLeft,
    ChevronRight,
    Settings2,
    Lock,
    Unlock,
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



function StatusBadge({ status }) {
    if (status === "active") {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-medium py-0.5">
                <CheckCircle className="w-3 h-3" />
                Active
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 gap-1 font-medium py-0.5">
            <Lock className="w-3 h-3" />
            Hidden
        </Badge>
    );
}

function VolatilityBadge({ level }) {
    const colors = {
        "Very Low": "bg-blue-50 text-blue-700 border-blue-100",
        "Low": "bg-cyan-50 text-cyan-700 border-cyan-100",
        "Medium": "bg-yellow-50 text-yellow-700 border-yellow-100",
        "High": "bg-orange-50 text-orange-700 border-orange-100",
        "Very High": "bg-red-50 text-red-700 border-red-100"
    };
    return (
        <Badge variant="outline" className={`${colors[level]} text-[10px] font-bold border py-0.5`}>
            {level}
        </Badge>
    );
}

import { useAdminIndices } from "@/hooks/useApi";

export default function IndicesManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    const { indices: apiIndices, pagination, loading, error, refetch } = useAdminIndices({
        page: currentPage,
        limit: perPage,
        search: searchQuery
    });

    const [selectedIdx, setSelectedIdx] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const stats = [
        { title: "Active Indices", value: pagination?.total || 0, icon: Database, color: "text-white", bg: "bg-blue-600" },
        { title: "Avg Return", value: apiIndices.length ? `${(apiIndices.reduce((acc, curr) => acc + curr.currentReturnRate, 0) / apiIndices.length).toFixed(1)}%` : "—", icon: TrendingUp, color: "text-white", bg: "bg-green-600" },
        { title: "Asset Classes", value: [...new Set(apiIndices.map(i => i.category))].length || 0, icon: Layers, color: "text-white", bg: "bg-purple-600" },
        { title: "Visible", value: apiIndices.filter(i => i.isActive).length, icon: Activity, color: "text-white", bg: "bg-red-600" },
    ];

    const indicesData = apiIndices || [];
    const totalPages = pagination?.pages || 1;

    const handleViewDetails = (idx) => {
        setSelectedIdx(idx);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            <TooltipProvider>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Investment Indices</h1>
                        <p className="text-sm text-gray-500 mt-1">Configure asset buckets and target return rates.</p>
                    </div>
                    <Button size="sm" className="h-10 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Index
                    </Button>
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
                            <Layers className="w-4 h-4 text-blue-600" />
                            Active Asset Buckets
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <div className="relative w-full sm:w-60">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <Input
                                    placeholder="Filter by name or class..."
                                    className="pl-9 h-9 text-xs border-gray-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="sm" className="h-9 border-gray-200">
                                <Filter className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/20">
                                <TableRow>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase px-6">Index Name</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Category</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Min Invest</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Est. Returns</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Volatility</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Active?</TableHead>
                                    <TableHead className="text-right px-6 text-xs font-bold text-gray-500 uppercase">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {indicesData.map((idx) => (
                                    <TableRow key={idx.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <TableCell className="px-6">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{idx.name}</p>
                                                <p className="text-[10px] text-gray-400 font-mono">{idx.slug}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{idx.category}</span>
                                        </TableCell>
                                        <TableCell className="text-xs font-black text-gray-900">{idx.minInvestmentFormatted || `₹${idx.minInvestment.toLocaleString()}`}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <TrendingUp className="w-3 h-3" />
                                                <span className="text-[11px] font-black">{idx.currentReturnRate}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <VolatilityBadge level={idx.riskLevel} />
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={idx.isActive ? 'active' : 'inactive'} />
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                            onClick={() => handleViewDetails(idx)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px]">Edit Config</TooltipContent>
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
                        {indicesData.map((idx) => (
                            <div key={idx.id} className="p-4 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{idx.name}</p>
                                        <p className="text-[10px] text-gray-400 font-mono tracking-tight">{idx.id}</p>
                                    </div>
                                    <StatusBadge status={idx.status} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Min Investment</p>
                                        <p className="text-sm font-black text-gray-900">{idx.minInvest}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. ROI</p>
                                        <div className="flex items-center gap-1 text-green-600 font-black text-sm">
                                            {idx.returns}
                                            <ArrowUpRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <VolatilityBadge level={idx.volatility} />
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold" onClick={() => handleViewDetails(idx)}>
                                            <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                                            Configure
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <CardFooter className="bg-white border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[11px] text-gray-500 font-medium">
                            Total <span className="text-gray-900 font-bold">{pagination?.total || indicesData.length}</span> index configurations
                        </p>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-[11px] font-bold" disabled>
                                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-[11px] font-bold">
                                Next
                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </TooltipProvider>

            {/* Index Configuration Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="p-0 sm:max-w-xl border-l overflow-y-auto">
                    {selectedIdx && (
                        <div className="flex flex-col h-full bg-slate-50/50">
                            <SheetHeader className="p-6 border-b bg-white shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg overflow-hidden relative">
                                        <div className="absolute inset-0 bg-white/10" />
                                        <Layers className="w-6 h-6 relative z-10" />
                                    </div>
                                    <div className="min-w-0">
                                        <SheetTitle className="text-xl font-black text-gray-900">{selectedIdx.name}</SheetTitle>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-[0.2em]">{selectedIdx.id}</p>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="p-6 space-y-8">
                                {/* Core Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                        <Settings2 className="w-3.5 h-3.5" />
                                        Index Core Configuration
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Asset Class</p>
                                            <p className="text-sm font-black text-gray-900 capitalize">{selectedIdx.category}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-blue-100 group">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Volatility</p>
                                            <VolatilityBadge level={selectedIdx.riskLevel} />
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Entry Barrier</p>
                                            <p className="text-sm font-black text-blue-600">{selectedIdx.minInvestmentFormatted || `₹${selectedIdx.minInvestment.toLocaleString()}`}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Target Yield</p>
                                            <p className="text-sm font-black text-green-600">{selectedIdx.currentReturnRate}%</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Active Controls */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5" />
                                        Visibility & Permissions
                                    </h3>
                                    <div className="p-5 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black text-gray-900">Market Visibility</p>
                                                <p className="text-[10px] text-gray-500 font-medium mt-0.5">Allow users to discover and invest</p>
                                            </div>
                                            <Button variant={selectedIdx.isActive ? 'default' : 'outline'} size="sm" className={`h-8 px-4 rounded-full text-[10px] font-black ${selectedIdx.isActive ? 'bg-green-600 hover:bg-green-700' : ''}`}>
                                                {selectedIdx.isActive ? 'ENABLED' : 'DISABLED'}
                                            </Button>
                                        </div>
                                        <div className="h-px bg-gray-50" />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-black text-gray-900">Auto-Compounding</p>
                                                <p className="text-[10px] text-gray-500 font-medium mt-0.5">Automatically reinvest distributed profits</p>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-8 px-4 rounded-full text-[10px] font-black text-blue-600 border-blue-100">
                                                ACTIVE
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk assessment */}
                                <div className="p-5 rounded-3xl bg-indigo-900 text-white shadow-xl relative overflow-hidden group">
                                    <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12 transition-transform group-hover:rotate-0">
                                        <Activity className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Badge className="bg-white/20 hover:bg-white/20 border-none text-[8px] font-black tracking-[0.2em]">RISK ADVISORY</Badge>
                                            <span className="text-[9px] font-bold opacity-60">ID: {selectedIdx.slug}</span>
                                        </div>
                                        <p className="text-xs font-medium leading-relaxed opacity-80">
                                            Current market volatility in <strong>{selectedIdx.category}</strong> is within optimized limits for the requested <strong>{selectedIdx.currentReturnRate}%</strong> return yield.
                                        </p>
                                        <Button variant="ghost" className="w-full text-white bg-white/10 hover:bg-white/20 text-[10px] font-black h-9 rounded-xl">
                                            View Real-time Analytics
                                            <ArrowUpRight className="w-3.5 h-3.5 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="mt-auto p-4 border-t bg-white flex gap-3">
                                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs font-black h-12 shadow-lg shadow-blue-100">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                                <Button variant="outline" className="flex-1 text-red-600 border-red-100 hover:bg-red-50 text-xs font-black h-12">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Archive Index
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
