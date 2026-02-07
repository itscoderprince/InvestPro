"use client";

import * as React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
    Upload,
    FileText,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    Info,
    ArrowLeft,
    ShieldCheck,
    FileCheck,
    Home,
    Loader2,
    Fingerprint,
    CreditCard,
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKYC } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// File Upload Zone Component
function FileUploadZone({ label, file, onFileSelect, onRemove, accept = ".jpg,.jpeg,.png,.pdf" }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile);
        }
    }, []);

    const validateAndSetFile = (selectedFile) => {
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(selectedFile.type)) {
            toast.error("Please upload JPG, PNG, or PDF files only");
            return;
        }
        onFileSelect(selectedFile);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) validateAndSetFile(selectedFile);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{label}</label>

            {!file ? (
                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${isDragging
                        ? "border-[#2563eb] bg-blue-50/50"
                        : "border-gray-200 hover:border-[#2563eb] hover:bg-gray-50 bg-white"
                        }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${isDragging ? "bg-[#2563eb] text-white" : "bg-white text-gray-400 group-hover:text-[#2563eb]"
                            }`}>
                            <Upload className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Maximum file size: 5MB (JPG, PNG, PDF)</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-4 bg-white shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border">
                        {file.type.startsWith("image/") ? (
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FileCheck className="w-6 h-6 text-[#2563eb]" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{formatFileSize(file.size)}</p>
                    </div>

                    <button
                        onClick={onRemove}
                        className="p-2.5 hover:bg-red-50 rounded-xl transition-colors group"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default function KYCPage() {
    const { refreshUser } = useAuthStore();
    const { status, kyc, loading: kycLoading, upload, resubmit } = useKYC();
    const [aadharNumber, setAadharNumber] = useState("");
    const [panNumber, setPanNumber] = useState("");
    const [aadharFile, setAadharFile] = useState(null);
    const [panFile, setPanFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);

    const canSubmit = aadharNumber.length === 12 && panNumber.length === 10 && aadharFile && panFile && !isUploading;

    const handleSubmit = async () => {
        if (!canSubmit) {
            if (aadharNumber.length !== 12) toast.error("Aadhar number must be 12 digits");
            if (panNumber.length !== 10) toast.error("PAN number must be 10 characters");
            return;
        }
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('aadharNumber', aadharNumber.trim());
            formData.append('panNumber', panNumber.trim().toUpperCase());
            formData.append('aadharDocument', aadharFile);
            formData.append('panDocument', panFile);

            if (status === 'rejected') {
                await resubmit(formData);
            } else {
                await upload(formData);
            }

            setUploadSuccess(true);
            toast.success("KYC documents submitted successfully");
            await refreshUser();
        } catch (err) {
            setError(err.message || 'Failed to upload documents');
            toast.error(err.message || 'Failed to upload documents');
        } finally {
            setIsUploading(false);
        }
    };

    if (kycLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Already approved
    if (status === 'approved') {
        return (
            <div className="max-w-md mx-auto py-12">
                <Card className="border-none shadow-xl text-center p-8 md:p-12 overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3">Verification Complete</h2>
                        <p className="text-sm text-gray-500 mb-10 leading-relaxed">
                            Your identity has been verified. You have full access to all platform features.
                        </p>
                        <Button asChild className="w-full bg-gray-900 hover:bg-black font-bold h-12 shadow-lg">
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Pending review
    if (status === 'pending' || status === 'submitted') {
        return (
            <div className="max-w-md mx-auto py-12">
                <Card className="border-none shadow-xl text-center p-8 md:p-12 overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Clock className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3">Under Review</h2>
                        <p className="text-sm text-gray-500 mb-10 leading-relaxed">
                            Your documents are being reviewed by our compliance team. This usually takes <span className="text-gray-900 font-bold">24-48 hours</span>.
                        </p>
                        <Button asChild className="w-full bg-gray-900 hover:bg-black font-bold h-12 shadow-lg">
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Upload success
    if (uploadSuccess) {
        return (
            <div className="max-w-md mx-auto py-12">
                <Card className="border-none shadow-xl text-center p-8 md:p-12 overflow-hidden relative">
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in-95 duration-500">
                            <ShieldCheck className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-3">Verification Started</h2>
                        <p className="text-sm text-gray-500 mb-10 leading-relaxed">
                            Your documents have been successfully queued for review. Our compliance team will verify your identity within <span className="text-gray-900 font-bold">24-48 hours</span>.
                        </p>
                        <Button asChild className="w-full bg-gray-900 hover:bg-black font-bold h-12 shadow-lg">
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // Rejected - show resubmit form
    const isResubmit = status === 'rejected';

    return (
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 pt-0 pb-2 md:pb-4 px-2 md:px-1">
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
                                <ShieldCheck className="w-3.5 h-3.5" />
                                KYC Verification
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-bold text-[10px]">VERIFICATION</Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-100 font-bold text-[10px]">STEP 1 OF 1</Badge>
                </div>
            </div>

            <Progress value={aadharFile && panFile ? 100 : aadharFile || panFile ? 50 : 10} className="h-2 bg-gray-100" />

            {/* Rejection message */}
            {isResubmit && kyc?.rejectionReason && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-800">Previous submission was rejected</p>
                        <p className="text-xs text-red-700 mt-1">{kyc.rejectionReason}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">
                                    {isResubmit ? 'Resubmit Documents' : 'Document Submission'}
                                </CardTitle>
                                <CardDescription className="text-xs font-medium">Clear copies of ID cards required</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8 pt-8">
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-amber-900">Important Requirement</p>
                                <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                                    Ensure the Name, Date of Birth, and Document ID are clearly visible and match your profile registration.
                                </p>
                            </div>
                        </div>

                        {/* Identity Numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="aadharNumber" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Aadhar Number (12 Digits)</Label>
                                <div className="relative">
                                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="aadharNumber"
                                        placeholder="1234 5678 9012"
                                        maxLength={12}
                                        value={aadharNumber}
                                        onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ""))}
                                        className="pl-10 h-11 border-gray-200 focus:border-blue-500 transition-all font-mono tracking-widest"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="panNumber" className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">PAN Number (10 Characters)</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="panNumber"
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                        value={panNumber}
                                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                        className="pl-10 h-11 border-gray-200 focus:border-blue-500 transition-all font-mono tracking-widest uppercase"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 pl-1">
                                        Format: 5 Letters, 4 Digits, 1 Letter (e.g., ABCDE1234F)
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <FileUploadZone
                                label="Proof of Residency (Aadhar)"
                                file={aadharFile}
                                onFileSelect={setAadharFile}
                                onRemove={() => setAadharFile(null)}
                            />

                            <FileUploadZone
                                label="Tax Identification (PAN)"
                                file={panFile}
                                onFileSelect={setPanFile}
                                onRemove={() => setPanFile(null)}
                            />
                        </div>

                        <Accordion type="single" collapsible className="w-full border-t pt-4">
                            <AccordionItem value="guidelines" className="border-none">
                                <AccordionTrigger className="text-xs font-bold text-gray-500 uppercase tracking-widest hover:no-underline hover:text-gray-900">
                                    Submission Guidelines
                                </AccordionTrigger>
                                <AccordionContent className="pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {[
                                            "Government issued original ID only",
                                            "No digital copies or screenshots",
                                            "Corners must be visible in frame",
                                            "Avoid glare or heavy shadows",
                                            "File size should be under 5MB",
                                            "Supported: JPG, PNG, PDF"
                                        ].map((tip, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t p-6 md:p-8 flex flex-col md:flex-row gap-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="w-full md:flex-1 h-12 bg-[#2563eb] hover:bg-[#1d4ed8] font-bold shadow-lg shadow-blue-500/20"
                        >
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting Verification...
                                </span>
                            ) : (
                                isResubmit ? "Resubmit Identity Documents" : "Submit Identity Documents"
                            )}
                        </Button>
                        <Button asChild variant="outline" className="w-full md:w-auto font-bold h-12 text-gray-400">
                            <Link href="/dashboard">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
