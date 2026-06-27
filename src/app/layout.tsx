import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MySiteBook - Construction Expense Tracker",
  description: "Track Every Rupee. Stop Profit Drain. The Ultimate Construction Expense Tracker.",
  manifest: "/manifest.json",
  icons: {
    icon: '/mysitebook-logo-transparent.png',
    apple: '/mysitebook-logo-transparent.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col text-brandtext bg-brandbg selection:bg-primary-500 selection:text-surface font-sans">
        <LanguageProvider>
          <Providers>
            {children}
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
