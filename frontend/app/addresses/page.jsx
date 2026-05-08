import { getAddresses } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const addresses = await getAddresses();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Addresses</h1>
      <p className="text-sm text-slate-600 mb-6">Connected to /addresses from backend</p>
      <ul className="space-y-2">
        {Array.isArray(addresses) && addresses.length > 0 ? (
          addresses.map((address) => (
            <li key={address.id} className="rounded border p-4">
              <div className="font-semibold">{address.label ?? "Unlabeled address"}</div>
              <div className="text-xs text-slate-500">ID: {address.id}</div>
              <div className="text-sm">City: {address.city}</div>
              <div className="text-sm">Street: {address.street}</div>
              <div className="text-sm">Patient ID: {address.patientId}</div>
            </li>
          ))
        ) : (
          <li className="text-slate-500">No addresses found.</li>
        )}
      </ul>
    </main>
  );
}
