"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { adminRefreshAccessToken } from "./adminAuth.service";
import type { SearchResults } from "@/types/search.type";

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
        headers: {
          Authorization: `Bearer ${refreshed.accessToken}`,
          ...options.headers,
        },
        withCredentials: true,
        validateStatus: () => true,
      });
    } else {
      redirect("/admin-login");
    }
  }

  return res;
}

export async function globalSearch(query: string) {
  const res = await authAxios(
    `${api_url}/search?q=${encodeURIComponent(query)}`,
    { method: "GET" }
  );
  const result = res.data;

  if (res.status < 200 || res.status >= 300) {
    return {
      status: false,
      message: result.message || "Search failed",
    };
  }

  return { status: true, data: result.data as SearchResults };
}
