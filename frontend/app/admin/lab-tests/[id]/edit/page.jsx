"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlogs } from "@/lib/api";

export default function EditTest() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    price: "",
    turnaroundTime: "",
    code: "",
    category: "",
    description: "",
    preparationBlogId: "",
  });
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [testData, blogsData] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lab-tests/${id}`).then((r) => r.json()),
          getBlogs("PUBLISHED"),
        ]);
        setBlogs(Array.isArray(blogsData) ? blogsData : []);

        setForm({
          name: testData?.name ?? "",
          price: testData?.price ?? "",
          turnaroundTime: testData?.turnaroundTime ?? "",
          code: testData?.code ?? "",
          category: testData?.category ?? "",
          description: testData?.description ?? "",
          preparationBlogId: testData?.preparationBlogId ?? "",
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    if (id) fetchData();
  }, [id]);

  const update = async () => {
    const payload = {
      name: form.name,
      price: form.price === "" ? undefined : Number(form.price),
      turnaroundTime: form.turnaroundTime,
      code: form.code,
      category: form.category,
      description: form.description,
      preparationBlogId: form.preparationBlogId || "",
    };

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lab-tests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    window.location.href = "/admin/lab-tests";
  };

  return (
    <div dir="rtl">
      <h1 className="text-xl mb-6">ویرایش آزمایش</h1>

      <div className="space-y-4 max-w-md">
        <input
          placeholder="نام آزمایش"
          className="w-full border p-2 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="کد آزمایش (مثلاً CBC)"
          className="w-full border p-2 rounded"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <input
          placeholder="قیمت"
          type="number"
          className="w-full border p-2 rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          placeholder="دسته‌بندی"
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <textarea
          placeholder="توضیحات"
          className="w-full border p-2 rounded"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        {/* Blog selector for preparation guide */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            راهنمای آمادگی قبل از آزمایش
          </label>
          <select
            className="w-full border p-2 rounded"
            value={form.preparationBlogId}
            onChange={(e) => setForm({ ...form, preparationBlogId: e.target.value })}
          >
            <option value="">بدون راهنما</option>
            {blogs.map((blog) => (
              <option key={blog.id} value={blog.id}>
                {blog.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            بیماران پس از انتخاب این آزمایش، مقاله راهنما را مشاهده خواهند کرد
          </p>
        </div>

        <button
          onClick={update}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          بروزرسانی
        </button>
      </div>
    </div>
  );
}
