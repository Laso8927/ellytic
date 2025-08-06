// ELLYTIC Landing Page (React + Next.js + Tailwind + shadcn/ui + Framer Motion + NextAuth + Sanity CMS)

import Head from "next/head";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity config
const client = createClient({
  projectId: "your_project_id",
  dataset: "production",
  apiVersion: "2023-01-01",
  useCdn: true,
});
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

// trimmed header for clarity (code continues below)
export default function Landing() {
  // ...
}
