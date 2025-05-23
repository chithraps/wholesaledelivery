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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const router = useRouter();

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/admin/order?page=${page}&limit=${limit}`
      );
      if (response.status === 200) {
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

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
                  fetchOrders(currentPage); // Refresh orders
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
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      <ToastContainer />
      <div className="flex-1 p-8 ml-[250px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
          <button
            onClick={() => router.push("/admin/createOrder")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-lg transition duration-200"
          >
            + Create Order
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No orders found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Truck Driver</th>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4">Products</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr
                      key={order._id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order._id}
                      </td>
                      <td className="px-6 py-4">
                        {order.truckDriver?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {order.vendor?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 text-sm">
                        {order.product ? (
                          <div>
                            {order.product.product?.name}{" "}
                            <span className="text-xs text-gray-500">
                              (x{order.product.quantity})
                            </span>
                          </div>
                        ) : (
                          "No product"
                        )}
                      </td>
                      <td className="px-6 py-4 text-green-600 font-semibold">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 capitalize">{order.status}</td>
                      <td className="px-6 py-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdateClick(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
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
