"use client";

import { useEffect, useMemo, useState } from "react";
import { formatOrderId } from "@/lib/orderDisplay";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResultsCreatePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filesByTestId, setFilesByTestId] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleFileChange = (orderTestId, file) => {
    setFilesByTestId((prev) => ({ ...prev, [orderTestId]: file }));
  };

  const uploadForOrderTest = async (orderTest) => {
    const file = filesByTestId[orderTest.id];
    if (!file) {
      alert("ابتدا فایل PDF را انتخاب کنید");
      return;
    }

    let resultId = orderTest.result?.id;
    try {
      if (!resultId) {
        const createRes = await fetch(`${API}/results`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderTestId: orderTest.id,
            value: "",
          }),
        });

        if (!createRes.ok) {
          const text = await createRes.text();
          throw new Error(text || "Failed to create result");
        }

        const created = await createRes.json();
        resultId = created.id;
      }

      const form = new FormData();
      form.append("file", file);

      const uploadRes = await fetch(`${API}/results/${resultId}/upload`, {
        method: "POST",
        body: form,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(text || "Failed to upload file");
      }

      alert("نتیجه آپلود شد");
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert("خطا در آپلود نتیجه");
    }
  };

  const removeFile = async (resultId) => {
    if (!confirm("فایل نتیجه حذف شود؟")) return;

    try {
      const res = await fetch(`${API}/results/${resultId}/file`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to remove file");
      }
      await loadOrders();
    } catch (err) {
      console.error(err);
      alert("خطا در حذف فایل");
    }
  };

  const ordersWithTests = useMemo(
    () => orders.filter((o) => Array.isArray(o.orderTests) && o.orderTests.length),
    [orders]
  );

  const rows = useMemo(() => {
    return ordersWithTests.flatMap((order) => {
      const patientName = order.patient
        ? `${order.patient.firstName || ""} ${order.patient.lastName || ""}`.trim()
        : "نامشخص";
      const nationalId = order.patient?.nationalId || "—";

      return order.orderTests.map((ot) => ({
        order,
        orderTest: ot,
        patientName,
        nationalId,
      }));
    });
  }, [ordersWithTests]);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter(({ patientName, nationalId, order, orderTest }) => {
      const haystack = [
        patientName,
        nationalId,
        order.id,
        orderTest.labTest?.name || "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [rows, searchTerm]);

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">آپلود نتایج آزمایش</h1>
        <a href="/admin/results" className="text-emerald-600">
          لیست نتایج
        </a>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <label className="block text-sm text-gray-600 mb-2">
          جستجو بر اساس نام بیمار یا کد ملی
        </label>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="مثلا: احمدی یا 0012345678"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {loading && <p>در حال بارگذاری...</p>}

      {!loading && rows.length === 0 && (
        <p className="text-gray-500">سفارشی برای نمایش وجود ندارد.</p>
      )}

      {!loading && filteredRows.length === 0 && (
        <p className="text-gray-500">موردی با این جستجو پیدا نشد.</p>
      )}

      {!loading && filteredRows.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full min-w-[1100px]">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-3 text-right">نام بیمار</th>
                <th className="p-3 text-right">کد ملی</th>
                <th className="p-3 text-right">شماره سفارش</th>
                <th className="p-3 text-right">آزمایش</th>
                <th className="p-3 text-right">تاریخ ثبت</th>
                <th className="p-3 text-right">وضعیت تست</th>
                <th className="p-3 text-right">فایل نتیجه</th>
                <th className="p-3 text-right">آپلود</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map(({ order, orderTest, patientName, nationalId }) => (
                <tr key={orderTest.id} className="border-b align-top">
                  <td className="p-3 font-medium">{patientName}</td>
                  <td className="p-3">{nationalId}</td>
                  <td className="p-3">
                    <div>{formatOrderId(order.id)}</div>
                    <div className="text-xs text-gray-400">{order.id}</div>
                  </td>
                  <td className="p-3">{orderTest.labTest?.name || "نامشخص"}</td>
                  <td className="p-3">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("fa-IR")
                      : "نامشخص"}
                  </td>
                  <td className="p-3">{orderTest.status || "نامشخص"}</td>
                  <td className="p-3">
                    {orderTest.result?.value ? (
                      <div className="space-y-2">
                        <a
                          href={orderTest.result.value}
                          target="_blank"
                          className="block text-emerald-600 underline text-sm"
                        >
                          مشاهده PDF
                        </a>
                        <button
                          onClick={() => removeFile(orderTest.result.id)}
                          className="text-red-600 text-sm"
                        >
                          حذف فایل
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">هنوز آپلود نشده</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                          handleFileChange(orderTest.id, e.target.files[0])
                        }
                        className="text-sm"
                      />
                      <button
                        onClick={() => uploadForOrderTest(orderTest)}
                        className="bg-emerald-600 text-white px-3 py-2 rounded text-sm"
                      >
                        {orderTest.result?.value ? "جایگزینی PDF" : "آپلود PDF"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
