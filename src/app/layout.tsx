import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/Providers";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "MySiteBook - Construction Expense Tracker",
  description: "Track Every Rupee. Stop Profit Drain. The Ultimate Construction Expense Tracker.",
  manifest: "/manifest.json",
  icons: {
    icon: '/mysitebook-icon.png',
    apple: '/mysitebook-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans h-full antialiased scroll-smooth`}>
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
