"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Compass,
  FlaskConical,
  Globe2,
  LayoutDashboard,
  MessageCircle,
  Route,
  Wallet,
} from "lucide-react";
import { navigation } from "@/components/header";
import { useProfile } from "@/lib/use-profile";
const icons = [
  LayoutDashboard,
  Compass,
  FlaskConical,
  Route,
  Globe2,
  Wallet,
  MessageCircle,
];
export function Workspace({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useProfile();
  return (
    <div className="workspace container">
      <aside className="workspace-sidebar">
        <div className="workspace-person">
          <span className="avatar">
            {state.profile.name.slice(0, 1).toUpperCase() || "D"}
          </span>
          <div>
            <strong>
              {state.completed ? state.profile.name : "Demo explorer"}
            </strong>
            <span>Your next chapter</span>
          </div>
        </div>
        <nav aria-label="Student workspace">
          {navigation.map(([label, href], i) => {
            const Icon = icons[i];
            return (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-note">
          <span className="eyebrow">ROOM TO GROW</span>
          <p>Your starting point isn’t your finish line.</p>
          <Link href="/onboarding">
            Edit your profile <ArrowUpRight size={13} />
          </Link>
        </div>
      </aside>
      <main id="main" className="workspace-main">
        <div className="demo-notice">
          <span className="demo-badge">DEMO</span>
          <span>
            {state.completed
              ? "Using your browser-local profile."
              : "Exploring an example profile. Complete the assessment to personalize."}{" "}
            All programs and figures are fictional.
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-intro">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
