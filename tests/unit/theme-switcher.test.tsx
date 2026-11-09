import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

describe("ThemeSwitcher", () => {
  it("offers exactly Light and Dark, never System", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole("button", { name: /change theme/i }));
    const options = await screen.findAllByRole("menuitemradio");
    expect(options.map((o) => o.textContent?.trim())).toEqual([
      "Light",
      "Dark",
    ]);
    expect(screen.queryByText(/system/i)).not.toBeInTheDocument();
  });

  it("marks the chosen theme and persists it", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole("button", { name: /change theme/i }));
    await user.click(
      await screen.findByRole("menuitemradio", { name: "Dark" }),
    );
    expect(localStorage.getItem("pathway-theme")).toBe("dark");
    await user.click(screen.getByRole("button", { name: /change theme/i }));
    expect(
      await screen.findByRole("menuitemradio", { name: "Dark" }),
    ).toHaveAttribute("aria-checked", "true");
  });
});
