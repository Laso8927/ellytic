import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";

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
          <PortableText value={post.body || []} />
        </div>
      </article>
    </main>
  );
}

