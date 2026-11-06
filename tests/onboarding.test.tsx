import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { Onboarding } from "@/components/onboarding";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
beforeEach(() => localStorage.clear());
test("shows an accessible required error and focuses the invalid input", async () => {
  const user = userEvent.setup();
  render(<Onboarding />);
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(
    await screen.findByText("Enter a nickname of 1–40 characters."),
  ).toBeVisible();
  expect(screen.getByLabelText("What should we call you?")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});
test("moves forwards and backwards without losing answers", async () => {
  const user = userEvent.setup();
  render(<Onboarding />);
  await user.type(screen.getByLabelText("What should we call you?"), "Demo");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByLabelText("IELTS overall band")).toHaveValue(6);
  await user.click(screen.getByRole("button", { name: "Previous" }));
  expect(screen.getByLabelText("What should we call you?")).toHaveValue("Demo");
  expect(
    JSON.parse(localStorage.getItem("pathway-profile-v1")!).profile.name,
  ).toBe("Demo");
});
