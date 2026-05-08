"use client";

import { useEffect, useState } from "react";
import { getDoctorUsers } from "@/lib/api";
import Link from "next/link";

export default function DoctorUsersPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorUsers()
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-8">در حال بارگذاری...</div>;

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت پزشکان (کاربران)</h1>
        <Link
          href="/admin/doctor-users/create"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          افزودن پزشک جدید
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-right text-gray-600">
            <tr>
              <th className="p-3">نام</th>
              <th className="p-3">ایمیل</th>
              <th className="p-3">تلفن</th>
              <th className="p-3">تخصص</th>
              <th className="p-3">شماره نظام</th>
              <th className="p-3">تاریخ ثبت</th>
              <th className="p-3">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  هیچ پزشکی ثبت نشده است
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {doc.doctorProfile?.fullName || "—"}
                  </td>
                  <td className="p-3">{doc.email || "—"}</td>
                  <td className="p-3">{doc.phone || "—"}</td>
                  <td className="p-3">{doc.doctorProfile?.specialty || "—"}</td>
                  <td className="p-3">{doc.doctorProfile?.licenseNumber || "—"}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-3 space-x-3 space-x-reverse">
                    <Link
                      href={`/admin/doctor-users/${doc.id}/edit`}
                      className="text-emerald-600 hover:text-emerald-800 ml-3"
                    >
                      ویرایش
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
