import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Gummy Fever is a South African premium clothing store. Limited drops, boxy cuts, pieces made to be seen.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description:
      "Gummy Fever is a South African premium clothing store. Limited drops, boxy cuts, pieces made to be seen.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA" className={sans.variable}>
      <body className={`${sans.className} antialiased bg-white text-black`}>
        {children}
      </body>
    </html>
  );
}
