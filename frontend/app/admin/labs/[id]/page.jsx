"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditLab() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`${API}/labs/${id}`)
      .then(r=>r.json())
      .then(setForm);
  }, []);

  const save = async () => {
    await fetch(`${API}/labs/${id}`, {
      method:"PATCH",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(form)
    });

    router.push("/labs");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div dir="rtl" className="p-6 max-w-lg space-y-4">
      <h1 className="text-xl font-bold">ویرایش آزمایشگاه</h1>

      <input className="border p-2 w-full"
        value={form.name}
        onChange={(e)=>setForm({...form,name:e.target.value})}/>

      <input className="border p-2 w-full"
        value={form.city}
        onChange={(e)=>setForm({...form,city:e.target.value})}/>

      <input className="border p-2 w-full"
        value={form.phone}
        onChange={(e)=>setForm({...form,phone:e.target.value})}/>

      <textarea className="border p-2 w-full"
        value={form.address}
        onChange={(e)=>setForm({...form,address:e.target.value})}/>

      <button onClick={save}
        className="bg-emerald-600 text-white px-4 py-2 rounded">
        ذخیره
      </button>
    </div>
  );
}
