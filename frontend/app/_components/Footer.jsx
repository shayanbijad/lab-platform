import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-100" dir="rtl">
      <div className="mx-auto max-w-5xl justify-center text-center flex flex-col items-center px-4 py-16 sm:px-6 lg:px-8">

        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="لوگو"
          width={200}
          height={100}
        />

        {/* Description */}
        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500">
          طب نوین، راهی ساده و سریع برای رزرو نوبت، مشاهده خدمات پزشکی و دسترسی به بهترین پزشکان.
          سلامت شما اولویت ماست.
        </p>

        {/* Navigation Links */}
        <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">

          <li>
            <a className="text-gray-700 transition hover:text-gray-700/75" href="#">
              درباره ما
            </a>
          </li>

          <li>
            <a className="text-gray-700 transition hover:text-gray-700/75" href="#">
              فرصت‌های شغلی
            </a>
          </li>

          <li>
            <a className="text-gray-700 transition hover:text-gray-700/75" href="#">
              تاریخچه
            </a>
          </li>

          <li>
            <a className="text-gray-700 transition hover:text-gray-700/75" href="#">
              خدمات
            </a>
          </li>

          <li>
            <a className="text-gray-700 transition hover:text-gray-700/75" href="#">
              پروژه‌ها
            </a>
          </li>

          <li>
            <a className="text-gray-700 transition hover:text-gray-700/75" href="#">
              بلاگ
            </a>
          </li>
        </ul>

      </div>
    </footer>
  );
};

export default Footer;
