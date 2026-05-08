import CreateDoctorForm from "@/components/admin/CreateDoctorForm";

export default function CreateDoctorPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ایجاد پزشک جدید</h1>
      <CreateDoctorForm />
    </div>
  );
}
