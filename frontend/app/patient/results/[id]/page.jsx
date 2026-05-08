"use client";

import { useEffect, useState } from "react";
import { getById } from "@/lib/api";

function isFileUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

export default function PatientResultDetailsPage({ params }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        const data = await getById("results", params.id);
        if (!data) {
          setError("نتیجه پیدا نشد");
          return;
        }
        setResult(data);
      } catch (err) {
        setError(err.message || "خطا در دریافت نتیجه");
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [params.id]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-gray-50 py-24 px-4">
        <div className="max-w-3xl mx-auto rounded-xl border bg-white p-6 shadow-sm">
          <p>در حال بارگذاری نتیجه...</p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main dir="rtl" className="min-h-screen bg-gray-50 py-24 px-4">
        <div className="max-w-3xl mx-auto rounded-xl border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">نتیجه آزمایش</h1>
          <p className="mt-4 text-red-600">{error || "نتیجه پیدا نشد"}</p>
          <a
            href="/patient/orders"
            className="mt-6 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            بازگشت به سفارش ها
          </a>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-3xl mx-auto rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">نتیجه آزمایش</h1>
          <p className="mt-2 text-sm text-gray-500">شناسه نتیجه: {result.id}</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-500">وضعیت بررسی</div>
            <div className="mt-1 font-semibold text-gray-800">
              {result.reviewed ? "بررسی شده" : "در انتظار بررسی"}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-500">تاریخ ثبت</div>
            <div className="mt-1 font-semibold text-gray-800">
              {result.createdAt
                ? new Date(result.createdAt).toLocaleDateString("fa-IR")
                : "-"}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-500">مقدار نتیجه</div>
            <div className="mt-1 break-all font-semibold text-gray-800">
              {result.value || "هنوز مقداری ثبت نشده است"}
            </div>
          </div>

          {isFileUrl(result.value) && (
            <a
              href={result.value}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              مشاهده فایل نتیجه
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
