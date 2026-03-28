import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PingText — SMS API for Developers",
  description: "Send text messages in 3 lines of code. TypeScript & Python SDKs.",
  openGraph: {
    title: "PingText — SMS API for Developers",
    description: "The developer-first SMS API. Simple, fast, reliable.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
