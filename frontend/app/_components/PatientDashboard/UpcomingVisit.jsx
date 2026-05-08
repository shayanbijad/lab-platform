"use client";
import { getOrderWorkflowStage } from "@/lib/order-status";

export default function UpcomingVisit({ orders }) {
  const upcoming = Array.isArray(orders)
    ? orders.find((order) => {
        const stage = getOrderWorkflowStage(order);
        return stage === "ASSIGNED" || stage === "ON_THE_WAY";
      })
    : null;

  const visit = upcoming
    ? {
        date: upcoming.scheduledAt
          ? new Date(upcoming.scheduledAt).toLocaleDateString("fa-IR")
          : "نامشخص",
        time: upcoming.timeWindow || "نامشخص",
        sampler: upcoming.doctor?.name || "نامشخص",
        phone: upcoming.doctor?.phone || null,
        address: upcoming.address,
      }
    : null;

  if (!visit) {
    return (
      <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">نمونه‌گیری آینده</h3>
        <p className="text-gray-500">زمانی برنامه‌ریزی نشده است</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">نمونه‌گیری آینده</h3>

      <div className="text-gray-700 space-y-2">
        <p>تاریخ: {visit.date}</p>
        <p>زمان: {visit.time}</p>
        <p>نمونه‌گیر: {visit.sampler}</p>
        {visit.address && (
          <p>
            آدرس: {visit.address.city}، {visit.address.street}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        {visit.phone && (
          <a
            href={`tel:${visit.phone}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            تماس با نمونه‌گیر
          </a>
        )}

        <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
          تغییر زمان
        </button>
      </div>
    </div>
  );
}
