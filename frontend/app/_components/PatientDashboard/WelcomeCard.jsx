"use client";

import { useEffect, useState } from "react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "صبح";
  if (hour >= 12 && hour < 17) return "بعد از ظهر";
  if (hour >= 17 && hour < 22) return "عصر";
  return "شب";
}

function getHealthQuote() {
  const quotes = [
    "سلامتی بزرگ‌ترین دارایی زندگی است",
    "پیشگیری همیشه بهتر از درمان است",
    "مراقبت از خود، عشق به خود است",
    "هر روز فرصتی تازه برای سلامتی است",
    "بدن سالم، خانه‌ای آرام برای روح است",
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default function WelcomeCard({ patient }) {
  const [name, setName] = useState("کاربر");
  const [greeting] = useState(getGreeting());
  const [quote] = useState(getHealthQuote());

  useEffect(() => {
    if (patient) {
      const fullName =
        patient.firstName && patient.lastName
          ? `${patient.firstName} ${patient.lastName}`
          : patient.firstName || "کاربر";

      setName(fullName);
      return;
    }

    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;

      const user = JSON.parse(stored);
      if (user?.name) setName(user.name);
    } catch (err) {
      console.error("Invalid user in localStorage");
    }
  }, [patient]);

  return (
    <div
      dir="rtl"
      className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 md:p-8 text-white shadow-lg"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-emerald-100 text-sm font-medium">
            {greeting} بخیر
          </p>
          <h2 className="text-2xl md:text-3xl font-bold">
            سلام {name} 👋
          </h2>
          <p className="text-emerald-100 text-sm max-w-md">
            &ldquo;{quote}&rdquo;
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <a
            href="/test-wizard"
            className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-50 transition shadow-sm text-sm"
          >
            ثبت آزمایش جدید
          </a>

          <a
            href="/patient/orders"
            className="bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition text-sm"
          >
            سفارش‌های من
          </a>
        </div>
      </div>
    </div>
  );
}
