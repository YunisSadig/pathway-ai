"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Dialog, DropdownMenu } from "radix-ui";
import { useState } from "react";
import { PUBLIC_NAV, SITE, WORKSPACE_NAV, type NavItem } from "@/lib/site";
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
  items = PUBLIC_NAV,
  onNavigate,
  className,
  linkClassName,
}: {
  items?: NavItem[];
  onNavigate?: () => void;
  className?: string;
  linkClassName?: string;
}) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-hover hover:text-foreground aria-[current=page]:bg-selected aria-[current=page]:font-semibold aria-[current=page]:text-primary-soft-foreground",
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

function WorkspaceMenu() {
  const pathname = usePathname();
  return (
    <div className="hidden md:block">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-sm font-semibold transition-colors hover:bg-hover">
          My workspace <ChevronDown aria-hidden className="size-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={6}
            className="z-50 min-w-52 rounded-xl border border-border bg-elevated p-1.5 shadow-lg data-[state=closed]:animate-[menu-out_100ms_ease-in_forwards] data-[state=open]:animate-[menu-in_140ms_ease-out]"
          >
            {WORKSPACE_NAV.map((item) => (
              <DropdownMenu.Item key={item.href} asChild>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex min-h-10 items-center rounded-lg px-3 text-sm font-medium outline-none aria-[current=page]:bg-selected aria-[current=page]:font-semibold data-[highlighted]:bg-hover"
                >
                  {item.label}
                </Link>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks className="flex items-center gap-1" />
        </nav>
        <WorkspaceMenu />
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-surface transition-colors duration-150 hover:bg-hover md:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 data-[state=closed]:animate-[fade-out_180ms_ease-in_forwards] data-[state=open]:animate-[fade-in_200ms_ease-out]" />
              <Dialog.Content
                aria-describedby={undefined}
                className="fixed inset-y-0 right-0 z-50 flex w-[min(20rem,88vw)] flex-col gap-6 border-l border-border bg-background p-5 shadow-lg data-[state=closed]:animate-[slide-out_180ms_ease-in_forwards] data-[state=open]:animate-[slide-in_240ms_var(--ease-out-soft)]"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-lg font-extrabold">
                    Menu
                  </Dialog.Title>
                  <Dialog.Close
                    aria-label="Close menu"
                    className="inline-flex size-11 items-center justify-center rounded-lg transition-colors hover:bg-hover"
                  >
                    <X className="size-5" aria-hidden />
                  </Dialog.Close>
                </div>
                <nav
                  aria-label="Mobile"
                  className="-mr-2 flex flex-col gap-4 overflow-y-auto pr-2"
                >
                  <NavLinks
                    onNavigate={() => setOpen(false)}
                    className="flex flex-col gap-1"
                    linkClassName="flex min-h-11 items-center px-3 text-base"
                  />
                  <p className="border-t border-border px-3 pt-4 text-sm font-semibold text-muted-foreground">
                    My workspace
                  </p>
                  <NavLinks
                    items={WORKSPACE_NAV}
                    onNavigate={() => setOpen(false)}
                    className="flex flex-col gap-1"
                    linkClassName="flex min-h-11 items-center px-3 text-base"
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
