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
 * True when the domain publishes MX records, i.e. it can actually receive mail.
 * Fails closed: unknown domain, malformed domain, DNS error and timeout all
 * return false so an unverifiable address is never treated as valid.
 */
export async function hasMxRecord(
    domain: string,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
    lookup: MxLookup = defaultLookup,
): Promise<boolean> {
    const normalized = domain.trim().toLowerCase().replace(/\.$/, "");
    if (!normalized || !DOMAIN_RE.test(normalized)) return false;

    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
        const timeout = new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error("DNS_TIMEOUT")), timeoutMs);
        });
        const records = await Promise.race([lookup(normalized), timeout]);
        return records.length > 0;
    } catch (error) {
        const code = (error as NodeJS.ErrnoException | undefined)?.code;
        // ENOTFOUND / ENODATA / ENOENT: the domain has no mail exchanger.
        if (code === "ENOTFOUND" || code === "ENODATA" || code === "ENOENT") return false;
        console.warn(
            "[email-mx] lookup failed for",
            normalized,
            code ?? (error as Error)?.message,
        );
        // Timeout or transient resolver failure: cannot verify -> reject.
        return false;
    } finally {
        clearTimeout(timer);
    }
}
