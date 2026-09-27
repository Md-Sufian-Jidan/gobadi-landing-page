"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { adminRefreshAccessToken } from "./adminAuth.service";
import type {
    SendNotificationPayload,
    BroadcastNotificationPayload,
} from "@/types/notification.type";

const api_url = process.env.NEXT_PUBLIC_API_URL;

if (!api_url) {
    throw new Error("Please set the NEXT_PUBLIC_API_URL environment variable");
}

async function getAuthHeaders() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    if (!accessToken) {
        return null;
    }
    return { Authorization: `Bearer ${accessToken}` };
}

async function authAxios(
    url: string,
    options: AxiosRequestConfig = {}
): Promise<AxiosResponse> {
    const headers = await getAuthHeaders();
    if (!headers) {
        redirect("/admin-login");
    }

    let res = await axios.request({
        url,
        ...options,
        headers: { ...headers, ...options.headers },
        withCredentials: true,
        validateStatus: () => true,
    });

    if (res.status === 401) {
        const refreshed = await adminRefreshAccessToken();
        if (refreshed.success && refreshed.accessToken) {
            res = await axios.request({
                url,
                ...options,
                headers: { Authorization: `Bearer ${refreshed.accessToken}`, ...options.headers },
                withCredentials: true,
                validateStatus: () => true,
            });
        } else {
            redirect("/admin-login");
        }
    }

    return res;
}

// ─── GET /dashboard/notifications (admin: all notifications) ─────────────────────────────
export async function getNotifications(
    page = 1,
    limit = 20,
    search?: string,
    type?: string
) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (search) params.set("search", search);
    if (type && type !== "all") params.set("type", type);

    const res = await authAxios(`${api_url}/dashboard/notifications?${params.toString()}`, {
        method: "GET",
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch notifications",
        };
    }

    return { status: true, data: result.data, meta: result.meta };
}

// ─── GET /dashboard/notifications/user (current user's notifications) ─────────────────────
export async function getNotificationsByUser(page = 1, limit = 20) {
    const res = await authAxios(
        `${api_url}/dashboard/notifications/user?page=${page}&limit=${limit}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch notifications",
        };
    }

    return { status: true, data: result.data, meta: result.meta };
}

// ─── GET /dashboard/notifications/unread-count ──────────────────────────────────────────
export async function getUnreadCount() {
    const res = await authAxios(`${api_url}/dashboard/notifications/unread-count`, {
        method: "GET",
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch unread count",
        };
    }

    return { status: true, data: (result?.data ?? result) as { count: number } };
}

// ─── PATCH /dashboard/notifications/:id/read ────────────────────────────────────────────
export async function markAsRead(id: string) {
    const res = await authAxios(`${api_url}/dashboard/notifications/${id}/read`, {
        method: "PATCH",
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to mark as read",
        };
    }

    return { status: true, data: result?.data ?? result };
}

// ─── PATCH /dashboard/notifications/read-all ────────────────────────────────────────────
export async function markAllAsRead() {
    const res = await authAxios(`${api_url}/dashboard/notifications/read-all`, {
        method: "PATCH",
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to mark all as read",
        };
    }

    return { status: true, data: result?.data ?? result };
}

// ─── POST /dashboard/notifications — create notification for a specific user ─────────────
export interface CreateNotificationPayload {
    title: string;
    body: string;
    type?: string;
    userId: number;
    occurrence: string;
    time: string;
    referenceType?: string;
    referenceId?: string;
}

export async function createNotification(payload: CreateNotificationPayload) {
    const res = await authAxios(`${api_url}/dashboard/notifications`, {
        method: "POST",
        data: payload,
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to create notification",
        };
    }

    return { status: true, data: result?.data ?? result };
}

// ─── POST /dashboard/notifications/send — send to specific users ───────────────────────
export async function sendToUsers(payload: SendNotificationPayload) {
    const res = await authAxios(`${api_url}/dashboard/notifications/send`, {
        method: "POST",
        data: payload,
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to send notification",
        };
    }

    return { status: true, data: result?.data ?? result };
}

// ─── POST /dashboard/notifications/broadcast — broadcast to ALL users (or by role) ──────
export async function broadcastNotification(payload: BroadcastNotificationPayload) {
    const res = await authAxios(`${api_url}/dashboard/notifications/broadcast`, {
        method: "POST",
        data: payload,
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to broadcast notification",
        };
    }

    return { status: true, data: result?.data ?? result };
}

// ─── DELETE /dashboard/notifications/:id ─────────────────────────────────────────────────
export async function deleteNotification(id: string) {
    const res = await authAxios(`${api_url}/dashboard/notifications/${id}`, {
        method: "DELETE",
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to delete notification",
        };
    }

    return { status: true };
}

// ─── GET /dashboard/notifications/:id ───────────────────────────────────────────────────
export async function getNotificationById(id: string) {
    const res = await authAxios(`${api_url}/dashboard/notifications/${id}`, {
        method: "GET",
    });
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch notification",
        };
    }

    return { status: true, data: result?.data ?? result };
}
