import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
    ContactFormData,
    contactSchema,
    emailDomain,
    UNVERIFIED_DOMAIN_MESSAGE,
} from "@/lib/contact";
import { hasMxRecord } from "@/lib/email-mx";
import { renderContactEmail } from "@/lib/email-template";

export async function POST(req: Request) {
    let body: ContactFormData;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
        const firstIssue = parsed.error.issues[0];
        const field = typeof firstIssue?.path[0] === "string" ? firstIssue.path[0] : undefined;
        return NextResponse.json(
            { error: firstIssue?.message ?? "Invalid input", field },
            { status: 400 },
        );
    }

    const { email, message } = parsed.data;

    if (!(await hasMxRecord(emailDomain(email)))) {
        return NextResponse.json(
            { error: UNVERIFIED_DOMAIN_MESSAGE, field: "email" },
            { status: 400 },
        );
    }

    const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env;
    const smtpPass = (SMTP_PASS ?? "").replace(/\s+/g, "");

    if (!SMTP_HOST || !SMTP_USER || !smtpPass || !CONTACT_TO_EMAIL) {
        console.error("[contact] Missing env vars:", {
            SMTP_HOST: !!SMTP_HOST,
            SMTP_USER: !!SMTP_USER,
            SMTP_PASS: !!smtpPass,
            CONTACT_TO_EMAIL: !!CONTACT_TO_EMAIL,
        });
        return NextResponse.json(
            { error: "The contact form is not configured yet. Please contact us directly." },
            { status: 500 },
        );
    }

    const port = Number(process.env.SMTP_PORT ?? 587);

    try {
        const transport = nodemailer.createTransport({
            host: SMTP_HOST,
            port,
            secure: port === 465,
            requireTLS: port !== 465,
            auth: { user: SMTP_USER, pass: smtpPass },
        });

        const { subject, html, text, attachments } = renderContactEmail({ email, message });

        await transport.sendMail({
            from: `"Gobadi Website" <${SMTP_USER}>`,
            to: CONTACT_TO_EMAIL,
            replyTo: email,
            subject,
            html,
            text,
            attachments,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        const err = error as { code?: string; message?: string; responseCode?: number; response?: string };

        console.error("[contact] SMTP error:", {
            code: err.code,
            responseCode: err.responseCode,
            response: err.response,
            message: err.message,
        });

        let reason = "Could not send your message. Please try again.";
        if (err.code === "EAUTH") {
            reason = "SMTP authentication failed. Check SMTP_USER and SMTP_PASS (Gmail requires an App Password).";
        } else if (err.code === "ECONNREFUSED") {
            reason = "Could not connect to the mail server. Check SMTP_HOST and SMTP_PORT.";
        } else if (err.code === "ETIMEDOUT" || err.code === "ESOCKET") {
            reason = "Connection to mail server timed out. The host may be blocking outbound SMTP.";
        } else if (err.responseCode) {
            reason = `SMTP ${err.responseCode}: ${err.response ?? err.message}`;
        }

        return NextResponse.json({ error: reason }, { status: 500 });
    }
}