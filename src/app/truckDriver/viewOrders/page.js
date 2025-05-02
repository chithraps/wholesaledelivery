'use client';

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import TdNavbar from "@/components/TdNavbar";

export default function TruckDriverOrdersPage() {
  const [orders, setOrders] = useState([]);
  const truckDriver = useSelector((state) => state.truckDriver.truckDriver);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!truckDriver?._id) return;

      try {
        const res = await axios.get("/api/truckDriver/viewOrders", {
          params: { truckDriverId: truckDriver._id },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [truckDriver]);

  return (
    <div className="ml-[250px] p-6 min-h-screen bg-gray-100">
      <TdNavbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
          Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">No orders assigned.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Vendor: {order.vendor?.name}
                  </h2>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="text-gray-600">
                  <p>
                    <strong>Total Amount:</strong> ₹{order.totalAmount}
                  </p>
                  <p>
                    <strong>Collected Amount:</strong> ₹{order.collectedAmount}
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-medium text-gray-700 mb-1">Products:</p>
                  <ul className="list-disc list-inside text-gray-600">
                    {order.products.map((item, index) => (
                      <li key={index}>
                        {item.product?.name} - {item.quantity} pcs @ ₹
                        {item.product?.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
