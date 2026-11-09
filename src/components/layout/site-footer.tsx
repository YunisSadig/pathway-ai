import Link from "next/link";
import { NAV, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="page-container flex flex-col gap-6 py-10 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-extrabold">{SITE.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {SITE.description}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="page-container pb-8 text-sm text-muted-foreground">
        Pathway AI is an early frontend. It does not list universities or
        scholarships yet. When it does, confirm every requirement, fee and
        deadline on the official website.
      </p>
    </footer>
  );
}
