import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "TechVerse",
    template: "%s | TechVerse",
  },
  description: "AI-powered agricultural intelligence platform for a resilient future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
