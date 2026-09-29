import { describe, expect, it } from "vitest";
import {
    BRAND,
    LOGO_CID,
    escapeHtml,
    renderContactEmail,
} from "./email-template";

const EMAIL = "visitor@example.com";
const RECEIVED_AT = new Date("2026-09-29T12:00:00.000Z");

describe("escapeHtml", () => {
    it("neutralises markup and quotes", () => {
        expect(escapeHtml(`<script>alert("x")</script> &'`)).toBe(
            "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp;&#39;"
        );
    });
});

describe("renderContactEmail", () => {
    it("returns subject, html, text and the logo attachment", () => {
        const rendered = renderContactEmail({
            email: EMAIL,
            message: "Hello from the contact form",
            receivedAt: RECEIVED_AT,
        });

        expect(rendered.subject).toBe(`New contact message from ${EMAIL}`);
        expect(rendered.text).toContain(EMAIL);
        expect(rendered.text).toContain("Hello from the contact form");
        expect(rendered.attachments).toHaveLength(1);
        expect(rendered.attachments[0]).toMatchObject({
            filename: "gobadi-logo.png",
            cid: LOGO_CID,
        });
    });

    it("builds the branded layout with the cid logo", () => {
        const { html } = renderContactEmail({
            email: EMAIL,
            message: "Hello",
            receivedAt: RECEIVED_AT,
        });

        expect(html).toContain(`cid:${LOGO_CID}`);
        expect(html).toContain(BRAND.primary);
        expect(html).toContain("New contact message");
        expect(html).toContain("display:none"); // hidden preheader
        expect(html).toContain(RECEIVED_AT.toUTCString());
    });

    it("escapes user content and converts newlines", () => {
        const { html } = renderContactEmail({
            email: EMAIL,
            message: `<script>alert("x")</script>\nsecond line`,
            receivedAt: RECEIVED_AT,
        });

        expect(html).not.toContain("<script>alert");
        expect(html).toContain(
            "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;<br />second line"
        );
    });

    it("includes a reply button and mailto link for the sender", () => {
        const { html } = renderContactEmail({
            email: EMAIL,
            message: "Hello",
            receivedAt: RECEIVED_AT,
        });

        expect(html).toContain("Reply to sender");
        expect(html).toContain(`mailto:${EMAIL}`);
        expect(html).toContain(`href="mailto:${EMAIL}"`);
    });

    it("keeps the raw message intact in the text version", () => {
        const { text } = renderContactEmail({
            email: EMAIL,
            message: 'Line "one" <b>two</b>',
            receivedAt: RECEIVED_AT,
        });

        expect(text).toContain('Line "one" <b>two</b>');
        expect(text).toContain(`From: ${EMAIL}`);
        expect(text).toContain("Received: Tue, 29 Sep 2026 12:00:00 GMT");
    });
});
