import { NextResponse } from "next/server";
import { UNVERIFIED_DOMAIN_MESSAGE, emailDomain, emailSchema } from "@/lib/contact";
import { hasMxRecord } from "@/lib/email-mx";

/**
 * Lightweight pre-check used by the contact form on blur so the email error
 * appears under the field instead of only after pressing Send.
 */
export async function POST(req: Request) {
    let body: { email?: unknown };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    const parsed = emailSchema.safeParse(body.email);
    if (!parsed.success) {
        const message = parsed.error.issues[0]?.message ?? "Please enter a valid email address";
        return NextResponse.json({ ok: false, error: message }, { status: 400 });
    }

    if (!(await hasMxRecord(emailDomain(parsed.data)))) {
        return NextResponse.json({ ok: false, error: UNVERIFIED_DOMAIN_MESSAGE }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
}
