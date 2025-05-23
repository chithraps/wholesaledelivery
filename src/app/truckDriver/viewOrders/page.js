"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import TdNavbar from "@/components/TdNavbar";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react"; 

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
  pending: <Clock className="h-4 w-4 mr-1" />,
  shipped: <Truck className="h-4 w-4 mr-1" />,
  delivered: <CheckCircle className="h-4 w-4 mr-1" />,
  cancelled: <XCircle className="h-4 w-4 mr-1" />,
};

export default function TruckDriverOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const truckDriver = useSelector((state) => state.truckDriver.truckDriver);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!truckDriver?._id) return;

      try {
        const res = await axios.get("/api/truckDriver/viewOrders", {
          params: {
            truckDriverId: truckDriver._id,
            page: currentPage,
            limit: 2,
          },
        });

        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [truckDriver, currentPage]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <TdNavbar />
      <main className="ml-[250px] max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">No orders assigned.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Vendor:{" "}
                        <span className="text-blue-700">{order.vendor?.name}</span>
                      </h2>
                      <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    </div>

                    <div
                      className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full ${statusStyles[order.status]}`}
                    >
                      {statusIcons[order.status]} {order.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-500 text-sm">Total Amount</p>
                      <p className="text-lg font-bold text-gray-800">₹{order.totalAmount}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-gray-700 mb-2">Products</h3>
                    <ul className="space-y-1 pl-4 list-disc text-gray-700">
                      {order.products.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-semibold">{item.product?.name}</span> —{" "}
                          {item.quantity} pcs @ ₹{item.product?.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
