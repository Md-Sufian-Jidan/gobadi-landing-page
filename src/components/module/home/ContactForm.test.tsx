import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";

type FetchBody = { ok: boolean; status: number; json: () => Promise<unknown> };

function stubFetch(handler: (url: string, init?: RequestInit) => FetchBody) {
    vi.stubGlobal(
        "fetch",
        vi.fn((url: string, init?: RequestInit) => Promise.resolve(handler(url, init))),
    );
}

beforeEach(() => {
    vi.stubGlobal("scrollTo", vi.fn());
});

afterEach(() => {
    vi.unstubAllGlobals();
});

function fillForm(email: string, message: string) {
    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.blur(emailInput);
    fireEvent.change(screen.getByLabelText("Message"), { target: { value: message } });
}

describe("ContactForm", () => {
    it("shows the MX error under the email field on blur", async () => {
        stubFetch(() => ({
            ok: false,
            status: 400,
            json: async () => ({
                ok: false,
                error: "We couldn't verify your email domain. Please use an address from a real provider like Gmail, Outlook or Yahoo.",
            }),
        }));

        render(<ContactForm />);
        fillForm("someone@fdasfads.com", "Hello, I would like to know more.");

        expect(await screen.findByRole("alert")).toHaveTextContent(
            /couldn't verify your email domain/i,
        );
    });

    it("does not call the server when the address is syntactically invalid", async () => {
        stubFetch(() => ({ ok: false, status: 400, json: async () => ({}) }));

        render(<ContactForm />);
        const emailInput = screen.getByLabelText("Email");
        fireEvent.change(emailInput, { target: { value: "not-an-email" } });
        fireEvent.blur(emailInput);

        await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
        expect(fetch).not.toHaveBeenCalled();
    });

    it("maps a rejected submission onto the email field", async () => {
        const message = "Hello, I would like to know more.";
        stubFetch((url) =>
            url.endsWith("/api/validate-email")
                ? { ok: true, status: 200, json: async () => ({ ok: true }) }
                : {
                      ok: false,
                      status: 400,
                      json: async () => ({
                          error: "We couldn't verify your email domain. Please use an address from a real provider like Gmail, Outlook or Yahoo.",
                          field: "email",
                      }),
                  },
        );

        render(<ContactForm />);
        fillForm("someone@somewhere.com", message);
        fireEvent.click(screen.getByRole("button", { name: /send message/i }));

        expect(await screen.findByRole("alert")).toHaveTextContent(
            /couldn't verify your email domain/i,
        );
        expect(
            (screen.getByLabelText("Email") as HTMLInputElement).getAttribute("aria-invalid"),
        ).toBe("true");
    });

    it("offers a prefilled direct email fallback when delivery is unavailable", async () => {
        stubFetch((url) =>
            url.endsWith("/api/validate-email")
                ? { ok: true, status: 200, json: async () => ({ ok: true }) }
                : {
                      ok: false,
                      status: 503,
                      json: async () => ({
                          error: "Email delivery is temporarily unavailable. Please contact us directly.",
                          fallbackEmail: "ceo.gobaadi@gmail.com",
                      }),
                  },
        );

        render(<ContactForm />);
        fillForm("someone@gmail.com", "Hello, I would like to know more.");
        fireEvent.click(screen.getByRole("button", { name: /send message/i }));

        const link = await screen.findByRole("link", { name: "ceo.gobaadi@gmail.com" });
        expect(link.getAttribute("href")).toContain("mailto:ceo.gobaadi@gmail.com");
        expect(link.getAttribute("href")).toContain("Hello%2C%20I%20would%20like%20to%20know%20more.");
    });
});
