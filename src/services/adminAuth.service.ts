"use server";

import { cookies } from "next/headers";

const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
  }
  return url;
};

const ADMIN_ACCESS_TOKEN = "accessToken";
const ADMIN_REFRESH_TOKEN = "refreshToken";

export async function adminLoginAction(data: { email: string; password: string }) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/admins/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok) {
    return { status: false, message: result.message || "Login failed" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_ACCESS_TOKEN, result.data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
  cookieStore.set(ADMIN_REFRESH_TOKEN, result.data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return { status: true, data: result.data };
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  const API_BASE_URL = getApiBaseUrl();
  try {
    const accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN)?.value;
    await fetch(`${API_BASE_URL}/admins/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    console.error("Admin logout backend call failed:", error);
  } finally {
    cookieStore.delete(ADMIN_ACCESS_TOKEN);
    cookieStore.delete(ADMIN_REFRESH_TOKEN);
  }
}

export async function getAdminProfile() {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN)?.value;
    if (!accessToken) {
      return { data: null, message: "No active session", status: false };
    }

    const API_BASE_URL = getApiBaseUrl();
    let res = await fetch(`${API_BASE_URL}/admins/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    // Token expired — try to refresh once and retry
    if (res.status === 401) {
      const refreshed = await adminRefreshAccessToken();
      if (!refreshed.success || !refreshed.accessToken) {
        // Refresh failed — clear cookies so middleware redirects to login
        cookieStore.delete(ADMIN_ACCESS_TOKEN);
        cookieStore.delete(ADMIN_REFRESH_TOKEN);
        return { data: null, message: "Session expired. Please log in again.", status: false };
      }
      accessToken = refreshed.accessToken;
      res = await fetch(`${API_BASE_URL}/admins/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
    }

    if (!res.ok) {
      return { data: null, message: "No active session", status: false };
    }

    const result = await res.json();
    return { data: result.data, error: null, status: true };
  } catch {
    return { data: null, message: "Failed to fetch session data", status: false };
  }
}

export async function updateAdminProfileAction(formData: FormData) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN)?.value;
    if (!accessToken) {
      return { status: false, message: "No active session" };
    }

    const API_BASE_URL = getApiBaseUrl();
    let res = await fetch(`${API_BASE_URL}/admins/profile`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    // Token expired — refresh once and retry
    if (res.status === 401) {
      const refreshed = await adminRefreshAccessToken();
      if (!refreshed.success || !refreshed.accessToken) {
        cookieStore.delete(ADMIN_ACCESS_TOKEN);
        cookieStore.delete(ADMIN_REFRESH_TOKEN);
        return { status: false, message: "Session expired. Please log in again." };
      }
      accessToken = refreshed.accessToken;
      res = await fetch(`${API_BASE_URL}/admins/profile`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
    }

    const result = await res.json();

    if (!res.ok) {
      return { status: false, message: result.message || "Failed to update profile" };
    }

    return { status: true, message: result.message, data: result.data };
  } catch {
    return { status: false, message: "Failed to update profile" };
  }
}

export async function adminRefreshAccessToken(): Promise<{ success: boolean; accessToken?: string }> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN)?.value;
  if (!refreshToken) {
    return { success: false };
  }

  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/admins/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    return { success: false };
  }

  const result = await res.json();
  if (result.data?.accessToken) {
    cookieStore.set(ADMIN_ACCESS_TOKEN, result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
  }
  if (result.data?.refreshToken) {
    cookieStore.set(ADMIN_REFRESH_TOKEN, result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }

  return { success: true, accessToken: result.data?.accessToken };
}

export async function adminForgotPasswordAction(email: string) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/admins/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { status: false, message: result.message || "Failed to send reset code" };
  }

  return { status: true, message: result.message };
}

export async function adminSendOtpAction(email: string, purpose: "verify" | "reset" = "verify") {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/admins/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { status: false, message: result.message || "Failed to send OTP" };
  }

  return { status: true, data: result.data };
}

export async function adminVerifyOtpAction(email: string, code: string, purpose: "verify" | "reset" = "verify") {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/admins/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, purpose }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { status: false, message: result.message || "Failed to verify OTP" };
  }

  // If purpose is reset, store the resetToken in a cookie
  if (purpose === "reset" && result.data?.resetToken) {
    const cookieStore = await cookies();
    cookieStore.set("adminResetToken", result.data.resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
  }

  return { status: true, data: result.data };
}

export async function adminResetPasswordAction(newPassword: string) {
  const cookieStore = await cookies();
  const resetToken = cookieStore.get("adminResetToken")?.value;

  if (!resetToken) {
    return { status: false, message: "Reset token not found. Please request a new code." };
  }

  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/admins/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, newPassword }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { status: false, message: result.message || "Failed to reset password" };
  }

  // Clear the reset token cookie
  cookieStore.delete("adminResetToken");

  return { status: true, message: result.message };
}
