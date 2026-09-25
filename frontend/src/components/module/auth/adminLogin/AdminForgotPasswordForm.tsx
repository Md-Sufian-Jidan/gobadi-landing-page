"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { adminForgotPasswordAction } from "@/services/adminAuth.service";

const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function AdminForgotPasswordForm() {
    const router = useRouter();
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            const res = await adminForgotPasswordAction(data.email);
            if (res.status) {
                setSent(true);
                toast.success("Reset code sent to your email!");
            } else {
                toast.error(res.message || "Failed to send reset code");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    if (sent) {
        return (
            <div className="w-full flex flex-col gap-5 text-center">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Check your email</h2>
                <p className="text-sm text-[#737373]">
                    We&apos;ve sent a verification code to your email address. Please check your inbox.
                </p>
                <Button
                    type="button"
                    onClick={() => router.push("/admin-login/reset-password")}
                    className="mt-2 h-11 w-full rounded-xl bg-[#242424] hover:bg-[#1A1A1A] text-white text-sm font-medium transition-all shadow-none cursor-pointer"
                >
                    Enter Reset Code
                </Button>
                <button
                    type="button"
                    onClick={() => router.push("/admin-login")}
                    className="text-xs text-[#888888] hover:text-[#1A1A1A] transition-colors"
                >
                    Back to login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
            <div className="text-center mb-2">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Forgot Password?</h2>
                <p className="text-sm text-[#737373] mt-1">
                    Enter your email address and we&apos;ll send you a code to reset your password.
                </p>
            </div>

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

            <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-11 w-full rounded-xl bg-[#242424] hover:bg-[#1A1A1A] text-white text-sm font-medium transition-all shadow-none cursor-pointer"
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending...</span>
                    </div>
                ) : (
                    "Send Reset Code"
                )}
            </Button>

            <button
                type="button"
                onClick={() => router.push("/admin-login")}
                className="text-xs text-[#888888] hover:text-[#1A1A1A] transition-colors"
            >
                Back to login
            </button>
        </form>
    );
}
