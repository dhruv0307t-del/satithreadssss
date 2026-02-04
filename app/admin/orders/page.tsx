"use client";

import { useEffect, useState } from "react";
import OrderReceiptModal from "./OrderReceiptModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="admin-main text-black relative">
      <h1 className="admin-title mb-8">Orders</h1>

      <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#3d2415] to-[#2d1810]">
            <tr>
              <th className="p-4 text-left text-white font-semibold">Order ID</th>
              <th className="text-left text-white font-semibold">User</th>
              <th className="text-left text-white font-semibold">Status</th>
              <th className="text-left text-white font-semibold">Payment</th>
              <th className="text-left text-white font-semibold">Total</th>
              <th className="text-left text-white font-semibold">Date</th>
              <th className="text-left text-white font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b border-[#E5DDD3] hover:bg-[#FFF7EC] transition-colors">
                <td className="p-4 font-mono text-sm">#{o._id.slice(-6)}</td>
                <td className="font-medium">{o.user?.name || "Guest"}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${o.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : o.orderStatus === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {o.orderStatus}
                  </span>
                </td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${o.paymentStatus === "Paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {o.paymentStatus}
                  </span>
                </td>
                <td className="font-bold text-[#D4A574]">₹{o.totalAmount}</td>
                <td className="text-sm text-gray-600">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </td>
                <td>
                  <button
                    onClick={() => setSelectedOrder(o)}
                    className="bg-[#3d2415] text-white px-4 py-2 rounded-lg hover:bg-[#2d1810] transition-all font-semibold text-sm"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderReceiptModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}