import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/(commonLayout)/page";

describe("Home page", () => {
  it("renders all main landing page sections", () => {
    render(<Home />);

    expect(document.getElementById("hero")).toBeInTheDocument();
    expect(document.getElementById("our-vision")).toBeInTheDocument();
    expect(document.getElementById("about")).toBeInTheDocument();
    expect(document.getElementById("contact")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: /Where Livestock Meets Intelligence/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /Something New Is/i })).toBeInTheDocument();
  });
});
