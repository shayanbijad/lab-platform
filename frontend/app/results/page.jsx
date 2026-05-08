import { getResults } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Lab Results</h1>
      <p className="text-sm text-slate-600 mb-6">Connected to /results from backend</p>
      <ul className="space-y-2">
        {Array.isArray(results) && results.length > 0 ? (
          results.map((result) => (
            <li key={result.id} className="rounded border p-4">
              <div className="font-semibold">Result ID: {result.id}</div>
              <div className="text-xs text-slate-500">OrderTest ID: {result.orderTestId}</div>
              <div className="text-sm">Value: {result.value}</div>
              <div className="text-sm">Reviewed: {String(result.reviewed)}</div>
            </li>
          ))
        ) : (
          <li className="text-slate-500">No results found.</li>
        )}
      </ul>
    </main>
  );
}
