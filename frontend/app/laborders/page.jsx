"use client";
import OrderCard from "../_components/OrderCard";


import { useEffect, useState } from "react";
import { getOrders } from "@/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await getOrders();
      setOrders(data);
    }

    loadOrders();
  }, []);

  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-semibold mb-4">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
