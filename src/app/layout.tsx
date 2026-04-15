import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description:
    "ClassicModels fullstack analytics dashboard with search and pivot-style statistics.",
  title: "ClassicModels Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background">
        <div className="flex min-h-full flex-col bg-linear-to-br from-slate-50 via-cyan-50/60 to-amber-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
