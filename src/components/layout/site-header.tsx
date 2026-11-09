"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";
import { PUBLIC_NAV, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight"
    >
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-lg bg-primary text-sm text-primary-foreground"
      >
        P
      </span>
      {SITE.name}
    </Link>
  );
}

function NavLinks({
  onNavigate,
  className,
  linkClassName,
}: {
  onNavigate?: () => void;
  className?: string;
  linkClassName?: string;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {PUBLIC_NAV.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-hover hover:text-foreground aria-[current=page]:text-foreground",
                linkClassName,
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks className="flex items-center gap-1" />
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface transition-colors hover:bg-hover md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 data-[state=open]:animate-[fade-in_200ms_ease-out]" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,88vw)] flex-col gap-6 border-l border-border bg-background p-5 shadow-lg data-[state=open]:animate-[slide-in_240ms_var(--ease-out-soft)]"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-lg font-extrabold">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-hover"
                  >
                    <X className="size-5" aria-hidden />
                  </Dialog.Close>
                </div>
                <nav aria-label="Mobile">
                  <NavLinks
                    onNavigate={() => setOpen(false)}
                    className="flex flex-col gap-1"
                    linkClassName="block min-h-11 px-3 py-3 text-base"
                  />
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
