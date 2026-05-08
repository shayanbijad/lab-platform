'use client'

import Link from "next/link"
import { Home, ClipboardList, History, LayoutDashboard, User } from "lucide-react"

export default function SamplerBottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 text-xs" dir="rtl">

      <Link href="/" className="flex flex-col items-center">
        <Home size={20}/>
        خانه
      </Link>

      <Link href="/missions" className="flex flex-col items-center">
        <ClipboardList size={20}/>
        ماموریت‌ها
      </Link>

      <Link href="/history" className="flex flex-col items-center">
        <History size={20}/>
        تاریخچه
      </Link>

      <Link href="/dashboard" className="flex flex-col items-center">
        <LayoutDashboard size={20}/>
        داشبورد
      </Link>

      <Link href="/profile" className="flex flex-col items-center">
        <User size={20}/>
        پروفایل
      </Link>

    </div>
  )
}
