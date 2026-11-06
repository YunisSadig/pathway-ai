"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Route, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeControl } from "@/components/theme-control";
import { useHydrated } from "@/lib/use-hydrated";
export const navigation = [
  ["Overview", "/dashboard"],
  ["Discover", "/universities"],
  ["Improvement Lab", "/improvement"],
  ["My pathway", "/planner"],
  ["Life abroad", "/life-abroad"],
  ["Finances", "/finance"],
  ["Advisor preview", "/advisor"],
];
export function Header() {
  const ready = useHydrated();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const navId = useId();
  useEffect(() => {
    if (!open) return;
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    function outside(e: PointerEvent) {
      if (!header.current?.contains(e.target as Node)) setOpen(false);
    }
    const desktop = window.matchMedia("(min-width:851px)");
    function resize() {
      if (desktop.matches) setOpen(false);
    }
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    desktop.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="header" ref={header}>
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="pathwayai home">
            <span className="brand-mark">
              <Route size={23} strokeWidth={2.5} />
            </span>
            pathway<span className="brand-ai">ai</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link
              href="/universities"
              aria-current={pathname === "/universities" ? "page" : undefined}
            >
              Find your university
            </Link>
            <Link
              href="/planner"
              aria-current={pathname === "/planner" ? "page" : undefined}
            >
              Build your pathway
            </Link>
            <Link
              href="/life-abroad"
              aria-current={pathname === "/life-abroad" ? "page" : undefined}
            >
              Life abroad
            </Link>
          </nav>
          <div className="header-actions">
            <ThemeControl />
            <Button asChild size="small">
              <Link href="/onboarding">
                Find my path <ArrowUpRight size={16} />
              </Link>
            </Button>
            <button
              type="button"
              ref={trigger}
              disabled={!ready}
              className="icon-button mobile-toggle"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls={navId}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav
          className="mobile-nav"
          id={navId}
          data-open={open}
          aria-hidden={!open}
          inert={!open}
          aria-label="Mobile navigation"
        >
          <div className="mobile-nav-links">
            {navigation.map(([title, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {title}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}
