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
    ChevronDown,
    ChevronUp,
    Info,
    ArrowLeft,
    ShieldCheck,
    FileCheck,
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
            alert("File size must be less than 5MB");
            return;
        }
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(selectedFile.type)) {
            alert("Please upload JPG, PNG, or PDF files only");
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
    const [mounted, setMounted] = useState(false);
    const [aadharFile, setAadharFile] = useState(null);
    const [panFile, setPanFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [kycStatus, setKycStatus] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const canSubmit = aadharFile && panFile && !isUploading;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsUploading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsUploading(false);
        setUploadSuccess(true);
        setKycStatus("pending");
    };

    if (!mounted) return null;

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

            <div className="grid grid-cols-1 gap-8">
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold">Document Submission</CardTitle>
                                <CardDescription className="text-xs font-medium">Clear copies of ID cards required</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-8 pt-8">
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
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting Verification...
                                </span>
                            ) : (
                                "Submit Identity Documents"
                            )}
                        </Button>
                        <Button asChild variant="ghost" className="w-full md:w-auto font-bold h-12 text-gray-400">
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
