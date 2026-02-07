"use client";

import * as React from "react";
import { useState } from "react";
import {
    MessageSquare,
    Plus,
    ChevronDown,
    ChevronUp,
    Upload,
    X,
    Clock,
    CheckCircle,
    AlertCircle,
    User,
    FileText,
    Paperclip,
    Send,
    Filter,
    MessageCircle,
    HelpCircle,
    History,
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useTickets } from "@/hooks/useApi";
import { ticketsApi } from "@/lib/api";

// Categories
const categories = [
    { value: "payment", label: "Payment issues" },
    { value: "kyc", label: "KYC verification" },
    { value: "withdrawal", label: "Withdrawal problems" },
    { value: "investment", label: "Investment queries" },
    { value: "account", label: "Account issues" },
    { value: "technical", label: "Technical issues" },
    { value: "other", label: "Other" },
];

// Status configuration
const statusConfig = {
    open: { label: "Open", variant: "blue", color: "bg-blue-500" },
    in_progress: { label: "In Progress", variant: "warning", color: "bg-amber-500" },
    resolved: { label: "Resolved", variant: "secondary", color: "bg-green-500" },
    closed: { label: "Closed", variant: "secondary", color: "bg-gray-400" },
};

// Format relative time
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function SupportPage() {
    const { tickets, loading, error, refetch } = useTickets();
    const [showForm, setShowForm] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [expandedTicket, setExpandedTicket] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        subject: "",
        category: "",
        description: "",
    });

    const filteredTickets = activeTab === "all"
        ? tickets
        : tickets.filter((t) => t.status === activeTab);

    const canSubmit = formData.subject.trim().length >= 5 && formData.category && formData.description.trim().length >= 20;

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await ticketsApi.create({
                subject: formData.subject,
                category: formData.category,
                description: formData.description,
            });

            setFormData({ subject: "", category: "", description: "" });
            setShowForm(false);
            refetch();
        } catch (err) {
            setSubmitError(err.message || 'Failed to create ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseTicket = async (ticketId) => {
        try {
            await ticketsApi.close(ticketId);
            refetch();
        } catch (err) {
            console.error('Failed to close ticket:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

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
                                <MessageSquare className="w-3.5 h-3.5" />
                                Support Center
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    size="sm"
                    className={`${showForm ? 'bg-red-50 text-red-600 hover:bg-red-100 border-none' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'} font-black text-[11px] uppercase tracking-wider transition-all h-9 px-6`}
                >
                    {showForm ? <X className="w-3.5 h-3.5 mr-2" /> : <Plus className="w-3.5 h-3.5 mr-2" />}
                    {showForm ? 'Cancel Request' : 'New Support Ticket'}
                </Button>
            </div>

            {/* Create Ticket Form */}
            {showForm && (
                <Card className="border-none shadow-xl animate-in slide-in-from-top-4 duration-300 overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b">
                        <CardTitle className="text-lg font-bold">Initiate Support Request</CardTitle>
                        <CardDescription>Provide details about your issue for faster processing.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {submitError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {submitError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue Subject</label>
                                    {formData.subject.length > 0 && formData.subject.length < 5 && (
                                        <span className="text-[10px] font-bold text-amber-500">Min 5 chars</span>
                                    )}
                                </div>
                                <Input
                                    value={formData.subject}
                                    onChange={(e) => handleInputChange("subject", e.target.value)}
                                    placeholder="Brief summary of the problem"
                                    className="h-12 border-gray-200 focus:border-blue-500 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => handleInputChange("category", val)}
                                >
                                    <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 rounded-xl">
                                        <SelectValue placeholder="What can we help with?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                                <span className={`text-[10px] font-bold ${formData.description.length > 0 && formData.description.length < 20 ? 'text-amber-500' : 'text-gray-300'}`}>
                                    {formData.description.length < 20 ? `${20 - formData.description.length} more needed` : `${formData.description.length}/500`}
                                </span>
                            </div>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Describe your issue in detail..."
                                rows={4}
                                maxLength={500}
                                className="border-gray-200 focus:border-blue-500 rounded-xl resize-none"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50/50 border-t p-6">
                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit || isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </span>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Support Ticket
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* My Tickets Section */}
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-gray-400" />
                        <h2 className="text-lg font-black text-gray-900">Recent Tickets</h2>
                    </div>

                    <TabsList className="bg-gray-100/80 p-1 rounded-lg h-9 w-fit">
                        <TabsTrigger value="all" className="rounded-md font-bold text-[11px] data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 h-7">All</TabsTrigger>
                        <TabsTrigger value="open" className="rounded-md font-bold text-[11px] data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 h-7">Open</TabsTrigger>
                        <TabsTrigger value="in_progress" className="rounded-md font-bold text-[11px] data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 h-7">Active</TabsTrigger>
                        <TabsTrigger value="closed" className="rounded-md font-bold text-[11px] data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 h-7">Closed</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value={activeTab} className="space-y-4 animate-in fade-in duration-300 outline-none">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                            <Card key={ticket._id} className="border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                                <div className="flex flex-col">
                                    <div
                                        onClick={() => setExpandedTicket(expandedTicket === ticket._id ? null : ticket._id)}
                                        className="p-5 flex items-start justify-between cursor-pointer"
                                    >
                                        <div className="flex-1 min-w-0 pr-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge className={`${statusConfig[ticket.status]?.color || 'bg-gray-500'} hover:${statusConfig[ticket.status]?.color || 'bg-gray-500'} text-white border-none font-bold text-[10px]`}>
                                                    {(statusConfig[ticket.status]?.label || ticket.status).toUpperCase()}
                                                </Badge>
                                                <span className="text-[10px] font-black text-gray-300 tracking-tighter">#{ticket.ticketNumber || ticket._id?.slice(-6)}</span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{ticket.subject}</h3>
                                            <div className="flex items-center gap-3 mt-2">
                                                <Badge variant="secondary" className="bg-gray-100 text-gray-500 font-bold text-[9px] uppercase tracking-tighter">
                                                    {categories.find(c => c.value === ticket.category)?.label || ticket.category}
                                                </Badge>
                                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {formatRelativeTime(ticket.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:text-blue-600 transition-all ${expandedTicket === ticket._id ? 'bg-blue-50 text-blue-600 rotate-180' : ''}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </div>

                                    {expandedTicket === ticket._id && (
                                        <div className="px-5 pb-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                            <Separator className="bg-gray-100" />

                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                                        <User className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <div className="bg-gray-50 rounded-2xl p-4 flex-1">
                                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">My Message</p>
                                                        <p className="text-sm text-gray-700 leading-relaxed font-medium">{ticket.description}</p>
                                                    </div>
                                                </div>

                                                {ticket.messages && ticket.messages.length > 0 ? (
                                                    ticket.messages.filter(m => m.sender === 'admin').map((msg, idx) => (
                                                        <div key={idx} className="flex gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                                                                <MessageCircle className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex-1">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Support Response</p>
                                                                    <span className="text-[10px] font-bold text-blue-400">{formatRelativeTime(msg.createdAt)}</span>
                                                                </div>
                                                                <p className="text-sm text-blue-900 leading-relaxed font-medium">{msg.content}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : ticket.status === 'open' ? (
                                                    <div className="flex gap-4 pr-12">
                                                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                            <Clock className="w-5 h-5 text-amber-500" />
                                                        </div>
                                                        <div className="bg-amber-50/50 border border-amber-100 border-dashed rounded-2xl p-4 flex-1">
                                                            <p className="text-xs font-bold text-amber-700">Ticket analysis in progress</p>
                                                            <p className="text-[10px] text-amber-600 mt-1">Our team typically responds within 4 hours.</p>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>

                                            {ticket.status !== "closed" && ticket.status !== "resolved" && ticket.messages?.some(m => m.sender === 'admin') && (
                                                <div className="flex justify-end pt-2">
                                                    <Button
                                                        variant="outline"
                                                        className="text-green-600 border-green-200 hover:bg-green-50 font-bold text-xs h-9"
                                                        onClick={() => handleCloseTicket(ticket._id)}
                                                    >
                                                        <CheckCircle className="w-3 h-3 mr-2" />
                                                        Mark as Resolved
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="bg-white rounded-3xl border-2 border-dashed p-16 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Everything looks clear!</h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-8">You don&apos;t have any {activeTab === 'all' ? '' : activeTab.replace('_', ' ')} support tickets at the moment.</p>
                            <Button
                                onClick={() => setShowForm(true)}
                                className="bg-gray-900 hover:bg-black font-bold h-11 px-8"
                            >
                                Need Assistance?
                            </Button>
                        </div>
                    )}
                </TabsContent>

                {/* Support Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: "Working Hours", content: "9 AM - 6 PM IST (Mon-Sat)", icon: Clock },
                        { title: "Average Response", content: "Under 4 hours", icon: MessageSquare },
                        { title: "Urgent Priority", content: "Typically 30-60 mins", icon: AlertCircle }
                    ].map((item, i) => (
                        <div key={i} className="bg-white border rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                <item.icon className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.title}</p>
                                <p className="text-sm font-bold text-gray-900">{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
