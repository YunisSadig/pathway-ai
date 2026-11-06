import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Explorer } from "@/components/explorer";
vi.mock("next/navigation", () => ({ usePathname: () => "/universities" }));
test("filters programs and recovers from an empty search", async () => {
  const user = userEvent.setup();
  render(<Explorer />);
  await user.type(screen.getByLabelText("Search programs"), "not a university");
  expect(
    screen.getByText("No fictional programs match these filters."),
  ).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(screen.getByRole("status")).toHaveTextContent("9 fictional programs");
  await user.selectOptions(
    screen.getByLabelText("Destination filter"),
    "Germany",
  );
  expect(screen.getByRole("status")).toHaveTextContent("2 fictional programs");
});
