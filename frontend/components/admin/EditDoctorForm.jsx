"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDoctor } from "@/lib/api";

export default function EditDoctorForm({ doctor }) {
  const [formData, setFormData] = useState(doctor);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoctor(doctor.id, formData);
    router.push("/admin/doctors");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
      <div>
        <label className="block mb-1">نام</label>
        <input
          className="border p-2 w-full rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded">
        ذخیره تغییرات
      </button>
    </form>
  );
}
