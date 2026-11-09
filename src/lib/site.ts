export const SITE = {
  name: "Pathway AI",
  tagline: "Your future deserves more than a guess.",
  description:
    "Pathway AI helps students discover universities worldwide, understand requirements, find scholarships and plan a realistic route abroad.",
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Public navigation. Only routes that exist are listed — extend this as
 * milestones ship so that no visible link is ever a dead end.
 */
export const PUBLIC_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
];
