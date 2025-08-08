import { client } from "@/sanity/lib/client";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import type { Image as SanityImage } from "sanity";

const builder = imageUrlBuilder({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production" });

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const img = value as SanityImage;
      const url = builder.image(img).width(1200).height(675).fit("max").url();
      if (!url) return null;
      return (
        <figure>
          <Image src={url} alt={value?.alt || ""} width={1200} height={675} className="rounded-lg" />
          {value?.caption && <figcaption className="text-sm text-gray-500">{value.caption}</figcaption>}
        </figure>
      );
    },
    code: ({ value }) => (
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto"><code>{value?.code}</code></pre>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = /^https?:\/\//i.test(href);
      return (
        <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="underline">
          {children}
        </a>
      );
    },
  },
};

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ title, publishedAt, body }`,
    { slug }
  );
  if (!post) return <main className="p-6">Not found</main>;
  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <article className="max-w-2xl mx-auto prose prose-gray">
        <h1>{post.title}</h1>
        <p className="text-sm text-gray-500">{new Date(post.publishedAt).toLocaleDateString()}</p>
        <div className="mt-6">
          <PortableText value={post.body || []} components={components} />
        </div>
      </article>
    </main>
  );
}

