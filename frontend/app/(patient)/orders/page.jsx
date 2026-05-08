"use client";

import { useState, useEffect } from "react";
import { getPatientByUserId, getOrdersByPatient } from "@/lib/api";
import { formatOrderId } from "@/lib/orderDisplay";
import {
  getOrderStatusBadgeClass,
  getOrderStatusLabel,
  isOrderResultsReady,
} from "@/lib/order-status";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userData = localStorage.getItem("user");
        if (!userData) {
          setError("User not found");
          return;
        }

        const user = JSON.parse(userData);
        const patient = await getPatientByUserId(user.id);
        
        if (patient && patient.id) {
          const ordersData = await getOrdersByPatient(patient.id);
          setOrders(ordersData || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">سفارش‌های من</h1>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-red-600">خطا: {error}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">سفارش‌های من</h1>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-gray-500">
            هنوز سفارشی ثبت نشده است.
          </p>
          <a href="/test-wizard" className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded">
            ثبت آزمایش جدید
          </a>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">سفارش‌های من</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const firstResultId = order.orderTests?.find((ot) => ot.result?.id)?.result?.id;

          return (
          <div key={order.id} className="p-6 border rounded-xl bg-white shadow-md hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  شماره سفارش: {formatOrderId(order.id)}
                </p>
                <p className="text-xs text-gray-400">{order.id}</p>
                <p className="text-lg font-semibold mt-2">
                  {order.orderTests?.map(ot => ot.labTest?.name || "نامشخص").join(" ، ") || "بدون تست"}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getOrderStatusBadgeClass(order)}`}>
                {getOrderStatusLabel(order)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <p>تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString("fa-IR")}</p>
              </div>
              {order.address && (
                <div>
                  <p>آدرس: {order.address.city}, {order.address.street}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <a
                href={`/patient/orders/${order.id}`}
                className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
              >
                مشاهده جزئیات
              </a>
              {isOrderResultsReady(order) && firstResultId && (
                <a
                  href={`/patient/results/${firstResultId}`}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  مشاهده نتایج
                </a>
              )}
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}
