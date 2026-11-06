import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "@/app/page";
test("introduces the product with a semantic heading", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { name: "Pathway AI" }),
  ).toBeInTheDocument();
});
