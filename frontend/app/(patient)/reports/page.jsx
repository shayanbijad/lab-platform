import { getResults } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            نتایج آزمایش‌ها
          </h1>
          <p className="text-gray-500 mt-2">
            مشاهده نتایج آزمایش‌های ثبت شده
          </p>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {Array.isArray(results) && results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">
                      نتیجه آزمایش #{result.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      شناسه سفارش: {result.orderTestId}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      result.reviewed
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {result.reviewed ? "بررسی شده" : "در انتظار بررسی"}
                  </span>
                </div>

                <div className="text-lg font-medium text-emerald-600">
                  مقدار نتیجه: {result.value}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border">
              <p className="text-gray-500">
                نتیجه‌ای برای نمایش وجود ندارد.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
