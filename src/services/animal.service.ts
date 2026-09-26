"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { adminRefreshAccessToken } from "./adminAuth.service";

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

export interface AnimalOwner {
    name: string;
    tag: string;
    avatar: string | null;
}

export interface AnimalListItem {
    id: number;
    animalTag: string;
    animalName: string;
    category: string;
    avatar: string | null;
    age: string;
    breed: string;
    gender: string;
    liveWeight: string;
    price: string;
    vaccinationDate: string;
    doctorVisit: string;
    owner: AnimalOwner;
}

export interface AnimalListResponse {
    data: AnimalListItem[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
}

export async function getAnimals(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filter?: string
) {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    const filterParam = filter && filter !== "all" ? `&filter=${encodeURIComponent(filter)}` : "";
    const res = await authAxios(
        `${api_url}/animals?page=${page}&limit=${limit}${searchParam}${filterParam}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch animals",
        };
    }

    return { status: true, data: result.data as AnimalListItem[], meta: result.meta };
}

export async function getAnimalById(id: number) {
    const res = await authAxios(
        `${api_url}/animals/${id}`,
        { method: "GET" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to fetch animal",
        };
    }

    return { status: true, data: result.data as AnimalListItem };
}

export async function deleteAnimalById(id: number) {
    const res = await authAxios(
        `${api_url}/animals/${id}`,
        { method: "DELETE" }
    );
    const result = res.data;

    if (res.status < 200 || res.status >= 300) {
        return {
            status: false,
            message: result.message || "Failed to delete animal",
        };
    }

    return { status: true };
}
