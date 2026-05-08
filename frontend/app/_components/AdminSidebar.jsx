"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-l shadow-sm p-5 flex flex-col">
      <h2 className="text-xl font-bold mb-6 text-right">پنل مدیریت</h2>

      <nav className="space-y-3 text-right">
        <Link href="/admin" className="block hover:text-emerald-600">داشبورد</Link>
        
        <hr className="my-2" />
        
        <div className="text-sm text-gray-500 font-semibold mt-3">مدیریت کاربران</div>
        <Link href="/admin/users" className="block hover:text-emerald-600 pl-3">کاربران</Link>
        <Link href="/admin/doctor-users" className="block hover:text-emerald-600 pl-3">پزشکان (داشبورد)</Link>
        <Link href="/admin/doctors" className="block hover:text-emerald-600 pl-3">پزشکان (سایت)</Link>
        <Link href="/admin/patients" className="block hover:text-emerald-600 pl-3">بیماران</Link>
        <Link href="/admin/samplers" className="block hover:text-emerald-600 pl-3">نمونه‌گیران</Link>
        
        <hr className="my-2" />
        
        <div className="text-sm text-gray-500 font-semibold mt-3">مدیریت آزمایشات</div>
        <Link href="/admin/lab-tests" className="block hover:text-emerald-600 pl-3">آزمایش‌ها</Link>
        <Link href="/admin/results" className="block hover:text-emerald-600 pl-3">نتایج آزمایش</Link>
        
        <hr className="my-2" />
        
        <div className="text-sm text-gray-500 font-semibold mt-3">مدیریت سفارشات</div>
        <Link href="/admin/orders" className="block hover:text-emerald-600 pl-3">سفارش‌ها</Link>
        <Link href="/admin/trash/missions" className="block hover:text-emerald-600 pl-3">ماموریت‌ها</Link>
        
        <hr className="my-2" />
        
        <div className="text-sm text-gray-500 font-semibold mt-3">مدیریت محتوا</div>
        <Link href="/admin/blogs" className="block hover:text-emerald-600 pl-3">بلاگ</Link>

        <hr className="my-2" />

        <div className="text-sm text-gray-500 font-semibold mt-3">مدیریت سیستم</div>
        <Link href="/admin/labs" className="block hover:text-emerald-600 pl-3">آزمایشگاه‌ها</Link>
        <Link href="/admin/addresses" className="block hover:text-emerald-600 pl-3">آدرس‌ها</Link>
        <Link href="/admin/role-management" className="block hover:text-emerald-600 pl-3">مدیریت نقش‌ها</Link>

      </nav>
    </aside>
  );
}
