import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
    const sendMailMock = vi.fn();
    const createTransportMock = vi.fn(() => ({ sendMail: sendMailMock }));
    return { sendMailMock, createTransportMock };
});

vi.mock("nodemailer", () => ({
    default: { createTransport: createTransportMock },
}));

import { POST } from "./route";

const makeRequest = (payload: unknown): Request =>
    ({ json: async () => payload }) as unknown as Request;

const brokenJsonRequest = (): Request =>
    ({
        json: async () => {
            throw new SyntaxError("Unexpected token");
        },
    }) as unknown as Request;

describe("POST /api/contact", () => {
    beforeEach(() => {
        vi.stubEnv("SMTP_HOST", "smtp.gmail.com");
        vi.stubEnv("SMTP_PORT", "587");
        vi.stubEnv("SMTP_USER", "ceo.gobaadi@gmail.com");
        vi.stubEnv("SMTP_PASS", "app-password");
        vi.stubEnv("CONTACT_TO_EMAIL", "ceo.gobaadi@gmail.com");
        sendMailMock.mockReset();
        createTransportMock.mockClear();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("sends the branded contact email and returns 200", async () => {
        sendMailMock.mockResolvedValue({ accepted: ["ceo.gobaadi@gmail.com"] });

        const res = await POST(
            makeRequest({ email: "visitor@example.com", message: "Hello from the form" })
        );

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ ok: true });

        const options = sendMailMock.mock.calls[0][0] as Record<string, unknown>;
        expect(options.to).toBe("ceo.gobaadi@gmail.com");
        expect(options.replyTo).toBe("visitor@example.com");
        expect(options.subject).toBe("New contact message from visitor@example.com");
        expect(options.html).toContain("cid:gobadi-logo");
        expect(options.html).toContain("#C0612B");
        expect(options.html).toContain("Hello from the form");
        expect(options.text).toContain("Hello from the form");
        expect(options.attachments).toHaveLength(1);
    });

    it("returns 400 when the body is not valid JSON", async () => {
        const res = await POST(brokenJsonRequest());

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "Invalid request body" });
        expect(sendMailMock).not.toHaveBeenCalled();
    });

    it("returns 400 with the validation message for invalid input", async () => {
        const res = await POST(makeRequest({ email: "", message: "" }));

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "Email is required" });
        expect(sendMailMock).not.toHaveBeenCalled();
    });

    it("returns 500 with an actionable message on SMTP auth failure", async () => {
        sendMailMock.mockRejectedValue(
            Object.assign(new Error("Invalid login: 535 BadCredentials"), { code: "EAUTH" })
        );

        const res = await POST(
            makeRequest({ email: "visitor@example.com", message: "Hello from the form" })
        );

        expect(res.status).toBe(500);
        const body = (await res.json()) as { error: string };
        expect(body.error).toContain("SMTP authentication failed");
    });

    it("returns 500 without touching the transport when SMTP is unconfigured", async () => {
        vi.stubEnv("SMTP_PASS", "");

        const res = await POST(
            makeRequest({ email: "visitor@example.com", message: "Hello from the form" })
        );

        expect(res.status).toBe(500);
        const body = (await res.json()) as { error: string };
        expect(body.error).toContain("not configured");
        expect(createTransportMock).not.toHaveBeenCalled();
        expect(sendMailMock).not.toHaveBeenCalled();
    });
});
