"use client";

import { TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-svh flex flex-col items-center justify-center p-6 md:p-10 bg-muted/30">
            <div className="w-full max-w-sm md:max-w-md space-y-6">
                <div className="flex justify-center">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                            <TrendingUp className="size-5" />
                        </div>
                        <span className="text-xl">InvestHub Inc.</span>
                    </Link>
                </div>

                <div className="w-full">
                    {children}
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} InvestHub Inc. All rights reserved.
                </p>
            </div>
        </div>
    );
}
