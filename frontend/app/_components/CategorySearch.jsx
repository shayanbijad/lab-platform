"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Droplet,
  FlaskConical,
  Activity,
  HeartPulse,
  ShieldPlus,
  Baby,
  Microscope,
  TestTube
} from "lucide-react";

const tests = [
  { name: "آزمایش خون", icon: Droplet },
  { name: "آزمایش ادرار", icon: FlaskConical },
  { name: "آزمایش قند خون", icon: Activity },
  { name: "آزمایش کلسترول", icon: HeartPulse },
  { name: "آزمایش تیروئید", icon: Microscope },
  { name: "آزمایش ویتامین D", icon: ShieldPlus },
  { name: "آزمایش بارداری", icon: Baby },
  { name: "آزمایش کرونا", icon: TestTube },
];

const CategorySearch = () => {
  return (
    <div
      className="mt-11 mb-11 flex flex-col items-center gap-2 px-5 text-center"
      dir="rtl"
    >
      <h2 className="font-bold text-3xl md:text-4xl tracking-wide">
        جستجو برای{" "}
        <span className="text-primary">پزشک، کلینیک، آزمایش یا بیماری</span>
      </h2>

      <h2 className="text-gray-400 text-sm md:text-lg">
        پزشک مورد نظر خود را پیدا کنید و تنها با یک کلیک نوبت بگیرید
      </h2>

      {/* Search Box */}
      <div className="flex w-full max-w-sm mt-3 items-center gap-2">
        <Input type="text" placeholder="جستجو..." />
        <Button type="submit">
          <Search className="h-4 w-4 ml-2" />
          جستجو
        </Button>
      </div>

      {/* Popular Tests */}
      <div className="grid grid-cols-3 mt-6 md:grid-cols-4 lg:grid-cols-8">
        {tests.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 bg-emerald-50 p-4 m-2 rounded-lg hover:scale-110 transition-all"
            >
              <div className="bg-white p-3 rounded-full shadow-sm">
                <Icon className="text-emerald-600 w-6 h-6" />
              </div>

              <span className="text-emerald-600 text-sm">{item.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySearch;
