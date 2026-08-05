import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGate from "./components/AuthGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panentra - Menghubungkan Panen dengan Peluang",
  description: "Marketplace Agrotech & Smart Farming Indonesia",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Panentra",
    statusBarStyle: "black-translucent",
  },
  themeColor: "#1B5E20",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-slate-100 flex justify-center items-center">
        <AuthGate>
          <main className="w-full max-w-[440px] min-h-screen bg-[#F7F9F7] text-[#1A1C19] relative shadow-2xl overflow-x-hidden flex flex-col justify-between">
            {children}
          </main>
        </AuthGate>
      </body>
    </html>
  );
}
