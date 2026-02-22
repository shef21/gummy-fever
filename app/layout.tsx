import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gummy Fever - Premium Gummy Clothing",
  description: "Discover premium gummy clothing at Gummy Fever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
