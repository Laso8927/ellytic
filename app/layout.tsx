import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Link from "next/link";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ellytic – We handle Greece",
  description:
    "AI-powered services for AFM registration, translations, tax and more. Fully GDPR-compliant and based in Germany.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
          <footer className="border-t bg-gray-50 text-gray-700 mt-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-lg tracking-tight text-black leading-none">ELLYTIC</span>
              </div>
              <nav className="flex items-center gap-6 text-sm">
                <Link className="hover:underline" href="/legal/imprint">Imprint</Link>
                <Link className="hover:underline" href="/legal/privacy">Privacy</Link>
              </nav>
              <div className="text-sm text-gray-500">© {new Date().getFullYear()} ELLYTIC</div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
