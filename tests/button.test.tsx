import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { Button } from "@/components/ui/button";
test("busy actions remain named and cannot submit again", async () => {
  const action = vi.fn();
  render(
    <Button loading onClick={action}>
      Save pathway
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Save pathway" });
  expect(button).toHaveAttribute("aria-busy", "true");
  expect(button).toBeDisabled();
  await userEvent.click(button);
  expect(action).not.toHaveBeenCalled();
});
