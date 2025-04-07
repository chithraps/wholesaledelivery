"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "@/components/AdminNavbar";
import EditOrderModal from "@/components/EditOrderModal";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/admin/order");
        if (response.status === 200) {
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

  const handleDelete = async (orderId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this order?</p>
        <div className="flex justify-center mt-2 space-x-4">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={async () => {
              try {
                const response = await axios.delete(
                  `/api/admin/order/${orderId}`
                );
                if (response.status === 200) {
                  toast.success("Order deleted successfully");
                  setOrders(orders.filter((order) => order._id !== orderId));
                }
              } catch (error) {
                console.error("Error deleting order:", error);
                toast.error("Failed to delete order");
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };
  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleOrderUpdate = (updatedOrder) => {
    setOrders(
      orders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

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
                <th className="border p-2">Actions</th>
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
                  <td className="border p-2 flex space-x-2">
                    <button
                      onClick={() => handleUpdateClick(order)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <EditOrderModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          order={selectedOrder}
          onUpdate={handleOrderUpdate}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
