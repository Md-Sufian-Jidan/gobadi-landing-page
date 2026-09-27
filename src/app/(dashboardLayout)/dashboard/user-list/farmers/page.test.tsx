import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import FarmersPage from "@/app/(dashboardLayout)/dashboard/user-list/farmers/page"

const { searchValueReceived } = vi.hoisted(() => ({
  searchValueReceived: {} as { value?: string },
}))

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("search=rahim"),
}))

vi.mock("@/components/module/dashboard/userList/farmers/FarmersTable", () => ({
  default: ({ searchValue }: { searchValue?: string }) => {
    searchValueReceived.value = searchValue
    return <div data-testid="farmers-table" />
  },
}))

describe("Farmers page", () => {
  it("seeds the table search from the ?search= query param", async () => {
    render(<FarmersPage />)

    const input = await screen.findByPlaceholderText("Search...")
    expect(input).toHaveValue("rahim")
    expect(searchValueReceived.value).toBe("rahim")
  })
})
