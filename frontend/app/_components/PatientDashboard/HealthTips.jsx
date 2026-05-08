"use client";

// ─── Medically‑based health check reminders ───────────────────────────────
// Only shown when the patient has at least one completed order with results.
// Each tip is tied to a real lab test code and suggests a re‑test interval.

const TEST_INTERVALS = [
  {
    codes: ["CBC", "FBC", "CBC_DIFF"],
    label: "آزمایش شمارش کامل خون (CBC)",
    intervalMonths: 6,
    reason: "برای پایش سطح گلبول‌های قرمز، سفید و پلاکت‌ها و تشخیص کم‌خونی یا عفونت",
  },
  {
    codes: ["FBS", "BS", "BLOOD_SUGAR"],
    label: "آزمایش قند خون ناشتا (FBS)",
    intervalMonths: 3,
    reason: "برای غربالگری دیابت و پیش‌دیابت",
  },
  {
    codes: ["LIPID", "CHOLESTEROL", "LDL", "HDL", "TG"],
    label: "پروفایل چربی خون (Lipid Profile)",
    intervalMonths: 6,
    reason: "برای بررسی کلسترول، LDL، HDL و تری‌گلیسیرید و ارزیابی سلامت قلب",
  },
  {
    codes: ["VIT_D", "25OHD"],
    label: "ویتامین D",
    intervalMonths: 6,
    reason: "برای پیشگیری از پوکی استخوان و تقویت سیستم ایمنی",
  },
  {
    codes: ["VIT_B12", "B12"],
    label: "ویتامین B12",
    intervalMonths: 12,
    reason: "برای سلامت اعصاب و پیشگیری از خستگی مزمن",
  },
  {
    codes: ["TSH", "T3", "T4", "THYROID"],
    label: "عملکرد تیروئید (TSH)",
    intervalMonths: 6,
    reason: "برای پایش کم‌کاری یا پرکاری تیروئید",
  },
  {
    codes: ["IRON", "FER", "FERRITIN"],
    label: "ذخیره آهن (فریتین)",
    intervalMonths: 6,
    reason: "برای تشخیص کم‌خونی فقر آهن",
  },
  {
    codes: ["LFT", "ALT", "AST", "ALP", "LIVER"],
    label: "آزمایش عملکرد کبد",
    intervalMonths: 6,
    reason: "برای ارزیابی سلامت کبد و تشخیص آسیب کبدی",
  },
  {
    codes: ["RFT", "CREATININE", "BUN", "KIDNEY"],
    label: "آزمایش عملکرد کلیه",
    intervalMonths: 6,
    reason: "برای پایش سلامت کلیه‌ها",
  },
  {
    codes: ["URIC_ACID", "UA"],
    label: "اسید اوریک",
    intervalMonths: 6,
    reason: "برای تشخیص و پایش نقرس",
  },
  {
    codes: ["HB_A1C", "A1C"],
    label: "هموگلوبین A1C",
    intervalMonths: 3,
    reason: "برای پایش میانگین قند خون ۳ ماهه در دیابت",
  },
  {
    codes: ["PSA"],
    label: "PSA (آنتی‌ژن اختصاصی پروستات)",
    intervalMonths: 12,
    reason: "برای غربالگری سرطان پروستات در آقایان بالای ۵۰ سال",
  },
  {
    codes: ["CA125"],
    label: "CA-125",
    intervalMonths: 12,
    reason: "برای غربالگری تومورهای تخمدان",
  },
  {
    codes: ["MAGNESIUM", "MG"],
    label: "منیزیم",
    intervalMonths: 6,
    reason: "برای سلامت عضلات و اعصاب و تنظیم ضربان قلب",
  },
  {
    codes: ["CALCIUM", "CA"],
    label: "کلسیم",
    intervalMonths: 6,
    reason: "برای سلامت استخوان‌ها و عملکرد اعصاب",
  },
];

function getMonthsAgo(dateString) {
  const then = new Date(dateString);
  const now = new Date();
  return (now - then) / (1000 * 60 * 60 * 24 * 30.44);
}

export default function HealthTips({ orders }) {
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Collect all completed test names from orders that have results
  const completedTests = safeOrders
    .filter((o) => o.status === "COMPLETED" || o.orderTests?.some((ot) => ot.result))
    .flatMap((o) => o.orderTests || [])
    .filter((ot) => ot.labTest && ot.result);

  // If no completed tests, show nothing
  if (completedTests.length === 0) {
    return null;
  }

  // Find the most recent result date for each test name
  const testLastDates = {};
  completedTests.forEach((ot) => {
    const name = ot.labTest.name;
    const date = ot.result?.createdAt || ot.order?.createdAt;
    if (name && date) {
      if (!testLastDates[name] || new Date(date) > new Date(testLastDates[name])) {
        testLastDates[name] = date;
      }
    }
  });

  // Check which intervals are overdue
  const overdueTips = [];
  TEST_INTERVALS.forEach((interval) => {
    // Check if any of the patient's completed tests match this interval's codes
    const matchedTestName = Object.keys(testLastDates).find((name) =>
      interval.codes.some((code) => name.toUpperCase().includes(code))
    );

    if (matchedTestName) {
      const monthsSince = getMonthsAgo(testLastDates[matchedTestName]);
      if (monthsSince >= interval.intervalMonths) {
        overdueTips.push({
          ...interval,
          lastDate: testLastDates[matchedTestName],
          monthsSince: Math.round(monthsSince),
        });
      }
    }
  });

  // Also add a general "great job" message if nothing is overdue
  const hasOverdue = overdueTips.length > 0;

  return (
    <div dir="rtl" className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🩺</span>
        <h3 className="text-xl font-bold text-gray-800">نکات سلامت</h3>
      </div>

      {hasOverdue ? (
        <div className="space-y-4">
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            ⏰ برخی آزمایش‌های دوره‌ای شما نیاز به تکرار دارند:
          </p>
          {overdueTips.slice(0, 4).map((tip, i) => (
            <div
              key={i}
              className="border-r-4 border-amber-400 bg-amber-50/50 rounded-lg p-4"
            >
              <p className="font-semibold text-gray-800">{tip.label}</p>
              <p className="text-xs text-gray-500 mt-1">
                آخرین بار {tip.monthsSince} ماه پیش — توصیه می‌شود هر {tip.intervalMonths} ماه یکبار تکرار شود
              </p>
              <p className="text-xs text-gray-600 mt-1">{tip.reason}</p>
              <a
                href="/test-wizard"
                className="inline-block mt-2 text-sm text-emerald-600 font-semibold hover:underline"
              >
                ثبت آزمایش جدید →
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="font-semibold text-emerald-800">✅ وضعیت سلامت شما عالی است!</p>
          <p className="text-sm text-emerald-700 mt-1">
            تمام آزمایش‌های دوره‌ای شما به‌روز هستند. همین روند را ادامه دهید.
          </p>
        </div>
      )}

      {/* General health tips (always shown) */}
      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold text-gray-500">توصیه‌های عمومی سلامت:</p>
        <ul className="text-xs text-gray-600 space-y-1.5 pr-4 list-disc">
          <li>روزانه حداقل ۳۰ دقیقه پیاده‌روی داشته باشید</li>
          <li>مصرف نمک و چربی‌های اشباع را کاهش دهید</li>
          <li>روزانه ۶-۸ لیوان آب بنوشید</li>
          <li>خواب کافی (۷-۸ ساعت) را فراموش نکنید</li>
        </ul>
      </div>
    </div>
  );
}
