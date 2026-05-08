"use client";

import { logout } from "@/lib/authService";

export default function AdminHeader() {
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-white border-b py-4 px-6 flex justify-between items-center">
      <h1 className="text-lg font-semibold">پنل مدیریت آزمایشگاه</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        خروج
      </button>
    </header>
  );
}
