"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Users,
    TrendingUp,
    Clock,
    DollarSign,
    FileCheck,
    CreditCard,
    Wallet,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    Check,
    X,
    Download,
    RefreshCw,
    MoreHorizontal,
    Eye,
    XCircle,
    AlertCircle,
    Home,
    ShieldCheck,
    CheckCircle2,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Label, Cell } from "recharts";

// Sample data
const recentActivity = [
    { id: 1, user: "Rahul Sharma", email: "rahul@email.com", action: "New Investment", amount: "₹15,000", status: "pending", date: "2 min ago", type: "investment" },
    { id: 2, user: "Priya Singh", email: "priya@email.com", action: "Withdrawal Request", amount: "₹5,000", status: "pending", date: "5 min ago", type: "withdrawal" },
    { id: 3, user: "Amit Kumar", email: "amit@email.com", action: "KYC Submission", amount: "—", status: "pending", date: "12 min ago", type: "kyc" },
    { id: 4, user: "Sneha Patel", email: "sneha@email.com", action: "New Investment", amount: "₹25,000", status: "approved", date: "1 hour ago", type: "investment" },
    { id: 5, user: "Vikram Roy", email: "vikram@email.com", action: "Withdrawal Request", amount: "₹8,000", status: "approved", date: "2 hours ago", type: "withdrawal" },
    { id: 6, user: "Anita Gupta", email: "anita@email.com", action: "KYC Submission", amount: "—", status: "rejected", date: "3 hours ago", type: "kyc" },
];

const userGrowthData = [
    { month: "Aug", users: 850 },
    { month: "Sep", users: 980 },
    { month: "Oct", users: 1120 },
    { month: "Nov", users: 1280 },
    { month: "Dec", users: 1420 },
    { month: "Jan", users: 1547 },
];

const investmentDistribution = [
    { name: "Tech Growth", value: 35, color: "#2563eb", fill: "var(--color-tech)" },
    { name: "Stability", value: 28, color: "#10b981", fill: "var(--color-stability)" },
    { name: "High Yield", value: 22, color: "#7c3aed", fill: "var(--color-yield)" },
    { name: "Balanced", value: 15, color: "#f59e0b", fill: "var(--color-balanced)" },
];

const chartConfig = {
    value: {
        label: "Percentage",
    },
    tech: {
        label: "Tech Growth",
        color: "#2563eb",
    },
    stability: {
        label: "Stability",
        color: "#10b981",
    },
    yield: {
        label: "High Yield",
        color: "#7c3aed",
    },
    balanced: {
        label: "Balanced",
        color: "#f59e0b",
    },
};

const statsData = [
    {
        title: "Total Users",
        value: "1,547",
        description: "Active platform users",
        trend: "+12%",
        trendUp: true,
        icon: Users,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        title: "Total Investments",
        value: "₹45,23,000",
        description: "143 active investments",
        trend: "+8.5%",
        trendUp: true,
        icon: TrendingUp,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
    },
    {
        title: "Pending Approvals",
        value: "23",
        description: "8 KYC • 10 Payments • 5 Withdrawals",
        trend: null,
        trendUp: false,
        icon: Clock,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
    },
    {
        title: "This Week's Returns",
        value: "₹1,85,000",
        description: "Distributed to users",
        trend: "+5.2%",
        trendUp: true,
        icon: DollarSign,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
    },
];

const quickActions = [
    { icon: FileCheck, label: "Approve KYC", color: "bg-blue-600 hover:bg-blue-700", href: "/admin/kyc" },
    { icon: CreditCard, label: "Process Payments", color: "bg-green-600 hover:bg-green-700", href: "/admin/payments" },
    { icon: DollarSign, label: "Set Weekly Returns", color: "bg-purple-600 hover:bg-purple-700", href: "/admin/returns" },
    { icon: MessageSquare, label: "View Tickets", color: "bg-orange-500 hover:bg-orange-600", href: "/admin/tickets" },
];

const pendingItems = [
    { icon: FileCheck, iconColor: "text-orange-600", bgColor: "bg-orange-100", title: "KYC Pending", count: "8", href: "/admin/kyc" },
    { icon: CreditCard, iconColor: "text-blue-600", bgColor: "bg-blue-100", title: "Payment Requests", count: "10", href: "/admin/payments" },
    { icon: Wallet, iconColor: "text-purple-600", bgColor: "bg-purple-100", title: "Withdrawals", count: "5", href: "/admin/withdrawals" },
];

export default function AdminDashboardPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    // Chart calculations
    const maxValue = Math.max(...userGrowthData.map((d) => d.users));
    const minValue = Math.min(...userGrowthData.map((d) => d.users));
    const range = maxValue - minValue;
    const points = userGrowthData.map((d, i) => {
        const x = (i / (userGrowthData.length - 1)) * 100;
        const y = 100 - ((d.users - minValue) / range) * 80;
        return `${x},${y}`;
    }).join(" ");

    const totalInvestmentValue = "₹45.2L";

    return (
        <div className="space-y-3 md:space-y-4 -mt-2">
            {/* Compact Breadcrumb Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin" className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
                                <Home className="w-3.5 h-3.5" />
                                Admin
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Dashboard
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {statsData.map((stat) => (
                    <Card key={stat.title} className="hover:shadow-md transition-all duration-200 border-gray-100 group overflow-hidden">
                        <CardContent className="px-3 py-1 md:px-4 md:py-1.5">
                            <div className="flex items-center gap-2.5 md:gap-3">
                                <div className={`w-9 h-9 md:w-10 md:h-10 ${stat.iconBg} rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1.5">
                                        <p className="text-[10px] md:text-[11px] text-gray-500 font-bold uppercase tracking-wider truncate">{stat.title}</p>
                                        {stat.trend && (
                                            <div className={`flex items-center gap-0.5 text-[10px] font-black shrink-0 ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                                                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                <span>{stat.trend}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-base md:text-xl font-black text-gray-900 leading-tight">{stat.value}</p>
                                    <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{stat.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 md:gap-3 py-1">
                {quickActions.map((action) => (
                    <Link key={action.label} href={action.href}>
                        <Button className={`${action.color} h-9 text-white text-[11px] md:text-xs font-bold rounded-lg shadow-sm`}>
                            <action.icon className="w-3.5 h-3.5 mr-2" />
                            <span className="hidden xs:inline">{action.label}</span>
                            <span className="xs:hidden">{action.label.split(" ")[0]}</span>
                        </Button>
                    </Link>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
                {/* User Growth Chart */}
                <Card className="lg:col-span-8 py-4">
                    <CardHeader className="flex flex-row items-center justify-between px-4 py-0 md:px-5 md:py-2 border-b [.border-b]:pb-4 ">
                        <CardTitle className="text-sm font-semibold">User Growth (6 months)</CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Export
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4 md:p-5">
                        <div className="relative h-32 md:h-40">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                                <line x1="0" y1="80" x2="100" y2="80" stroke="#f1f5f9" strokeWidth="0.5" />
                                <polyline
                                    points={points}
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <polygon points={`0,100 ${points} 100,100`} fill="url(#gradient)" opacity="0.1" />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#2563eb" />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-400 -mb-4">
                                {userGrowthData.map((d) => (
                                    <span key={d.month}>{d.month}</span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs text-gray-500">
                            <span>Total Users: <strong className="text-gray-900">1,547</strong></span>
                            <span className="text-green-600 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />
                                +12% this month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Investment Distribution - Shadcn Chart */}
                <Card className="lg:col-span-4 py-4 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between px-4 py-0 md:px-5 md:py-2 border-b [.border-b]:pb-4">
                        <CardTitle className="text-sm font-semibold">Investment Distribution</CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Export
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0 pt-4">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[200px]"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={investmentDistribution}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={50}
                                    strokeWidth={5}
                                >
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-xl font-bold"
                                                        >
                                                            {totalInvestmentValue}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 20}
                                                            className="fill-muted-foreground text-[10px]"
                                                        >
                                                            Invested
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                    {investmentDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 p-4 pt-0">
                        <div className="grid grid-cols-2 gap-2 w-full">
                            {investmentDistribution.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] text-gray-500 truncate">{item.name}</span>
                                    <span className="text-[10px] font-medium text-gray-900 ml-auto">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Recent Activity - Shadcn Table */}
            <Card className="border-gray-100 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between px-4 py-2.5 md:px-5 border-b bg-gray-50/30">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-[#2563eb]" />
                        <CardTitle className="text-sm md:text-base font-black tracking-tight">Recent Platform Activity</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold">
                        <Download className="w-3 h-3 mr-1.5" />
                        Export
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {/* Desktop Table - Shadcn Table component */}
                    <div className="hidden md:block overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead className="px-5 h-10 text-[11px] font-bold uppercase tracking-wider text-gray-500">User</TableHead>
                                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-gray-500">Action</TableHead>
                                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-gray-500">Amount</TableHead>
                                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</TableHead>
                                    <TableHead className="h-10 text-[11px] font-bold uppercase tracking-wider text-gray-500">Date</TableHead>
                                    <TableHead className="px-5 h-10 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentActivity.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="px-5 py-4">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.user}</p>
                                                <p className="text-xs text-gray-400">{item.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-900">{item.action}</TableCell>
                                        <TableCell className="text-sm font-medium text-gray-900">{item.amount}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`flex items-center gap-1 w-fit font-medium ${item.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                                                    item.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" :
                                                        "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                    }`}
                                            >
                                                {item.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                                                {item.status === "rejected" && <XCircle className="w-3 h-3" />}
                                                {item.status === "pending" && <AlertCircle className="w-3 h-3" />}
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">{item.date}</TableCell>
                                        <TableCell className="px-5 text-right">
                                            {item.status === "pending" ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button title="Approve" className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button title="Reject" className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button title="View Details" className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {recentActivity.map((item) => (
                            <div key={item.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-medium text-gray-900">{item.user}</p>
                                            <Badge
                                                variant="outline"
                                                className={`flex items-center gap-1 font-medium text-[10px] ${item.status === "approved" ? "bg-green-50 text-green-700 border-green-200" :
                                                    item.status === "rejected" ? "bg-red-50 text-red-700 border-red-200" :
                                                        "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                    }`}
                                            >
                                                {item.status === "approved" && <CheckCircle2 className="w-2.5 h-2.5" />}
                                                {item.status === "rejected" && <XCircle className="w-2.5 h-2.5" />}
                                                {item.status === "pending" && <AlertCircle className="w-2.5 h-2.5" />}
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">{item.action}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                            <span className="font-medium text-gray-900">{item.amount}</span>
                                            <span>•</span>
                                            <span>{item.date}</span>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {item.status === "pending" && (
                                                <>
                                                    <DropdownMenuItem className="text-green-600">
                                                        <Check className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600">
                                                        <X className="w-4 h-4 mr-2" />
                                                        Reject
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <DropdownMenuItem>
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Details
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 md:px-5 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">Showing 6 of 156 activities</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" disabled>Previous</Button>
                            <Button variant="outline" size="sm">Next</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {pendingItems.map((item) => (
                    <Link key={item.title} href={item.href}>
                        <Card className="hover:shadow-md transition-all group cursor-pointer border-gray-100 overflow-hidden">
                            <CardContent className="p-3.5 md:p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`w-10 h-10 md:w-11 md:h-11 ${item.bgColor} rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                                        <item.icon className={`w-5 h-5 md:w-5.5 md:h-5.5 ${item.iconColor}`} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] md:text-xs font-bold text-gray-500 uppercase tracking-wide">{item.title}</p>
                                        <p className="text-lg md:text-xl font-black text-gray-900 leading-none mt-0.5">{item.count}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
