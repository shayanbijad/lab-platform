"use client";

import { useState } from "react";

export default function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT",
  });

  const submit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/users";
  };

  return (
    <div dir="rtl">
      <h1 className="text-xl mb-6">افزودن کاربر</h1>

      <div className="space-y-4 max-w-md">

        <input
          placeholder="نام"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="ایمیل"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="رمز عبور"
          type="password"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="ADMIN">ادمین</option>
          <option value="PATIENT">بیمار</option>
          <option value="SAMPLER">نمونه‌گیر</option>
        </select>

        <button
          onClick={submit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ذخیره
        </button>

      </div>
    </div>
  );
}
