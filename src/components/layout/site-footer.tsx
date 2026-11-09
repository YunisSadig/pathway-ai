import Link from "next/link";
import { PUBLIC_NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-extrabold">{SITE.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {SITE.description}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {PUBLIC_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs text-muted-foreground sm:px-6">
        Prototype: profile data stays in your browser. Verify every requirement
        with the official university before applying.
      </p>
    </footer>
  );
}
