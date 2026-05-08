import EditDoctorForm from "@/components/admin/EditDoctorForm";
import { getDoctorById } from "@/lib/api";

export default async function EditDoctorPage({ params }) {
  const doctor = await getDoctorById(params.id);

  if (!doctor) return <div>پزشک یافت نشد</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ویرایش پزشک: {doctor.name}</h1>
      <EditDoctorForm doctor={doctor} />
    </div>
  );
}
