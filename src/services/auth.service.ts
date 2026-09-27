"use server";

import { cache } from "react";
import { cookies } from "next/headers";

const getApiBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
    }
    return url;
};

type ApiAuthResponse = {
    success?: boolean;
    statusCode?: number;
    message?: string;
    accessToken?: string;
    refreshToken?: string;
    data?: { accessToken?: string; refreshToken?: string } & Record<string, unknown>;
} | null;

export async function loginAction(data: { identifier: string; password: string }) {
    try {
        const API_BASE_URL = getApiBaseUrl();
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        let result: ApiAuthResponse = null;
        try {
            result = await res.json();
        } catch {
            result = null;
        }

        if (!res.ok) {
            return { status: false, message: result?.message || "Login failed" };
        }

        const payload = result?.data ?? result;
        if (!payload?.accessToken || !payload?.refreshToken) {
            return {
                status: false,
                message: result?.message || "Login response did not contain auth tokens",
            };
        }

        const cookieStore = await cookies();
        cookieStore.set("accessToken", payload.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60, // 1 hour
            path: "/",
        });
        cookieStore.set("refreshToken", payload.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return { status: true, data: payload };
    } catch (error) {
        console.error("[loginAction] failed:", error);
        return { status: false, message: "Could not reach the login service. Please try again." };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();
    const API_BASE_URL = getApiBaseUrl();
    try {
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            body: JSON.stringify({ refreshToken }),
        });
    } catch (error) {
        console.error("Logout backend call failed:", error);
    } finally {
        cookieStore.delete("accessToken");
        cookieStore.delete("refreshToken");
    }
}

export async function forgotPasswordAction(identifier: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
    });

    const result = await res.json();

    if (!res.ok) {
        return { status: false, message: result.message || "Failed to send reset code" };
    }

    return { status: true, message: result.message };
}

export async function verifyOtpAction(
    phone: string,
    code: string,
    purpose: "login" | "verify" | "reset" = "reset"
) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, purpose }),
    });

    const result = await res.json();

    if (!res.ok) {
        return { status: false, message: result.message || "Failed to verify OTP" };
    }

    const payload = result?.data ?? result;

    if (purpose === "reset") {
        const resetToken =
            (payload as { resetToken?: string } | null)?.resetToken ??
            (result as { resetToken?: string } | null)?.resetToken;

        if (!resetToken) {
            return {
                status: false,
                message: "No reset token was issued. Please request a new code.",
            };
        }

        const cookieStore = await cookies();
        cookieStore.set("userResetToken", resetToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10, // 10 minutes
            path: "/",
        });
    }

    return { status: true, data: payload };
}

export async function resetPasswordAction(newPassword: string) {
    const cookieStore = await cookies();
    const resetToken = cookieStore.get("userResetToken")?.value;

    if (!resetToken) {
        return { status: false, message: "Reset token not found. Please request a new code." };
    }

    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
    });

    const result = await res.json();

    if (!res.ok) {
        return { status: false, message: result.message || "Failed to reset password" };
    }

    cookieStore.delete("userResetToken");

    return { status: true, message: result.message };
}

export const getProfile = cache(async () => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        if (!accessToken) {
            return { data: null, message: "No active session", status: false };
        }

        const API_BASE_URL = getApiBaseUrl();
        const res = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
        });

        if (!res.ok) {
            return { data: null, message: "No active session", status: false };
        }

        const result = await res.json();
        return { data: result.data, error: null, status: true };
    } catch {
        return { data: null, message: "Failed to fetch session data", status: false };
    }
});

export async function refreshAccessToken(): Promise<{ success: boolean; accessToken?: string }> {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) {
        return { success: false };
    }

    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
        return { success: false };
    }

    const result = await res.json();
    if (result.data?.accessToken) {
        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60,
            path: "/",
        });
    }
    if (result.data?.refreshToken) {
        cookieStore.set("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
    }

    return { success: true, accessToken: result.data?.accessToken };
}
