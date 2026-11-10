export const SITE = {
  name: "Pathway AI",
  tagline: "Your future deserves more than a guess.",
  description:
    "Pathway AI is a study-abroad guide in development. Browse destinations today; verified university and scholarship information is being prepared.",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/** The four primary pages. */
export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Universities", href: "/universities" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "How It Works", href: "/how-it-works" },
];
