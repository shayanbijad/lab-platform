"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditMission() {
  const { id } = useParams();

  const [mission, setMission] = useState(null);
  const [samplers, setSamplers] = useState([]);
  const [samplerId, setSamplerId] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/missions/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setMission(data);
        setSamplerId(data.samplerId || "");
      });

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users?role=SAMPLER`)
      .then((r) => r.json())
      .then((data) => setSamplers(data));
  }, []);

  const assignSampler = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/missions/${id}/assign`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ samplerId }),
      }
    );

    alert("نمونه‌گیر با موفقیت اختصاص یافت");
  };

  if (!mission) return <p>Loading...</p>;

  return (
    <div dir="rtl">
      <h1 className="text-xl mb-6">ویرایش ماموریت</h1>

      <div className="bg-white p-6 rounded shadow max-w-md space-y-4">

        <p>کد سفارش: {mission.orderId}</p>
        <p>آدرس: {mission.address}</p>

        <label className="font-bold">اختصاص نمونه‌گیر:</label>

        <select
          value={samplerId}
          onChange={(e) => setSamplerId(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- انتخاب نمونه‌گیر --</option>

          {samplers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.email}
            </option>
          ))}
        </select>

        <button
          onClick={assignSampler}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ذخیره
        </button>

      </div>
    </div>
  );
}
