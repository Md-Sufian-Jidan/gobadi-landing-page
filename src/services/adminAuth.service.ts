"use server";

import { cookies } from "next/headers";
import type { AdminProfile } from "@/types/auth.type";
import { validatePhone } from "@/lib/phone";

const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
  }
  return url;
};

const ADMIN_ACCESS_TOKEN = "accessToken";
const ADMIN_REFRESH_TOKEN = "refreshToken";

type ApiAuthResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  data?: { accessToken?: string; refreshToken?: string } & Record<string, unknown>;
} | null;

export async function adminLoginAction(data: { email: string; password: string }) {
  try {
    const API_BASE_URL = getApiBaseUrl();

    const res = await fetch(`${API_BASE_URL}/dashboard/admins/login`, {
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
        message:
          result?.message ||
          `Unexpected login response (keys: ${Object.keys(result ?? {}).join(", ") || "empty"})`,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_ACCESS_TOKEN, payload.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });
    cookieStore.set(ADMIN_REFRESH_TOKEN, payload.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { status: true, data: payload };
  } catch (error) {
    console.error("[adminLoginAction] failed:", error);
    return { status: false, message: "Could not reach the login service. Please try again." };
  }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies();
  const API_BASE_URL = getApiBaseUrl();
  try {
    const accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN)?.value;
    await fetch(`${API_BASE_URL}/dashboard/admins/logout`, {
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

export type AdminProfileResult =
  | { status: true; data: AdminProfile; error: null }
  | { status: false; data: null; message: string };

export async function getAdminProfile(): Promise<AdminProfileResult> {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN)?.value;
    if (!accessToken) {
      return { data: null, message: "No active session", status: false };
    }

    const API_BASE_URL = getApiBaseUrl();
    let res = await fetch(`${API_BASE_URL}/dashboard/admins/profile`, {
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
      res = await fetch(`${API_BASE_URL}/dashboard/admins/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
    }

    if (!res.ok) {
      let message = "Failed to load profile";
      try {
        const err = await res.json();
        message = err?.message || message;
      } catch {
        // non-JSON error body — keep the default message
      }
      if (res.status === 401 || res.status === 403) {
        cookieStore.delete(ADMIN_ACCESS_TOKEN);
        cookieStore.delete(ADMIN_REFRESH_TOKEN);
        message = "Session expired. Please log in again.";
      }
      return { data: null, message, status: false };
    }

    const result = await res.json();
    // The endpoint returns the admin object raw; tolerate a `{ data }` envelope too.
    const payload = result?.data ?? result;
    return { data: payload, error: null, status: true };
  } catch (error) {
    console.error("[getAdminProfile] failed:", error);
    return { data: null, message: "Failed to fetch session data", status: false };
  }
}

export type UpdateAdminProfileResult =
  | { status: true; data: AdminProfile; message: string }
  | { status: false; message: string; data?: undefined };

export async function updateAdminProfileAction(
  formData: FormData
): Promise<UpdateAdminProfileResult> {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN)?.value;
    if (!accessToken) {
      return { status: false, message: "No active session" };
    }

    if (formData.has("phone")) {
      const phoneCheck = validatePhone(String(formData.get("phone") ?? ""));
      if (!phoneCheck.ok) {
        return { status: false, message: phoneCheck.message };
      }
      formData.set("phone", phoneCheck.phone);
    }

    const API_BASE_URL = getApiBaseUrl();
    let res = await fetch(`${API_BASE_URL}/dashboard/admins/profile`, {
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
      res = await fetch(`${API_BASE_URL}/dashboard/admins/profile`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
    }

    const result = await res.json();

    if (!res.ok) {
      return { status: false, message: result.message || "Failed to update profile" };
    }

    // The endpoint returns the updated admin object raw; tolerate a `{ data }` envelope too.
    return { status: true, message: result.message || "Profile updated successfully", data: result.data ?? result };
  } catch (error) {
    console.error("[updateAdminProfileAction] failed:", error);
    return { status: false, message: "Failed to update profile" };
  }
}

export async function adminRefreshAccessToken(): Promise<{ success: boolean; accessToken?: string }> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(ADMIN_REFRESH_TOKEN)?.value;
    if (!refreshToken) {
      return { success: false };
    }

    const API_BASE_URL = getApiBaseUrl();
    const res = await fetch(`${API_BASE_URL}/dashboard/admins/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return { success: false };
    }

    let result: ApiAuthResponse = null;
    try {
      result = await res.json();
    } catch {
      return { success: false };
    }

    const payload = result?.data ?? result;
    if (!payload?.accessToken) {
      return { success: false };
    }

    cookieStore.set(ADMIN_ACCESS_TOKEN, payload.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });
    if (payload.refreshToken) {
      cookieStore.set(ADMIN_REFRESH_TOKEN, payload.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }

    return { success: true, accessToken: payload.accessToken };
  } catch (error) {
    console.error("[adminRefreshAccessToken] failed:", error);
    return { success: false };
  }
}

export async function adminForgotPasswordAction(email: string) {
  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/dashboard/admins/forgot-password`, {
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
  const res = await fetch(`${API_BASE_URL}/dashboard/admins/send-otp`, {
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
  const res = await fetch(`${API_BASE_URL}/dashboard/admins/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, purpose }),
  });

  const result = await res.json();

  if (!res.ok) {
    return { status: false, message: result.message || "Failed to verify OTP" };
  }

  const payload = result?.data ?? result;

  // If purpose is reset, store the resetToken in a cookie.
  // The token may be nested under `data` or returned at the top level of the body.
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
    cookieStore.set("adminResetToken", resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
  }

  return { status: true, data: payload };
}

export type DeleteOwnAccountResult =
  | { status: true; message: string }
  | { status: false; message: string };

async function readErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const err = await res.json();
    return err?.message || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Delete the signed-in admin's own account.
 *
 * 1. Sends DELETE /dashboard/admins/me with the current session token and the
 *    supplied password (verified server-side by the backend) — any admin role
 *    may delete their own account.
 * 2. Retries once after refreshing an expired access token.
 * 3. Clears the session cookies only after a successful deletion.
 */
export async function deleteOwnAccountAction(
  password: string
): Promise<DeleteOwnAccountResult> {
  try {
    if (!password) {
      return { status: false, message: "Enter your password to continue" };
    }

    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ADMIN_ACCESS_TOKEN)?.value;
    if (!accessToken) {
      return { status: false, message: "No active session" };
    }

    const API_BASE_URL = getApiBaseUrl();
    const deleteUrl = `${API_BASE_URL}/dashboard/admins/profile`;
    const doDelete = (token: string) =>
      fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        cache: "no-store",
      });

    let deleteRes = await doDelete(accessToken);

    if (deleteRes.status === 401) {
      const refreshed = await adminRefreshAccessToken();
      if (!refreshed.success || !refreshed.accessToken) {
        cookieStore.delete(ADMIN_ACCESS_TOKEN);
        cookieStore.delete(ADMIN_REFRESH_TOKEN);
        return { status: false, message: "Session expired. Please log in again." };
      }
      accessToken = refreshed.accessToken;
      deleteRes = await doDelete(accessToken);
    }

    if (!deleteRes.ok) {
      if (deleteRes.status === 404 || deleteRes.status === 405) {
        return {
          status: false,
          message: "Account deletion isn't available yet. Please try again later.",
        };
      }
      if (deleteRes.status === 429) {
        return {
          status: false,
          message: "Too many attempts. Please wait a moment and try again.",
        };
      }
      const message = await readErrorMessage(deleteRes, "Unable to delete your account");
      // Account still exists — keep the session so a failed attempt
      // (wrong password, missing permission) doesn't sign the user out.
      return { status: false, message };
    }

    cookieStore.delete(ADMIN_ACCESS_TOKEN);
    cookieStore.delete(ADMIN_REFRESH_TOKEN);

    return { status: true, message: "Your account has been deleted" };
  } catch (error) {
    console.error("[deleteOwnAccountAction] failed:", error);
    return { status: false, message: "Failed to delete your account. Please try again." };
  }
}

export async function adminResetPasswordAction(newPassword: string) {
  const cookieStore = await cookies();
  const resetToken = cookieStore.get("adminResetToken")?.value;

  if (!resetToken) {
    return { status: false, message: "Reset token not found. Please request a new code." };
  }

  const API_BASE_URL = getApiBaseUrl();
  const res = await fetch(`${API_BASE_URL}/dashboard/admins/reset-password`, {
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
