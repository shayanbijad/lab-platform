"use client";

import { useState, useEffect } from "react";
import { getBlogs } from "@/lib/api";

export default function BlogArticles() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const data = await getBlogs("PUBLISHED");
        setBlogs(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📖</span>
          <h3 className="text-xl font-bold text-gray-800">مقالات سلامت</h3>
        </div>
        <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📖</span>
        <h3 className="text-xl font-bold text-gray-800">مقالات سلامت</h3>
      </div>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <a
            key={blog.id}
            href={`/blogs/${blog.slug}`}
            className="flex gap-3 group cursor-pointer"
          >
            {blog.coverImageUrl && (
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={blog.coverImageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition line-clamp-2">
                {blog.title}
              </p>
              {blog.excerpt && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {blog.excerpt}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(blog.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </a>
        ))}
      </div>

      <a
        href="/blogs"
        className="inline-block mt-4 text-sm text-emerald-600 font-semibold hover:underline"
      >
        مشاهده همه مقالات ←
      </a>
    </div>
  );
}
