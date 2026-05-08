"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LabsPage() {
  const [labs, setLabs] = useState([]);

  const load = async () => {
    const r = await fetch(`${API}/labs`);
    const d = await r.json();
    setLabs(d);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("حذف آزمایشگاه؟")) return;
    await fetch(`${API}/labs/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">آزمایشگاه‌ها</h1>
        <Link href="/labs/create" className="bg-emerald-600 text-white px-4 py-2 rounded">
          افزودن آزمایشگاه
        </Link>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="border-b">
          <tr>
            <th className="p-2">نام</th>
            <th className="p-2">شهر</th>
            <th className="p-2">تلفن</th>
            <th className="p-2">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((l) => (
            <tr key={l.id} className="border-b">
              <td className="p-2">{l.name}</td>
              <td className="p-2">{l.city}</td>
              <td className="p-2">{l.phone}</td>
              <td className="p-2 space-x-2">
                <Link href={`/labs/${l.id}/edit`} className="text-emerald-600">ویرایش</Link>
                <button onClick={() => remove(l.id)} className="text-red-600 mr-3">
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
