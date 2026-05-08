"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ResultDetails() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  const loadResult = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/results/${id}`
    );
    const data = await res.json();
    setResult(data);
  };

  useEffect(() => {
    loadResult();
  }, []);

  if (!result) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div dir="rtl" className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        جزئیات نتیجه آزمایش
      </h1>

      <div className="bg-white p-6 rounded shadow max-w-lg space-y-3">

        <p>
          <strong>شناسه نتیجه:</strong> {result.id}
        </p>

        <p>
          <strong>Order ID:</strong> {result.orderId}
        </p>

        <p>
          <strong>وضعیت:</strong> {result.status}
        </p>

        {result.value ? (
          <a
            href={result.value}
            target="_blank"
            className="text-emerald-600 underline"
          >
            مشاهده فایل PDF
          </a>
        ) : (
          <p className="text-gray-500">
            هنوز فایلی آپلود نشده
          </p>
        )}

      </div>

      <div className="flex gap-4">

        <Link
          href={`/admin/results/${result.id}/edit`}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          آپلود / جایگزینی PDF
        </Link>

        <Link
          href="/admin/results"
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          بازگشت
        </Link>

      </div>

    </div>
  );
}
