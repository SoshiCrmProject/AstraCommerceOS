import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AstraCommerce OS",
  description:
    "AI-powered commerce operating system to unify every marketplace workflow.",
};

type RootLayoutProps = {
  children: React.ReactNode;
  params?: Promise<Record<string, never>>;
};

export default function RootLayout({ children, params }: RootLayoutProps) {
  // Root layout doesn't use locale param
  return (
    <html lang={defaultLocale}>
      <body
        className={`${inter.variable} ${geistMono.variable} bg-page text-primary antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
