async function getPatients() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?role=PATIENT`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div dir="rtl">
      <h1 className="text-2xl mb-6">مدیریت بیماران</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr className="text-right">
            <th className="p-3">نام</th>
            <th className="p-3">ایمیل</th>
            <th className="p-3">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id} className="border-t text-right">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.email}</td>

              <td className="p-3">
                <a href={`/patients/${p.id}/edit`} className="text-emerald-600">
                  ویرایش
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
