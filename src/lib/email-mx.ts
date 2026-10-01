import "server-only";
import { Resolver } from "node:dns/promises";

const DEFAULT_TIMEOUT_MS = 3000;

/** Conservative domain shape check before spending a DNS round trip. */
const DOMAIN_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;

export interface MxRecord {
    exchange: string;
    priority: number;
}

export type MxLookup = (domain: string) => Promise<MxRecord[]>;
export type MxCheckResult = "verified" | "no-mail-record" | "unavailable";

/**
 * Optional comma-separated DNS servers (e.g. "172.16.100.110,172.16.100.106")
 * for hosts whose default resolver is unavailable.
 */
function createResolver(): Resolver {
    const servers = (process.env.CONTACT_MX_DNS_SERVERS ?? "")
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean);
    const resolver = new Resolver();
    if (servers.length) resolver.setServers(servers);
    return resolver;
}

const defaultLookup: MxLookup = (domain) => createResolver().resolveMx(domain);

/**
 * Distinguishes domains confirmed to have no mail records from temporary DNS
 * failures, which should not prevent someone from contacting us.
 */
export async function checkMxRecord(
    domain: string,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
    lookup: MxLookup = defaultLookup,
): Promise<MxCheckResult> {
    const normalized = domain.trim().toLowerCase().replace(/\.$/, "");
    if (!normalized || !DOMAIN_RE.test(normalized)) return "no-mail-record";

    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
        const timeout = new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error("DNS_TIMEOUT")), timeoutMs);
        });
        const records = await Promise.race([lookup(normalized), timeout]);
        return records.length > 0 ? "verified" : "no-mail-record";
    } catch (error) {
        const code = (error as NodeJS.ErrnoException | undefined)?.code;
        // These DNS responses definitively mean the domain cannot receive mail.
        if (code === "ENOTFOUND" || code === "ENODATA") return "no-mail-record";
        console.warn(
            "[email-mx] lookup failed for",
            normalized,
            code ?? (error as Error)?.message,
        );
        return "unavailable";
    } finally {
        clearTimeout(timer);
    }
}
