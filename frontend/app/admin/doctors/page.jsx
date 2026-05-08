import { getDoctors } from "@/lib/api";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">مدیریت پزشکان</h1>

      <a
        href="/admin/doctors/create"
        className="bg-emerald-600 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        افزودن پزشک جدید
      </a>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-gray-100 text-right text-gray-600">
          <tr>
            <th className="p-3">نام</th>
            <th className="p-3">دسته‌بندی</th>
            <th className="p-3">تجربه (سال)</th>
            <th className="p-3">آدرس</th>
            <th className="p-3">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {doctors?.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="p-3">{doc.name}</td>
              <td className="p-3">{doc.Categories}</td>
              <td className="p-3">{doc.Experience}</td>
              <td className="p-3">{doc.Address}</td>
              <td className="p-3 space-x-3 space-x-reverse">
                <a
                  href={`/admin/doctors/${doc.id}/edit`}
                  className="text-emerald-600"
                >
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
