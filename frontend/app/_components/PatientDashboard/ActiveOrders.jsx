"use client";

import OrderProgress from "@/app/_components/PatientDashboard/OrderProgress";
import {
  getOrderProgressStep,
  getOrderStatusLabel,
  isOrderClosed,
} from "@/lib/order-status";

export default function ActiveOrders({ orders }) {
  const list = Array.isArray(orders) ? orders : [];
  const activeOrders = list
    .filter((order) => !isOrderClosed(order))
    .slice(0, 5)
    .map((order) => ({
      id: order.id,
      tests: order.orderTests?.map((ot) => ot.labTest?.name || "نامشخص") || [],
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("fa-IR")
        : "نامشخص",
      status: getOrderStatusLabel(order),
      step: getOrderProgressStep(order),
      address: order.address,
    }));

  if (activeOrders.length === 0) {
    return (
      <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">سفارش‌های فعال</h3>
        <p className="text-gray-500">سفارش فعالی وجود ندارد</p>
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold mb-4">سفارش‌های فعال</h3>

      <div className="space-y-4">
        {activeOrders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center gap-3">
              <div>
                <p className="font-semibold">
                  {order.tests.join(" ، ")}
                </p>
                {order.address && (
                  <p className="mt-1 text-sm text-gray-500">
                    {order.address.city}، {order.address.street}
                  </p>
                )}
              </div>

              <span className="text-sm text-emerald-600 font-semibold">
                {order.status}
              </span>
            </div>

            <OrderProgress step={order.step} />

            <a
              href={`/patient/orders/${order.id}`}
              className="text-emerald-600 text-sm mt-3 inline-block"
            >
              مشاهده جزئیات →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
