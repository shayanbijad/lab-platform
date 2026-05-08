"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDoctor } from "@/lib/api";

export default function CreateDoctorForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createDoctor(formData);

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
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1">تجربه</label>
        <input
          className="border p-2 w-full rounded"
          value={formData.experience}
          onChange={(e) =>
            setFormData({ ...formData, experience: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block mb-1">آدرس</label>
        <input
          className="border p-2 w-full rounded"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        ایجاد پزشک
      </button>
    </form>
  );
}
