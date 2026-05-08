"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CreateLab() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    city: "",
    phone: "",
    address: ""
  });

  const submit = async () => {
    await fetch(`${API}/labs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    router.push("/labs");
  };

  return (
    <div dir="rtl" className="p-6 max-w-lg space-y-4">
      <h1 className="text-xl font-bold">افزودن آزمایشگاه</h1>

      <input className="border p-2 w-full" placeholder="نام"
        onChange={(e)=>setForm({...form,name:e.target.value})} />

      <input className="border p-2 w-full" placeholder="شهر"
        onChange={(e)=>setForm({...form,city:e.target.value})} />

      <input className="border p-2 w-full" placeholder="تلفن"
        onChange={(e)=>setForm({...form,phone:e.target.value})} />

      <textarea className="border p-2 w-full" placeholder="آدرس"
        onChange={(e)=>setForm({...form,address:e.target.value})} />

      <button onClick={submit}
        className="bg-green-600 text-white px-4 py-2 rounded">
        ذخیره
      </button>
    </div>
  );
}
