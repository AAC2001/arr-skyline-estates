import Image from "next/image";
import Link from "next/link";
import { fetchBlogPosts } from "@/lib/api";

export const metadata = { title: "Blog & Updates" };

export default async function BlogPage() {
  const posts = await fetchBlogPosts().catch(() => []);

  return (
    <div className="section-padding">
      <div className="container-wide">
        <h1 className="font-display text-4xl text-navy-900">Real Estate Updates</h1>
        <p className="mt-2 text-navy-600">Market insights and company news</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-soft">
              {post.cover_image_url && (
                <div className="relative h-48">
                  <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-5">
                <h2 className="font-display text-xl text-navy-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-gold-600">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-navy-600">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
