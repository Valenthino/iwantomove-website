import type { Metadata } from "next";
import { Header, Footer } from "@/components/site";
import { Analytics } from "@/components/analytics";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://iwantomove.ca"),
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
