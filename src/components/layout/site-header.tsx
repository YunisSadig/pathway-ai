"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { Suspense, useState } from "react";
import { NAV, SITE, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-display text-lg font-bold tracking-tight"
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

type NavLinksProps = {
  items?: NavItem[];
  onNavigate?: () => void;
  className?: string;
  linkClassName?: string;
};

/**
 * The current path is only known at request time on routes with a dynamic segment (programs and universities),
 * so it is read inside Suspense; the fallback renders the same links without the active marker.
 */
function NavLinks(props: NavLinksProps) {
  return (
    <Suspense fallback={<NavLinkList {...props} pathname={null} />}>
      <ActiveNavLinks {...props} />
    </Suspense>
  );
}

function ActiveNavLinks(props: NavLinksProps) {
  return <NavLinkList {...props} pathname={usePathname()} />;
}

function NavLinkList({
  items = NAV,
  onNavigate,
  className,
  linkClassName,
  pathname,
}: NavLinksProps & { pathname: string | null }) {
  return (
    <ul className={className}>
      {items.map((item) => {
        const active =
          pathname === null
            ? false
            : item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) ||
                // program pages live under the Universities experience
                (item.href === "/universities" &&
                  pathname.startsWith("/programs"));
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

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks className="flex items-center gap-1" />
        </nav>
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
                  <Dialog.Title className="font-display text-lg font-bold">
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
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
