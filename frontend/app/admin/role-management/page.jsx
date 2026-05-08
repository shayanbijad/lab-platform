"use client";

import { useEffect, useState } from "react";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      }
    );

    fetchUsers();
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">مدیریت نقش کاربران</h1>

      <div className="bg-white shadow rounded p-4">

        <table className="w-full text-right">
          <thead className="border-b">
            <tr>
              <th className="p-2">نام</th>
              <th className="p-2">ایمیل</th>
              <th className="p-2">نقش</th>
              <th className="p-2">تغییر نقش</th>
            </tr>
          </thead>

          <tbody>

            {users.map((user) => (
              <tr key={user.id} className="border-b">

                <td className="p-2">{user.name}</td>

                <td className="p-2">{user.email}</td>

                <td className="p-2">{user.role}</td>

                <td className="p-2">
                  <select
                    defaultValue={user.role}
                    onChange={(e) =>
                      updateRole(user.id, e.target.value)
                    }
                    className="border p-2 rounded"
                  >
                    <option value="PATIENT">بیمار</option>
                    <option value="SAMPLER">نمونه‌گیر</option>
                    <option value="LAB_ADMIN">ادمین آزمایشگاه</option>
                    <option value="SUPER_ADMIN">سوپر ادمین</option>
                  </select>
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>
  );
}
