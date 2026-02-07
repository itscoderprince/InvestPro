"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
    Settings,
    Sliders,
    CreditCard,
    Shield,
    Mail,
    Database,
    Users,
    HardDrive,
    FileText,
    Save,
    Check,
    X,
    Upload,
    AlertTriangle,
    Clock,
    Globe,
    Lock,
    Bell,
    Trash2,
    Plus,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    Search,
    Zap,
    Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Save Status Indicator Component
function SaveStatusIndicator({ status, onSave, onRetry }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (status === "saved") {
            const timer = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setVisible(true);
        }
    }, [status]);

    if (!visible && status === "saved") return null;

    const configs = {
        saved: {
            icon: CheckCircle,
            text: "All changes saved",
            bg: "bg-green-50 border-green-200",
            iconColor: "text-green-600",
            textColor: "text-green-700",
        },
        saving: {
            icon: Loader2,
            text: "Saving changes...",
            bg: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-600",
            textColor: "text-blue-700",
            spin: true,
        },
        unsaved: {
            icon: AlertCircle,
            text: "Unsaved changes",
            bg: "bg-yellow-50 border-yellow-200",
            iconColor: "text-yellow-600",
            textColor: "text-yellow-700",
            action: { label: "Save Now", onClick: onSave },
        },
        error: {
            icon: XCircle,
            text: "Failed to save",
            bg: "bg-red-50 border-red-200",
            iconColor: "text-red-600",
            textColor: "text-red-700",
            action: { label: "Retry", onClick: onRetry },
        },
    };

    const config = configs[status];
    const Icon = config.icon;

    return (
        <div className={`fixed top-24 right-8 z-50 flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${config.bg}`}>
            <Icon className={`w-4 h-4 ${config.iconColor} ${config.spin ? "animate-spin" : ""}`} />
            <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
            {config.action && (
                <button
                    onClick={config.action.onClick}
                    className={`ml-1 text-xs font-semibold px-2 py-0.5 rounded ${status === "error" ? "bg-red-600 text-white hover:bg-red-700" : "bg-yellow-600 text-white hover:bg-yellow-700"} transition-colors`}
                >
                    {config.action.label}
                </button>
            )}
        </div>
    );
}

// Custom components deleted in favor of shadcn/ui

// Category colors
const categoryColors = {
    general: "#2563eb",
    platform: "#7c3aed",
    payment: "#10b981",
    security: "#ef4444",
    email: "#f59e0b",
    indices: "#14b8a6",
    admins: "#4f46e5",
    system: "#6b7280",
    legal: "#64748b",
};

// Settings categories
const categories = [
    { id: "general", label: "General Settings", icon: Settings, color: categoryColors.general },
    { id: "platform", label: "Platform Configuration", icon: Sliders, color: categoryColors.platform },
    { id: "payment", label: "Payment Settings", icon: CreditCard, color: categoryColors.payment },
    { id: "security", label: "Security & Access", icon: Shield, color: categoryColors.security },
    { id: "email", label: "Email & Notifications", icon: Mail, color: categoryColors.email },
    { id: "indices", label: "Indices Configuration", icon: Database, color: categoryColors.indices },
    { id: "admins", label: "Admin Users", icon: Users, color: categoryColors.admins },
    { id: "system", label: "System & Backup", icon: HardDrive, color: categoryColors.system },
    { id: "legal", label: "Legal & Compliance", icon: FileText, color: categoryColors.legal },
];

// Searchable settings
const searchableSettings = [
    { id: "platformName", label: "Platform Name", category: "general" },
    { id: "supportEmail", label: "Support Email", category: "general" },
    { id: "maintenanceMode", label: "Maintenance Mode", category: "general" },
    { id: "minInvestment", label: "Minimum Investment", category: "platform" },
    { id: "maxInvestment", label: "Maximum Investment", category: "platform" },
    { id: "weeklyReturn", label: "Weekly Return", category: "platform" },
    { id: "bankDetails", label: "Bank Account Details", category: "payment" },
    { id: "withdrawalLimits", label: "Withdrawal Limits", category: "payment" },
    { id: "twoFactor", label: "Two-Factor Authentication", category: "security" },
    { id: "passwordRules", label: "Password Requirements", category: "security" },
    { id: "smtpSettings", label: "SMTP Settings", category: "email" },
    { id: "adminTeam", label: "Admin Team", category: "admins" },
    { id: "databaseBackup", label: "Database Backup", category: "system" },
    { id: "termsConditions", label: "Terms & Conditions", category: "legal" },
];

import { useAdminSettings, useAdminUsers } from "@/hooks/useApi";
import { adminApi } from "@/lib/api";

const quickActions = [
    { id: "backup", label: "Backup Now", icon: HardDrive, shortcut: "B" },
    { id: "testEmail", label: "Send Test Email", icon: Mail, shortcut: "E" },
    { id: "clearCache", label: "Clear Cache", icon: Trash2, shortcut: "C" },
    { id: "errorLogs", label: "View Error Logs", icon: AlertCircle, shortcut: "L" },
    { id: "addAdmin", label: "Add Admin User", icon: Users, shortcut: "A" },
];

export default function AdminSettingsPage() {
    const [activeCategory, setActiveCategory] = useState("general");
    const [saveStatus, setSaveStatus] = useState("saved");
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const searchInputRef = React.useRef(null);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setShowSearch(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
            }
            if (e.key === "Escape") {
                setShowSearch(false);
                setShowQuickActions(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const filteredSettings = searchableSettings.filter(s =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { settings, loading, error, updateSettings: apiUpdateSettings, refetch, initSettings } = useAdminSettings(activeCategory);
    const { users: adminList, loading: usersLoading } = useAdminUsers({ role: 'admin' });

    // Local state for edits
    const [localSettings, setLocalSettings] = useState({});

    useEffect(() => {
        if (settings) {
            setLocalSettings(settings);
        }
    }, [settings]);

    const handleSave = async () => {
        setSaveStatus("saving");
        try {
            await apiUpdateSettings(localSettings);
            setSaveStatus("saved");
            setToast({ message: "Settings saved successfully", type: "success" });
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            setSaveStatus("error");
            setToast({ message: err.message || "Failed to save settings", type: "error" });
        }
    };

    const updateLocalSettings = (updates) => {
        setLocalSettings((prev) => ({ ...prev, ...updates }));
        setSaveStatus("unsaved");
    };

    if (loading && !settings) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading Settings...</p>
            </div>
        );
    }



    const renderContent = () => {
        switch (activeCategory) {
            case "general":
                return (
                    <div className="space-y-6">
                        {/* Platform Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Information</CardTitle>
                                <CardDescription>Basic information about your platform</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="platformName">Platform Name *</Label>
                                        <input
                                            id="platformName"
                                            type="text"
                                            value={localSettings?.platformName || ""}
                                            onChange={(e) => updateLocalSettings({ platformName: e.target.value })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tagline">Tagline</Label>
                                        <input
                                            id="tagline"
                                            type="text"
                                            value={localSettings?.tagline || ""}
                                            onChange={(e) => updateLocalSettings({ tagline: e.target.value })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="supportEmail">Support Email *</Label>
                                        <input
                                            id="supportEmail"
                                            type="email"
                                            value={localSettings?.supportEmail || ""}
                                            onChange={(e) => updateLocalSettings({ supportEmail: e.target.value })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="supportPhone">Support Phone</Label>
                                        <input
                                            id="supportPhone"
                                            type="text"
                                            value={localSettings?.supportPhone || ""}
                                            onChange={(e) => updateLocalSettings({ supportPhone: e.target.value })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 rounded-lg">
                                            <AvatarFallback className="bg-[#2563eb] text-white">IP</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium text-[#111827]">Platform Logo</p>
                                            <p className="text-xs text-[#6b7280]">PNG, JPG (max 2MB)</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Upload Logo</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Maintenance Mode */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle>Maintenance Mode</CardTitle>
                                    <CardDescription>Temporarily disable user access for updates</CardDescription>
                                </div>
                                <Switch
                                    checked={!!localSettings?.maintenanceMode}
                                    onCheckedChange={(val) => updateLocalSettings({ maintenanceMode: val })}
                                />
                            </CardHeader>
                            {localSettings?.maintenanceMode && (
                                <CardContent className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="space-y-2">
                                        <Label>Message to Users</Label>
                                        <textarea
                                            value={localSettings?.maintenanceMessage || ""}
                                            onChange={(e) => updateLocalSettings({ maintenanceMessage: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none resize-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                                        <p className="text-xs text-orange-800">Users will see maintenance page. Admins can still access.</p>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                );

            case "platform":
                return (
                    <div className="space-y-6">
                        {/* Investment Limits */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Investment Limits</CardTitle>
                                <CardDescription>These limits apply across all indices unless overridden</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minInvestment">Minimum Investment (₹)</Label>
                                    <input
                                        id="minInvestment"
                                        type="number"
                                        value={localSettings?.minInvestment || ""}
                                        onChange={(e) => updateLocalSettings({ minInvestment: parseInt(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxInvestment">Maximum Investment (₹)</Label>
                                    <input
                                        id="maxInvestment"
                                        type="number"
                                        value={localSettings?.maxInvestment || ""}
                                        onChange={(e) => updateLocalSettings({ maxInvestment: parseInt(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxActiveInvestments">Max Active Investments</Label>
                                    <input
                                        id="maxActiveInvestments"
                                        type="number"
                                        value={localSettings?.maxActiveInvestments || ""}
                                        onChange={(e) => updateLocalSettings({ maxActiveInvestments: parseInt(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Return Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Return Configuration</CardTitle>
                                <CardDescription>Configure how returns are calculated and distributed</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minWeeklyReturn">Min Weekly Return (%)</Label>
                                    <input
                                        id="minWeeklyReturn"
                                        type="number"
                                        step="0.5"
                                        value={localSettings?.minWeeklyReturn || ""}
                                        onChange={(e) => updateLocalSettings({ minWeeklyReturn: parseFloat(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxWeeklyReturn">Max Weekly Return (%)</Label>
                                    <input
                                        id="maxWeeklyReturn"
                                        type="number"
                                        step="0.5"
                                        value={localSettings?.maxWeeklyReturn || ""}
                                        onChange={(e) => updateLocalSettings({ maxWeeklyReturn: parseFloat(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="returnDay">Return Distribution Day</Label>
                                    <select
                                        id="returnDay"
                                        value={localSettings?.returnDay || "Monday"}
                                        onChange={(e) => updateLocalSettings({ returnDay: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] outline-none bg-white"
                                    >
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* User Registration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>User Registration</CardTitle>
                                <CardDescription>Configure user signup and verification rules</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-0">
                                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                    <div className="space-y-0.5">
                                        <Label>Allow New Registrations</Label>
                                        <p className="text-xs text-[#6b7280]">Enable or disable new user signups</p>
                                    </div>
                                    <Switch
                                        checked={!!localSettings?.allowRegistrations}
                                        onCheckedChange={(val) => updateLocalSettings({ allowRegistrations: val })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                    <div className="space-y-0.5">
                                        <Label>Require Email Verification</Label>
                                        <p className="text-xs text-[#6b7280]">Users must verify email before login</p>
                                    </div>
                                    <Switch
                                        checked={!!localSettings?.requireEmailVerification}
                                        onCheckedChange={(val) => updateLocalSettings({ requireEmailVerification: val })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                    <div className="space-y-0.5">
                                        <Label>Require Phone Verification</Label>
                                        <p className="text-xs text-[#6b7280]">Users must verify phone number</p>
                                    </div>
                                    <Switch
                                        checked={!!localSettings?.requirePhoneVerification}
                                        onCheckedChange={(val) => updateLocalSettings({ requirePhoneVerification: val })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-4">
                                    <div className="space-y-0.5">
                                        <Label>Auto-Approve KYC</Label>
                                        <p className="text-xs text-red-500">⚠️ Not recommended - enables automatic approval</p>
                                    </div>
                                    <Switch
                                        checked={!!localSettings?.autoApproveKYC}
                                        onCheckedChange={(val) => updateLocalSettings({ autoApproveKYC: val })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case "payment":
                return (
                    <div className="space-y-6">
                        {/* Bank Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Offline Payment Instructions</CardTitle>
                                <CardDescription>These details are shown to users for offline payments</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                                    <input
                                        id="accountHolder"
                                        type="text"
                                        value={localSettings?.accountHolder || ""}
                                        onChange={(e) => updateLocalSettings({ accountHolder: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accountNumber">Account Number</Label>
                                    <input
                                        id="accountNumber"
                                        type="text"
                                        value={localSettings?.accountNumber || ""}
                                        onChange={(e) => updateLocalSettings({ accountNumber: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ifscCode">IFSC Code</Label>
                                    <input
                                        id="ifscCode"
                                        type="text"
                                        value={localSettings?.ifscCode || ""}
                                        onChange={(e) => updateLocalSettings({ ifscCode: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bankName">Bank Name</Label>
                                    <input
                                        id="bankName"
                                        type="text"
                                        value={localSettings?.bankName || ""}
                                        onChange={(e) => updateLocalSettings({ bankName: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="branch">Branch</Label>
                                    <input
                                        id="branch"
                                        type="text"
                                        value={localSettings?.branch || ""}
                                        onChange={(e) => updateLocalSettings({ branch: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="upiId">UPI ID</Label>
                                    <input
                                        id="upiId"
                                        type="text"
                                        value={localSettings?.upiId || ""}
                                        onChange={(e) => updateLocalSettings({ upiId: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Withdrawal Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Withdrawal Settings</CardTitle>
                                <CardDescription>Manage withdrawal limits and fees</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="minWithdrawal">Minimum Withdrawal (₹)</Label>
                                    <input
                                        id="minWithdrawal"
                                        type="number"
                                        value={localSettings?.minWithdrawal || ""}
                                        onChange={(e) => updateLocalSettings({ minWithdrawal: parseInt(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxWithdrawal">Maximum Withdrawal (₹)</Label>
                                    <input
                                        id="maxWithdrawal"
                                        type="number"
                                        value={localSettings?.maxWithdrawal || ""}
                                        onChange={(e) => updateLocalSettings({ maxWithdrawal: parseInt(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="withdrawalFee">Withdrawal Fee (₹)</Label>
                                    <input
                                        id="withdrawalFee"
                                        type="number"
                                        value={localSettings?.withdrawalFee || ""}
                                        onChange={(e) => updateLocalSettings({ withdrawalFee: parseInt(e.target.value) })}
                                        className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 outline-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case "security":
                return (
                    <div className="space-y-6">
                        {/* Admin Authentication */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Admin Authentication</CardTitle>
                                <CardDescription>Manage how administrators access the platform</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                    <div className="space-y-0.5">
                                        <Label>Require 2FA for Admin Login</Label>
                                        <p className="text-xs text-[#6b7280]">Two-factor authentication for all admins</p>
                                    </div>
                                    <Switch
                                        checked={!!localSettings?.require2FA}
                                        onCheckedChange={(val) => updateLocalSettings({ require2FA: val })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTimeout">Session Timeout (mins)</Label>
                                        <select
                                            id="sessionTimeout"
                                            value={localSettings?.sessionTimeout || 30}
                                            onChange={(e) => updateLocalSettings({ sessionTimeout: parseInt(e.target.value) })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm bg-white outline-none"
                                        >
                                            {[15, 30, 60, 120].map((mins) => (
                                                <option key={mins} value={mins}>{mins} minutes</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                                        <input
                                            id="maxLoginAttempts"
                                            type="number"
                                            value={localSettings?.maxLoginAttempts || ""}
                                            onChange={(e) => updateLocalSettings({ maxLoginAttempts: parseInt(e.target.value) })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lockoutDuration">Lockout Duration (mins)</Label>
                                        <input
                                            id="lockoutDuration"
                                            type="number"
                                            value={localSettings?.lockoutDuration || ""}
                                            onChange={(e) => updateLocalSettings({ lockoutDuration: parseInt(e.target.value) })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Password Requirements */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle>Password Requirements</CardTitle>
                                    <CardDescription>Configure password complexity rules for users</CardDescription>
                                </div>
                                <Switch
                                    checked={!!localSettings?.requireStrongPasswords}
                                    onCheckedChange={(val) => updateLocalSettings({ requireStrongPasswords: val })}
                                />
                            </CardHeader>
                            {localSettings?.requireStrongPasswords && (
                                <CardContent className="space-y-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <Label htmlFor="minPasswordLength">Minimum length:</Label>
                                        <input
                                            id="minPasswordLength"
                                            type="number"
                                            value={localSettings?.minPasswordLength || ""}
                                            onChange={(e) => updateLocalSettings({ minPasswordLength: parseInt(e.target.value) })}
                                            className="w-20 h-9 px-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#2563eb]"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-6">
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="requireUpper" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" />
                                            <Label htmlFor="requireUpper" className="text-sm font-normal">Require uppercase</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="requireNums" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" />
                                            <Label htmlFor="requireNums" className="text-sm font-normal">Require numbers</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="requireSpecial" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]" />
                                            <Label htmlFor="requireSpecial" className="text-sm font-normal">Require special chars</Label>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>

                        {/* Activity Logging */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Logging</CardTitle>
                                <CardDescription>Track events and actions within the system</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <Label>Log User Actions</Label>
                                    <Switch
                                        checked={!!localSettings?.logUserActions}
                                        onCheckedChange={(val) => updateLocalSettings({ logUserActions: val })}
                                    />
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <Label>Log Admin Actions</Label>
                                    <Switch
                                        checked={!!localSettings?.logAdminActions}
                                        onCheckedChange={(val) => updateLocalSettings({ logAdminActions: val })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 pt-4 border-t border-gray-100">
                                <Button variant="outline" size="sm">Download Logs</Button>
                                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Clear Old Logs</Button>
                            </CardFooter>
                        </Card>
                    </div>
                );

            case "admins":
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle>Admin Team</CardTitle>
                                    <CardDescription>Manage your platform administrators and their roles</CardDescription>
                                </div>
                                <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                                    <Plus className="w-4 h-4 mr-2" />Add Admin
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#f9fafb] border-y border-gray-100">
                                            <tr>
                                                <th className="text-left text-xs font-semibold text-[#6b7280] uppercase px-6 py-4">Admin</th>
                                                <th className="text-left text-xs font-semibold text-[#6b7280] uppercase px-6 py-4">Role</th>
                                                <th className="text-left text-xs font-semibold text-[#6b7280] uppercase px-6 py-4">Last Login</th>
                                                <th className="text-left text-xs font-semibold text-[#6b7280] uppercase px-6 py-4">Status</th>
                                                <th className="text-left text-xs font-semibold text-[#6b7280] uppercase px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {adminList.map((admin) => (
                                                <tr key={admin.id || admin._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-9 w-9">
                                                                <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white text-xs">
                                                                    {admin.name.split(" ").map(n => n[0]).join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-medium text-[#111827]">{admin.name}</p>
                                                                <p className="text-xs text-[#6b7280]">{admin.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="secondary" className={`${admin.role === "Super Admin" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"} border-none`}>
                                                            {admin.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-[#6b7280]">{admin.lastLogin}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                                            <span className="text-sm text-[#111827]">Active</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-[#111827]">
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case "system":
                return (
                    <div className="space-y-6">
                        {/* Database Backup */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Database Backup</CardTitle>
                                <CardDescription>Configure automated database backups and retention</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">Last backup successfully completed 2 hours ago</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="backupFrequency">Backup Frequency</Label>
                                        <select id="backupFrequency" defaultValue="Daily" className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm bg-white outline-none focus:border-[#2563eb]">
                                            <option value="Hourly">Hourly</option>
                                            <option value="Daily">Daily</option>
                                            <option value="Weekly">Weekly</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="backupTime">Backup Time</Label>
                                        <input id="backupTime" type="time" defaultValue="02:00" className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#2563eb]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="retention">Retention (backups)</Label>
                                        <input
                                            id="retention"
                                            type="number"
                                            value={localSettings?.backupRetention || 30}
                                            onChange={(e) => updateLocalSettings({ backupRetention: parseInt(e.target.value) })}
                                            className="w-full h-10 px-4 rounded-lg border border-gray-300 text-sm outline-none focus:border-[#2563eb]"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2 border-t border-gray-100 pt-6">
                                <Button className="bg-[#2563eb] hover:bg-[#1d4ed8]">Backup Now</Button>
                                <Button variant="outline">Download Latest</Button>
                            </CardFooter>
                        </Card>

                        {/* System Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>System Information</CardTitle>
                                <CardDescription>Environment details and platform status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: "Platform Version", value: "v1.0.0" },
                                        { label: "Database", value: "MongoDB 7.0" },
                                        { label: "Node.js", value: "v20.x" },
                                        { label: "Uptime", value: "15 days" }
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-[#f9fafb] rounded-xl border border-gray-100">
                                            <p className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm font-bold text-[#111827] mt-1">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cache Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Cache Management</CardTitle>
                                <CardDescription>Optimize performance by managing application cache</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between py-4">
                                <div>
                                    <p className="text-xs font-medium text-[#6b7280] uppercase">Current Cache Size</p>
                                    <p className="text-3xl font-bold text-[#111827] mt-1">145<span className="text-lg ml-1 font-medium text-gray-500">MB</span></p>
                                </div>
                                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">Clear Cache</Button>
                            </CardContent>
                        </Card>
                    </div>
                );

            case "legal":
                return (
                    <div className="space-y-6">
                        {/* Terms & Conditions */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle>Terms & Conditions</CardTitle>
                                    <CardDescription>Last updated: 1 Jan 2024</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hidden sm:flex"><Eye className="w-4 h-4 mr-1" />Preview</Button>
                                    <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">Save & Publish</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <textarea
                                    rows={8}
                                    value={localSettings?.termsAndConditions || ""}
                                    onChange={(e) => updateLocalSettings({ termsAndConditions: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm resize-none outline-none focus:border-[#2563eb] min-h-[200px]"
                                />
                            </CardContent>
                        </Card>

                        {/* Privacy Policy */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle>Privacy Policy</CardTitle>
                                    <CardDescription>Last updated: 1 Jan 2024</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="hidden sm:flex"><Eye className="w-4 h-4 mr-1" />Preview</Button>
                                    <Button size="sm" className="bg-[#2563eb] hover:bg-[#1d4ed8]">Save & Publish</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <textarea
                                    rows={8}
                                    value={localSettings?.privacyPolicy || ""}
                                    onChange={(e) => updateLocalSettings({ privacyPolicy: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm resize-none outline-none focus:border-[#2563eb] min-h-[200px]"
                                />
                            </CardContent>
                        </Card>

                        {/* Disclaimers */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Investment Disclaimers</CardTitle>
                                <CardDescription>Legal disclaimers shown on investment pages</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Risk Disclaimer</Label>
                                    <textarea
                                        rows={3}
                                        value={localSettings?.riskDisclaimer || ""}
                                        onChange={(e) => updateLocalSettings({ riskDisclaimer: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm resize-none outline-none focus:border-[#2563eb]"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            default:
                return (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-[#111827] mb-2">Coming Soon</h3>
                        <p className="text-[#6b7280]">This section is under development.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen">
            {/* Save Status Indicator */}
            <SaveStatusIndicator status={saveStatus} onSave={handleSave} onRetry={handleSave} />

            {/* Search Modal */}
            {showSearch && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24" onClick={() => setShowSearch(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search settings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 outline-none text-sm"
                                autoFocus
                            />
                            <kbd className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-500">ESC</kbd>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {filteredSettings.length > 0 ? (
                                filteredSettings.map((setting) => {
                                    const cat = categories.find((c) => c.id === setting.category);
                                    return (
                                        <button
                                            key={setting.id}
                                            onClick={() => {
                                                setActiveCategory(setting.category);
                                                setShowSearch(false);
                                                setSearchQuery("");
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat?.color}15` }}>
                                                {cat && <cat.icon className="w-4 h-4" style={{ color: cat.color }} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[#111827]">{setting.label}</p>
                                                <p className="text-xs text-[#6b7280]">{cat?.label}</p>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-8 text-center text-sm text-[#6b7280]">No settings found</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions Modal */}
            {showQuickActions && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowQuickActions(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-[#111827]">Quick Actions</h3>
                            <p className="text-xs text-[#6b7280]">Keyboard shortcuts available</p>
                        </div>
                        <div className="p-2">
                            {quickActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => {
                                        setShowQuickActions(false);
                                        setToast({ message: `${action.label} triggered`, type: "success" });
                                        setTimeout(() => setToast(null), 3000);
                                    }}
                                    className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <action.icon className="w-5 h-5 text-[#6b7280]" />
                                        <span className="text-sm font-medium text-[#111827]">{action.label}</span>
                                    </div>
                                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-500">{action.shortcut}</kbd>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-[1400px] mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Settings & Configuration</h1>
                        <p className="text-[#6b7280] text-sm mt-1">Manage platform settings, security, and preferences</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setShowSearch(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
                        >
                            <Search className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600 hidden sm:inline">Search settings...</span>
                            <kbd className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-white rounded border border-gray-300 text-gray-500 font-sans uppercase">
                                <Command className="w-2.5 h-2.5" />K
                            </kbd>
                        </button>
                        <Button onClick={handleSave} disabled={saveStatus === "saved" || saveStatus === "saving"} className="bg-[#2563eb] hover:bg-[#1d4ed8] shadow-sm">
                            {saveStatus === "saving" ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Saving...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" />Save Changes</>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto p-8">
                <Tabs value={activeCategory} onValueChange={setActiveCategory} orientation="vertical" className="flex flex-col lg:flex-row gap-8">
                    <TabsList className="lg:w-72 h-auto flex flex-col items-stretch bg-transparent space-y-1 p-0">
                        {categories.map((cat) => (
                            <TabsTrigger
                                key={cat.id}
                                value={cat.id}
                                className={`
                                    justify-start gap-3 px-4 py-3 h-auto rounded-xl text-sm font-medium transition-all
                                    data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#111827]
                                    data-[state=inactive]:text-[#6b7280] data-[state=inactive]:hover:bg-gray-100/80 data-[state=inactive]:hover:text-[#111827]
                                `}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor: activeCategory === cat.id ? `${cat.color}15` : 'transparent',
                                    }}
                                >
                                    <cat.icon
                                        className="w-4 h-4"
                                        style={{ color: activeCategory === cat.id ? cat.color : '#6b7280' }}
                                    />
                                </div>
                                <span>{cat.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex-1 min-w-0">
                        <TabsContent value={activeCategory} className="mt-0 focus-visible:outline-none">
                            {renderContent()}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Quick Actions FAB */}
            <button
                onClick={() => setShowQuickActions(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group z-40"
            >
                <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}
