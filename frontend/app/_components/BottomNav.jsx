"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, FileText, FlaskConical, User } from "lucide-react";

const navItems = [
  { href: "/patient/dashboard", icon: Home, label: "داشبورد" },
  { href: "/lab-tests", icon: FlaskConical, label: "آزمایش‌ها" },
  { href: "/orders", icon: ClipboardList, label: "سفارش‌ها" },
  { href: "/reports", icon: FileText, label: "گزارش‌ها" },
  { href: "/profile", icon: User, label: "پروفایل" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white flex justify-around py-2">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className="flex flex-col items-center">
          <Icon
            size={20}
            className={pathname === href ? "text-emerald-600" : "text-gray-500"}
          />
          <span className="text-xs">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
