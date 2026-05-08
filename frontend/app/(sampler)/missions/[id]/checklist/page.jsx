'use client'

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import SamplerBottomNav from "@/app/_components/SamplerBottomNav"

export default function ChecklistPage(){

  const { id } = useParams()

  const [items,setItems] = useState({
    identity:false,
    fasting:false,
    medication:false,
    label:false,
    volume:false,
    time:false
  })

  function toggle(name){
    setItems({...items,[name]:!items[name]})
  }

  return (
    <div dir="rtl" className="p-4 pb-24">

      <Link href={`/missions/${id}`}>
        ← بازگشت
      </Link>

      <h2 className="text-lg font-bold mt-3 mb-4">
        چک لیست
      </h2>

      <div className="space-y-3">

        {Object.keys(items).map(key => (
          <label key={key} className="flex gap-2 border p-3 rounded">
            <input
              type="checkbox"
              checked={items[key]}
              onChange={()=>toggle(key)}
            />
            {key}
          </label>
        ))}

      </div>

      <div className="flex gap-3 mt-6">

        <button className="flex-1 bg-gray-300 py-3 rounded">
          ذخیره
        </button>

        <Link
          href={`/missions/${id}/upload`}
          className="flex-1 bg-gray-800 text-white py-3 rounded text-center"
        >
          تکمیل چک لیست
        </Link>

      </div>

      <SamplerBottomNav/>

    </div>
  )
}
