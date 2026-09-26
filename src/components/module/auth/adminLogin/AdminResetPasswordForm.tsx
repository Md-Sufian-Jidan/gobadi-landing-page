"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { adminVerifyOtpAction, adminResetPasswordAction } from "@/services/adminAuth.service";

const verifyOtpSchema = z.object({
    code: z.string().min(1, "Code is required").length(4, "Code must be 4 digits"),
});

const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function AdminResetPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<"otp" | "password">("otp");
    const [resetToken, setResetToken] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);

    const otpForm = useForm<VerifyOtpFormData>({
        resolver: zodResolver(verifyOtpSchema),
    });

    const passwordForm = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onVerifyOtp = async (data: VerifyOtpFormData) => {
        try {
            const res = await adminVerifyOtpAction("", data.code, "reset");
            if (res.status) {
                setResetToken(res.data?.resetToken || "");
                setStep("password");
                toast.success("Code verified successfully!");
            } else {
                toast.error(res.message || "Invalid code");
            }
        } catch (error) {
            console.error("Verify OTP error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const onResetPassword = async (data: ResetPasswordFormData) => {
        try {
            const res = await adminResetPasswordAction(data.newPassword);
            if (res.status) {
                toast.success("Password reset successfully!");
                router.push("/admin-login");
            } else {
                toast.error(res.message || "Failed to reset password");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    if (step === "password") {
        return (
            <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="w-full flex flex-col gap-5">
                <div className="text-center mb-2">
                    <h2 className="text-lg font-semibold text-[#1A1A1A]">Set New Password</h2>
                    <p className="text-sm text-[#737373] mt-1">
                        Enter your new password below.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="newPassword" className="text-xs font-semibold text-[#525252]">
                        New Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="newPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-11 px-4 pr-10 rounded-xl border-[#E2E2E2] bg-white text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none"
                            {...passwordForm.register("newPassword")}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                        <p className="text-xs text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold text-[#525252]">
                        Confirm Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className="h-11 px-4 rounded-xl border-[#E2E2E2] bg-white text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none"
                        {...passwordForm.register("confirmPassword")}
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={passwordForm.formState.isSubmitting}
                    className="mt-2 h-11 w-full rounded-xl bg-[#242424] hover:bg-[#1A1A1A] text-white text-sm font-medium transition-all shadow-none cursor-pointer"
                >
                    {passwordForm.formState.isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Resetting...</span>
                        </div>
                    ) : (
                        "Reset Password"
                    )}
                </Button>
            </form>
        );
    }

    return (
        <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="w-full flex flex-col gap-5">
            <div className="text-center mb-2">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Enter Verification Code</h2>
                <p className="text-sm text-[#737373] mt-1">
                    Enter the 4-digit code sent to your email.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="code" className="text-xs font-semibold text-[#525252]">
                    Verification Code
                </Label>
                <Input
                    id="code"
                    type="text"
                    placeholder="1234"
                    maxLength={4}
                    className="h-11 px-4 rounded-xl border-[#E2E2E2] bg-white text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none text-center text-lg tracking-[0.5em]"
                    {...otpForm.register("code")}
                />
                {otpForm.formState.errors.code && (
                    <p className="text-xs text-red-500">{otpForm.formState.errors.code.message}</p>
                )}
            </div>

            <Button
                type="submit"
                disabled={otpForm.formState.isSubmitting}
                className="mt-2 h-11 w-full rounded-xl bg-[#242424] hover:bg-[#1A1A1A] text-white text-sm font-medium transition-all shadow-none cursor-pointer"
            >
                {otpForm.formState.isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Verifying...</span>
                    </div>
                ) : (
                    "Verify Code"
                )}
            </Button>

            <button
                type="button"
                onClick={() => router.push("/admin-login/forgot-password")}
                className="text-xs text-[#888888] hover:text-[#1A1A1A] transition-colors"
            >
                Back to forgot password
            </button>
        </form>
    );
}
