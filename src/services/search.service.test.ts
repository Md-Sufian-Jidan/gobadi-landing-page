import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const requestMock = vi.fn();

vi.mock("axios", () => ({
  default: {
    request: (...args: unknown[]) => requestMock(...args),
  },
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => ({ value: "test-token" }),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("unexpected redirect");
  }),
}));

vi.mock("./adminAuth.service", () => ({
  adminRefreshAccessToken: vi.fn(async () => ({ success: false })),
}));

let globalSearch: (query: string) => Promise<unknown>;

beforeAll(async () => {
  process.env.NEXT_PUBLIC_API_URL = "https://api.test";
  ({ globalSearch } = await import("./search.service"));
});

beforeEach(() => {
  requestMock.mockReset();
});

describe("globalSearch", () => {
  it("reads results from the flat (unwrapped) backend response", async () => {
    requestMock.mockResolvedValue({
      status: 200,
      data: {
        farmers: [{ id: 1, name: "Rahim", email: "r@example.com", phone: null, avatar: null, verified: true }],
        doctors: [],
        animals: [],
        notifications: [],
      },
    });

    const res = await globalSearch("rah");

    expect(res).toEqual({
      status: true,
      data: {
        farmers: [{ id: 1, name: "Rahim", email: "r@example.com", phone: null, avatar: null, verified: true }],
        doctors: [],
        animals: [],
        notifications: [],
      },
    });
    expect(requestMock).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://api.test/dashboard/search?q=rah" })
    );
  });

  it("also accepts a `{ data }` enveloped response", async () => {
    requestMock.mockResolvedValue({
      status: 200,
      data: {
        data: {
          farmers: [],
          doctors: [{ id: 7, name: "Dr Salam" }],
          animals: [],
          notifications: [],
        },
      },
    });

    const res = await globalSearch("sal");

    expect(res).toEqual({
      status: true,
      data: { farmers: [], doctors: [{ id: 7, name: "Dr Salam" }], animals: [], notifications: [] },
    });
  });

  it("defaults missing categories to empty arrays so the UI never reads undefined", async () => {
    requestMock.mockResolvedValue({
      status: 200,
      data: { farmers: [{ id: 2, name: "Bablu" }] },
    });

    const res = await globalSearch("bab");

    expect(res).toEqual({
      status: true,
      data: { farmers: [{ id: 2, name: "Bablu" }], doctors: [], animals: [], notifications: [] },
    });
  });

  it("returns a failure result when the backend responds with an error", async () => {
    requestMock.mockResolvedValue({
      status: 500,
      data: { message: "boom" },
    });

    const res = await globalSearch("x");

    expect(res).toEqual({ status: false, message: "boom" });
  });
});
