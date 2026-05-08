import { getLabTests } from "@/lib/api";
import BottomNav from "@/app/_components/BottomNav";

export const dynamic = "force-dynamic";

function formatPrice(price) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

export default async function LabTestsPage() {
  const tests = await getLabTests();

  return (
    <main dir="rtl" className="p-6 pb-24 bg-gray-50 min-h-screen text-right">
      
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        آزمایش‌ها
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        لیست آزمایش‌های قابل انجام در آزمایشگاه
      </p>

      {Array.isArray(tests) && tests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg text-gray-800 mb-2">
                {test.name}
              </h2>

              <p className="text-sm text-gray-500 mb-1">
                کد آزمایش: {test.code}
              </p>

              <p className="text-sm text-gray-600 mb-2">
                دسته‌بندی: {test.category}
              </p>

              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-emerald-700">
                  {formatPrice(test.price)}
                </span>

                <button className="text-sm bg-emerald-600 text-white px-3 py-1 rounded-lg hover:bg-emerald-700">
                  جزئیات
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          هنوز آزمایشی ثبت نشده است.
        </div>
      )}

      <BottomNav />
    </main>
  );
}
