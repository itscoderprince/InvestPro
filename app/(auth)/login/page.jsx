"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Mail, Lock, LogIn, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator
} from "@/components/ui/field";
import { loginSchema } from "@/lib/validations/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log("Login submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-neutral-200/60">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
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
              />
              {errors.email && (
                <FieldDescription className="text-destructive font-medium">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password" icon={Lock}>Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-muted/30 focus-visible:bg-white transition-colors"
              />
              {errors.password && (
                <FieldDescription className="text-destructive font-medium">
                  {errors.password.message}
                </FieldDescription>
              )}
            </Field>

            <Button type="submit" disabled={isLoading} className="w-full h-11">
              {isLoading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 size-4" />
              )}
              Sign In
            </Button>
            <div className="text-center text-sm text-balance">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
                Create Account
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
