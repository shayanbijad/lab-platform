"use client";

import { FileText, Home, ClipboardList } from "lucide-react";

const services = [
  {
    icon: FileText,
    title: "پرونده پزشکی",
    items: [
      "دسترسی به سوابق بیماری و دارویی",
      "دسترسی به مدارک آزمایشگاهی",
      "ثبت قد و وزن",
      "مشاهده نمودار علائم حیاتی",
    ],
  },
  {
    icon: Home,
    title: "ثبت سفارش آزمایش در خانه",
    items: [
      "نمونه‌گیری در منزل",
      "انتخاب زمان مراجعه",
      "مشاهده هزینه آزمایش",
      "ثبت آنلاین درخواست",
    ],
  },
  {
    icon: ClipboardList,
    title: "نتایج آزمایش آنلاین",
    items: [
      "مشاهده سریع نتایج",
      "دانلود گزارش PDF",
      "اشتراک‌گذاری با پزشک",
      "آرشیو نتایج قبلی",
    ],
  },
];

export default function ServicesSection() {
  return (
    <section className="px-4 mt-8" dir="rtl">
      <h2 className="text-xl font-bold text-right mb-6 text-gray-800">
        خدمات <span className="text-emerald-600">RamadaMed</span>
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service, i) => {
          const Icon = service.icon;

          return (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col items-center text-center gap-3">

                <div className="bg-emerald-100 p-4 rounded-full">
                  <Icon className="text-emerald-600 w-6 h-6" />
                </div>

                <h3 className="font-semibold text-gray-800">
                  {service.title}
                </h3>

                <ul className="text-sm text-gray-500 space-y-1 mt-2">
                  {service.items.map((item, idx) => (
                    <li key={idx}>{idx + 1}. {item}</li>
                  ))}
                </ul>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
