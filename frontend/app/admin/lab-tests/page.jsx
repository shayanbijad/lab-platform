async function getTests() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/lab-tests`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function LabTestsPage() {
  const tests = await getTests();

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">مدیریت آزمایش‌ها</h1>

      <a
        href="/admin/lab-tests/create"
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        افزودن آزمایش
      </a>

      <table className="w-full mt-6 bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr className="text-right">
            <th className="p-3">نام</th>
            <th className="p-3">قیمت</th>
            <th className="p-3">مدت پاسخ</th>
            <th className="p-3">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {tests.map((test) => (
            <tr key={test.id} className="border-t text-right">
              <td className="p-3">{test.name}</td>
              <td className="p-3">{test.price}</td>
              <td className="p-3">{test.turnaroundTime}</td>

              <td className="p-3 space-x-3 space-x-reverse">
                <a
                  href={`/admin/lab-tests/${test.id}/edit`}
                  className="text-emerald-600"
                >
                  ویرایش
                </a>

                <button className="text-red-600">
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
