"use client";
import { isOrderResultsReady } from "@/lib/order-status";

export default function RecentResults({ orders }) {
  const results = Array.isArray(orders)
    ? orders
        .filter((order) => isOrderResultsReady(order))
        .flatMap(
          (order) =>
            order.orderTests
              ?.filter((ot) => ot.result)
              .map((ot) => ({
                id: ot.result?.id,
                name: ot.labTest?.name || "نامشخص",
                date: new Date(ot.result?.createdAt).toLocaleDateString("fa-IR"),
                value: ot.result?.value,
                unit: ot.result?.unit,
                link: `/patient/results/${ot.result?.id}`,
              })) || [],
        )
        .slice(0, 5)
    : [];

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧪</span>
        <h3 className="text-xl font-bold text-gray-800">آخرین نتایج آزمایش‌ها</h3>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-4xl">🔬</span>
          <p className="text-gray-500 mt-3">
            هنوز نتیجه‌ای موجود نیست
          </p>
          <p className="text-xs text-gray-400 mt-1">
            پس از انجام آزمایش، نتایج اینجا نمایش داده می‌شود
          </p>
          <a
            href="/test-wizard"
            className="inline-block mt-4 bg-emerald-600 text-white px-5 py-2 rounded-xl hover:bg-emerald-700 transition text-sm"
          >
            ثبت آزمایش جدید
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((r, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-emerald-200 hover:shadow-sm transition"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800">{r.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-gray-500">
                    {r.date}
                  </p>
                  {r.value && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {r.value} {r.unit || ""}
                    </span>
                  )}
                </div>
              </div>

              <a
                href={r.link}
                className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition text-sm flex-shrink-0"
              >
                مشاهده
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
