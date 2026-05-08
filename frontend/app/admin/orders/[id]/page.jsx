"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/lib/api";
import { formatOrderId } from "@/lib/orderDisplay";
import {
  getInternalOrderStatusLabel,
  getOrderStatusLabel,
} from "@/lib/order-status";

const STATUS_OPTIONS = [
  { value: "CREATED", label: getInternalOrderStatusLabel("CREATED") },
  { value: "SCHEDULED", label: getInternalOrderStatusLabel("SCHEDULED") },
  { value: "IN_PROGRESS", label: getInternalOrderStatusLabel("IN_PROGRESS") },
  { value: "COMPLETED", label: getInternalOrderStatusLabel("COMPLETED") },
  { value: "CANCELLED", label: getInternalOrderStatusLabel("CANCELLED") },
];

export default function AdminOrderEditPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
        setStatus(data?.status || "");
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "خطا در دریافت سفارش");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const totalPrice = useMemo(() => {
    if (!order?.orderTests) return 0;
    return order.orderTests.reduce((sum, ot) => {
      const price = ot?.labTest?.price;
      return sum + (typeof price === "number" ? price : 0);
    }, 0);
  }, [order]);

  const updateStatus = async () => {
    if (!id) return;
    try {
      setSaving(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update status");
      }

      const updated = await res.json();
      setOrder(updated);
      alert("وضعیت سفارش بروزرسانی شد");
    } catch (err) {
      console.error(err);
      alert("خطا در بروزرسانی وضعیت");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">ویرایش سفارش</h1>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-red-600">خطا: {error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">ویرایش سفارش</h1>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-gray-500">سفارشی پیدا نشد.</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="container mx-auto px-4 py-24 space-y-6">
      <h1 className="text-3xl font-bold">ویرایش سفارش</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">کد سفارش</p>
            <p className="font-semibold">{formatOrderId(order.id)}</p>
            <p className="font-mono text-xs text-gray-400">{order.id}</p>
          </div>
          <div>
            <p className="text-gray-500">کاربر</p>
            <p>
              {order.patient
                ? `${order.patient.firstName} ${order.patient.lastName}`
                : "نامشخص"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">تاریخ ثبت</p>
            <p>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("fa-IR")
                : "نامشخص"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">قیمت کل</p>
            <p>{new Intl.NumberFormat("fa-IR").format(totalPrice)}</p>
          </div>
          <div>
            <p className="text-gray-500">وضعیت</p>
            <p className="mb-2 text-xs text-gray-400">
              نمایش به کاربر: {getOrderStatusLabel(order)}
            </p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded w-full"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={updateStatus}
              disabled={saving}
              className="bg-emerald-600 text-white px-4 py-2 rounded w-full"
            >
              {saving ? "در حال بروزرسانی..." : "بروزرسانی وضعیت"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold mb-3">آدرس</h2>
        {order.address ? (
          <p className="text-sm text-gray-700">
            {order.address.city}، {order.address.street}
            {order.address.building ? `، پلاک ${order.address.building}` : ""}
          </p>
        ) : (
          <p className="text-sm text-gray-500">آدرسی ثبت نشده است.</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold mb-3">آزمایش‌ها</h2>
        {!order.orderTests || order.orderTests.length === 0 ? (
          <p className="text-sm text-gray-500">آزمایشی ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {order.orderTests.map((ot) => (
              <div
                key={ot.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-semibold">
                    {ot.labTest?.name || "نامشخص"}
                  </p>
                  {ot.labTest?.price !== undefined && (
                    <p className="text-sm text-gray-500">
                      قیمت:{" "}
                      {new Intl.NumberFormat("fa-IR").format(
                        Number(ot.labTest.price) || 0
                      )}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  وضعیت تست: {ot.status || "نامشخص"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
