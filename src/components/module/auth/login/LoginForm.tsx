"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/services/auth.service";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            const res = await loginAction({ identifier: data.email, password: data.password });
            if (res.status) {
                toast.success("Login successful!");
                router.push("/dashboard");
            } else {
                toast.error("Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs font-semibold text-[#525252]">
                    Email
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="email@email.com"
                    className="h-11 px-4 rounded-xl border-[#E2E2E2] bg-white text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-[#525252]">
                        Password
                    </Label>
                    <button
                        type="button"
                        className="text-xs text-[#888888] hover:text-[#1A1A1A] transition-colors"
                    >
                        Forgot password?
                    </button>
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 px-4 rounded-xl border-[#E2E2E2] bg-white text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-11 w-full rounded-xl bg-[#242424] hover:bg-[#1A1A1A] text-white text-sm font-medium transition-all shadow-none cursor-pointer"
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Signing in...</span>
                    </div>
                ) : (
                    "Sign in"
                )}
            </Button>
        </form>
    );
}