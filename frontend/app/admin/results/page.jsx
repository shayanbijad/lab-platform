"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const load = async () => {
    const r = await fetch(`${API}/results`);
    const d = await r.json();
    setResults(Array.isArray(d) ? d : []);
  };

  const deleteResult = async (id) => {
    if (!confirm("آیا مطمئن هستید؟")) return;

    await fetch(`${API}/results/${id}`, {
      method: "DELETE",
    });

    load();
  };

  useEffect(() => {
    load();
  }, []);

  const filteredResults = results.filter((result) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    const patient = result.orderTest?.order?.patient;
    const patientName = `${patient?.firstName || ""} ${patient?.lastName || ""}`.trim();
    const nationalId = patient?.nationalId || "";
    const testName = result.orderTest?.labTest?.name || "";

    return [patientName, nationalId, testName, result.id]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });

  return (
    <div dir="rtl" className="p-6 space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">نتایج آزمایش</h1>

        <Link
          href="/admin/results/create"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ایجاد نتیجه
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <label className="block text-sm text-gray-600 mb-2">
          جستجو بر اساس نام بیمار یا کد ملی
        </label>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="نام بیمار یا کد ملی"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <table className="w-full bg-white shadow rounded">

        <thead className="border-b">
          <tr>
            <th className="p-2">نام بیمار</th>
            <th className="p-2">کد ملی</th>
            <th className="p-2">کد</th>
            <th className="p-2">سفارش</th>
            <th className="p-2">آزمایش</th>
            <th className="p-2">وضعیت</th>
            <th className="p-2">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {filteredResults.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">
                {r.orderTest?.order?.patient
                  ? `${r.orderTest.order.patient.firstName || ""} ${r.orderTest.order.patient.lastName || ""}`.trim() || "نامشخص"
                  : "نامشخص"}
              </td>
              <td className="p-2">{r.orderTest?.order?.patient?.nationalId || "—"}</td>
              <td className="p-2">{r.id}</td>
              <td className="p-2">
                {r.orderTest?.orderId || r.orderTestId || "نامشخص"}
              </td>
              <td className="p-2">{r.orderTest?.labTest?.name || "نامشخص"}</td>
              <td className="p-2">{r.value ? "دارای فایل" : "بدون فایل"}</td>

              <td className="p-2 space-x-3">

                <Link
                  href={`/admin/results/${r.id}`}
                  className="text-emerald-600"
                >
                  مشاهده
                </Link>

                <Link
                  href={`/admin/results/${r.id}/edit`}
                  className="text-emerald-600 mr-3"
                >
                  آپلود نتیجه
                </Link>

                <button
                  onClick={() => deleteResult(r.id)}
                  className="text-red-600 mr-3"
                >
                  حذف
                </button>

              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
