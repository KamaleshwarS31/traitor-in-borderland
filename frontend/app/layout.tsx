import type { Metadata } from "next";
import ClientShell from "@/components/layout/ClientShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traitor in Borderland – Riviera 2026",
  description:
    "A thrilling real-time treasure hunt where innocents and traitors battle for gold. Riviera 2026 – VIT University.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}