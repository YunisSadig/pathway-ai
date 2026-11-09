"use client";

import { Check, Moon, Sun } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

const subscribe = () => () => {};

/** Icon-button dropdown offering exactly two choices: Light and Dark. */
export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  // Avoid hydration mismatch: the resolved theme is only known on the client.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const active = mounted ? resolvedTheme : undefined;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label="Change theme"
        className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors duration-150 hover:bg-hover data-[state=open]:bg-hover"
      >
        <Sun className="size-[18px] dark:hidden" aria-hidden />
        <Moon className="hidden size-[18px] dark:block" aria-hidden />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className="z-50 min-w-40 rounded-xl border border-border bg-elevated p-1.5 shadow-lg data-[state=closed]:animate-[menu-out_140ms_ease-in] data-[state=open]:animate-[menu-in_180ms_var(--ease-out-soft)]"
        >
          <DropdownMenu.RadioGroup
            value={active ?? ""}
            onValueChange={(value) => setTheme(value)}
          >
            {OPTIONS.map(({ value, label, Icon }) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-100 outline-none",
                  "data-[highlighted]:bg-hover data-[state=checked]:bg-selected data-[state=checked]:text-primary-soft-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span className="flex-1">{label}</span>
                <DropdownMenu.ItemIndicator>
                  <Check className="size-4" aria-hidden />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
