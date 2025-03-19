"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "@/components/AdminNavbar";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
   const router = useRouter();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/admin/order");
        if (response.status === 200) {
            console.log(response.data)
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminNavbar />
      <ToastContainer />
      <div className="flex-1 p-6 ml-[250px]">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Orders List</h2>
         
          <button
            onClick={() => router.push("/admin/createOrder")} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Order
          </button>
        </div>

       
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found</p>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Truck Driver</th>
                <th className="border p-2">Vendor</th>
                <th className="border p-2">Products</th>
                <th className="border p-2">Total Amount</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2">
                    {order.truckDriver?.name || "N/A"}
                  </td>
                  <td className="border p-2">{order.vendor?.name || "N/A"}</td>
                  <td className="border p-2">
                    {order.products.map((item) => (
                      <div key={item.product._id}>
                        {item.product.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="border p-2">₹{order.totalAmount}</td>
                  <td className="border p-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
