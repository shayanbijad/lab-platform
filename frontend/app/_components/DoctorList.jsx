    // frontend/app/components/DoctorList.jsx (or wherever this file is located)
    "use client"; // Ensure this directive is present if it's a client component
    import Image from "next/image";
    import Link from "next/link";
    // Import the specific function from your api utility
    import { getDoctors } from "@/lib/api"; // Adjust path if necessary
    import { useEffect, useState } from "react";

    const DoctorList = ({
      heading = "پزشکان محبوب",
    }) => {
      const [doctorsList, setDoctorsList] = useState([]);
      const [loading, setLoading] = useState(true); // Added loading state
      const [error, setError] = useState(null); // Added error state

      useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const data = await getDoctors(); // Use the imported function
            setDoctorsList(data);
          } catch (err) {
            console.error("خطا در دریافت لیست پزشکان:", err);
            setError("خطا در بارگذاری پزشکان. لطفاً بعداً دوباره امتحان کنید."); // User-friendly error message
          } finally {
            setLoading(false); // Set loading to false after fetching
          }
        };

        fetchDoctors();
      }, []);

      return (
        <div className="mb-10 px-8" dir="rtl">
          <h2 className="font-bold text-xl text-right mb-4">
            {heading}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {loading ? (
              // Show skeleton loaders while loading
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[220px] bg-slate-200 w-full rounded-lg animate-pulse"
                ></div>
              ))
            ) : error ? (
              // Display error message if fetching failed
              <div className="col-span-full text-center text-red-500">{error}</div>
            ) : doctorsList.length > 0 ? (
              doctorsList.map((doctor) => (
                <Link
                  href={"/details/" + doctor.id}
                  key={doctor.id}
                  className="border rounded-lg p-3 cursor-pointer hover:border-primary hover:shadow-sm transition-all"
                >
                  {/* Doctor Image from Backend */}
                  <Image
                    src={doctor.image} // This path is relative to localhost:3000 by default
                    alt={doctor.name}
                    width={500}
                    height={200}
                    className="h-[200px] w-full object-cover rounded"
                    // next/image automatically handles optimization and serving static assets
                    // The key is that the `doctor.image` path MUST be resolvable by the frontend server
                    // which it is, because you confirmed http://localhost:3000/images/doctors/01.jpg works.
                  />

                  <div className="mt-3 flex flex-col gap-1 text-right">
                    <span className="text-[10px] bg-emerald-100 p-1 rounded-full px-2 text-primary w-fit">
                      {doctor.Categories}
                    </span>

                    <h3 className="font-bold">{doctor.name}</h3>

                    <span className="text-primary text-sm">
                      {doctor.Experience} سال تجربه
                    </span>

                    <span className="text-gray-500 text-sm">
                      {doctor.Address}
                    </span>

                    <div className="w-full mt-2">
                      <span className="block p-2 px-3 border text-primary rounded-full text-center text-[11px] cursor-pointer hover:bg-primary hover:text-white transition">
                        رزرو نوبت
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Message if no doctors are found
              <div className="col-span-full text-center text-gray-500">
                هیچ پزشکی یافت نشد.
              </div>
            )}
          </div>
        </div>
      );
    };

    export default DoctorList;
