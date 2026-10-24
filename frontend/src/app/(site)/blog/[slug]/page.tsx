import { notFound } from "next/navigation";
import { fetchBlogPost } from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await fetchBlogPost(slug);
    return { title: post.title, description: post.excerpt };
  } catch {
    return { title: "Blog" };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await fetchBlogPost(slug);
  } catch {
    notFound();
  }

  return (
    <article className="section-padding">
      <div className="container-wide mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-navy-900">{post.title}</h1>
        <p className="mt-4 whitespace-pre-wrap text-navy-700 leading-relaxed">{post.body}</p>
      </div>
    </article>
  );
}
