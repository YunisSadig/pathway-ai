import Link from "next/link";
export default function Dashboard() {
  return (
    <main id="main" className="container section">
      <h1>Your starting point is saved.</h1>
      <p>Your full dashboard is being prepared in the next feature.</p>
      <Link href="/onboarding">Review your profile</Link>
    </main>
  );
}
