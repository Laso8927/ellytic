"use client";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";
import {useTranslations} from "next-intl";

export default function Header() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const EASE: number[] = [0.4, 0.0, 0.2, 1];
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="sticky top-0 z-50 bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between md:px-6 relative"
    >
      <Link href="/">
        <span className="font-extrabold text-xl tracking-tight text-black subpixel-antialiased leading-none">ELLYTIC</span>
      </Link>
      <nav className="hidden md:flex space-x-6 text-sm">
        <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/wizard2">{t("nav.getStarted")}</Link>
        <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/about">{t("nav.about")}</Link>
        <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/blog">{t("nav.blog")}</Link>
        <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/studio">{t("nav.studio")}</Link>
        <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/dashboard">{t("nav.dashboard")}</Link>
        <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/login">{t("nav.login")}</Link>
      </nav>
      <div className="md:hidden">
        <button
          className="text-gray-700 focus:outline-none"
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="fixed inset-0 bg-black/40 z-30"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute top-full left-0 w-full bg-white border-t shadow-md md:hidden z-40"
            >
              <div className="flex flex-col space-y-4 p-4 text-sm">
                <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/wizard2">{t("nav.getStarted")}</Link>
                <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/about">{t("nav.about")}</Link>
                <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/blog">{t("nav.blog")}</Link>
                <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/studio">{t("nav.studio")}</Link>
                <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/dashboard">{t("nav.dashboard")}</Link>
                <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/login">{t("nav.login")}</Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

