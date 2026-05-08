export default function OrderCard({ order }) {
  return (
    <div className="border rounded-xl p-4 shadow-sm bg-white">
      <h2 className="font-semibold">{order.testName}</h2>

      <p className="text-gray-500 text-sm mt-1">
        {order.status} | {order.time}
      </p>

      <p className="text-emerald-500 text-sm mt-1 cursor-pointer">
        {order.action}
      </p>
    </div>
  );
}
