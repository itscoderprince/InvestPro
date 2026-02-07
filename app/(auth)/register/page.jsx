"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Phone, Lock, UserPlus, Gift } from "lucide-react";
import { toast } from "sonner";
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
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { registerSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser } = useAuthStore();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            referralCode: "",
            agreeTerms: false,
        },
    });

    const password = watch("password");

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const response = await registerUser(data);
            toast.success("Account created! Redirecting...");

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            toast.error(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="shadow-lg border-neutral-200/60 transition-all duration-300">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>
                    Join InvestHub to start your investment journey
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FieldGroup>

                        <Field>
                            <FieldLabel htmlFor="fullName" icon={User}>Full Name</FieldLabel>
                            <Input
                                {...register("fullName")}
                                id="fullName"
                                placeholder="John Doe"
                                className="bg-muted/30 focus-visible:bg-white transition-colors"
                                required
                            />
                            {errors.fullName && (
                                <FieldDescription className="text-destructive font-medium">
                                    {errors.fullName.message}
                                </FieldDescription>
                            )}
                        </Field>

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
                                <FieldDescription className="text-destructive font-medium">
                                    {errors.email.message}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="phone" icon={Phone}>Phone Number</FieldLabel>
                            <Input
                                {...register("phone")}
                                id="phone"
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="bg-muted/30 focus-visible:bg-white transition-colors"
                                required
                            />
                            {errors.phone && (
                                <FieldDescription className="text-destructive font-medium">
                                    {errors.phone.message}
                                </FieldDescription>
                            )}
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="password" icon={Lock}>Password</FieldLabel>
                                <Input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-muted/30 focus-visible:bg-white transition-colors"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirmPassword" icon={Lock}>Confirm</FieldLabel>
                                <Input
                                    {...register("confirmPassword")}
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-muted/30 focus-visible:bg-white transition-colors"
                                    required
                                />
                            </Field>
                        </div>

                        {/* Password Strength Indicator */}
                        <PasswordStrength password={password} />

                        {(errors.password || errors.confirmPassword) && (
                            <FieldDescription className="text-destructive font-medium">
                                {errors.password?.message || errors.confirmPassword?.message}
                            </FieldDescription>
                        )}

                        <Field>
                            <FieldLabel htmlFor="referralCode" icon={Gift}>Referral Code (Optional)</FieldLabel>
                            <Input
                                {...register("referralCode")}
                                id="referralCode"
                                placeholder="REF12345"
                                className="bg-muted/30 focus-visible:bg-white transition-colors"
                            />
                        </Field>

                        <Field>
                            <div className="flex items-start gap-2">
                                <input
                                    {...register("agreeTerms")}
                                    type="checkbox"
                                    id="agreeTerms"
                                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                                        Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-primary underline-offset-4 hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {errors.agreeTerms && (
                                <FieldDescription className="text-destructive font-medium">
                                    {errors.agreeTerms.message}
                                </FieldDescription>
                            )}
                        </Field>

                        <Button type="submit" disabled={isLoading} className="w-full h-11">
                            {isLoading ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <UserPlus className="mr-2 size-4" />
                            )}
                            Create Account
                        </Button>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
