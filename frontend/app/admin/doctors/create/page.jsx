"use client";

import { useState } from "react";

export default function CreateDoctor() {
  const [form, setForm] = useState({
    name: "",
    Categories: "",
    Experience: "",
    Address: "",
    image: "",
  });

  const submit = async () => {
    await fetch("/api/doctors", {
      method: "POST",
      body: JSON.stringify(form),
    });
    window.location.href = "/admin/doctors";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">افزودن پزشک جدید</h1>

      <div className="space-y-4 max-w-xl bg-white p-6 rounded-xl shadow">

        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block mb-1 text-right">{key}</label>
            <input
              className="w-full border p-2 rounded"
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          </div>
        ))}

        <button
          onClick={submit}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}
