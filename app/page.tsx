"use client";
// ELLYTIC Landing Page (React + Next.js + Tailwind + shadcn/ui + Framer Motion + NextAuth + Sanity CMS)

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";

// Types
interface Post {
  title: string;
  slug: { current: string };
  mainImage: any;
  publishedAt: string;
}

// Sanity config (optional in dev). Avoid crashing if env is missing.
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tjn76wnq";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const client = SANITY_PROJECT_ID
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: "2023-01-01",
      useCdn: true,
    })
  : null;
const builder = client ? imageUrlBuilder(client) : null;
function urlFor(source: any) {
  return builder?.image(source);
}

export default function Landing() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<"single" | "couple">("single");
  const [addBankAccount, setAddBankAccount] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  // Restore previous simpler easing (default easeInOut)
  const EASE: number[] = [0.4, 0.0, 0.2, 1];

  useEffect(() => {
    if (!client) return;
    client
      .fetch(
        `*[_type == "post"] | order(publishedAt desc)[0...3]{title, slug, mainImage, publishedAt}`
      )
      .then(setPosts)
      .catch(() => setPosts([]));
  }, []);

  const starterPrices: Record<string, number> = {
    single: 325,
    couple: 575,
  };

  return (
    <>

      {/* Global header moved to RootLayout */}

      <main className="min-h-screen text-gray-900">
        <motion.section
          id="hero"
          className="px-6 py-24 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.h1
            className="text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {t("hero.headline")}
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            ELLYTIC transforms your Greek journey with TransLytic – our AI-driven solution for home buyers, freelancers, Greeks abroad and professionals. From translations to tax and enterprise services – we make Greece yours.
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          >
  <Link href="/wizard2">
        <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.2, ease: EASE }}>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.2, ease: EASE }}>
            <Button size="lg">{t("hero.cta")}</Button>
          </motion.div>
        </motion.div>
  </Link>
</motion.div>
        </motion.section>
        <section id="blog" className="py-20 px-4 sm:px-6 border-t">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold mb-10 text-center">
              Insights & Articles
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug.current}
                  href={`/blog/${post.slug.current}`}
                  className="block group"
                >
                  <div className="overflow-hidden rounded-xl shadow-sm">
                           {post.mainImage && builder && (
                      <Image
                        loading="lazy"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        src={urlFor(post.mainImage)!
                          .width(600)
                          .height(400)
                          .url()}
                        alt={post.title}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
    </div>
        </section>

        {/* About (split) */}
        <section id="about" className="py-20 px-4 sm:px-6 bg-gray-50 border-t">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-2xl shadow-sm p-8 md:p-10">
              <h3 className="text-2xl font-semibold">Our Mission</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We simplify and digitize Greek administrative processes for EU citizens, Greek nationals, investors,
                expats, pensioners, and the Greek diaspora. Using AI and automation, we eliminate bureaucracy,
                reduce costs, and ensure transparency.
              </p>
            </div>
            <div className="bg-white border rounded-2xl shadow-sm p-8 md:p-10">
              <h3 className="text-2xl font-semibold">About Us</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                We are a product-first team building a modern service network for Greece. We combine legal know-how
                with automation to make processes reliable, fast, and affordable.
              </p>
            </div>
            <div className="bg-white border rounded-2xl shadow-sm p-8 md:p-10">
              <h3 className="text-2xl font-semibold">Our Vision</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                A digital Greece—where administrative processes are fast, affordable, and easy for everyone. Despite
                economic growth, Greece’s markets are still dominated by outdated, inefficient, and costly providers. We
                aim to change that.
              </p>
            </div>
            <div className="bg-white border rounded-2xl shadow-sm p-8 md:p-10">
              <h3 className="text-2xl font-semibold">Solutions</h3>
              <ul className="mt-3 list-disc pl-5 space-y-1 text-gray-700">
                <li>Automate processes like E1 & recurring E9 tax declarations</li>
                <li>AI-powered translations and document processing</li>
                <li>Streamlined services without unnecessary intermediaries</li>
                <li>Data-driven insights for investors and stakeholders</li>
                <li>Partner with real estate and legal experts</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/about" className="inline-flex items-center text-blue-600 hover:underline">Learn more →</Link>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="py-20 px-4 sm:px-6 border-t">
          <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">Contact</h2>
              <p className="mt-3 text-gray-600">Tell us briefly how we can help. We’ll get back to you.</p>
            </div>
            <ContactForm />
          </div>
        </section>

        {/* ...About, Login, Footer etc. bleiben unverändert */}
      </main>
    </>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorText("");
    if (!name.trim()) return setErrorText("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErrorText("Please enter a valid email.");
    if (message.trim().length < 10) return setErrorText("Message should be at least 10 characters.");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setName(""); setEmail(""); setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-gray-50 border rounded-2xl p-6 md:p-8 shadow-sm w-full">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-600 focus:ring-blue-600"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nachricht</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-600 focus:ring-blue-600 min-h-[120px]"
            placeholder="How can we help?"
          />
        </div>
        {errorText && <p className="text-sm text-red-600">{errorText}</p>}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
          {status === "success" && <span className="text-sm text-green-700">Thanks! We will get back to you.</span>}
          {status === "error" && <span className="text-sm text-red-600">Something went wrong. Please try again.</span>}
        </div>
      </div>
    </form>
  );
}
