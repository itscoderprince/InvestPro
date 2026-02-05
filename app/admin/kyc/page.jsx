"use client";

import * as React from "react";
import { useState } from "react";
import {
    Search,
    FileCheck,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Download,
    Eye,
    Check,
    X,
    CheckCircle2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Shield,
    User,
    FileText,
    AlertCircle,
    Info,
    ArrowUpRight,
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

// Sample KYC data
const kycRequests = [
    { id: "KYC-8801", user: "Rahul Sharma", email: "rahul@email.com", type: "Aadhar Card", docNumber: "XXXX-XXXX-1234", level: "Level 1", status: "pending", date: "10 min ago" },
    { id: "KYC-8802", user: "Priya Singh", email: "priya@email.com", type: "PAN Card", docNumber: "XXXXX1234X", level: "Level 2", status: "pending", date: "25 min ago" },
    { id: "KYC-8803", user: "Amit Kumar", email: "amit@email.com", type: "Passport", docNumber: "Z1234567", level: "Level 1", status: "approved", date: "2 hours ago" },
    { id: "KYC-8804", user: "Sneha Patel", email: "sneha@email.com", type: "Voter ID", docNumber: "ABC1234567", level: "Level 1", status: "pending", date: "4 hours ago" },
    { id: "KYC-8805", user: "Vikram Roy", email: "vikram@email.com", type: "Aadhar Card", docNumber: "XXXX-XXXX-9876", level: "Level 2", status: "rejected", date: "5 hours ago" },
    { id: "KYC-8806", user: "Anita Gupta", email: "anita@email.com", type: "PAN Card", docNumber: "XXXXX9876X", level: "Level 1", status: "approved", date: "Yesterday" },
];

function StatusBadge({ status }) {
    if (status === "approved") {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-medium py-0.5">
                <CheckCircle2 className="w-3 h-3" />
                Approved
            </Badge>
        );
    }
    if (status === "rejected") {
        return (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 font-medium py-0.5">
                <XCircle className="w-3 h-3" />
                Rejected
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 font-medium py-0.5">
            <Clock className="w-3 h-3" />
            Pending
        </Badge>
    );
}

export default function KYCManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const stats = [
        { title: "Total Pending", value: "24", icon: Clock, color: "text-white", bg: "bg-blue-600" },
        { title: "Verified Today", value: "12", icon: CheckCircle, color: "text-white", bg: "bg-green-600" },
        { title: "Level 2 Requests", value: "8", icon: Shield, color: "text-white", bg: "bg-purple-600" },
        { title: "Rejections", value: "3", icon: XCircle, color: "text-white", bg: "bg-red-600" },
    ];

    const handleViewDetails = (kyc) => {
        setSelectedKyc(kyc);
        setIsSheetOpen(true);
    };

    return (
        <div className="space-y-6">
            {!mounted ? (
                <div className="h-96 flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">KYC Verification</h1>
                            <p className="text-sm text-gray-500 mt-1">Review and approve user identity documents.</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-9">
                            <Download className="w-4 h-4 mr-2" />
                            Export Requests
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
                    <Card className="border-none shadow-sm overflow-hidden py-1">
                        <CardHeader className="bg-white px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
                            <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-blue-600" />
                                Identity Verification Requests
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative w-full sm:w-60">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <Input
                                        placeholder="Search user or ID..."
                                        className="pl-9 h-9 text-xs border-gray-200"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="h-9 border-gray-200 text-xs">
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
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase px-6">User</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase">Document Type</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase">ID Number</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase">Level</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase">Status</TableHead>
                                        <TableHead className="text-xs font-bold text-gray-500 uppercase">Submitted</TableHead>
                                        <TableHead className="text-right px-6 text-xs font-bold text-gray-500 uppercase">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {kycRequests.map((req) => (
                                        <TableRow key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="px-6">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-gray-900 truncate">{req.user}</p>
                                                    <p className="text-[10px] text-gray-400 truncate">{req.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-[11px] font-medium text-gray-700">{req.type}</TableCell>
                                            <TableCell className="text-[10px] font-mono text-gray-500">{req.docNumber}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-[10px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-100">
                                                    {req.level}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={req.status} />
                                            </TableCell>
                                            <TableCell className="text-[10px] text-gray-500">{req.date}</TableCell>
                                            <TableCell className="text-right px-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-blue-600 hover:bg-blue-50"
                                                                onClick={() => handleViewDetails(req)}
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">View Proof</TooltipContent>
                                                    </Tooltip>
                                                    {req.status === "pending" && (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:bg-green-50">
                                                                        <Check className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="text-[10px]">Approve</TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:bg-red-50">
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="text-[10px]">Reject</TooltipContent>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-gray-100">
                            {kycRequests.map((req) => (
                                <div key={req.id} className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{req.user}</p>
                                            <p className="text-[10px] text-gray-400">{req.email}</p>
                                        </div>
                                        <StatusBadge status={req.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                        <div>
                                            <p className="text-gray-400 uppercase tracking-wider text-[9px] font-bold">Document</p>
                                            <p className="font-semibold text-gray-700">{req.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 uppercase tracking-wider text-[9px] font-bold">Level</p>
                                            <p className="font-semibold text-blue-600">{req.level}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {req.date}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold" onClick={() => handleViewDetails(req)}>
                                                Details
                                            </Button>
                                            {req.status === "pending" && (
                                                <Button variant="default" size="sm" className="h-7 text-[10px] font-bold bg-green-600">
                                                    Approve
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <CardFooter className="bg-white border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-[11px] text-gray-500 font-medium font-mono">
                                Page <span className="text-gray-900 font-bold">1</span> of 5
                            </p>
                            <div className="flex items-center gap-1">
                                <Button variant="outline" size="sm" className="h-8 px-2 text-[11px] font-bold" disabled>
                                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                    Prev
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 px-2 text-[11px] font-bold">
                                    Next
                                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </>
            )}

            {/* KYC Detail Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="p-0 sm:max-w-xl">
                    {selectedKyc && (
                        <div className="flex flex-col h-full">
                            <SheetHeader className="p-6 border-b bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <SheetTitle className="text-lg font-bold">{selectedKyc.user}</SheetTitle>
                                        <p className="text-[10px] text-gray-400 font-mono">{selectedKyc.id}</p>
                                    </div>
                                </div>
                            </SheetHeader>
                            <div className="p-6 space-y-8 overflow-y-auto flex-1">
                                {/* Verification Status */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-yellow-600" />
                                        <p className="text-sm font-bold text-yellow-700">Verification Pending</p>
                                    </div>
                                    <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-200 border-none font-bold text-[10px]">
                                        Manual Review
                                    </Badge>
                                </div>

                                {/* User Info */}
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Info className="w-3.5 h-3.5" />
                                        Submission Details
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-medium">Document Type</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedKyc.type}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-medium">ID Number</p>
                                            <p className="text-sm font-bold text-gray-900 font-mono">{selectedKyc.docNumber}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-medium">KYC Level</p>
                                            <p className="text-sm font-bold text-blue-600">{selectedKyc.level}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-gray-400 font-medium">Submitted At</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedKyc.date}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Document Preview */}
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" />
                                        Document Proof
                                    </h3>
                                    <div className="aspect-video w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2">
                                        <FileCheck className="w-10 h-10 text-gray-300" />
                                        <p className="text-xs font-bold text-gray-400">Preview not available in demo</p>
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">
                                            Open Full Resolution
                                            <ArrowUpRight className="w-3 h-3 ml-1.5" />
                                        </Button>
                                    </div>
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                                        <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                                            Verify that the name on the document matches the user profile name <strong>{selectedKyc.user}</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t bg-white flex gap-3">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-xs font-bold h-10">
                                    <Check className="w-4 h-4 mr-2" />
                                    Verify Documents
                                </Button>
                                <Button variant="outline" className="flex-1 text-red-600 border-red-100 hover:bg-red-50 text-xs font-bold h-10">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject KYC
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
