"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminRefreshAccessToken } from "./adminAuth.service";

const getApiBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    if (!url) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
    }
    return url;
};

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
        return null;
    }
    return { Authorization: `Bearer ${accessToken}` };
}

interface AuthFetchOptions extends RequestInit {
    skipAuth?: boolean;
}

async function authFetch(url: string, options: AuthFetchOptions = {}): Promise<Response> {
    const headers = await getAuthHeaders();
    if (!headers) {
        redirect("/admin-login");
    }

    let res = await fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers },
        credentials: "include",
    });

    if (res.status === 401) {
        const refreshed = await adminRefreshAccessToken();
        if (refreshed.success && refreshed.accessToken) {
            res = await fetch(url, {
                ...options,
                headers: { Authorization: `Bearer ${refreshed.accessToken}`, ...options.headers },
                credentials: "include",
            });
        } else {
            redirect("/admin-login");
        }
    }

    return res;
}

export async function getUserProfile() {
    const API_BASE_URL = getApiBaseUrl();
    const res = await authFetch(`${API_BASE_URL}/auth/profile`, { method: "GET" });
    const result = await res.json();
    if (!res.ok) {
        return { status: false, message: result.message || "Login failed" };
    }

    return { status: true, data: result.data };
}

export async function getAllUsers(page = 1, limit = 10) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await authFetch(`${API_BASE_URL}/users?page=${page}&limit=${limit}`, { method: "GET" });
    const result = await res.json();
    if (!res.ok) {
        return { status: false, message: result.message || "Failed to fetch users" };
    }

    return { status: true, data: result.data };
}

export async function getUserById(id: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await authFetch(`${API_BASE_URL}/users/${id}`, { method: "GET" });
    const result = await res.json();
    if (!res.ok) {
        return { status: false, message: result.message || "Failed to fetch user" };
    }

    return { status: true, data: result.data };
}

export async function updateUser(id: string, payload: FormData | Record<string, string | undefined>) {
    const API_BASE_URL = getApiBaseUrl();

    const requestHeaders: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any;

    const isFormData =
        typeof payload === "object" &&
        payload !== null &&
        (typeof (payload as FormData).append === "function" || payload instanceof FormData);

    if (isFormData) {
        delete requestHeaders["Content-Type"];
        delete requestHeaders["content-type"];
        body = payload;
    } else {
        requestHeaders["Content-Type"] = "application/json";
        body = JSON.stringify(payload);
    }

    const res = await authFetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: requestHeaders,
        body,
    });

    const result = await res.json();
    if (!res.ok) {
        return { status: false, message: result.message || "Failed to update user" };
    }

    return { status: true, data: result.data };
}

export async function deleteUser(id: string) {
    const API_BASE_URL = getApiBaseUrl();
    const res = await authFetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
    const result = await res.json();
    if (!res.ok) {
        return { status: false, message: result.message || "Failed to delete user" };
    }

    return { status: true, message: result.message };
}
