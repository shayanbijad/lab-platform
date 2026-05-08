import { getPatients } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Patients</h1>
      <p className="text-sm text-slate-600 mb-6">Connected to /patients from backend</p>
      <ul className="space-y-2">
        {Array.isArray(patients) && patients.length > 0 ? (
          patients.map((patient) => (
            <li key={patient.id} className="rounded border p-4">
              <div className="font-semibold">{patient.firstName} {patient.lastName}</div>
              <div className="text-xs text-slate-500">ID: {patient.id}</div>
              <div className="text-sm">National ID: {patient.nationalId}</div>
              <div className="text-sm">Gender: {patient.gender}</div>
            </li>
          ))
        ) : (
          <li className="text-slate-500">No patients found.</li>
        )}
      </ul>
    </main>
  );
}
