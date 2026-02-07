"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
    Search,
    MessageSquare,
    User,
    Mail,
    Phone,
    Clock,
    CheckCircle,
    AlertCircle,
    X,
    Send,
    Paperclip,
    ChevronDown,
    Flag,
    UserPlus,
    MoreHorizontal,
    Grid,
    List,
    Settings,
    XCircle,
    Star,
    RefreshCcw,
    Filter,
    CreditCard,
    ShieldCheck,
    ArrowDownCircle,
    TrendingUp,
    HelpCircle,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useAdminTickets, useAdminTicket } from "@/hooks/useApi";
import { adminApi } from "@/lib/api";

const categories = {
    payment: { label: "Payment", color: "bg-blue-100 text-blue-800", icon: CreditCard },
    kyc: { label: "KYC", color: "bg-purple-100 text-purple-800", icon: ShieldCheck },
    withdrawal: { label: "Withdrawal", color: "bg-orange-100 text-orange-800", icon: ArrowDownCircle },
    investment: { label: "Investment", color: "bg-green-100 text-green-800", icon: TrendingUp },
    account: { label: "Account", color: "bg-gray-100 text-gray-800", icon: User },
    other: { label: "Other", color: "bg-gray-100 text-gray-800", icon: HelpCircle },
};

// Format date - stable format to avoid hydration mismatch
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const mins = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${day} ${month} ${year}, ${hour12}:${mins} ${ampm}`;
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
}

// Status Badge Component
function TicketStatusBadge({ status }) {
    const variants = {
        open: "bg-blue-50 text-blue-700 border-blue-100",
        in_progress: "bg-yellow-50 text-yellow-700 border-yellow-100",
        closed: "bg-gray-50 text-gray-600 border-gray-100",
    };
    const labels = {
        open: "Open",
        in_progress: "In Progress",
        closed: "Closed",
    };
    return (
        <Badge variant="outline" className={`${variants[status]} border font-medium`}>
            {labels[status]}
        </Badge>
    );
}

// Priority Badge Component
function PriorityBadge({ priority }) {
    if (priority === "high") {
        return (
            <Badge variant="destructive" className="flex items-center gap-1.5 px-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                High Priority
            </Badge>
        );
    }
    return null;
}

// Toast Component
function Toast({ message, onClose }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-green-600 text-white animate-in slide-in-from-bottom-4 duration-300">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// Ticket Card Component
function TicketCard({ ticket, onView, onAssign, onPriority }) {
    const cat = categories[ticket.category] || categories.other;
    const Icon = cat.icon;

    return (
        <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-gray-200 group">
            {/* Header */}
            <CardHeader shadow-sm="true" className="px-4 py-2.5 bg-gray-50/80 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2 flex-wrap text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                    <span>{ticket.id}</span>
                    <TicketStatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                </div>
                {ticket.assignedTo && (
                    <Badge variant="secondary" className="bg-white text-[10px] border-gray-200 h-5 px-1.5 font-semibold">
                        {ticket.assignedTo}
                    </Badge>
                )}
            </CardHeader>

            {/* Body */}
            <CardContent className="space-y-2 px-4 py-3">
                {/* User */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-gray-100 shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white text-[10px] font-bold">
                            {ticket.userName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1e293b] leading-tight truncate">{ticket.userName}</p>
                        <p className="text-[10px] text-[#64748b] truncate">{ticket.userEmail}</p>
                    </div>
                </div>

                {/* Category + Subject */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        {Icon && <Icon className={`w-3.5 h-3.5 ${cat.color.split(' ')[1].replace('800', '600')}`} />}
                        <Badge variant="outline" className={`${cat.color} border-none font-semibold h-4 px-1.5 text-[9px]`}>
                            {cat.label}
                        </Badge>
                    </div>
                    <h3 className="font-bold text-[#0f172a] text-[13px] leading-snug group-hover:text-[#2563eb] transition-colors line-clamp-1">{ticket.subject}</h3>
                    <p className="text-[11px] text-[#64748b] line-clamp-2 leading-relaxed">{ticket.description}</p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-[10px] text-[#94a3b8] pt-2.5 border-t border-gray-100/50">
                    <div className="flex items-center gap-3">
                        {ticket.attachments > 0 && (
                            <span className="flex items-center gap-1 font-medium bg-gray-50 px-1.5 py-0.5 rounded">
                                <Paperclip className="w-3 h-3" />
                                {ticket.attachments}
                            </span>
                        )}
                        <span className="flex items-center gap-1 font-medium bg-gray-50 px-1.5 py-0.5 rounded">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.messages.length}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        {formatDateShort(ticket.createdAt)}
                    </span>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="px-4 py-2.5 bg-gray-50/50 border-t border-gray-100 flex items-center gap-2">
                <Button size="sm" onClick={() => onView(ticket)} className="flex-1 h-8 bg-[#2563eb] hover:bg-[#1d4ed8] shadow-sm text-xs font-semibold">
                    View Ticket
                </Button>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onAssign(ticket.id)}
                        className="h-8 w-8 text-[#94a3b8] hover:text-[#2563eb] hover:bg-[#2563eb]/5"
                        title="Assign to me"
                    >
                        <UserPlus className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPriority(ticket.id, ticket.priority)}
                        className={`h-8 w-8 ${ticket.priority === "high" ? "text-red-500 bg-red-50" : "text-[#94a3b8] hover:text-red-500 hover:bg-red-50"}`}
                        title="Mark as priority"
                    >
                        <Flag className="w-4 h-4" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

// Ticket Sheet Component (Replacing Modal)
function TicketSheet({ ticket, isOpen, onClose, onReply, onStatusChange, onPriorityChange }) {
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [priority, setPriority] = useState(ticket?.priority || "medium");

    React.useEffect(() => {
        if (ticket) {
            setPriority(ticket.priority);
        }
    }, [ticket]);

    if (!ticket) return null;

    const cat = categories[ticket.category] || categories.other;

    const handleSendReply = async () => {
        if (!replyText.trim()) return;
        setIsSubmitting(true);
        try {
            await onReply(ticket.id, replyText);
            setReplyText("");
        } catch (error) {
            console.error("Failed to send reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-xl p-0 flex flex-col h-full gap-0">
                <SheetHeader className="px-6 py-5 border-b border-gray-100 shrink-0 text-left">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#6b7280] tracking-wider">{ticket.id}</span>
                        <TicketStatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                    <SheetTitle className="text-xl font-bold text-[#111827] leading-tight">{ticket.subject}</SheetTitle>
                    <SheetDescription className="flex items-center gap-3 pt-1">
                        <Badge variant="outline" className={`${cat.color} border-none font-medium`}>{cat.label}</Badge>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            Created {formatDate(ticket.createdAt)}
                        </span>
                    </SheetDescription>
                </SheetHeader>

                {/* User Info & Actions Bar */}
                <div className="px-6 py-4 bg-[#f9fafb] border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white shadow-sm">
                            <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white text-xs font-bold">
                                {ticket.userName.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-bold text-[#111827]">{ticket.userName}</p>
                            <div className="flex items-center gap-3 text-xs text-[#6b7280] mt-0.5">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{ticket.userEmail}</span>
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2">
                                <Settings className="w-4 h-4" />
                                Settings
                                <ChevronDown className="w-3.5 h-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Ticket Settings</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onPriorityChange(ticket.id, "high")} className="gap-2">
                                <Flag className="w-4 h-4 text-red-500" /> High Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPriorityChange(ticket.id, "medium")} className="gap-2">
                                <Flag className="w-4 h-4 text-yellow-500" /> Medium Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPriorityChange(ticket.id, "low")} className="gap-2">
                                <Flag className="w-4 h-4 text-green-500" /> Low Priority
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {ticket.status !== "closed" && (
                                <DropdownMenuItem onClick={() => onStatusChange(ticket.id, "closed")} className="text-red-600 gap-2">
                                    <XCircle className="w-4 h-4" /> Close Ticket
                                </DropdownMenuItem>
                            )}
                            {ticket.status === "closed" && (
                                <DropdownMenuItem onClick={() => onStatusChange(ticket.id, "open")} className="text-green-600 gap-2">
                                    <CheckCircle className="w-4 h-4" /> Reopen Ticket
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Conversation Body */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30 p-4 sm:p-5">
                    <div className="space-y-4">
                        {ticket.messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"}`}>
                                <div className="flex items-center gap-2 mb-1.5 px-1">
                                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wide">
                                        {msg.sender === "admin" ? (msg.adminName || "Support Team") : ticket.userName}
                                    </span>
                                    <span className="text-[10px] text-[#94a3b8] font-medium">{formatDate(msg.timestamp)}</span>
                                </div>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${msg.sender === "admin"
                                    ? "bg-[#2563eb] text-white rounded-tr-none"
                                    : "bg-white text-[#1e293b] rounded-tl-none border border-gray-100"
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reply Footer */}
                <div className="p-6 border-t border-gray-100 bg-white shrink-0">
                    {ticket.status !== "closed" ? (
                        <div className="space-y-4">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type your response here..."
                                className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] outline-none transition-all resize-none shadow-sm"
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-9 text-gray-500 hover:text-gray-700">
                                        <Paperclip className="w-4 h-4 mr-2" />
                                        Attach
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-9 text-gray-500 hover:text-gray-700">
                                        <Star className="w-4 h-4 mr-2" />
                                        Canned Response
                                    </Button>
                                </div>
                                <Button
                                    onClick={handleSendReply}
                                    disabled={!replyText.trim() || isSubmitting}
                                    className="h-10 px-6 bg-[#2563eb] hover:bg-[#1d4ed8]"
                                >
                                    {isSubmitting ? "Sending..." : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Reply
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                            <p className="text-sm font-medium text-[#6b7280]">This ticket is closed and inactive.</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onStatusChange(ticket.id, "open")}
                                className="mt-3"
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Reopen Discussion
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default function AdminTicketsPage() {
    const [activeTab, setActiveTab] = useState("open");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const { tickets, loading, error, refetch } = useAdminTickets({ status: activeTab });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [toast, setToast] = useState(null);

    const tabs = [
        { id: "open", label: "Open" },
        { id: "in_progress", label: "In Progress" },
        { id: "closed", label: "Closed" },
    ];

    const stats = {
        open: tickets.filter((t) => t.status === "open").length,
        inProgress: tickets.filter((t) => t.status === "in_progress").length,
        closedToday: tickets.filter((t) => t.status === "closed").length,
        avgResponse: "4 hours",
    };

    const filteredTickets = tickets.filter((t) => {
        const matchesTab = t.status === activeTab;
        const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
        const matchesSearch = !searchQuery ||
            t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesPriority && matchesSearch;
    });

    const handleView = (ticket) => {
        setSelectedTicket(ticket);
    };

    const handleAssign = async (id) => {
        try {
            await adminApi.updateTicket(id, { assignedTo: "Support" });
            refetch();
            setToast("Ticket assigned to you");
        } catch (err) {
            setToast("Failed to assign ticket");
        }
        setTimeout(() => setToast(null), 3000);
    };

    const handleTogglePriority = async (id, currentPriority) => {
        const newPriority = currentPriority === "high" ? "medium" : "high";
        try {
            await adminApi.updateTicket(id, { priority: newPriority });
            refetch();
            if (selectedTicket?.id === id) {
                setSelectedTicket(prev => ({ ...prev, priority: newPriority }));
            }
        } catch (err) {
            setToast("Failed to update priority");
            setTimeout(() => setToast(null), 3000);
        }
    };

    const handleReply = async (id, message) => {
        try {
            await adminApi.replyTicket(id, message);
            refetch();
            // Update selected ticket messages locally if needed or let effect handle it if we add a singular hook
            // For now, let's keep it simple and just refetch all if we don't have a better way
            setToast("Reply sent successfully");
        } catch (err) {
            setToast("Failed to send reply");
        }
        setTimeout(() => setToast(null), 3000);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await adminApi.updateTicket(id, { status: newStatus });
            refetch();
            if (selectedTicket?.id === id) {
                setSelectedTicket(prev => ({ ...prev, status: newStatus }));
            }
            setToast(`Ticket ${newStatus === "closed" ? "closed" : "updated"}`);
        } catch (err) {
            setToast("Failed to update status");
        }
        setTimeout(() => setToast(null), 3000);
    };

    const handlePriorityChange = async (id, newPriority) => {
        try {
            await adminApi.updateTicket(id, { priority: newPriority });
            refetch();
            if (selectedTicket?.id === id) {
                setSelectedTicket(prev => ({ ...prev, priority: newPriority }));
            }
            setToast(`Priority updated to ${newPriority}`);
        } catch (err) {
            setToast("Failed to update priority");
        }
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="max-w-[1400px] mx-auto p-2 sm:p-3 lg:p-4 space-y-4">
            {/* Compact Breadcrumb Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                                <MessageSquare className="w-3.5 h-3.5" />
                                Support Tickets
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                        <Button
                            variant={viewMode === "grid" ? "outline" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className={`h-7 w-7 p-0 ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                        >
                            <Grid className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "outline" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className={`h-7 w-7 p-0 ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                        >
                            <List className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                    <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8] shadow-sm h-9 px-3 text-xs md:text-sm">
                        New Ticket
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                {[
                    { label: "Open Tickets", value: stats.open, color: "text-blue-600", bg: "bg-blue-50", icon: MessageSquare },
                    { label: "In Progress", value: stats.inProgress, color: "text-yellow-600", bg: "bg-yellow-50", icon: RefreshCcw },
                    { label: "Avg Response", value: stats.avgResponse, color: "text-purple-600", bg: "bg-purple-50", icon: Clock },
                    { label: "Closed Today", value: stats.closedToday, color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
                ].map((stat, i) => (
                    <Card key={i} className="border-gray-100 shadow-sm py-0 gap-3">
                        <CardContent className="p-2 sm:p-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[9px] font-bold text-[#6b7280] uppercase tracking-wider">{stat.label}</p>
                                <stat.icon className={`w-3.5 h-3.5 ${stat.color} opacity-80`} />
                            </div>
                            <div className="flex items-baseline gap-1.5 mt-1">
                                <p className={`text-lg sm:text-2xl font-black ${stat.color}`}>{stat.value}</p>
                                <Badge variant="secondary" className={`${stat.bg} ${stat.color} border-none text-[8px] h-3.5 px-1`}>
                                    Live
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters & Content */}
            {loading && !tickets.length ? (
                <div className="h-96 flex items-center justify-center bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-gray-500 font-medium tracking-tight">Loading content...</p>
                    </div>
                </div>
            ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-1 border-b border-gray-100">
                        <TabsList className="bg-gray-100/50 p-1 rounded-xl w-fit">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="h-9 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#2563eb] data-[state=active]:shadow-sm text-sm font-bold transition-all text-[#64748b]"
                                >
                                    {tab.label}
                                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 bg-[#2563eb]/10 text-[#2563eb] border-none font-black text-[10px]">
                                        {tickets.filter((t) => t.status === tab.id).length}
                                    </Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 lg:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search tickets..."
                                    className="pl-10 h-10 bg-white border-gray-200 focus:ring-[#2563eb]/20 rounded-xl"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-10 gap-2 font-medium">
                                        <Filter className="w-4 h-4" />
                                        Filter
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setPriorityFilter("all")} className="justify-between">
                                        All Priorities {priorityFilter === "all" && <CheckCircle className="w-4 h-4 text-[#2563eb]" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setPriorityFilter("high")} className="justify-between">
                                        High Priority {priorityFilter === "high" && <CheckCircle className="w-4 h-4 text-red-500" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setPriorityFilter("medium")} className="justify-between">
                                        Medium Priority {priorityFilter === "medium" && <CheckCircle className="w-4 h-4 text-yellow-500" />}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setPriorityFilter("low")} className="justify-between">
                                        Low Priority {priorityFilter === "low" && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="mt-0 outline-none">
                        {filteredTickets.length > 0 ? (
                            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" : "space-y-3"}>
                                {filteredTickets.map((ticket) => (
                                    <TicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                        onView={handleView}
                                        onAssign={handleAssign}
                                        onPriority={handleTogglePriority}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-100 py-24 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-[#111827] mb-2">No tickets found</h3>
                                <p className="text-[#6b7280] max-w-sm mx-auto">
                                    {searchQuery ? "We couldn't find any tickets matching your search criteria. Try a different query." : `There are currently no tickets in the ${activeTab.replace("_", " ")} queue.`}
                                </p>
                                {searchQuery && (
                                    <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2 text-[#2563eb]">
                                        Clear all filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* Detail Sheet */}
            <TicketSheet
                ticket={selectedTicket}
                isOpen={!!selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onReply={handleReply}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
            />

            {/* Toast Notifications */}
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <Badge className="bg-[#111827] text-white px-6 py-2 rounded-full shadow-2xl border-none text-sm font-medium">
                        {toast}
                    </Badge>
                </div>
            )}
        </div>
    );
}
