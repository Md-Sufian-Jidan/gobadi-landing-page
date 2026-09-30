import { describe, expect, it } from "vitest";
import {
    checkPhoneRawInput,
    detectDial,
    formatPhone,
    parsePhone,
    validatePhone,
} from "./phone";

describe("checkPhoneRawInput", () => {
    it("accepts digits with spaces, dashes and parentheses", () => {
        expect(checkPhoneRawInput("0171 2345678").ok).toBe(true);
        expect(checkPhoneRawInput("(0171) 234-5678").ok).toBe(true);
        expect(checkPhoneRawInput("+49 171 2345678").ok).toBe(true);
    });

    it("rejects empty input", () => {
        const result = checkPhoneRawInput("");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.message).toBe("Phone number is required");
    });

    it("rejects input with no digits", () => {
        const result = checkPhoneRawInput("abc");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.message).toBe("Phone number is required");
    });

    it("rejects letters mixed into the number", () => {
        const result = checkPhoneRawInput("abc1234567890");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.message).toBe("Phone number can only contain digits");
    });

    it("rejects special characters", () => {
        expect(checkPhoneRawInput("0171*2345678").ok).toBe(false);
        expect(checkPhoneRawInput("0171#2345678").ok).toBe(false);
    });
});

describe("detectDial", () => {
    it("detects supported dial codes", () => {
        expect(detectDial("+49 171 2345678")).toBe("+49");
        expect(detectDial("+8801712345678")).toBe("+880");
        expect(detectDial("+14155552671")).toBe("+1");
        expect(detectDial("+447911123456")).toBe("+44");
    });

    it("returns undefined for unsupported codes", () => {
        expect(detectDial("+33612345678")).toBeUndefined();
        expect(detectDial("")).toBeUndefined();
    });
});

describe("validatePhone", () => {
    it("accepts valid numbers for every supported country", () => {
        expect(validatePhone("+491712345678").ok).toBe(true);
        expect(validatePhone("+8801712345678").ok).toBe(true);
        expect(validatePhone("+14155552671").ok).toBe(true);
        expect(validatePhone("+447911123456").ok).toBe(true);
        expect(validatePhone("+493012345678").ok).toBe(true);
    });

    it("rejects an empty number", () => {
        const result = validatePhone("");
        expect(result.ok).toBe(false);
    });

    it("rejects non-E164 input", () => {
        expect(validatePhone("01712345678").ok).toBe(false);
        expect(validatePhone("491712345678").ok).toBe(false);
        expect(validatePhone("+abc").ok).toBe(false);
    });

    it("rejects unsupported country codes", () => {
        const result = validatePhone("+33612345678");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.message).toContain("Unsupported country code");
    });

    it("rejects a leading 0 after the dial code", () => {
        const result = validatePhone("+4901712345678");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.message).toContain("without a leading 0");
    });

    it("rejects wrong digit counts", () => {
        expect(validatePhone("+88017123456").ok).toBe(false);
        expect(validatePhone("+1415555267").ok).toBe(false);
        expect(validatePhone("+141555526712345").ok).toBe(false);
    });

    it("rejects correctly-sized but invalid Bangladeshi numbers", () => {
        expect(validatePhone("+8809123456789").ok).toBe(false);
        expect(validatePhone("+8809999999999").ok).toBe(false);
        expect(validatePhone("+8802123456789").ok).toBe(false);
    });

    it("rejects correctly-sized but invalid US numbers", () => {
        expect(validatePhone("+11234567890").ok).toBe(false);
        expect(validatePhone("+11111111111").ok).toBe(false);
        expect(validatePhone("+10234567890").ok).toBe(false);
        expect(validatePhone("+1212555abc1").ok).toBe(false);
    });

    it("rejects correctly-sized but invalid German numbers", () => {
        expect(validatePhone("+491234567890").ok).toBe(false);
        expect(validatePhone("+491412345678").ok).toBe(false);
        expect(validatePhone("+4912345678901").ok).toBe(false);
    });

    it("rejects correctly-sized but invalid UK numbers", () => {
        expect(validatePhone("+444123456789").ok).toBe(false);
        expect(validatePhone("+446123456789").ok).toBe(false);
    });
});

describe("formatPhone", () => {
    it("prepends the selected dial code", () => {
        expect(formatPhone("01712345678", "+880")).toBe("+8801712345678");
        expect(formatPhone("1712345678", "+880")).toBe("+8801712345678");
        expect(formatPhone("4155552671", "+1")).toBe("+14155552671");
    });

    it("keeps a typed + prefix as-is (after digit normalization)", () => {
        expect(formatPhone("+49 171 2345678", "+880")).toBe("+491712345678");
    });

    it("returns empty string for input without digits", () => {
        expect(formatPhone("", "+49")).toBe("");
        expect(formatPhone("abc", "+49")).toBe("");
    });
});

describe("parsePhone", () => {
    it("splits a known number into dial and national part", () => {
        expect(parsePhone("+8801712345678")).toEqual({ dial: "+880", number: "1712345678" });
        expect(parsePhone("+491712345678")).toEqual({ dial: "+49", number: "1712345678" });
    });

    it("handles empty values", () => {
        expect(parsePhone(null)).toEqual({ dial: "", number: "" });
        expect(parsePhone("")).toEqual({ dial: "", number: "" });
    });
});
