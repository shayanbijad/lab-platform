import { getDoctors } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main
      dir="rtl"
      className="p-6 pb-24 bg-gray-50 min-h-screen text-right"
    >
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        لیست پزشکان
      </h1>
      <p className="text-sm text-gray-500 mb-6">
            از اینجا به پزشکان مورد نظر خود دسترسی داشته باشید
        .
      </p>

      <ul className="space-y-3">
        {Array.isArray(doctors) && doctors.length > 0 ? (
          doctors.map((doc) => (
            <li
              key={doc.id}
              className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex flex-col items-start space-y-1">
                <h2 className="font-semibold text-lg text-gray-800">
                  {doc.name ||
                    `${doc.firstName ?? ""} ${doc.lastName ?? ""}` ||
                    "بدون نام"}
                </h2>

                <p className="text-sm text-gray-500">شماره شناسایی: {doc.id}</p>

                <p className="text-sm text-gray-600">
                  تخصص:{" "}
                  <span className="font-medium text-emerald-700">
                    {doc.specialty ?? "نامشخص"}
                  </span>
                </p>

                <p className="text-sm text-gray-600">
                  ایمیل: {doc.email ?? "فاقد ایمیل"}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm bg-white p-4 rounded-xl text-center">
            هیچ پزشکی یافت نشد.
          </li>
        )}
      </ul>

      {/* 🩺 Bottom Nav Included here only */}
      <div
        dir="rtl"
        className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-md text-gray-700 text-sm"
      >
        <a href="/" className="hover:text-emerald-600 transition">خانه</a>
        <a href="/tests" className="hover:text-emerald-600 transition">آزمایش‌ها</a>
        <a href="/orders" className="hover:text-emerald-600 transition">سفارش‌ها</a>
        <a href="/reports" className="hover:text-emerald-600 transition">گزارش‌ها</a>
        <a href="/profile" className="hover:text-emerald-600 transition">پروفایل</a>
      </div>
    </main>
  );
}
