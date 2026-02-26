import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gummy Fever - Turn up the HEAT",
  description: "Turn up the HEAT with Gummy Fever premium clothing.",
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
