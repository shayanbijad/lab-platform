"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditPatient() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`)
      .then((r) => r.json())
      .then((data) => setForm(data));
  }, []);

  const update = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/patients";
  };

  return (
    <div dir="rtl">
      <h1 className="text-xl mb-6">ویرایش بیمار</h1>

      <div className="space-y-4 max-w-md">

        <input
          value={form.name}
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          value={form.email}
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button
          onClick={update}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          ذخیره تغییرات
        </button>

      </div>
    </div>
  );
}
