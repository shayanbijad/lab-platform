import Link from "next/link";
import { getBlogs } from "@/lib/api";

export const metadata = {
  title: "بلاگ | طب نوین",
};

export default async function BlogsPage() {
  const blogs = await getBlogs("PUBLISHED");

  return (
    <main className="bg-slate-50 px-4 py-10" dir="rtl">
      <section className="mx-auto max-w-6xl rounded-[32px] bg-gradient-to-l from-slate-900 via-slate-800 to-emerald-700 px-6 py-10 text-white shadow-xl md:px-10">
        <p className="text-sm text-emerald-100">مجله سلامت طب نوین</p>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">مقاله ها و راهنمایی های سلامت، آزمایش و مراقبت</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
          تازه ترین نوشته های آموزشی و کاربردی را اینجا می خوانید؛ از آمادگی قبل از آزمایش تا نکته های سبک زندگی سالم.
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
        {blogs?.map((blog) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.slug}`}
            className="group overflow-hidden rounded-[28px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56 w-full bg-slate-100">
              {blog.coverImageUrl ? (
                <img src={blog.coverImageUrl} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">بدون تصویر</div>
              )}
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(blog.createdAt).toLocaleDateString("fa-IR")}</span>
                <span>مطالعه بلاگ</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 transition group-hover:text-emerald-700">{blog.title}</h2>
              <p className="line-clamp-3 text-sm leading-7 text-slate-600">{blog.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
