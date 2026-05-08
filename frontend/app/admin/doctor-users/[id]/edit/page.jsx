"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDoctorUser, updateDoctorUser } from "@/lib/api";

export default function EditDoctorUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    fullName: "",
    specialty: "",
    licenseNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDoctorUser(id)
      .then((data) => {
        setForm({
          email: data.email || "",
          phone: data.phone || "",
          fullName: data.doctorProfile?.fullName || "",
          specialty: data.doctorProfile?.specialty || "",
          licenseNumber: data.doctorProfile?.licenseNumber || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await updateDoctorUser(id, form);
      router.push("/admin/doctor-users");
      router.refresh();
    } catch (err) {
      setError(err.message || "خطا در بروزرسانی");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">ویرایش پزشک</h1>

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
          <label className="block mb-1 text-right font-medium">نام کامل</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.fullName}
            onChange={handleChange("fullName")}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">ایمیل</label>
          <input
            type="email"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.email}
            onChange={handleChange("email")}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">شماره تلفن</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.phone}
            onChange={handleChange("phone")}
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">تخصص</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.specialty}
            onChange={handleChange("specialty")}
          />
        </div>

        <div>
          <label className="block mb-1 text-right font-medium">شماره نظام پزشکی</label>
          <input
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            value={form.licenseNumber}
            onChange={handleChange("licenseNumber")}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}
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
