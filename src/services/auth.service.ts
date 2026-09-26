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

export async function registerAction(data: {
    name: string;
    identifier: string;
    password: string;
    role?: string;
}) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
        return { status: false, message: result.message || "Registration failed" };
    }

    return { status: true, message: result.message };
}

export async function loginAction(data: { identifier: string; password: string }) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    const result = await res.json();

    if (!res.ok) {
        return { status: false, message: result.message || "Login failed" };
    }

    const cookieStore = await cookies();
    cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour
        path: "/",
    });
    cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
    });

    return { status: true, data: result.data };
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

export async function forgotPasswordAction(email: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const result = await res.json();

    if (!res.ok) {
        return { status: false, message: result.message || "Failed to send reset link" };
    }

    return { status: true, message: result.message };
}

export async function resetPasswordAction(token: string, password: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });

    const result = await res.json();

    if (!res.ok) {
        return { status: false, message: result.message || "Failed to reset password" };
    }

    return { status: true, data: result.data };
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
