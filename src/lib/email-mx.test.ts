import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { hasMxRecord, type MxLookup, type MxRecord } from "./email-mx";

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

describe("hasMxRecord", () => {
    it("returns true when the domain publishes MX records", async () => {
        const { lookup, calls } = fakeLookup(() =>
            Promise.resolve([{ exchange: "gmail-smtp-in.l.google.com", priority: 5 }]),
        );
        await expect(hasMxRecord("gmail.com", 3000, lookup)).resolves.toBe(true);
        expect(calls).toEqual(["gmail.com"]);
    });

    it("returns false when the domain does not exist (ENOTFOUND)", async () => {
        const { lookup } = fakeLookup(() => Promise.reject(dnsError("ENOTFOUND")));
        await expect(hasMxRecord("fdasfads.com", 3000, lookup)).resolves.toBe(false);
    });

    it("returns false when the domain has no mail exchanger (ENODATA)", async () => {
        const { lookup } = fakeLookup(() => Promise.reject(dnsError("ENODATA")));
        await expect(hasMxRecord("example.org", 3000, lookup)).resolves.toBe(false);
    });

    it("returns false when the lookup returns no records", async () => {
        const { lookup } = fakeLookup(() => Promise.resolve([]));
        await expect(hasMxRecord("example.org", 3000, lookup)).resolves.toBe(false);
    });

    it("fails closed when the DNS lookup times out", async () => {
        const { lookup } = fakeLookup(() => new Promise(() => {}));
        await expect(hasMxRecord("gmail.com", 20, lookup)).resolves.toBe(false);
    });

    it("fails closed on transient resolver errors", async () => {
        const { lookup } = fakeLookup(() => Promise.reject(dnsError("ECONNREFUSED")));
        await expect(hasMxRecord("gmail.com", 3000, lookup)).resolves.toBe(false);
    });

    it("rejects malformed domains without spending a DNS lookup", async () => {
        const { lookup, calls } = fakeLookup(() =>
            Promise.resolve([{ exchange: "mx.example.com", priority: 1 }]),
        );
        await expect(hasMxRecord("", 3000, lookup)).resolves.toBe(false);
        await expect(hasMxRecord("nodots", 3000, lookup)).resolves.toBe(false);
        await expect(hasMxRecord("-bad-.example", 3000, lookup)).resolves.toBe(false);
        expect(calls).toEqual([]);
    });

    it("normalizes case and trailing dots before querying", async () => {
        const { lookup, calls } = fakeLookup(() =>
            Promise.resolve([{ exchange: "mx.example.com", priority: 10 }]),
        );
        await expect(hasMxRecord("  Example.COM. ", 3000, lookup)).resolves.toBe(true);
        expect(calls).toEqual(["example.com"]);
    });
});
