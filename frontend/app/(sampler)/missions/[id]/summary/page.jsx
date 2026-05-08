'use client'

import { useParams } from "next/navigation"
import SamplerBottomNav from "@/app/_components/SamplerBottomNav"

export default function Summary(){

  const { id } = useParams()

  return (
    <div dir="rtl" className="p-4 pb-24">

      <h2 className="text-lg font-bold mb-4">
        خلاصه ماموریت
      </h2>

      <div className="border p-4 rounded space-y-2">

        <p>شناسه ماموریت: {id}</p>
        <p>هویت بیمار تایید شد</p>
        <p>نمونه جمع آوری شد</p>

        <p className="text-sm text-gray-600">
          نمونه خون، بیمار ناشتا، 3 ویال جمع آوری شد
        </p>

        <p className="font-semibold">
          بارکد: TRACK-123456
        </p>

      </div>

      <textarea
        placeholder="یادداشت..."
        className="w-full border rounded p-2 mt-4"
      />

      <div className="flex gap-3 mt-4">

        <button className="flex-1 bg-gray-300 py-3 rounded">
          ذخیره
        </button>

        <button className="flex-1 bg-green-600 text-white py-3 rounded">
          تحویل به آزمایشگاه
        </button>

      </div>

      <SamplerBottomNav/>

    </div>
  )
}
