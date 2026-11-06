"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Route, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeControl } from "@/components/theme-control";
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
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="pathwayai home">
            <span className="brand-mark">
              <Route size={23} strokeWidth={2.5} />
            </span>
            pathway<span className="brand-ai">ai</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            <Link href="/universities">Find your university</Link>
            <Link href="/planner">Build your pathway</Link>
            <Link href="/life-abroad">Life abroad</Link>
          </nav>
          <div className="header-actions">
            <ThemeControl />
            <Button asChild size="small">
              <Link href="/onboarding">
                Find my path <ArrowUpRight size={16} />
              </Link>
            </Button>
            <button
              className="icon-button mobile-toggle"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
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
          </nav>
        )}
      </header>
    </>
  );
}
