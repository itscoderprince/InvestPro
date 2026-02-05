"use client";

import * as React from "react";
import { useState } from "react";
import {
    Search,
    Users,
    CheckCircle,
    TrendingUp,
    XCircle,
    Filter,
    Download,
    Eye,
    Edit,
    Mail,
    Phone,
    Shield,
    Trash2,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    CheckCircle2,
    ShieldAlert,
    UserCheck,
    UserMinus,
    Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
    SheetFooter,
} from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

// Sample users data
const usersData = [
    { id: "USR-1001", name: "Rahul Sharma", email: "rahul@email.com", phone: "+91 98765 43210", kycStatus: "approved", totalInvested: 45000, activeInvestments: 2, registrationDate: "2024-01-15", accountStatus: "active", lastLogin: "2 min ago", avatar: null },
    { id: "USR-1002", name: "Priya Singh", email: "priya@email.com", phone: "+91 87654 32109", kycStatus: "approved", totalInvested: 25000, activeInvestments: 1, registrationDate: "2024-01-18", accountStatus: "active", lastLogin: "1 hour ago", avatar: null },
    { id: "USR-1003", name: "Amit Kumar", email: "amit@email.com", phone: "+91 76543 21098", kycStatus: "pending", totalInvested: 0, activeInvestments: 0, registrationDate: "2024-01-25", accountStatus: "active", lastLogin: "5 hours ago", avatar: null },
    { id: "USR-1004", name: "Sneha Patel", email: "sneha@email.com", phone: "+91 65432 10987", kycStatus: "approved", totalInvested: 80000, activeInvestments: 3, registrationDate: "2024-01-10", accountStatus: "active", lastLogin: "Yesterday", avatar: null },
    { id: "USR-1005", name: "Vikram Roy", email: "vikram@email.com", phone: "+91 54321 09876", kycStatus: "rejected", totalInvested: 0, activeInvestments: 0, registrationDate: "2024-01-20", accountStatus: "active", lastLogin: "2 days ago", avatar: null },
    { id: "USR-1006", name: "Anita Gupta", email: "anita@email.com", phone: "+91 43210 98765", kycStatus: "approved", totalInvested: 15000, activeInvestments: 1, registrationDate: "2024-01-12", accountStatus: "blocked", lastLogin: "1 week ago", avatar: null },
];

// Format number
function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// KYC Status Badge with icons
function KYCBadge({ status }) {
    if (status === "approved") {
        return (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1 font-medium whitespace-nowrap">
                <CheckCircle2 className="w-3 h-3" />
                Approved
            </Badge>
        );
    }
    if (status === "rejected") {
        return (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 font-medium whitespace-nowrap">
                <XCircle className="w-3 h-3" />
                Rejected
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1 font-medium whitespace-nowrap">
            <Clock className="w-3 h-3" />
            Pending
        </Badge>
    );
}

// Account Status Badge with icons
function AccountStatusBadge({ status }) {
    if (status === "active") {
        return (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1 font-medium whitespace-nowrap">
                <UserCheck className="w-3 h-3" />
                Active
            </Badge>
        );
    }
    return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 gap-1 font-medium whitespace-nowrap">
            <ShieldAlert className="w-3 h-3 text-red-500" />
            Blocked
        </Badge>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState(usersData);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        kycStatus: "all",
        accountStatus: "all",
        investmentRange: 0,
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailSheetOpen, setDetailSheetOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 10;

    // Stats
    const stats = {
        total: users.length,
        kycVerified: users.filter((u) => u.kycStatus === "approved").length,
        activeInvestors: users.filter((u) => u.totalInvested > 0).length,
        blocked: users.filter((u) => u.accountStatus === "blocked").length,
    };

    // Filter users
    const filteredUsers = users.filter((u) => {
        const matchesSearch = !searchQuery ||
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.phone.includes(searchQuery) ||
            u.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesKyc = filters.kycStatus === "all" || u.kycStatus === filters.kycStatus;
        const matchesAccount = filters.accountStatus === "all" || u.accountStatus === filters.accountStatus;
        const matchesRange = u.totalInvested >= filters.investmentRange;
        return matchesSearch && matchesKyc && matchesAccount && matchesRange;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / perPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(paginatedUsers.map((u) => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id, checked) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((i) => i !== id));
        }
    };

    const toggleUserStatus = (user) => {
        const newStatus = user.accountStatus === "active" ? "blocked" : "active";
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, accountStatus: newStatus } : u));
    };

    const deleteUser = (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };

    const viewUserDetail = (user) => {
        setSelectedUser(user);
        setDetailSheetOpen(true);
    };

    const statsConfig = [
        { title: "Total Users", value: stats.total, icon: Users, color: "text-white", bg: "bg-blue-600" },
        { title: "KYC Verified", value: stats.kycVerified, icon: CheckCircle, color: "text-white", bg: "bg-green-600" },
        { title: "Active Investors", value: stats.activeInvestors, icon: TrendingUp, color: "text-white", bg: "bg-purple-600" },
        { title: "Blocked Accounts", value: stats.blocked, icon: XCircle, color: "text-white", bg: "bg-red-600" },
    ];

    return (
        <div className="space-y-6">
            <TooltipProvider>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Users Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage platform users, verify KYC, and track investments.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statsConfig.map((stat) => (
                        <Card key={stat.title} className="border-none shadow-sm py-2">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}>
                                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">{stat.title}</p>
                                    <p className="text-xl font-bold text-gray-900">{formatNumber(stat.value)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="border-none shadow-sm overflow-hidden py-2">
                    <CardHeader className="bg-white px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
                        <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            All Platform Users
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="relative w-full sm:w-60">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <Input
                                    placeholder="Search name, email, id..."
                                    className="pl-9 h-9 text-xs border-gray-200"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 w-full sm:w-auto border-gray-200 text-xs"
                                onClick={() => setShowFilters(true)}
                            >
                                <Filter className="w-3.5 h-3.5 mr-2" />
                                Filters
                                {(filters.kycStatus !== "all" || filters.accountStatus !== "all" || filters.investmentRange > 0) && (
                                    <span className="ml-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                )}
                            </Button>
                        </div>
                    </CardHeader>

                    {/* Table View (Desktop) */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="w-12 px-6">
                                        <Checkbox
                                            checked={selectedIds.length === paginatedUsers.length && paginatedUsers.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">User</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Contact</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">KYC Status</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Investments</TableHead>
                                    <TableHead className="text-xs font-bold text-gray-500 uppercase">Status</TableHead>
                                    <TableHead className="text-right px-6 text-xs font-bold text-gray-500 uppercase">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <TableCell className="px-6">
                                                <Checkbox
                                                    checked={selectedIds.includes(user.id)}
                                                    onCheckedChange={(checked) => handleSelect(user.id, checked)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold shrink-0 uppercase">
                                                        {user.name.split(" ").map(n => n[0]).join("")}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-mono">{user.id}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5 min-w-[140px]">
                                                    <p className="text-[11px] font-medium text-gray-700 flex items-center gap-1.5">
                                                        <Mail className="w-3 h-3 text-gray-400" />
                                                        {user.email}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                                                        <Phone className="w-3 h-3 text-gray-400" />
                                                        {user.phone}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <KYCBadge status={user.kycStatus} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold text-gray-900">₹{formatNumber(user.totalInvested)}</p>
                                                    <p className="text-[10px] text-gray-500">{user.activeInvestments} Active</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <AccountStatusBadge status={user.accountStatus} />
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                                onClick={() => viewUserDetail(user)}
                                                            >
                                                                <Eye className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">View Detail</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">Edit User</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className={`h-7 w-7 ${user.accountStatus === 'active' ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                                                                onClick={() => toggleUserStatus(user)}
                                                            >
                                                                {user.accountStatus === 'active' ? <ShieldAlert className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">{user.accountStatus === 'active' ? 'Block User' : 'Unblock User'}</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => deleteUser(user.id)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="text-[10px]">Delete User</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Users className="w-10 h-10 text-gray-200 mb-3" />
                                                <p className="font-medium">No users found</p>
                                                <p className="text-xs">Try adjusting your filters or search.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Card View (Mobile) */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                                <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0 uppercase">
                                                {user.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-[10px] text-gray-400 font-mono">{user.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600"
                                                onClick={() => viewUserDetail(user)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-indigo-600"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">KYC Status</p>
                                            <KYCBadge status={user.kycStatus} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Account Status</p>
                                            <AccountStatusBadge status={user.accountStatus} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Contact</p>
                                            <p className="text-[11px] text-gray-600 truncate">{user.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Invested</p>
                                            <p className="text-xs font-bold text-gray-900">₹{formatNumber(user.totalInvested)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`flex-1 h-8 text-[11px] font-bold ${user.accountStatus === 'active' ? 'text-orange-600 border-orange-100' : 'text-green-600 border-green-100'}`}
                                            onClick={() => toggleUserStatus(user)}
                                        >
                                            {user.accountStatus === 'active' ? <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> : <UserCheck className="w-3.5 h-3.5 mr-1.5" />}
                                            {user.accountStatus === 'active' ? 'Block' : 'Unblock'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 h-8 text-[11px] font-bold text-red-600 border-red-100"
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <p className="text-sm">No users match your criteria.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <CardFooter className="bg-white border-t px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[11px] text-gray-500 font-medium">
                            Showing <span className="text-gray-900 font-bold">{(currentPage - 1) * perPage + 1}-{Math.min(currentPage * perPage, filteredUsers.length)}</span> of <span className="text-gray-900 font-bold">{filteredUsers.length}</span> users
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[11px] font-bold"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            >
                                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 text-[11px] font-bold"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            >
                                Next
                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                {/* Filter Sheet */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetContent side="right" className="w-full sm:max-w-md p-0">
                        <SheetHeader className="px-6 py-4 border-b">
                            <SheetTitle className="flex items-center gap-2 text-base">
                                <Filter className="w-4 h-4 text-blue-600" />
                                Filter Users
                            </SheetTitle>
                        </SheetHeader>
                        <div className="p-6 space-y-6">
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">KYC Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["all", "pending", "approved", "rejected"].map((status) => (
                                        <Button
                                            key={status}
                                            variant={filters.kycStatus === status ? "default" : "outline"}
                                            size="sm"
                                            className="capitalize text-[11px] font-bold h-8"
                                            onClick={() => setFilters({ ...filters, kycStatus: status })}
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Account Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["all", "active", "blocked"].map((status) => (
                                        <Button
                                            key={status}
                                            variant={filters.accountStatus === status ? "default" : "outline"}
                                            size="sm"
                                            className="capitalize text-[11px] font-bold h-8"
                                            onClick={() => setFilters({ ...filters, accountStatus: status })}
                                        >
                                            {status}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Min Investment</label>
                                    <span className="text-blue-600 font-bold text-xs">₹{formatNumber(filters.investmentRange)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100000"
                                    step="5000"
                                    value={filters.investmentRange}
                                    onChange={(e) => setFilters({ ...filters, investmentRange: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                className="flex-1 text-[11px] font-bold"
                                onClick={() => setFilters({ kycStatus: "all", accountStatus: "all", investmentRange: 0 })}
                            >
                                Reset Filters
                            </Button>
                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-[11px] font-bold" onClick={() => setShowFilters(false)}>
                                Show {filteredUsers.length} Results
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* User Detail Sheet */}
                <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                    <SheetContent side="right" className="w-full sm:max-w-2xl p-0 overflow-y-auto">
                        {selectedUser && (
                            <>
                                <SheetHeader className="px-6 py-6 border-b bg-gray-50/50">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-sm shrink-0 uppercase">
                                            {selectedUser.name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <SheetTitle className="text-lg font-bold text-gray-900 truncate">{selectedUser.name}</SheetTitle>
                                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{selectedUser.id}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <KYCBadge status={selectedUser.kycStatus} />
                                                <AccountStatusBadge status={selectedUser.accountStatus} />
                                            </div>
                                        </div>
                                    </div>
                                </SheetHeader>

                                <div className="p-6 space-y-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl border border-gray-100 bg-white">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Total Invested</p>
                                            <p className="text-xl font-black text-gray-900">₹{formatNumber(selectedUser.totalInvested)}</p>
                                        </div>
                                        <div className="p-4 rounded-xl border border-gray-100 bg-white">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Active Plans</p>
                                            <p className="text-xl font-black text-gray-900">{selectedUser.activeInvestments}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1 h-3 bg-blue-600 rounded-full" />
                                            Contact Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-400 font-medium font-mono uppercase tracking-tighter">Email</p>
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {selectedUser.email}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-400 font-medium font-mono uppercase tracking-tighter">Phone</p>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {selectedUser.phone}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-400 font-medium font-mono uppercase tracking-tighter">Registered</p>
                                                <p className="text-sm font-semibold text-gray-900 truncate capitalize">
                                                    {selectedUser.registrationDate}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-gray-400 font-medium font-mono uppercase tracking-tighter">Last Active</p>
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {selectedUser.lastLogin}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1 h-3 bg-indigo-600 rounded-full" />
                                            Verification Documents
                                        </h3>
                                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                                    <Shield className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">Aadhar/PAN Card</p>
                                                    <p className="text-[10px] text-gray-500 font-medium">Verified Identity Document</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold bg-white">View Docs</Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-6">
                                        <Button className="flex-1 h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700" onClick={() => setDetailSheetOpen(false)}>
                                            <Edit className="w-3.5 h-3.5 mr-2" />
                                            Edit Profile
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className={`flex-1 h-10 text-xs font-bold ${selectedUser.accountStatus === 'active' ? 'text-orange-600 border-orange-100 hover:bg-orange-50' : 'text-green-600 border-green-100 hover:bg-green-50'}`}
                                            onClick={() => { toggleUserStatus(selectedUser); setDetailSheetOpen(false); }}
                                        >
                                            {selectedUser.accountStatus === 'active' ? <ShieldAlert className="w-3.5 h-3.5 mr-2" /> : <UserCheck className="w-3.5 h-3.5 mr-2" />}
                                            {selectedUser.accountStatus === 'active' ? 'Block User' : 'Unblock User'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </SheetContent>
                </Sheet>
            </TooltipProvider>
        </div>
    );
}
