import { z } from "zod";

export const COUNTRIES = [
    { code: "DE", flag: "🇩🇪", label: "Germany (+49)", dial: "+49" },
    { code: "BD", flag: "🇧🇩", label: "Bangladesh (+880)", dial: "+880" },
    { code: "US", flag: "🇺🇸", label: "United States (+1)", dial: "+1" },
    { code: "UK", flag: "🇬🇧", label: "United Kingdom (+44)", dial: "+44" },
] as const;

/**
 * National-part rules (digits after the dial code) per supported country.
 * `pattern` encodes real-world prefix rules so correctly-sized but invalid
 * numbers (e.g. +8809…, +1123…) are rejected.
 */
const PHONE_RULES: Record<
    string,
    { minDigits: number; maxDigits: number; name: string; pattern: RegExp }
> = {
    "+49": {
        minDigits: 10,
        maxDigits: 11,
        name: "German",
        // Geographic (area code starts 2-9) or mobile (15x/16x/17x).
        pattern: /^(?:[2-9]\d{9,10}|1[5-7]\d{8,9})$/,
    },
    "+880": {
        minDigits: 10,
        maxDigits: 10,
        name: "Bangladeshi",
        // Bangladeshi mobile prefixes are 013 through 019.
        pattern: /^1[3-9]\d{8}$/,
    },
    "+1": {
        minDigits: 10,
        maxDigits: 10,
        name: "US",
        // NANP: area code and exchange code must both start with 2-9.
        pattern: /^[2-9]\d{2}[2-9]\d{6}$/,
    },
    "+44": {
        minDigits: 10,
        maxDigits: 11,
        name: "UK",
        // Geographic/mobile/service ranges (1,2,3,5,7,8,9 after the dial code).
        pattern: /^[1235789]\d{9,10}$/,
    },
};

const E164_RE = /^\+[1-9]\d{6,14}$/;

/** Characters accepted in the raw input field (checked before formatting). */
const RAW_INPUT_RE = /^\+?[\d\s()-]*$/;

/** Longest-first so a dial code is never shadowed by a shorter one. */
function matchDial(value: string): string | undefined {
    return [...COUNTRIES]
        .map((c) => c.dial)
        .sort((a, b) => b.length - a.length)
        .find((dial) => value.startsWith(dial));
}

/** Detects a supported dial code in a user-typed value (e.g. "+49 171…"). */
export function detectDial(value: string): string | undefined {
    const digits = value.replace(/\D/g, "");
    if (!digits) return undefined;
    return [...COUNTRIES]
        .map((c) => ({ dial: c.dial, digits: c.dial.slice(1) }))
        .sort((a, b) => b.digits.length - a.digits.length)
        .find((entry) => digits.startsWith(entry.digits))?.dial;
}

/**
 * Validates the raw text typed into the phone field *before* formatPhone
 * strips non-digits, so junk input (letters, symbols) can never be saved.
 */
export function checkPhoneRawInput(raw: string): PhoneValidation {
    const trimmed = raw.trim();
    if (!trimmed || !/\d/.test(trimmed)) {
        return { ok: false, message: "Phone number is required" };
    }
    if (!RAW_INPUT_RE.test(trimmed)) {
        return { ok: false, message: "Phone number can only contain digits" };
    }
    return { ok: true, phone: trimmed };
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
            return;
        }
        if (!rule.pattern.test(national)) {
            ctx.addIssue(`Please enter a valid ${rule.name} phone number`);
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
