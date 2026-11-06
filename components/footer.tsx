import Link from "next/link";
import { ArrowUpRight, Route } from "lucide-react";
export function Footer() {
  return (
    <footer className="footer container">
      <div>
        <Link className="brand" href="/">
          <Route size={20} />
          pathway<span className="brand-ai">ai</span>
        </Link>
        <p>A little clarity. A world of possibility.</p>
      </div>
      <p className="fine-print">
        Frontend demonstration · All universities and figures are fictional.
        <br />
        Your assessment stays in this browser.
      </p>
      <Link href="/onboarding" className="text-link">
        Start your next chapter <ArrowUpRight size={16} />
      </Link>
    </footer>
  );
}
