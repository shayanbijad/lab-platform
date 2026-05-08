"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Hero from "./_components/Hero";
import CategorySearch from "./_components/CategorySearch";
import DoctorList from "./_components/DoctorList";
import ServicesSection from "./_components/ServiceSection";
import ConsultingCTA from "./_components/ConsultingCTA";
import BottomNav from "@/app/_components/BottomNav";
import BlogSection from "./_components/BlogSection";

export default function Home() {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    async function loadPatient() {
      try {
        const resp = await fetch("http://localhost:4000/patients/me");
        const data = await resp.json();
        setPatient(data);
      } catch (err) {
        console.log(err);
      }
    }

    loadPatient();
  }, []);

  return (
    <main className="relative pb-20 bg-gray-50">
      <Hero />

      <ServicesSection />

      <section className="mt-6 space-y-5 px-4" dir="rtl">
        <div>
          <p className="text-xs font-semibold text-emerald-600">رزرو آنلاین آزمایش</p>
          <h2 className="text-lg font-semibold text-gray-900">
            {patient?.name ? `${patient.name}، برای ثبت آزمایش آماده اید؟` : "آزمایش خود را در چند دقیقه رزرو کنید"}
          </h2>
        </div>

        <div className="rounded-xl bg-emerald-600 p-4 text-white shadow-md">
          <h3 className="text-base font-semibold">رزرو آزمایش</h3>
          <p className="mb-3 text-xs text-emerald-100">ثبت آنلاین، انتخاب زمان مراجعه و نمونه گیری در منزل</p>

          <Link href="/test-wizard">
            <Button className="w-full bg-white text-emerald-800 hover:bg-emerald-50">سفارش آزمایش</Button>
          </Link>
        </div>
      </section>

      <ConsultingCTA />

      <CategorySearch />

      <div className="mt-6">
        <DoctorList />
      </div>

      <BlogSection />

      <BottomNav />
    </main>
  );
}
