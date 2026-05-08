async function getSamplers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?role=SAMPLER`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function SamplersPage() {
  const samplers = await getSamplers();

  return (
    <div dir="rtl">
      <h1 className="text-2xl mb-6">مدیریت نمونه‌گیرها</h1>

      <a
        href="/samplers/create"
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        افزودن نمونه‌گیر
      </a>

      <table className="w-full mt-6 bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr className="text-right">
            <th className="p-3">نام</th>
            <th className="p-3">ایمیل</th>
            <th className="p-3">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {samplers.map((s) => (
            <tr key={s.id} className="border-t text-right">
              <td className="p-3">{s.name}</td>
              <td className="p-3">{s.email}</td>

              <td className="p-3 space-x-3 space-x-reverse">
                <a href={`/samplers/${s.id}/edit`} className="text-emerald-600">
                  ویرایش
                </a>

                <button className="text-red-600">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
