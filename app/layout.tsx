import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Krishi Hub",
    template: "%s | Krishi Hub",
  },
  description: "AI-powered agricultural intelligence platform for a resilient future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full bg-background text-foreground flex flex-col font-sans">
        <LanguageProvider>
          <Providers>{children}</Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
