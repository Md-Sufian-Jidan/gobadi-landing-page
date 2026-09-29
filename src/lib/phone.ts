import { z } from "zod";

export const COUNTRIES = [
    { code: "DE", flag: "🇩🇪", label: "Germany (+49)", dial: "+49" },
    { code: "BD", flag: "🇧🇩", label: "Bangladesh (+880)", dial: "+880" },
    { code: "US", flag: "🇺🇸", label: "United States (+1)", dial: "+1" },
    { code: "UK", flag: "🇬🇧", label: "United Kingdom (+44)", dial: "+44" },
] as const;

/** National digit counts (digits after the dial code) allowed per supported country. */
const PHONE_RULES: Record<string, { minDigits: number; maxDigits: number; name: string }> = {
    "+49": { minDigits: 10, maxDigits: 11, name: "German" },
    "+880": { minDigits: 10, maxDigits: 10, name: "Bangladeshi" },
    "+1": { minDigits: 10, maxDigits: 10, name: "US" },
    "+44": { minDigits: 10, maxDigits: 11, name: "UK" },
};

const E164_RE = /^\+[1-9]\d{6,14}$/;

/** Longest-first so a dial code is never shadowed by a shorter one. */
function matchDial(value: string): string | undefined {
    return [...COUNTRIES]
        .map((c) => c.dial)
        .sort((a, b) => b.length - a.length)
        .find((dial) => value.startsWith(dial));
}

export const phoneSchema = z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine((value) => E164_RE.test(value), {
        message: "Enter a valid phone number in international format, e.g. +491712345678",
    })
    .superRefine((value, ctx) => {
        const dial = matchDial(value);
        if (!dial) {
            ctx.addIssue(
                `Unsupported country code. Supported: ${COUNTRIES.map((c) => c.label).join(", ")}`
            );
            return;
        }

        const rule = PHONE_RULES[dial];
        const national = value.slice(dial.length);
        if (national.startsWith("0")) {
            ctx.addIssue(
                `Please enter a valid ${rule.name} phone number without a leading 0`
            );
            return;
        }
        if (national.length < rule.minDigits || national.length > rule.maxDigits) {
            const range =
                rule.minDigits === rule.maxDigits
                    ? `${rule.minDigits}`
                    : `${rule.minDigits}–${rule.maxDigits}`;
            ctx.addIssue(`Please enter a valid ${rule.name} phone number (${range} digits)`);
        }
    });

export type PhoneValidation =
    | { ok: true; phone: string }
    | { ok: false; message: string };

/** Validates an already-formatted international number (see formatPhone). */
export function validatePhone(value: string): PhoneValidation {
    const result = phoneSchema.safeParse(value);
    if (result.success) return { ok: true, phone: result.data };
    return {
        ok: false,
        message: result.error.issues[0]?.message ?? "Please enter a valid phone number",
    };
}

/** Splits "+8801712345678" into a known dial code and the local number. */
export function parsePhone(value?: string | null): { dial: string; number: string } {
    const trimmed = (value || "").trim();
    if (!trimmed) return { dial: "", number: "" };

    const dial = matchDial(trimmed);
    if (dial) {
        return { dial, number: trimmed.slice(dial.length).replace(/[^\d]/g, "") };
    }
    return { dial: "", number: trimmed.replace(/[^\d]/g, "") };
}

/** Builds the international number that gets sent to the API. */
export function formatPhone(raw: string, dial: string): string {
    const trimmed = raw.trim();
    if (!trimmed) return "";

    const digits = trimmed.replace(/\D/g, "");
    if (!digits) return "";

    if (trimmed.startsWith("+")) {
        return `+${digits}`;
    }

    if (!dial) return `+${digits}`;

    const local = digits.startsWith("0") ? digits.slice(1) : digits;
    return `${dial}${local}`;
}
