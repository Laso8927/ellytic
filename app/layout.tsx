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

function nestMessages(flat: Record<string, any>): Record<string, any> {
  const nested: Record<string, any> = {};
  for (const [key, value] of Object.entries(flat || {})) {
    const parts = key.split(".");
    let cursor = nested;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!cursor[part] || typeof cursor[part] !== "object") cursor[part] = {};
      cursor = cursor[part];
    }
    cursor[parts[parts.length - 1]] = value;
  }
  return nested;
}

async function loadMessages(locale: string) {
  try {
    switch (locale) {
      case "de":
        return nestMessages((await import("@/messages/de.json")).default as any);
      case "el":
        return nestMessages((await import("@/messages/el.json")).default as any);
      case "nl":
        return nestMessages((await import("@/messages/nl.json")).default as any);
      default:
        return nestMessages((await import("@/messages/en.json")).default as any);
    }
  } catch {
    return nestMessages((await import("@/messages/en.json")).default as any);
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
  const imprintLabel = (messages as any)?.footer?.imprint ?? "Imprint";
  const privacyLabel = (messages as any)?.footer?.privacy ?? "Privacy";
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
                <Link className="hover:underline" href="/legal/imprint">{imprintLabel}</Link>
                <Link className="hover:underline" href="/legal/privacy">{privacyLabel}</Link>
                <form action="/lang" method="post" className="inline-flex items-center gap-2">
                  <select name="lang" defaultValue={lang} className="text-sm border rounded px-2 py-1">
                    <option value="en">EN</option>
                    <option value="de">DE</option>
                    <option value="el">EL</option>
                    <option value="nl">NL</option>
                  </select>
                  <button className="text-sm underline" type="submit">{(messages as any)?.footer?.langApply ?? "Apply"}</button>
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
