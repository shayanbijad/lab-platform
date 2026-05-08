"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Menu as MenuIcon, X as CloseIcon, UserCircle } from "lucide-react";
import { logout } from "@/lib/authService";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Menu = [
  { id: 1, name: "خانه", path: "/" },
  { id: 2, name: "پزشکان", path: "/doctors" },
  
  
  { id: 5, name: "آزمایش‌ها", path: "/lab-tests" },
  { id: 6, name: "مقالات", path: "/blogs" },
  
  
];

const Header = () => {
  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const checkUser = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData || userData === "undefined") {
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  checkUser();

  window.addEventListener("authChanged", checkUser);
  window.addEventListener("storage", checkUser);

  return () => {
    window.removeEventListener("authChanged", checkUser);
    window.removeEventListener("storage", checkUser);
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-4 shadow-sm bg-white sticky top-0 z-50">
      
      {/* LEFT: Profile / Login Section */}
      <div className="flex items-center gap-3">
        {user ? (
          <Popover>
            <PopoverTrigger>
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="profile-image"
                  width={40}
                  height={40}
                  className="rounded-full cursor-pointer border hover:opacity-80 transition-opacity"
                />
              ) : (
                <UserCircle
                  size={40}
                  className="cursor-pointer border rounded-full hover:opacity-80 transition-opacity p-1"
                />
              )}
            </PopoverTrigger>
            <PopoverContent className="w-44 mt-2">
              <ul className="flex flex-col gap-2 text-right">
                <Link href="/profile">
  <li className="cursor-pointer hover:bg-slate-100 p-2 rounded-md text-sm font-medium">
    پروفایل
  </li>
</Link>
                <li  onClick={() => {
    logout();
    window.location.href = "/";
  }}
  className="cursor-pointer hover:bg-slate-100 p-2 rounded-md text-sm font-medium text-red-500"
>
  خروج
</li>
              </ul>
            </PopoverContent>
          </Popover>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="outline" className="text-sm">
                ورود / ثبت‌نام
              </Button>
            </Link>
          </div>

        )}
      </div>

      {/* DESKTOP MENU (Hidden on Mobile) */}
      <ul className="md:flex gap-6 hidden text-[15px] font-medium text-gray-600">
        {Menu.map((item) => (
          <Link href={item.path} key={item.id}>
            <li className="hover:text-primary cursor-pointer hover:scale-105 transition-all ease-in-out">
              {item.name}
            </li>
          </Link>
        ))}
      </ul>

      {/* RIGHT: Logo + Typography + Hamburger Button */}
      <div className="flex items-center gap-4">
        {/* Logo & Text */}
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-gray-500 font-bold hidden sm:block">
              BornaLab
            </span>
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
          </div>
        </Link>

        {/* Hamburger - Mobile only */}
        <button
          className="md:hidden p-1 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <CloseIcon className="w-7 h-7 text-gray-700" />
          ) : (
            <MenuIcon className="w-7 h-7 text-gray-700" />
          )}
        </button>
      </div>

      {/* MOBILE OVERLAY MENU (Slide Down) */}
      {menuOpen && (
        <div className="fixed top-[72px] right-0 w-full bg-white border-b shadow-xl p-6 md:hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <ul className="flex flex-col gap-5 text-right font-medium">
            {Menu.map((item) => (
              <Link href={item.path} key={item.id} onClick={() => setMenuOpen(false)}>
                <li className="text-gray-700 text-lg hover:text-primary transition-colors border-b border-gray-50 pb-2">
                  {item.name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
