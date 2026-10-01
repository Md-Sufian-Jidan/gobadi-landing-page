import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { checkMxRecord, type MxLookup, type MxRecord } from "./email-mx";

function dnsError(code: string): NodeJS.ErrnoException {
    const error = new Error(code) as NodeJS.ErrnoException;
    error.code = code;
    return error;
}

/** Records the domains it was asked for and settles with a fixed result. */
function fakeLookup(result: () => Promise<MxRecord[]>) {
    const calls: string[] = [];
    const lookup: MxLookup = (domain) => {
        calls.push(domain);
        return result();
    };
    return { lookup, calls };
}

describe("checkMxRecord", () => {
    it("verifies a domain that publishes MX records", async () => {
        const { lookup, calls } = fakeLookup(() =>
            Promise.resolve([{ exchange: "gmail-smtp-in.l.google.com", priority: 5 }]),
        );
        await expect(checkMxRecord("gmail.com", 3000, lookup)).resolves.toBe("verified");
        expect(calls).toEqual(["gmail.com"]);
    });

    it("rejects a domain that does not exist (ENOTFOUND)", async () => {
        const { lookup } = fakeLookup(() => Promise.reject(dnsError("ENOTFOUND")));
        await expect(checkMxRecord("fdasfads.com", 3000, lookup)).resolves.toBe("no-mail-record");
    });

    it("rejects a domain with no mail exchanger (ENODATA)", async () => {
        const { lookup } = fakeLookup(() => Promise.reject(dnsError("ENODATA")));
        await expect(checkMxRecord("example.org", 3000, lookup)).resolves.toBe("no-mail-record");
    });

    it("rejects a successful lookup that returns no records", async () => {
        const { lookup } = fakeLookup(() => Promise.resolve([]));
        await expect(checkMxRecord("example.org", 3000, lookup)).resolves.toBe("no-mail-record");
    });

    it("does not treat a DNS timeout as proof that the domain is invalid", async () => {
        const { lookup } = fakeLookup(() => new Promise(() => {}));
        await expect(checkMxRecord("gmail.com", 20, lookup)).resolves.toBe("unavailable");
    });

    it("does not treat transient resolver errors as proof that the domain is invalid", async () => {
        const { lookup } = fakeLookup(() => Promise.reject(dnsError("ECONNREFUSED")));
        await expect(checkMxRecord("gmail.com", 3000, lookup)).resolves.toBe("unavailable");
    });

    it("rejects malformed domains without spending a DNS lookup", async () => {
        const { lookup, calls } = fakeLookup(() =>
            Promise.resolve([{ exchange: "mx.example.com", priority: 1 }]),
        );
        await expect(checkMxRecord("", 3000, lookup)).resolves.toBe("no-mail-record");
        await expect(checkMxRecord("nodots", 3000, lookup)).resolves.toBe("no-mail-record");
        await expect(checkMxRecord("-bad-.example", 3000, lookup)).resolves.toBe("no-mail-record");
        expect(calls).toEqual([]);
    });

    it("normalizes case and trailing dots before querying", async () => {
        const { lookup, calls } = fakeLookup(() =>
            Promise.resolve([{ exchange: "mx.example.com", priority: 10 }]),
        );
        await expect(checkMxRecord("  Example.COM. ", 3000, lookup)).resolves.toBe("verified");
        expect(calls).toEqual(["example.com"]);
    });
});
