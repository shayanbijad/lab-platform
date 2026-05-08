"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/lib/api";
import { formatOrderId } from "@/lib/orderDisplay";
import { getOrderStatusLabel, getTestStatusLabel } from "@/lib/order-status";

function getMapEmbedUrl(latitude, longitude) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  const offset = 0.008;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - offset}%2C${lat - offset}%2C${lng + offset}%2C${lat + offset}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function PatientOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "خطا در دریافت سفارش");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

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
        <h1 className="text-3xl font-bold mb-6">جزئیات سفارش</h1>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-red-600">خطا: {error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">جزئیات سفارش</h1>
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <p className="text-gray-500">سفارشی پیدا نشد.</p>
        </div>
      </div>
    );
  }

  const mapEmbedUrl = getMapEmbedUrl(
    order.address?.latitude,
    order.address?.longitude,
  );

  return (
    <div dir="rtl" className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-6">جزئیات سفارش</h1>

      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">شماره سفارش</p>
            <p className="font-semibold">{formatOrderId(order.id)}</p>
            <p className="font-mono text-xs text-gray-400">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">وضعیت</p>
            <p className="font-semibold">{getOrderStatusLabel(order)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">تاریخ ثبت</p>
            <p>
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("fa-IR")
                : "نامشخص"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">آدرس نمونه‌گیری</h2>
        {order.address ? (
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              {order.address.city}، {order.address.street}
              {order.address.building ? `، پلاک ${order.address.building}` : ""}
            </p>
            {(order.address.latitude || order.address.longitude) && (
              <div className="text-xs text-gray-500">
                موقعیت:{" "}
                {order.address.latitude ?? "?"}, {order.address.longitude ?? "?"}
                {order.address.latitude && order.address.longitude && (
                  <>
                    {" "}
                    •{" "}
                    <a
                      className="text-emerald-600 underline"
                      target="_blank"
                      href={`https://www.openstreetmap.org/?mlat=${order.address.latitude}&mlon=${order.address.longitude}#map=17/${order.address.latitude}/${order.address.longitude}`}
                    >
                      مشاهده روی نقشه
                    </a>
                  </>
                )}
              </div>
            )}
            {mapEmbedUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border">
                <iframe
                  title="موقعیت نمونه گیری"
                  src={mapEmbedUrl}
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">آدرسی ثبت نشده است.</p>
        )}
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-lg font-bold mb-4">آزمایش‌ها</h2>
        {!order.orderTests || order.orderTests.length === 0 ? (
          <p className="text-gray-500">آزمایشی ثبت نشده است.</p>
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
                  وضعیت: {getTestStatusLabel(ot)}
                </div>

                {ot.result?.id && (
                  <a
                    href={`/patient/results/${ot.result.id}`}
                    className="bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 text-sm"
                  >
                    مشاهده نتیجه
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
