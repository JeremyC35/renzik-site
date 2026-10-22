import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { siteUrl, isProductionDeploy } from "@/lib/env";
import { palette } from "@/config/site";
import "./globals.css";

// next/font downloads the font at build time and serves it from this site. No requests to Google at runtime.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const title = "Renzik — AI call answering and follow-up for contractors";
const description =
  "Renzik builds AI systems for contractors that answer every call and follow up with leads, so jobs stop going to voicemail.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Renzik",
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: isProductionDeploy ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: palette.pine,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-ui focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
