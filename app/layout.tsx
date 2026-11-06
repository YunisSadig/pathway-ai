import type { Metadata } from "next";
import "./globals.css";
import "./interactions.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/inter";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Pathway AI — Your next chapter, with a plan",
  description:
    "Explore a thoughtful study-abroad plan. A fictional, browser-local education planning prototype for students in Azerbaijan.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
