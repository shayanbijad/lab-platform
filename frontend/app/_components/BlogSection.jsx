"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlogs } from "@/lib/api";

export default function BlogSection() {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const posts = await getBlogs("PUBLISHED");
        setFeaturedPosts(posts.slice(0, 3));
      } catch (error) {
        console.error("Failed to load blog section", error);
        setFeaturedPosts([]);
      }
    }

    loadBlogs();
  }, []);

  if (featuredPosts.length === 0) return null;

  return (
    <section className="mt-12 px-4" dir="rtl">
      <div className="mx-auto max-w-6xl rounded-[32px] bg-gradient-to-l from-white via-emerald-50 to-emerald-50 p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-emerald-600">بلاگ طب نوین</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">آخرین مقاله های سلامت و آزمایش</h2>
          </div>
          <Link href="/blogs" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            مشاهده همه
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${post.slug}`}
              className="group overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-48 w-full bg-slate-100">
                {post.coverImageUrl ? (
                  <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">بدون تصویر</div>
                )}
              </div>
              <div className="space-y-3 p-5">
                <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString("fa-IR")}</p>
                <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">{post.title}</h3>
                <p className="line-clamp-3 text-sm leading-7 text-slate-600">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
