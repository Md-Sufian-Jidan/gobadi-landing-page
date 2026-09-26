"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { adminRefreshAccessToken } from "./adminAuth.service";
import type {
    Period,
    UserListStats,
    UserLocationData,
    DailyUserData,
    RegisteredAnimalData,
    TaskFeatureUserData,
} from "@/types/api.type";

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

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DashboardStats {
    totalDownloads: number;
    totalUsers: number;
    totalFarmers: number;
    totalDoctors: number;
    userGrowth: {
        current: number;
        previous: number;
        changePercent: number;
        isPositive: boolean;
    };
}

export interface UserGrowthData {
    chartData: { day: string; value: number }[];
    summary: {
        total: number;
        changePercent: number;
        isPositive: boolean;
    };
}

export interface UserOSData {
    android: { date: string; value: number }[];
    ios: { date: string; value: number }[];
}

export interface AiUserData {
    totalAiUsers: number;
    changePercent: number;
    isPositive: boolean;
    gaugePercentage: number;
}

export interface AppointmentData {
    chartData: { day: string; bar1: number; bar2: number }[];
}

export interface RetentionData {
    chartData: { day: string; value: number }[];
    summary: {
        total: number;
        changePercent: number;
        isPositive: boolean;
    };
    targetLine: number;
}

export async function getDashboardStats(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/stats?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;
    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch dashboard stats",
        };
    }

    return { status: true, data: result.data as DashboardStats };
}

export async function getUserGrowth(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/user-growth?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch user growth data",
        };
    }

    return { status: true, data: result.data as UserGrowthData };
}

export async function getUserOS(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/user-os?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch user OS data",
        };
    }

    return { status: true, data: result.data as UserOSData };
}

export async function getAiUsers(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/ai-users?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch AI user data",
        };
    }

    return { status: true, data: result.data as AiUserData };
}

export async function getAppointments(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/appointments?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch appointment data",
        };
    }

    return { status: true, data: result.data as AppointmentData };
}

export async function getRetention(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/retention?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch retention data",
        };
    }

    return { status: true, data: result.data as RetentionData };
}

export async function getUserListStats(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/user-list-stats?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch user list stats",
        };
    }

    return { status: true, data: result.data as UserListStats };
}

export async function getUserLocation(
    period: Period = "last_7_days",
    role: "farmer" | "doctor" = "farmer",
    filter: "District" | "Upazila" | "Division" = "District"
) {
    const res = await authAxios(
        `${api_url}/dashboard/user-location?period=${period}&role=${role}&filter=${filter}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch user location data",
        };
    }

    return { status: true, data: result.data as UserLocationData };
}

export async function getDailyUsers(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/daily-users?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch daily user data",
        };
    }

    return { status: true, data: result.data as DailyUserData };
}

export async function getRegisteredAnimals(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/registered-animals?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch registered animal data",
        };
    }

    return { status: true, data: result.data as RegisteredAnimalData };
}

export async function getTaskFeatureUsers(period: Period = "last_7_days") {
    const res = await authAxios(
        `${api_url}/dashboard/task-feature-users?period=${period}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch task feature user data",
        };
    }

    return { status: true, data: result.data as TaskFeatureUserData };
}

export async function getFarmers(page = 1, limit = 10, search?: string, status?: string) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const res = await authAxios(
        `${api_url}/dashboard/farmers?${params.toString()}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch farmers data",
        };
    }

    return { status: true, data: result.data };
}

export async function getDoctors(page = 1, limit = 10, search?: string, status?: string) {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const res = await authAxios(
        `${api_url}/dashboard/doctors?${params.toString()}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch doctors data",
        };
    }

    return { status: true, data: result.data };
}

export async function getDoctorById(id: number) {
    const res = await authAxios(
        `${api_url}/dashboard/doctors/${id}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch doctor data",
        };
    }

    return { status: true, data: result.data };
}

export async function deleteDoctorById(id: number) {
    const res = await authAxios(
        `${api_url}/dashboard/doctors/${id}`,
        { method: "DELETE" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to delete doctor",
        };
    }

    return { status: true, message: result.message };
}

export async function getFarmerById(id: number) {
    const res = await authAxios(
        `${api_url}/dashboard/farmers/${id}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch farmer data",
        };
    }

    return { status: true, data: result.data };
}

export async function deleteFarmerById(id: number) {
    const res = await authAxios(
        `${api_url}/dashboard/farmers/${id}`,
        { method: "DELETE" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to delete farmer",
        };
    }

    return { status: true, message: result.message };
}
