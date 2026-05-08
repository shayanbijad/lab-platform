"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDoctorUser } from "@/lib/api";

export default function CreateDoctorUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    fullName: "",
    specialty: "",
    licenseNumber: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await createDoctorUser(form);
      router.push("/admin/doctor-users");
      router.refresh();
    } catch (err) {
      setError(err.message || "خطا در ایجاد پزشک");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">افزودن پزشک جدید</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-white p-6 rounded-xl shadow space-y-4"
      >
        <div>
          <label className="block mb-1 text-right font-medium">نام کامل *</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.fullName}
            onChange={handleChange("fullName")}
            required
            placeholder="دکتر ..."
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">ایمیل *</label>
          <input
            type="email"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.email}
            onChange={handleChange("email")}
            required
            placeholder="doctor@example.com"
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">شماره تلفن *</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.phone}
            onChange={handleChange("phone")}
            required
            placeholder="0912xxxxxxx"
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">رمز عبور *</label>
          <input
            type="password"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.password}
            onChange={handleChange("password")}
            required
            placeholder="حداقل ۶ کاراکتر"
            minLength={6}
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">تخصص</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.specialty}
            onChange={handleChange("specialty")}
            placeholder="مثلاً: قلب و عروق"
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">شماره نظام پزشکی</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.licenseNumber}
            onChange={handleChange("licenseNumber")}
            placeholder="شماره نظام پزشکی"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "در حال ایجاد..." : "ایجاد پزشک"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/doctor-users")}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}
