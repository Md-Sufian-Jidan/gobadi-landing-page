import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves an avatar path returned by the API into an absolute URL.
 * Absolute URLs (http/https/blob/data) are returned untouched; relative
 * paths are prefixed with the API origin (never a hard-coded host).
 */
export function resolveAvatarUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^(https?:|blob:|data:)/i.test(url)) return url;

  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return url;

  let origin = base;
  try {
    origin = new URL(base).origin;
  } catch {
    // keep the raw base if it is not a valid URL
  }

  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

const API_DESIGNATION_MAP: Record<string, string> = {
  founder: "founder",
  "co-founder": "co_founder",
  co_founder: "co_founder",
  manager: "manager",
  developer: "developer",
  analyst: "analyst",
  support: "support",
};

export function toApiDesignation(value: string): string {
  return API_DESIGNATION_MAP[value] ?? value;
}

export function toUiDesignation(value?: string | null): string {
  if (!value) return "founder";
  if (value === "co_founder" || value === "co-founder") return "co-founder";
  return value;
}
