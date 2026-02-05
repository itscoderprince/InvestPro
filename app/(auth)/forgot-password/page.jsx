"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Mail, ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { forgotPasswordSchema } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            console.log("Forgot password submitted:", data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setIsSubmitted(true);
        } catch (error) {
            console.error("Forgot password error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <Card className="shadow-lg border-neutral-200/60">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-green-50 text-green-600 rounded-full">
                            <CheckCircle2 className="size-6" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
                    <CardDescription>
                        We&apos;ve sent password reset instructions to{" "}
                        <span className="font-semibold text-foreground underline decoration-primary/30 underline-offset-4">{getValues("email")}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="w-full h-11"
                    >
                        <RotateCcw className="mr-2 size-4" />
                        Didn&apos;t receive it? Resend
                    </Button>
                    <div className="text-center pt-2">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg border-neutral-200/60">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                    <div className="p-3 bg-primary/10 text-primary rounded-full">
                        <Mail className="size-6" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email" icon={Mail}>Email Address</FieldLabel>
                            <Input
                                {...register("email")}
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-muted/30 focus-visible:bg-white transition-colors"
                                required
                            />
                            {errors.email && (
                                <FieldDescription className="text-destructive font-medium mt-1">
                                    {errors.email.message}
                                </FieldDescription>
                            )}
                        </Field>

                        <Button type="submit" disabled={isLoading} className="w-full h-11">
                            {isLoading ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                "Send Reset Instructions"
                            )}
                        </Button>

                        <div className="text-center pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                            >
                                <ArrowLeft className="size-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
