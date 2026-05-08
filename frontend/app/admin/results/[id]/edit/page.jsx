"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function UploadResult() {

  const { id } = useParams();
  const [file,setFile] = useState(null);

  const upload = async () => {

    const form = new FormData();
    form.append("file",file);

    await fetch(`${API}/results/${id}/upload`,{
      method:"POST",
      body:form
    });

    alert("نتیجه آپلود شد");
  };

  return (
    <div dir="rtl" className="p-6 max-w-md space-y-4">

      <h1 className="text-xl font-bold">
        آپلود نتیجه آزمایش
      </h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e)=>setFile(e.target.files[0])}
      />

      <button
        onClick={upload}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        آپلود PDF
      </button>

    </div>
  );
}
