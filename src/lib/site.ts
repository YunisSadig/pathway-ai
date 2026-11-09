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

/** Public navigation. Only routes that exist are listed. */
export const PUBLIC_NAV: NavItem[] = [
  { label: "Universities", href: "/universities" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Life Abroad", href: "/life-abroad" },
  { label: "How It Works", href: "/how-it-works" },
];

/** Student workspace. Opened from the header menu. */
export const WORKSPACE_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Profile", href: "/profile" },
  { label: "Saved", href: "/saved" },
  { label: "Compare", href: "/compare" },
  { label: "Pathway planner", href: "/pathway-planner" },
  { label: "Improvement Lab", href: "/improvement-lab" },
  { label: "Financial planner", href: "/financial-planner" },
  { label: "AI Advisor preview", href: "/advisor-preview" },
  { label: "Settings", href: "/settings" },
];
