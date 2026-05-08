import BottomNav from "@/app/_components/BottomNav";

export default function PatientLayout({ children }) {
  return (
    <div dir="rtl" className="min-h-screen pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
