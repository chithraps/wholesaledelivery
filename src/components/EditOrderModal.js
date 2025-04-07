"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditOrderModal = ({ isOpen, onClose, order, onUpdate }) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (order) {
      setStatus(order.status || "");
    }
  }, [order]);

  const handleChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/admin/order/${order._id}`, { status });
      if (response.status === 200) {
        toast.success("Order status updated successfully");
        onUpdate(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-medium">Truck Driver</label>
            <input
              type="text"
              value={order?.truckDriver?.name || ""}
              disabled
              className="border rounded w-full p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Vendor</label>
            <input
              type="text"
              value={order?.vendor?.name || ""}
              disabled
              className="border rounded w-full p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Total Amount</label>
            <input
              type="number"
              value={order?.totalAmount || ""}
              disabled
              className="border rounded w-full p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={handleChange}
              className="border rounded w-full p-2"
            >
              <option value="pending">pending</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
