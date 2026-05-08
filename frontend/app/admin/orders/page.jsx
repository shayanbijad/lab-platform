async function getOrders() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
    { cache: "no-store" }
  );
  return res.json();
}

import { formatOrderId } from "@/lib/orderDisplay";

export default async function OrdersPage() {
  const orders = await getOrders();
  const list = Array.isArray(orders) ? orders : [];

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold mb-6">مدیریت سفارش‌ها</h1>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr className="text-right">
            <th className="p-3">کد سفارش</th>
            <th className="p-3">کاربر</th>
            <th className="p-3">وضعیت</th>
            <th className="p-3">قیمت</th>
            <th className="p-3">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {list.map((order) => (
            <tr key={order.id} className="border-t text-right">
              <td className="p-3">
                <div className="font-semibold">{formatOrderId(order.id)}</div>
                <div className="text-xs text-gray-400">{order.id}</div>
              </td>
              <td className="p-3">
                {order.patient
                  ? `${order.patient.firstName} ${order.patient.lastName}`
                  : "نامشخص"}
              </td>
              <td className="p-3">{order.status}</td>
              <td className="p-3">
                {Array.isArray(order.orderTests)
                  ? order.orderTests.reduce((sum, ot) => {
                      const price = ot?.labTest?.price;
                      return sum + (typeof price === "number" ? price : 0);
                    }, 0)
                  : 0}
              </td>

              <td className="p-3">
                <a
                  href={`/admin/orders/${order.id}`}
                  className="text-emerald-600"
                >
                  ویرایش
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
