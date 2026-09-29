import * as fs from "node:fs";
import * as path from "node:path";

export const BRAND = {
    primary: "#C0612B", // rust orange from the Gobadi cattle mark
    primaryDark: "#9C4E22",
    text: "#4E4540",
    textMuted: "#8A8078",
    background: "#F3F1EC",
    card: "#FFFFFF",
    border: "#E7E1D8",
};

export const LOGO_CID = "gobadi-logo";

const LOGO_PATH = path.join(process.cwd(), "public", "apple-touch-icon.png");
const REPLY_SUBJECT = "Re: Gobadi contact message";

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export interface ContactEmailInput {
    email: string;
    message: string;
    receivedAt?: Date;
}

export interface RenderedEmail {
    subject: string;
    html: string;
    text: string;
    attachments: Array<{ filename: string; path: string; cid: string }>;
}

function renderReplyButton(safeEmail: string): string {
    const href = escapeHtml(`mailto:${safeEmail}?subject=${encodeURIComponent(REPLY_SUBJECT)}`);
    return `
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;">
              <tr>
                <td style="border-radius:10px; background-color:${BRAND.primary};">
                  <a href="${href}" style="display:inline-block; padding:12px 24px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:10px;">Reply to sender</a>
                </td>
              </tr>
            </table>`;
}

function renderBody(
    safeEmail: string,
    safeMessage: string,
    receivedAt: Date
): string {
    const received = escapeHtml(receivedAt.toUTCString());

    return `
                <p style="margin:0 0 20px; font-size:15px; line-height:1.6; color:${BRAND.textMuted};">
                  You received a new message through the Gobadi website contact form.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:${BRAND.text};">
                  <tr>
                    <td style="padding:6px 0; width:88px; font-size:13px; color:${BRAND.textMuted};">From</td>
                    <td style="padding:6px 0; font-weight:600; word-break:break-all;">
                      <a href="mailto:${safeEmail}" style="color:${BRAND.primary}; text-decoration:none;">${safeEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; font-size:13px; color:${BRAND.textMuted};">Received</td>
                    <td style="padding:6px 0;">${received}</td>
                  </tr>
                </table>
                <hr style="border:none; border-top:1px solid ${BRAND.border}; margin:20px 0;" />
                <div style="margin-bottom:8px; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:${BRAND.textMuted};">Message</div>
                <blockquote style="margin:0; padding:16px 18px; background-color:${BRAND.background}; border-left:3px solid ${BRAND.primary}; border-radius:0 12px 12px 0; font-size:15px; line-height:1.6; color:${BRAND.text};">${safeMessage}</blockquote>
                ${renderReplyButton(safeEmail)}`;
}

function renderLayout(
    preheader: string,
    heading: string,
    bodyHtml: string,
    logoHtml: string
): string {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Gobadi</title>
  </head>
  <body style="margin:0; padding:0; background-color:${BRAND.background}; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.background}; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%;">
            <tr>
              <td align="center" style="padding-bottom:24px;">
                ${logoHtml}
                <div style="margin-top:8px; font-size:20px; font-weight:700; color:${BRAND.text}; letter-spacing:0.2px;">Gobadi</div>
              </td>
            </tr>
            <tr>
              <td style="background-color:${BRAND.card}; border:1px solid ${BRAND.border}; border-radius:16px; padding:32px 28px;">
                <h1 style="margin:0 0 16px; font-size:18px; color:${BRAND.text};">${heading}</h1>
                <div style="font-size:15px; line-height:1.6; color:${BRAND.text};">
                  ${bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-top:24px; font-size:12px; color:${BRAND.textMuted};">
                Gobadi App &middot; Automated notification &mdash; replying will email the sender directly.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderContactEmail({
    email,
    message,
    receivedAt = new Date(),
}: ContactEmailInput): RenderedEmail {
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");
    const preheader = escapeHtml(`New contact message from ${email}`);
    const logoAvailable = fs.existsSync(LOGO_PATH);

    const logoHtml = logoAvailable
        ? `<img src="cid:${LOGO_CID}" width="56" height="56" alt="Gobadi" style="display:block; border-radius:14px;" />`
        : "";

    if (!logoAvailable) {
        console.warn(`[renderContactEmail] logo not found at ${LOGO_PATH}, sending without it`);
    }

    return {
        subject: `New contact message from ${email}`,
        html: renderLayout(
            preheader,
            "New contact message",
            renderBody(safeEmail, safeMessage, receivedAt),
            logoHtml
        ),
        text: [
            "New contact message",
            "",
            `From: ${email}`,
            `Received: ${receivedAt.toUTCString()}`,
            "",
            "Message:",
            message,
            "",
            `Reply to this email to respond directly to ${email}.`,
        ].join("\n"),
        attachments: logoAvailable
            ? [{ filename: "gobadi-logo.png", path: LOGO_PATH, cid: LOGO_CID }]
            : [],
    };
}
