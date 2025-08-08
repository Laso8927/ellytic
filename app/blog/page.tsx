import Link from "next/link";
import { client } from "@/sanity/lib/client";

export default async function BlogIndex() {
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc){ _id, title, slug, publishedAt }[0...20]`);
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <ul className="space-y-3">
          {posts.map((p: any) => (
            <li key={p._id} className="border-b pb-3">
              <Link className="font-medium hover:underline" href={`/blog/${p.slug.current}`}>{p.title}</Link>
              <div className="text-xs text-gray-500">{new Date(p.publishedAt).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

