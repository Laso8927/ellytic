"use client";
// ELLYTIC Landing Page (React + Next.js + Tailwind + shadcn/ui + Framer Motion + NextAuth + Sanity CMS)

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<"single" | "couple">("single");
  const [addBankAccount, setAddBankAccount] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

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

      <motion.header
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="sticky top-0 z-50 bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between md:px-6 relative"
>
        <Link href="/">
          <span className="font-extrabold text-xl tracking-tight text-black subpixel-antialiased leading-none">ELLYTIC</span>
        </Link>
        <nav className="hidden md:flex space-x-6 text-sm">
          <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/wizard">Get Started</Link>
          <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/#blog">Blog</Link>
          <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/studio">Studio</Link>
          <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/dashboard">Dashboard</Link>
          <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/login">Login</Link>
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
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 bg-black/40 z-30"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute top-full left-0 w-full bg-white border-t shadow-md md:hidden z-40"
              >
                <div className="flex flex-col space-y-4 p-4 text-sm">
                  <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/wizard">Get Started</Link>
                  <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/#blog">Blog</Link>
                  <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/studio">Studio</Link>
                  <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/dashboard">Dashboard</Link>
                  <Link className="text-gray-900 font-medium hover:text-black hover:underline" href="/login">Login</Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="min-h-screen bg-white text-gray-900">
        <motion.section
          id="hero"
          className="px-6 py-24 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-5xl font-bold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            You plan. We handle Greece.
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-gray-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            ELLYTIC transforms your Greek journey with TransLytic – our AI-driven solution for home buyers, freelancers, Greeks abroad and professionals. From translations to tax and enterprise services – we make Greece yours.
          </motion.p>
          <motion.div
  className="mt-10"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.6 }}
>
  <Link href="/wizard">
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Button size="lg">Start Now</Button></motion.div>
    </motion.div>
  </Link>
</motion.div>
        </motion.section>
        <section id="blog" className="bg-white py-20 px-4 sm:px-6 border-t">
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

        {/* About Us section */}
        <section id="about" className="py-20 px-4 sm:px-6 bg-gray-50 border-t">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border rounded-2xl shadow-sm p-8 md:p-12">
              <h2 className="text-3xl font-semibold tracking-tight">About Us</h2>
              <p className="mt-4 text-gray-700 leading-relaxed">
                We’re a tech-driven team transforming relocation and business in Greece.
                ELLYTIC delivers AI-powered translations and streamlined, automated solutions for
                home buyers, expats, Greeks abroad and professionals. Our mission is to make complex processes
                effortless, secure and transparent – so you can focus on what truly matters. Stay tuned and let us
                elevate your Greek success.
              </p>
            </div>
          </div>
        </section>

        {/* Contact section */}
        <section id="contact" className="py-20 px-4 sm:px-6 bg-white border-t">
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
