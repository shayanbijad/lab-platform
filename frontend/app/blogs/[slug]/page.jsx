import { notFound } from "next/navigation";
import { getBlog, getBlogs } from "@/lib/api";

export async function generateStaticParams() {
  try {
    const blogs = await getBlogs("PUBLISHED");
    return blogs.map((blog) => ({ slug: blog.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    const blog = await getBlog(params.slug);
    return {
      title: `${blog.title} | بلاگ طب نوین`,
      description: blog.excerpt || "",
    };
  } catch {
    return {
      title: "بلاگ طب نوین",
    };
  }
}

export default async function BlogDetailsPage({ params }) {
  let blog;

  try {
    blog = await getBlog(params.slug);
  } catch {
    notFound();
  }

  return (
    <main className="bg-slate-50 px-4 py-10" dir="rtl">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-sm">
        {blog.coverImageUrl ? (
          <div className="h-[260px] w-full md:h-[420px]">
            <img src={blog.coverImageUrl} alt={blog.title} className="h-full w-full object-cover" />
          </div>
        ) : null}

        <div className="px-6 py-8 md:px-10 md:py-10">
          <p className="text-sm text-emerald-600">{new Date(blog.createdAt).toLocaleDateString("fa-IR")}</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">{blog.title}</h1>
          {blog.excerpt ? <p className="mt-4 text-base leading-8 text-slate-500">{blog.excerpt}</p> : null}

          <div
            className="blog-content mt-8 space-y-4 text-base leading-8 text-slate-700 [&_a]:text-emerald-600 [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_img]:my-6 [&_img]:w-full [&_img]:rounded-[28px] [&_img]:object-cover [&_li]:mr-6 [&_p]:leading-8 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
    </main>
  );
}
