"use client";
// ELLYTIC Landing Page (React + Next.js + Tailwind + shadcn/ui + Framer Motion + NextAuth + Sanity CMS)

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

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
          <span className="font-bold text-lg tracking-tight">ELLYTIC</span>
        </Link>
        <nav className="hidden md:flex space-x-6 text-sm">
          <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
          <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
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
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black backdrop-blur-sm z-30"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.nav
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute top-full left-0 w-full bg-white border-t shadow-md md:hidden z-40"
              >
                <div className="flex flex-col space-y-4 p-4 text-sm">
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} transition={{ duration: 0.25, ease: 'easeOut' }}><Link href="#">Link</Link></motion.div>
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
  <Link href="#services">
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
                      <img
                        loading="lazy"
                               src={urlFor(post.mainImage)!
                          .width(600)
                          .height(400)
                          .url()}
                        alt={post.title}
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

        {/* ...About, Login, Footer etc. bleiben unverändert */}
      </main>
    </>
  );
}
