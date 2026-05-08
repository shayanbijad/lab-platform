async function getUsers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">مدیریت کاربران</h1>

      <a
        href="/users/create"
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        افزودن کاربر
      </a>

      <table className="w-full mt-6 bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr className="text-right">
            <th className="p-3">نام</th>
            <th className="p-3">ایمیل</th>
            <th className="p-3">نقش</th>
            <th className="p-3">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t text-right">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>

              <td className="p-3 space-x-3 space-x-reverse">
                <a href={`/users/${u.id}/edit`} className="text-emerald-600">
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
