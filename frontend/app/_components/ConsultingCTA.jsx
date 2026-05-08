import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConsultingCTA() {
  return (
    <section className="mt-8 px-4" dir="rtl">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-l from-emerald-600 via-emerald-500 to-teal-500 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm text-emerald-50">مشاوره رایگان</p>
            <h2 className="text-2xl font-bold leading-relaxed md:text-3xl">
              قبل از ثبت آزمایش، از تیم RamadaMed مشاوره رایگان بگیرید
            </h2>
            <p className="text-sm leading-7 text-emerald-50 md:text-base">
              اگر برای انتخاب آزمایش، زمان نمونه گیری یا تفسیر اولیه نتایج سوال دارید،
              کارشناسان ما آماده هستند تا شما را راهنمایی کنند.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:min-w-[220px]">
            <Link href="/doctors">
              <Button className="w-full bg-white text-emerald-700 hover:bg-emerald-50">
                درخواست مشاوره رایگان
              </Button>
            </Link>
            <p className="text-center text-xs text-emerald-50">
              پاسخگویی سریع و راهنمایی برای انتخاب بهترین خدمت
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
