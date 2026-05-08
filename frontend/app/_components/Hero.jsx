import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div dir="rtl">
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">

            {/* Image Section */}
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-first lg:h-full">
              <Image
                alt="پزشکان"
                src="/doctors.jpg"
                width={800}
                height={800}
                className="absolute inset-0 h-full w-full object-cover rounded-3xl"
              />
            </div>

            {/* Text Section */}
            <div className="lg:py-24">
              <p className="mb-4 text-sm font-semibold text-emerald-600">
                معرفی آزمایشگاه RamadaMed
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl leading-relaxed">
                خدمات آزمایشگاهی دقیق،
                <span className="text-primary"> سریع </span>
                و قابل اعتماد برای شما و خانواده
              </h2>

              <p className="mt-4 text-gray-600 leading-8">
                RamadaMed با تمرکز بر نمونه گیری در منزل، پاسخ دهی سریع و دسترسی
                آنلاین به نتایج، تجربه ای ساده و مطمئن از خدمات آزمایشگاهی را برای
                شما فراهم می کند.
              </p>

              <Link href="/test-wizard">
                <Button className="mt-10 text-[15px] px-8 py-5">
                  رزرو آزمایش
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
