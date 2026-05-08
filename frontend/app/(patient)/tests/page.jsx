"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FlaskConical, ShoppingCart } from "lucide-react";
import { getLabTests } from "@/lib/api";

function formatPrice(price) {
  if (typeof price !== "number") return "نامشخص";
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

export default function TestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const data = await getLabTests();
        setTests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center text-red-600">
        <p>خطا: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">آزمایش‌ها</h1>
        <p className="mt-2 text-gray-500">
          انتخاب و سفارش آنلاین آزمایش‌های تشخیصی
        </p>
      </div>

      {/* Grid */}
      {tests.length === 0 ? (
        <div className="text-center text-gray-500">
          هنوز آزمایشی ثبت نشده است.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tests.map((test) => (
          <div
            key={test.id}
            className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                <FlaskConical size={20} />
              </div>
              <span className="text-sm text-gray-500">{test.category || "عمومی"}</span>
            </div>

            <h3 className="mb-3 font-semibold">{test.name}</h3>

            <div className="mb-4 text-lg font-bold text-emerald-600">
              {formatPrice(test.price)}
            </div>

            <Link
              href={`/test-wizard?testId=${test.id}`}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-white hover:bg-emerald-700"
            >
              <ShoppingCart size={18} />
              سفارش آزمایش
            </Link>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}
