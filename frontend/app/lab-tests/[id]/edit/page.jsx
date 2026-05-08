import { redirect } from "next/navigation";

export default function LabTestEditRedirect({ params }) {
  redirect(`/admin/lab-tests/${params.id}/edit`);
}
