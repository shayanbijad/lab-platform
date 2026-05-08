import Link from "next/link";
import { getBlogs } from "@/lib/api";

export default async function AdminBlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت بلاگ</h1>
          <p className="mt-2 text-sm text-gray-500">همه مقاله ها، پیش نویس ها و نوشته های منتشر شده را از اینجا مدیریت کنید.</p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          مقاله جدید
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-gray-50 text-sm text-gray-500">
            <tr>
              <th className="px-5 py-4">مقاله</th>
              <th className="px-5 py-4">وضعیت</th>
              <th className="px-5 py-4">آدرس</th>
              <th className="px-5 py-4">تاریخ</th>
              <th className="px-5 py-4">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {blogs?.map((blog) => (
              <tr key={blog.id} className="border-t border-gray-100 align-top">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    {blog.coverImageUrl ? (
                      <img src={blog.coverImageUrl} alt={blog.title} className="h-16 w-24 rounded-xl object-cover" />
                    ) : (
                      <div className="flex h-16 w-24 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">
                        بدون تصویر
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{blog.title}</div>
                      <p className="mt-1 line-clamp-2 max-w-xl text-sm text-gray-500">{blog.excerpt || "بدون خلاصه"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${blog.status === "PUBLISHED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {blog.status === "PUBLISHED" ? "منتشر شده" : "پیش نویس"}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">/blogs/{blog.slug}</td>
                <td className="px-5 py-4 text-sm text-gray-500">{new Date(blog.updatedAt).toLocaleDateString("fa-IR")}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-4 text-sm">
                    <Link href={`/admin/blogs/${blog.id}/edit`} className="text-emerald-600 hover:text-emerald-700">
                      ویرایش
                    </Link>
                    <Link href={`/blogs/${blog.slug}`} className="text-gray-500 hover:text-gray-700">
                      مشاهده
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
