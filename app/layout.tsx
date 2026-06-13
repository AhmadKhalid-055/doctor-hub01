import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Doctor Hub — Healthcare Management Platform",
  description:
    "Book consultations, manage prescriptions, and access your complete medical history securely. Trusted by 24+ clinics.",
  keywords: ["doctor", "healthcare", "appointment booking", "medical records", "prescription"],
  authors: [{ name: "Doctor Hub" }],
  openGraph: {
    title: "Doctor Hub",
    description: "Your Health, Connected.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
