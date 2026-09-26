"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Eye, EyeOff, Camera, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdminProfile, adminLogoutAction, updateAdminProfileAction } from "@/services/adminAuth.service";
import type { AdminProfile } from "@/types/auth.type";

const COUNTRIES = [
    { code: "DE", flag: "🇩🇪", label: "Germany (+49)" },
    { code: "BD", flag: "🇧🇩", label: "Bangladesh (+880)" },
    { code: "US", flag: "🇺🇸", label: "United States (+1)" },
    { code: "UK", flag: "🇬🇧", label: "United Kingdom (+44)" },
];

const getImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
    const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";
    return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function SettingsClient() {
    const router = useRouter();
    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [role, setRole] = useState<string>("");
    const [designation, setDesignation] = useState<string>("");
    const [profileImage, setProfileImage] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                const result = await getAdminProfile();
                if (result.status && result.data) {
                    const a = result.data as AdminProfile;
                    setAdmin(a);
                    if (a.name) {
                        const parts = a.name.trim().split(/\s+/);
                        setFirstName(parts[0] || "");
                        setLastName(parts.slice(1).join(" ") || "");
                    }
                    if (a.email) setEmail(a.email);
                    if (a.phone) setPhone(a.phone);
                    if (a.role) setRole(a.role);
                    if (a.designation) setDesignation(a.designation);
                    if (a.avatar) setProfileImage(a.avatar);
                }
            } catch (error) {
                console.error("Failed to load admin profile:", error);
                toast.error("Error loading profile details");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image must be smaller than 5 MB");
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setProfileImage(url);
            toast.success("Profile picture selected! Click 'Save Changes' to update profile picture.");
        }
    };

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await adminLogoutAction();
            toast.success("Logged out successfully");
            router.push("/admin-login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout");
        } finally {
            setLoggingOut(false);
        }
    };

    const handleSave = async () => {
        const name = [firstName, lastName].filter(Boolean).join(" ").trim();
        if (!firstName.trim() || !lastName.trim()) {
            toast.error("Please fill in both first and last name");
            return;
        }

        if (password && password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setSaving(true);
            const formData = new FormData();
            formData.append("name", name);
            if (password) formData.append("password", password);
            if (phone) formData.append("phone", phone);
            if (selectedFile) formData.append("avatar", selectedFile);

            const result = await updateAdminProfileAction(formData);
            if (!result.status) {
                toast.error(result.message || "Failed to update profile");
                setSaving(false);
                return;
            }

            toast.success("Profile updated successfully");
            if (result.data) setAdmin(result.data as AdminProfile);
            setSelectedFile(null);
            setPassword("");
            setConfirmPassword("");

            const refetched = await getAdminProfile();
            if (refetched.status && refetched.data) {
                const a = refetched.data as AdminProfile;
                setAdmin(a);
                if (a.name) {
                    const parts = a.name.trim().split(/\s+/);
                    setFirstName(parts[0] || "");
                    setLastName(parts.slice(1).join(" ") || "");
                }
                if (a.avatar) setProfileImage(a.avatar);
                if (a.phone) setPhone(a.phone);
            }

            router.refresh();
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const firstChar = firstName.trim() ? firstName.trim()[0].toUpperCase() : "";
    const lastChar = lastName.trim() ? lastName.trim()[0].toUpperCase() : "";
    const initials = `${firstChar}${lastChar}`;
    const displayName = [firstName, lastName].filter(Boolean).join(" ");
    const resolvedAvatarUrl = getImageUrl(profileImage);

    if (loading) {
        return (
            <Card className="bg-[#FCFCFC] border-[#EAE5DD] shadow-xs rounded-[20px] sm:rounded-[28px] p-12 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#C15C2B] mb-3" />
                <p className="text-sm font-medium text-[#737373]">Loading settings...</p>
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
                {/* Page Header with Logout */}
                <CardHeader className="border-b border-[#F5F2EC] pb-4 px-0 pt-0 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-display tracking-tight">
                            Settings
                        </CardTitle>

                    </div>
                    <Button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        variant="outline"
                        className="h-10 px-4 rounded-md border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all cursor-pointer flex items-center gap-2 text-sm font-medium"
                    >
                        {loggingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Logout</span>
                    </Button>
                </CardHeader>

                <CardContent className="px-0 pt-4">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* Left Column: Profile Card & Information */}
                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* User Profile Avatar Card */}
                            <Card className="bg-white border-[#EAE5DD] rounded-[24px] p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs">
                                <div className="relative group w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#F5F2EC] shadow-sm mb-5 flex items-center justify-center bg-[#F5F2EC]">
                                    <Avatar
                                        src={resolvedAvatarUrl}
                                        alt={displayName}
                                        fallback={initials}
                                        className="w-full h-full text-4xl sm:text-5xl font-bold bg-[#F5F2EC] text-[#C15C2B] border-none rounded-full flex items-center justify-center select-none"
                                    />
                                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-200 rounded-full">
                                        <Camera className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-semibold">Change Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <h2 className="text-lg font-bold text-[#C15C2B] uppercase tracking-wide">
                                    {displayName}
                                </h2>
                                <p className="text-sm font-medium text-[#737373] mt-1">
                                    {email || ""}
                                </p>
                            </Card>

                            {/* Information & Preferences Card */}
                            <Card className="bg-white border-[#EAE5DD] rounded-[24px] p-6 sm:p-7 flex flex-col gap-6 shadow-xs text-sm">
                                <div className="flex flex-col gap-3">
                                    <h3 className="text-base font-bold text-[#1A1A1A]">Information</h3>
                                    <div className="flex flex-col gap-2 leading-relaxed">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#1A1A1A]">Name:</span>
                                            <span className="text-[#525252]">{displayName || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#1A1A1A]">Email:</span>
                                            <span className="text-[#525252]">{email || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-[#F5F2EC]" />

                                <div className="flex flex-col gap-3">
                                    <h3 className="text-base font-bold text-[#1A1A1A]">Preferences</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1A1A1A]">Role:</span>
                                        <span className="font-bold text-[#C15C2B] capitalize">{role || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1A1A1A]">Designation:</span>
                                        <span className="font-bold text-[#C15C2B] capitalize">{designation || "N/A"}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Edit Profile Form */}
                        <Card className="lg:col-span-8 bg-white border-[#EAE5DD] rounded-[24px] p-6 flex flex-col gap-5 shadow-xs">
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="firstName" className="text-sm font-semibold text-[#1A1A1A]">
                                        First Name<span className="text-[#C15C2B]">*</span>
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First Name"
                                        className="h-12 rounded-[14px] bg-white border-[#EAE5DD] text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none px-4"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="lastName" className="text-sm font-semibold text-[#1A1A1A]">
                                        Last Name<span className="text-[#C15C2B]">*</span>
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last Name"
                                        className="h-12 rounded-[14px] bg-white border-[#EAE5DD] text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none px-4"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-[#1A1A1A]">
                                    Email<span className="text-[#C15C2B]">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    readOnly
                                    disabled
                                    placeholder="Enter your email"
                                    className="h-12 rounded-[14px] bg-white border-[#EAE5DD] text-sm text-[#737373] cursor-not-allowed shadow-none select-none opacity-80 px-4"
                                />
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="phone" className="text-sm font-semibold text-[#1A1A1A]">
                                    Phone<span className="text-[#C15C2B]">*</span>
                                </Label>
                                <div className="flex items-center h-12 w-full rounded-[14px] bg-white border border-[#EAE5DD] px-3.5 focus-within:border-[#1A1A1A] transition-all shadow-none">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            type="button"
                                            className="flex items-center gap-1.5 outline-none cursor-pointer select-none py-1 px-1 rounded-md hover:bg-[#F5F2EC]/60 transition-colors"
                                        >
                                            <span className="text-lg leading-none">{selectedCountry.flag}</span>
                                            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="start"
                                            sideOffset={6}
                                            className="w-56 max-h-60 overflow-y-auto bg-white border border-[#EAE5DD] shadow-md rounded-xl p-1 z-50"
                                        >
                                            {COUNTRIES.map((country) => (
                                                <DropdownMenuItem
                                                    key={country.code}
                                                    onClick={() => setSelectedCountry(country)}
                                                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${selectedCountry.code === country.code
                                                        ? "bg-[#F5F2EC] text-[#1A1A1A] font-semibold"
                                                        : "text-[#525252] hover:bg-[#F5F2EC] hover:text-[#1A1A1A]"
                                                        }`}
                                                >
                                                    <span className="text-base leading-none">{country.flag}</span>
                                                    <span className="flex-1">{country.label}</span>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <div className="w-[1px] h-5 bg-[#EAE5DD] mx-3 shrink-0" />

                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        placeholder="Phone number"
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] outline-none border-none p-0 focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            {/* Change Password */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="password" className="text-sm font-semibold text-[#1A1A1A]">
                                    Change Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="*************"
                                        className="h-12 pr-11 rounded-[14px] bg-white border-[#EAE5DD] text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none px-4"
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
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#1A1A1A]">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="*************"
                                        className="h-12 pr-11 rounded-[14px] bg-white border-[#EAE5DD] text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] focus-visible:ring-0 focus-visible:border-[#1A1A1A] transition-all shadow-none px-4"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Role Dropdown (Readonly) */}
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm font-semibold text-[#1A1A1A]">
                                    Role<span className="text-[#C15C2B]">*</span>
                                </Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger disabled className="w-full h-12 px-4 rounded-[14px] border border-[#EAE5DD] bg-white flex items-center justify-between text-sm font-medium text-[#737373] outline-none cursor-not-allowed opacity-80">
                                        <span className="uppercase">{role}</span>
                                        <ChevronDown className="w-4 h-4 text-[#737373]" />
                                    </DropdownMenuTrigger>
                                </DropdownMenu>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-2 flex items-center justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="h-11 px-6 rounded-md bg-[#C15C2B] hover:bg-[#A84F23] text-white font-semibold text-sm transition-all shadow-none cursor-pointer flex items-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <span>Save Changes</span>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
