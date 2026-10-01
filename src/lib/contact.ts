import { z } from "zod";

export const CONTACT_EMAIL = "ceo.gobaadi@gmail.com";

/** Temporary/disposable inbox providers — never a real way to reach someone. */
export const DISPOSABLE_DOMAINS: readonly string[] = [
    "10minutemail.com",
    "10minutemail.net",
    "anonbox.net",
    "binkmail.com",
    "cool.fr.nf",
    "courriel.fr.nf",
    "curiousview.com",
    "dispostable.com",
    "dropmail.me",
    "emailondeck.com",
    "etempmail.com",
    "fakeinbox.com",
    "getnada.com",
    "grr.la",
    "guerrillamail.biz",
    "guerrillamail.com",
    "guerrillamail.de",
    "guerrillamail.info",
    "guerrillamail.net",
    "guerrillamail.org",
    "harakirimail.com",
    "inboxbear.com",
    "jetable.fr.nf",
    "mail.tm",
    "mail7.io",
    "mailcatch.com",
    "maildrop.cc",
    "mailinator.com",
    "mailnesia.com",
    "moakt.cc",
    "moakt.com",
    "mytemp.email",
    "nomail.xl.cx",
    "pokemail.net",
    "sharklasers.com",
    "spam4.me",
    "temp-mail.io",
    "temp-mail.org",
    "tempmail.com",
    "tempmail.dev",
    "tempmail.plus",
    "tempmailo.com",
    "tempr.email",
    "throwaway.email",
    "throwawaymail.com",
    "tmail.ws",
    "trashmail.com",
    "trashmail.de",
    "trashmail.me",
    "yopmail.com",
    "yopmail.fr",
    "yopmail.net",
];

const DISPOSABLE_DOMAIN_LIST = [...DISPOSABLE_DOMAINS];

export const DISPOSABLE_EMAIL_MESSAGE =
    "Temporary email addresses aren't supported. Please use a permanent email like Gmail, Outlook or Yahoo.";

export const UNVERIFIED_DOMAIN_MESSAGE =
    "We couldn't verify your email domain. Please use an address from a real provider like Gmail, Outlook or Yahoo.";

/** Lowercased domain part of an address ("" when there is none). */
export function emailDomain(email: string): string {
    const at = email.lastIndexOf("@");
    if (at === -1) return "";
    return email.slice(at + 1).trim().toLowerCase().replace(/\.$/, "");
}

export function isDisposableEmail(email: string): boolean {
    const domain = emailDomain(email);
    if (!domain) return false;
    if (DISPOSABLE_DOMAIN_LIST.includes(domain)) return true;
    // Subdomains of a disposable service, e.g. "mail.yopmail.com".
    return DISPOSABLE_DOMAIN_LIST.some((d) => domain.endsWith(`.${d}`));
}

export const emailSchema = z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email")
    .refine((value) => !isDisposableEmail(value), { message: DISPOSABLE_EMAIL_MESSAGE });

export const contactSchema = z.object({
    email: emailSchema,
    message: z
        .string()
        .trim()
        .min(5, "Message must be at least 5 characters")
        .max(2000, "Message must be 2000 characters or fewer"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
