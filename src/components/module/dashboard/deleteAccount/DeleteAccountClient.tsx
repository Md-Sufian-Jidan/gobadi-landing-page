"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    AlertCircle,
    RefreshCw,
    EyeClosed,
    EyeOff,
    Loader2,
    Trash2,
    ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { deleteOwnAccountAction } from "@/services/adminAuth.service";
import { useAdminProfile } from "@/hooks/useAdminProfile";

const CONSEQUENCES = [
    "Your admin profile, settings, and session will be permanently removed.",
    "This action is immediate and cannot be undone or recovered.",
    "You will be signed out and returned to the login page.",
];

export default function DeleteAccountClient() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: admin, isLoading, isError, error, refetch } = useAdminProfile();

    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const email = admin?.email || "";
    const loading = isLoading && !admin;

    const handleDelete = async () => {
        if (!password) {
            toast.error("Enter your password to continue");
            return;
        }

        try {
            setDeleting(true);
            const result = await deleteOwnAccountAction(password);

            if (!result.status) {
                toast.error(result.message || "Failed to delete your account");
                return;
            }

            queryClient.clear();
            toast.success(result.message || "Your account has been deleted");
            router.push("/admin-login");
        } catch (err) {
            console.error("Delete account error:", err);
            toast.error("Failed to delete your account. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Card className="bg-[#FCFCFC] border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[28px] p-12 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#C15C2B] mb-3" />
                <p className="text-sm font-medium text-[#737373]">Loading...</p>
            </Card>
        );
    }

    if (isError && !admin) {
        return (
            <Card className="bg-[#FCFCFC] border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[28px] p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
                <p className="text-sm font-medium text-[#737373] mb-1">
                    {error?.message || "Failed to load your profile"}
                </p>
                <p className="text-xs text-[#A3A3A3] mb-4">
                    Check your connection and try again, or log in once more.
                </p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="h-10 px-4 rounded-md bg-[#C15C2B] hover:bg-[#A84F23] text-white font-semibold text-sm transition-all cursor-pointer flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </button>
            </Card>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col gap-6"
        >
            <Card className="bg-[#FCFCFC] border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[28px] p-4 border">
                <CardHeader className="border-b border-[#F5F2EC] pb-4 px-0 pt-0">
                    <CardTitle className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-display tracking-tight">
                        Delete Account
                    </CardTitle>
                </CardHeader>

                <CardContent className="px-0 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left: Warning */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                            <Card className="bg-gradient-to-b from-[#FEF2F2] via-white to-white border-[#FEE2E2] rounded-[24px] p-6 sm:p-7 flex flex-col gap-4 shadow-xs">
                                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-red-200/80 shadow-[0_10px_25px_rgba(239,68,68,0.15)]">
                                    <AlertTriangle className="w-7 h-7 text-[#DC2626] stroke-[2.25]" />
                                </div>

                                <div>
                                    <h2 className="text-base font-bold text-[#1A1A1A]">
                                        This action is permanent
                                    </h2>
                                    <p className="text-sm text-[#525252] leading-relaxed mt-1">
                                        Deleting your account removes your access to the Gobaadi
                                        dashboard immediately.
                                    </p>
                                </div>

                                <ul className="flex flex-col gap-2.5 text-sm text-[#525252] leading-relaxed">
                                    {CONSEQUENCES.map((item) => (
                                        <li key={item} className="flex items-start gap-2.5">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        {/* Right: Confirmation form */}
                        <Card className="lg:col-span-7 bg-white border-[#EAE5DD] rounded-[24px] p-6 flex flex-col gap-5 shadow-xs">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#FEF2F2] border border-red-200/70">
                                    <ShieldCheck className="w-5 h-5 text-[#DC2626]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#1A1A1A]">
                                        Confirm it&apos;s you
                                    </h3>
                                    <p className="text-xs text-[#737373]">
                                        Re-enter your password to delete{" "}
                                        <span className="font-semibold text-[#1A1A1A]">{email}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label
                                    htmlFor="deletePassword"
                                    className="text-sm font-semibold text-[#1A1A1A]"
                                >
                                    Password<span className="text-[#DC2626]">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="deletePassword"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleDelete();
                                        }}
                                        placeholder="*************"
                                        autoComplete="current-password"
                                        disabled={deleting}
                                        className="h-12 pr-11 rounded-[14px] bg-white border-[#EAE5DD] text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#DC2626] transition-all shadow-none px-4 disabled:opacity-60"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <EyeClosed className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mt-1 flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard/settings")}
                                    disabled={deleting}
                                    className="h-11 px-6 rounded-[16px] bg-[#F7F4EE] border border-[#EAE5DD] text-sm font-semibold text-[#525252] hover:bg-[#EFECE6] hover:text-[#1A1A1A] transition-all cursor-pointer outline-none shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting || !password}
                                    className="h-11 px-6 rounded-[16px] bg-gradient-to-r from-[#DC2626] to-[#EF4444] hover:from-[#B91C1C] hover:to-[#DC2626] text-sm font-semibold text-white shadow-[0_4px_16px_rgba(220,38,38,0.30)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.40)] active:scale-[0.98] transition-all cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete My Account</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
