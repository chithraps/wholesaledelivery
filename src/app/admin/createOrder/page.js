"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "@/components/AdminNavbar";

const CreateOrder = () => {
  const router = useRouter();
  const [truckDrivers, setTruckDrivers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    truckDriver: "",
    vendor: "",
    products: [],
    totalAmount: "",
    collectedAmount: "",
    status: "pending",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/admin/orderData");
        setTruckDrivers(response.data.truckDrivers);
        setVendors(response.data.vendors);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (productId, quantity) => {
    const updatedProducts = [...formData.products];
    const existingProduct = updatedProducts.find((p) => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity = quantity;
    } else {
      updatedProducts.push({ product: productId, quantity: Number(quantity) });
    }

    setFormData({ ...formData, products: updatedProducts });
  };

  const validateForm = () => {
    if (!formData.truckDriver) {
      toast.error("Please select a truck driver.");
      return false;
    }
    if (!formData.vendor) {
      toast.error("Please select a vendor.");
      return false;
    }
    if (formData.products.length === 0 || formData.products.every(p => p.quantity <= 0)) {
      toast.error("Please select at least one product with a valid quantity.");
      return false;
    }
    if (!formData.totalAmount || formData.totalAmount <= 0) {
      toast.error("Total amount must be a positive number.");
      return false;
    }
    if (formData.collectedAmount < 0) {
      toast.error("Collected amount cannot be negative.");
      return false;
    }
    if (Number(formData.collectedAmount) > Number(formData.totalAmount)) {
      toast.error("Collected amount cannot exceed the total amount.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post("/api/admin/order", formData);
      toast.success("Order created successfully!");
      router.push("/admin/getOrder");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminNavbar />
      <ToastContainer />
      <div className="flex-1 p-6 ml-[250px]">
        <h2 className="text-xl font-bold mb-4">Create Order</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          {/* Truck Driver Dropdown */}
          <label className="block mb-2">Truck Driver:</label>
          <select
            name="truckDriver"
            value={formData.truckDriver}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select a Truck Driver</option>
            {truckDrivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.name}
              </option>
            ))}
          </select>

          {/* Vendor Dropdown */}
          <label className="block mb-2">Vendor:</label>
          <select
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          >
            <option value="">Select a Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor._id} value={vendor._id}>
                {vendor.name}
              </option>
            ))}
          </select>

          {/* Product Selection */}
          <label className="block mb-2">Products:</label>
          {products.map((product) => (
            <div key={product._id} className="flex items-center mb-2">
              <input
                type="number"
                min="1"
                placeholder="Quantity"
                className="border p-2 mr-2 w-20"
                onChange={(e) =>
                  handleProductChange(product._id, e.target.value)
                }
              />
              <span>{product.name}</span>
            </div>
          ))}

          {/* Total Amount */}
          <label className="block mb-2">Total Amount (₹):</label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />

          {/* Collected Amount */}
          <label className="block mb-2">Collected Amount (₹):</label>
          <input
            type="number"
            name="collectedAmount"
            value={formData.collectedAmount}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-4"
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
