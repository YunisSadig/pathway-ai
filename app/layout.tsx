import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pathway AI — Your next chapter, with a plan",
  description:
    "Explore a thoughtful study-abroad plan. A fictional, browser-local education planning prototype for students in Azerbaijan.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
