import { describe, expect, it } from "vitest";
import { formatPhone, parsePhone, phoneSchema, validatePhone } from "@/lib/phone";

function messageFor(value: string): string | undefined {
    const result = phoneSchema.safeParse(value);
    if (result.success) return undefined;
    return result.error.issues[0]?.message;
}

describe("phoneSchema", () => {
    it("accepts a valid German number", () => {
        expect(phoneSchema.safeParse("+491712345678").success).toBe(true);
    });

    it("accepts a valid Bangladeshi number", () => {
        expect(phoneSchema.safeParse("+8801712345678").success).toBe(true);
    });

    it("accepts a valid US number", () => {
        expect(phoneSchema.safeParse("+14155552671").success).toBe(true);
    });

    it("accepts a valid UK number", () => {
        expect(phoneSchema.safeParse("+447911123456").success).toBe(true);
    });

    it("rejects an empty number", () => {
        expect(phoneSchema.safeParse("").success).toBe(false);
        expect(messageFor("")).toBe("Phone number is required");
    });

    it("rejects digits without a country code", () => {
        expect(phoneSchema.safeParse("1234567890").success).toBe(false);
    });

    it("rejects numbers shorter than 7 total digits", () => {
        expect(phoneSchema.safeParse("+49123").success).toBe(false);
    });

    it("rejects a number with more than 15 digits", () => {
        expect(phoneSchema.safeParse("+4912345678901234").success).toBe(false);
    });

    it("rejects numbers starting with 0 after the dial code", () => {
        expect(phoneSchema.safeParse("+4901712345678").success).toBe(false);
    });

    it("rejects a German number with too few national digits", () => {
        expect(phoneSchema.safeParse("+4917123").success).toBe(false);
        expect(messageFor("+4917123")).toBe(
            "Please enter a valid German phone number (10–11 digits)"
        );
    });

    it("rejects a US number with too many national digits", () => {
        expect(phoneSchema.safeParse("+14155552671234").success).toBe(false);
        expect(messageFor("+14155552671234")).toBe(
            "Please enter a valid US phone number (10 digits)"
        );
    });

    it("rejects a Bangladeshi number with the wrong digit count", () => {
        expect(phoneSchema.safeParse("+880171234567").success).toBe(false);
        expect(phoneSchema.safeParse("+88017123456789").success).toBe(false);
    });

    it("rejects an unsupported country code", () => {
        expect(phoneSchema.safeParse("+33612345678").success).toBe(false);
        expect(messageFor("+33612345678")).toContain("Unsupported country code");
    });

    it("trims surrounding whitespace", () => {
        expect(phoneSchema.safeParse("  +491712345678  ").success).toBe(true);
    });
});

describe("validatePhone", () => {
    it("returns the normalized phone on success", () => {
        expect(validatePhone("+491712345678")).toEqual({
            ok: true,
            phone: "+491712345678",
        });
    });

    it("returns a message on failure", () => {
        const result = validatePhone("123456");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.message).toBeTruthy();
    });
});

describe("formatPhone", () => {
    it("prefixes the selected dial code and strips a leading zero", () => {
        expect(formatPhone("01712345678", "+49")).toBe("+491712345678");
    });

    it("keeps digits without a leading zero as-is", () => {
        expect(formatPhone("1712345678", "+49")).toBe("+491712345678");
    });

    it("normalizes a pasted + number", () => {
        expect(formatPhone("+49 171 2345678", "+880")).toBe("+491712345678");
    });

    it("strips non-digit characters", () => {
        expect(formatPhone("(0171) 234-5678", "+49")).toBe("+491712345678");
    });

    it("returns an empty string for empty or non-numeric input", () => {
        expect(formatPhone("", "+49")).toBe("");
        expect(formatPhone("abc", "+49")).toBe("");
    });

    it("falls back to a bare + number when no dial code is selected", () => {
        expect(formatPhone("1712345678", "")).toBe("+1712345678");
    });
});

describe("parsePhone", () => {
    it("splits a known dial code from the local number", () => {
        expect(parsePhone("+8801712345678")).toEqual({ dial: "+880", number: "1712345678" });
    });

    it("returns empty parts for null or empty input", () => {
        expect(parsePhone(null)).toEqual({ dial: "", number: "" });
        expect(parsePhone("")).toEqual({ dial: "", number: "" });
    });

    it("returns raw digits when no dial code matches", () => {
        expect(parsePhone("+33612345678")).toEqual({ dial: "", number: "33612345678" });
    });
});
