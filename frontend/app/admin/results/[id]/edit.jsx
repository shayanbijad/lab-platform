"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
const router = useRouter();

export default function UploadResult() {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  const upload = async () => {
  if (!file) {
    alert("لطفا فایل PDF انتخاب کنید");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/results/${id}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (res.ok) {
    alert("نتیجه با موفقیت آپلود شد");
  } else {
    alert("خطا در آپلود فایل");
  }
};

  return (
    <div dir="rtl">
      <h1 className="text-xl mb-6">آپلود نتیجه آزمایش</h1>

      <div className="space-y-4 bg-white p-6 rounded shadow max-w-md">

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 w-full"
        />

        <button
          onClick={upload}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          آپلود PDF
        </button>

      </div>
    </div>
  );
  
}
if (res.ok) {
  alert("نتیجه با موفقیت آپلود شد");
  router.push("/admin/results");
}
