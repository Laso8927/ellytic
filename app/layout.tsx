import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";

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

async function loadMessages(locale: string) {
  try {
    switch (locale) {
      case "de":
        return (await import("@/messages/de.json")).default;
      case "el":
        return (await import("@/messages/el.json")).default;
      case "nl":
        return (await import("@/messages/nl.json")).default;
      default:
        return (await import("@/messages/en.json")).default;
    }
  } catch {
    return (await import("@/messages/en.json")).default;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const lang = cookieStore.get("lang")?.value || "en";
  const messages = await loadMessages(lang);
  return (
    <html lang={lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <NextIntlClientProvider locale={lang} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <footer className="border-t bg-gray-50 text-gray-700 mt-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-lg tracking-tight text-black leading-none">ELLYTIC</span>
              </div>
              <nav className="flex items-center gap-6 text-sm">
                <Link className="hover:underline" href="/legal/imprint">Imprint</Link>
                <Link className="hover:underline" href="/legal/privacy">Privacy</Link>
                <form action="/lang" method="post" className="inline-flex items-center gap-2">
                  <select name="lang" defaultValue={lang} className="text-sm border rounded px-2 py-1">
                    <option value="en">EN</option>
                    <option value="de">DE</option>
                    <option value="el">EL</option>
                    <option value="nl">NL</option>
                  </select>
                  <button className="text-sm underline" type="submit">Apply</button>
                </form>
              </nav>
              <div className="text-sm text-gray-500">© {new Date().getFullYear()} ELLYTIC</div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
