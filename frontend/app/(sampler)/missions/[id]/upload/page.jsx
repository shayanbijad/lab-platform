'use client'

import Link from "next/link"
import { useParams } from "next/navigation"
import SamplerBottomNav from "@/app/_components/SamplerBottomNav"

export default function UploadDocs(){

  const { id } = useParams()

  return (
    <div dir="rtl" className="p-4 pb-24">

      <Link href={`/missions/${id}/checklist`}>
        ← بازگشت
      </Link>

      <h2 className="text-lg font-bold mt-3 mb-4">
        آپلود مدارک
      </h2>

      <div className="border p-4 rounded mb-4">

        <p className="font-semibold mb-2">
          فرم رضایت بیمار
        </p>

        <input type="file" className="mb-2"/>
        <input type="file"/>

      </div>

      <div className="border p-4 rounded">

        <p className="font-semibold mb-2">
          نسخه پزشک
        </p>

        <input type="file" className="mb-2"/>
        <input type="file"/>

      </div>

      <Link
        href={`/missions/${id}/summary`}
        className="block text-center bg-gray-800 text-white py-3 rounded mt-6"
      >
        تایید آپلود
      </Link>

      <SamplerBottomNav/>

    </div>
  )
}
