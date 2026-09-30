import { describe, expect, it } from "vitest";
import {
    DISPOSABLE_EMAIL_MESSAGE,
    contactSchema,
    emailDomain,
    emailSchema,
    isDisposableEmail,
} from "./contact";

describe("emailDomain", () => {
    it("returns the lowercased domain part", () => {
        expect(emailDomain("User@Gmail.COM")).toBe("gmail.com");
        expect(emailDomain("a.b@sub.example.co.uk")).toBe("sub.example.co.uk");
    });

    it("returns an empty string without an @", () => {
        expect(emailDomain("not-an-email")).toBe("");
    });
});

describe("isDisposableEmail", () => {
    it("flags known temporary providers", () => {
        expect(isDisposableEmail("someone@mailinator.com")).toBe(true);
        expect(isDisposableEmail("someone@yopmail.com")).toBe(true);
        expect(isDisposableEmail("someone@guerrillamail.com")).toBe(true);
        expect(isDisposableEmail("someone@10minutemail.com")).toBe(true);
    });

    it("flags subdomains of temporary providers", () => {
        expect(isDisposableEmail("someone@mail.yopmail.com")).toBe(true);
    });

    it("accepts real providers and custom domains", () => {
        expect(isDisposableEmail("someone@gmail.com")).toBe(false);
        expect(isDisposableEmail("someone@outlook.com")).toBe(false);
        expect(isDisposableEmail("someone@yahoo.co.uk")).toBe(false);
        expect(isDisposableEmail("someone@company.com")).toBe(false);
    });

    it("accepts uppercase input", () => {
        expect(isDisposableEmail("Someone@Mailinator.COM")).toBe(true);
    });
});

describe("emailSchema", () => {
    it("accepts a normal address", () => {
        expect(emailSchema.safeParse("jidanjiyaj03@gmail.com").success).toBe(true);
    });

    it("trims surrounding whitespace", () => {
        const result = emailSchema.safeParse("  someone@gmail.com  ");
        expect(result.success).toBe(true);
        if (result.success) expect(result.data).toBe("someone@gmail.com");
    });

    it("rejects malformed addresses", () => {
        expect(emailSchema.safeParse("not-an-email").success).toBe(false);
        expect(emailSchema.safeParse("missing@tld").success).toBe(false);
        expect(emailSchema.safeParse("spaces in@gmail.com").success).toBe(false);
    });

    it("rejects disposable domains with a helpful message", () => {
        const result = emailSchema.safeParse("jidanjiyaj03@fdasfads.com");
        expect(result.success).toBe(true); // syntactically fine, MX check handles fake domains

        const disposable = emailSchema.safeParse("jidanjiyaj03@mailinator.com");
        expect(disposable.success).toBe(false);
        if (!disposable.success) {
            expect(disposable.error.issues[0]?.message).toBe(DISPOSABLE_EMAIL_MESSAGE);
        }
    });
});

describe("contactSchema", () => {
    it("accepts a complete payload", () => {
        const result = contactSchema.safeParse({
            email: "someone@gmail.com",
            message: "Hello, I would like to know more.",
        });
        expect(result.success).toBe(true);
    });

    it("reports the failing field path", () => {
        const result = contactSchema.safeParse({ email: "nope", message: "hi" });
        expect(result.success).toBe(false);
        if (!result.success) expect(result.error.issues[0]?.path[0]).toBe("email");
    });

    it("rejects messages that are too short or too long", () => {
        expect(
            contactSchema.safeParse({ email: "someone@gmail.com", message: "hi" }).success,
        ).toBe(false);
        expect(
            contactSchema.safeParse({
                email: "someone@gmail.com",
                message: "x".repeat(2001),
            }).success,
        ).toBe(false);
    });
});
