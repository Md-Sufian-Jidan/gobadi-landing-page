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

export async function getAdmins(page = 1, limit = 10) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await authFetch(`${API_BASE_URL}/admins?page=${page}&limit=${limit}`, {
    method: "GET",
  });
  const result = await res.json();
  if (!res.ok) {
    return { status: false, message: result.message || "Failed to fetch admins" };
  }
  return { status: true, data: result.data, meta: result.meta };
}

export async function getAdmin(id: string) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await authFetch(`${API_BASE_URL}/admins/${id}`, { method: "GET" });
  const result = await res.json();
  if (!res.ok) {
    return { status: false, message: result.message || "Failed to fetch admin" };
  }
  return { status: true, data: result.data };
}

export async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
  designation: string;
  avatar?: string;
  status?: string;
}) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await authFetch(`${API_BASE_URL}/admins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    return { status: false, message: result.message || "Failed to create admin" };
  }
  return { status: true, data: result.data };
}

export async function updateAdmin(id: string, payload: Record<string, string | undefined>) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await authFetch(`${API_BASE_URL}/admins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await res.json();
  if (!res.ok) {
    return { status: false, message: result.message || "Failed to update admin" };
  }
  return { status: true, data: result.data };
}

export async function deleteAdmin(id: string) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await authFetch(`${API_BASE_URL}/admins/${id}`, { method: "DELETE" });
  const result = await res.json();
  if (!res.ok) {
    return { status: false, message: result.message || "Failed to delete admin" };
  }
  return { status: true, message: result.message };
}

export async function toggleAdminStatus(id: string) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await authFetch(`${API_BASE_URL}/admins/${id}/deactivate`, {
    method: "PATCH",
  });
  const result = await res.json();
  if (!res.ok) {
    return { status: false, message: result.message || "Failed to toggle admin status" };
  }
  return { status: true, data: result.data };
}
