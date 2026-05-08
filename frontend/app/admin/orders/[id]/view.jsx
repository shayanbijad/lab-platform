"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getInternalOrderStatusLabel, getOrderStatusLabel } from "@/lib/order-status";

const STATUS_OPTIONS = ["CREATED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

export default function OrderView() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
      });
  }, [id]);

  const updateStatus = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    alert("وضعیت سفارش بروزرسانی شد");
  };

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div dir="rtl" className="space-y-6">
      <h1 className="text-2xl mb-4">جزئیات سفارش</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <p>کد سفارش: {order.id}</p>
        <p>کاربر: {order.user?.name}</p>
        <p>وضعیت نمایش داده‌شده: {getOrderStatusLabel(order)}</p>
        <p>قیمت کل: {order.totalPrice}</p>

        <div className="mt-4">
          <label className="block mb-2 font-bold">مرحله داخلی سفارش:</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {STATUS_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {getInternalOrderStatusLabel(value)}
              </option>
            ))}
          </select>

          <button
            onClick={updateStatus}
            className="bg-emerald-600 text-white px-4 py-2 rounded mt-3"
          >
            بروزرسانی وضعیت
          </button>
        </div>

        <div>
          <h2 className="font-bold mb-2">آزمایش‌ها</h2>
          {order.tests?.map((t) => (
            <div key={t.id} className="border-b py-2">
              {t.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
