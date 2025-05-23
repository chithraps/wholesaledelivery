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
    product: {
      product: "",
      quantity: 0,
    },
    totalAmount: "",
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
    const { name, value } = e.target;
    if (name === "product") {
      setFormData({
        ...formData,
        product: { ...formData.product, product: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calculateTotalAmount = () => {
    const selectedProduct = products.find(
      (prod) => prod._id === formData.product.product
    );
    const price = selectedProduct ? selectedProduct.price : 0;
    return price * formData.product.quantity;
  };
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value, 10) || 0;
    setFormData({
      ...formData,
      product: { ...formData.product, quantity },
    });
  };
  const validateForm = () => {
    const totalAmount = calculateTotalAmount();
    if (!formData.truckDriver) {
      toast.error("Please select a truck driver.");
      return false;
    }
    if (!formData.vendor) {
      toast.error("Please select a vendor.");
      return false;
    }
    if (!formData.product.product || formData.product.quantity <= 0) {
      toast.error("Please select a product and enter a valid quantity.");
      return false;
    }
    if (totalAmount <= 0) {
      toast.error("Total amount must be a positive number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const totalAmount = calculateTotalAmount();
      console.log(" formData ",formData)
      await axios.post("/api/admin/order", {
        ...formData,
        totalAmount,
      });
      toast.success("Order created successfully!");
      router.push("/admin/getOrder");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      <ToastContainer />
      <div className="flex-1 p-8 ml-[250px]">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Create New Order
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Truck Driver Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Truck Driver
              </label>
              <select
                name="truckDriver"
                value={formData.truckDriver}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a Truck Driver</option>
                {truckDrivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Vendor Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vendor
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a Vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Dropdown with Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                name="product"
                value={formData.product.product}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg p-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a Product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                placeholder="Qty"
                className="w-full border border-gray-300 p-2 rounded-md"
                value={formData.product.quantity}
                onChange={handleQuantityChange}
              />
            </div>
            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount (₹)
              </label>
              <div className="w-full border-gray-300 rounded-lg p-2 bg-gray-100">
                ₹{calculateTotalAmount()}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Submit Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
