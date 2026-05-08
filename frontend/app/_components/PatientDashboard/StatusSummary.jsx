"use client";
import { isOrderClosed, isOrderResultsReady } from "@/lib/order-status";

const SUMMARY_ITEMS = [
  { key: "total", label: "کل سفارش‌ها", icon: "📋", color: "text-blue-600", bg: "bg-blue-50" },
  { key: "active", label: "سفارش‌های فعال", icon: "🔄", color: "text-amber-600", bg: "bg-amber-50" },
  { key: "completed", label: "تکمیل‌شده", icon: "✅", color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "cancelled", label: "لغوشده", icon: "❌", color: "text-red-600", bg: "bg-red-50" },
];

function countOrders(orders) {
  const safe = Array.isArray(orders) ? orders : [];
  const completed = safe.filter((order) => isOrderResultsReady(order)).length;
  const cancelled = safe.filter((o) => o.status === "CANCELLED").length;
  const active = safe.filter((order) => !isOrderClosed(order)).length;

  return {
    total: safe.length,
    active,
    completed,
    cancelled,
  };
}

export default function StatusSummary({ orders }) {
  const counts = countOrders(orders);

  return (
    <div dir="rtl" className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {SUMMARY_ITEMS.map((item) => (
        <div
          key={item.key}
          className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition"
        >
          <span className="text-2xl">{item.icon}</span>
          <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          <p className={`text-2xl font-bold mt-1 ${item.color}`}>
            {counts[item.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
