"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import {
  createBlog,
  deleteBlog,
  removeBlogCover,
  updateBlog,
  uploadBlogCover,
  uploadBlogInlineImage,
} from "@/lib/api";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogEditorForm({ initialBlog }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialBlog?.title || "",
    slug: initialBlog?.slug || "",
    excerpt: initialBlog?.excerpt || "",
    status: initialBlog?.status || "DRAFT",
    content: initialBlog?.content || "",
  });
  const [coverPreview, setCoverPreview] = useState(initialBlog?.coverImageUrl || "");
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const generatedSlug = useMemo(() => slugify(form.slug || form.title || ""), [form.slug, form.title]);

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSave = async (nextStatus) => {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        ...form,
        slug: generatedSlug,
        status: nextStatus || form.status,
      };

      const blog = initialBlog?.id
        ? await updateBlog(initialBlog.id, payload)
        : await createBlog(payload);

      if (coverFile) {
        await uploadBlogCover(blog.id, coverFile);
      }

      setMessage(payload.status === "PUBLISHED" ? "مقاله منتشر شد." : "پیش نویس ذخیره شد.");
      router.push(`/admin/blogs/${blog.id}/edit?success=1`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("ذخیره مقاله با خطا مواجه شد.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialBlog?.id) return;
    const confirmed = window.confirm("مطمئن هستید که می خواهید این مقاله حذف شود؟");
    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteBlog(initialBlog.id);
      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("حذف مقاله انجام نشد.");
      setSaving(false);
    }
  };

  const handleRemoveCover = async () => {
    if (!initialBlog?.id || !initialBlog?.coverImageUrl) {
      setCoverFile(null);
      setCoverPreview("");
      return;
    }

    try {
      await removeBlogCover(initialBlog.id);
      setCoverFile(null);
      setCoverPreview("");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("حذف تصویر شاخص انجام نشد.");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {initialBlog?.id ? "ویرایش مقاله" : "مقاله جدید"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            متن، تصویر شاخص و تصاویر داخل محتوا را از همین صفحه مدیریت کنید.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("DRAFT")}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            ذخیره پیش نویس
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("PUBLISHED")}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            انتشار مقاله
          </button>
          {initialBlog?.id ? (
            <button
              type="button"
              disabled={saving}
              onClick={handleDelete}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              حذف
            </button>
          ) : null}
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-gray-700">عنوان مقاله</label>
            <input
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
              placeholder="مثلا: چطور قبل از آزمایش خون آماده شویم؟"
            />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">اسلاگ</label>
                <input
                  value={form.slug}
                  onChange={(event) => handleChange("slug", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                  placeholder="blog-post-slug"
                />
                <p className="mt-2 text-xs text-gray-400">آدرس نهایی: /blogs/{generatedSlug || "new-post"}</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">وضعیت</label>
                <select
                  value={form.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
                >
                  <option value="DRAFT">پیش نویس</option>
                  <option value="PUBLISHED">منتشر شده</option>
                </select>
              </div>
            </div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">خلاصه مقاله</label>
            <textarea
              value={form.excerpt}
              onChange={(event) => handleChange("excerpt", event.target.value)}
              className="min-h-[120px] w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-emerald-400"
              placeholder="یک خلاصه کوتاه برای کارت مقاله و سئو"
            />
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <label className="mb-3 block text-sm font-semibold text-gray-700">محتوای مقاله</label>
            <RichTextEditor
              value={form.content}
              onChange={(content) => handleChange("content", content)}
              onUploadImage={uploadBlogInlineImage}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">تصویر شاخص</h2>
            <label className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-sm text-gray-500 transition hover:border-emerald-300 hover:bg-emerald-50/50">
              انتخاب تصویر
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
            </label>

            {coverPreview ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100">
                <img src={coverPreview} alt="cover preview" className="h-56 w-full object-cover" />
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-400">هنوز تصویری برای این مقاله انتخاب نشده است.</p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleRemoveCover}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-red-200 hover:text-red-600"
              >
                حذف تصویر
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
            <h2 className="text-lg font-semibold">نکته های مدیریت بلاگ</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              <li>برای نمایش در صفحه اصلی، مقاله باید در وضعیت منتشر شده باشد.</li>
              <li>تصاویر داخل متن از طریق دکمه "عکس داخل متن" مستقیما آپلود می شوند.</li>
              <li>اگر خلاصه را خالی بگذارید، از محتوای مقاله به صورت خودکار ساخته می شود.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
