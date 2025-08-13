"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import TdNavbar from "@/components/TdNavbar";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { Plus, Minus, Trash2, ShoppingCart, PackagePlus } from "lucide-react";
import {
  getTruckDriverVendors,
  getVendorProducts, createTruckDriverOrder
} from "@/services/truckDriverService";
import { STATUS_CODES } from "@/Constants/codeStatus";

const OrderManagementPage = () => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const truckDriver = useSelector((state) => state.truckDriver.truckDriver);

  useEffect(() => {
    const fetchVendors = async () => {
      const { data, status, error } = await getTruckDriverVendors();

      if (!error && status === STATUS_CODES.OK) {
        setVendors(data);
      } else {
        toast.error("Failed to load vendors");
      }
    };

    fetchVendors();
  }, []);
  const handleMultipleSelect = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedProduct(selectedOptions);
  };
  const handleVendorChange = async (e) => {
    const vendorId = e.target.value;
    setSelectedVendor(vendorId);
    setSelectedProduct([]);
    setQuantities({});
    setProducts([]);

    if (vendorId) {
      try {
        const { data, status, error } = await getVendorProducts(vendorId);

        if (!error && status === STATUS_CODES.OK) {
          setProducts(data.products || []);
        } else {
          toast.error("Failed to load products for selected vendor");
        }
      } catch (err) {
        toast.error("Something went wrong while loading products");
      }
    }
  };

  const handleAddToCart = (product) => {
    const quantity = parseInt(quantities[product._id] || 0);
    if (quantity <= 0) {
      toast.warn("Please enter a valid quantity");
      return;
    }
    const exists = cart.find((item) => item.product._id === product._id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success(`Added ${quantity} more ${product.name}`);
    } else {
      setCart([...cart, { product, quantity }]);
      toast.success(`Added ${product.name} to cart`);
    }
    setQuantities({ ...quantities, [product._id]: 0 });
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.product._id !== id));
    toast.info("Item removed from cart");
  };

  const handleQuantityChange = (id, change) => {
    setCart(
      cart.map((item) =>
        item.product._id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
            }
          : item
      )
    );
  };

  const handleCreateOrder = async () => {
    if (!selectedVendor) {
      toast.warn("Please select a vendor");
      return;
    }
    if (cart.length === 0) {
      toast.warn("Please add products to cart");
      return;
    }

    try {
      const orderData = {
        vendor: selectedVendor,
        truckDriver: truckDriver._id,
        products: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalAmount: cart.reduce(
          (sum, item) => sum + item.quantity * item.product.price,
          0
        ),
      };

      const { data, status, error } = await createTruckDriverOrder(orderData);

      if (!error && status === STATUS_CODES.CREATED) {
        toast.success("Order created successfully!");
        setCart([]);
        setSelectedVendor("");
      } else {
        toast.error(error || "Failed to create order");
      }
    } catch (error) {
      toast.error("Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <TdNavbar />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="ml-0 md:ml-[250px] p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Create New Order
              </h2>
              <p className="text-gray-600 mt-1">
                Add products to your delivery order
              </p>
            </div>
            {cart.length > 0 && (
              <div className="mt-4 md:mt-0 flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                <ShoppingCart className="mr-2" size={18} />
                <span className="font-medium">
                  {cart.length} {cart.length === 1 ? "item" : "items"} in cart
                </span>
              </div>
            )}
          </div>

          {/* Order Creation Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Select Products
                </h3>

                {/* Vendor Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={selectedVendor}
                    onChange={handleVendorChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors.map((vendor) => (
                      <option key={vendor._id} value={vendor._id}>
                        {vendor.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Selection */}
                {selectedVendor && (
                  <>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-start gap-2"
                          >
                            <input
                              type="checkbox"
                              id={product._id}
                              checked={selectedProduct.includes(product._id)}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelectedProduct((prevSelected) =>
                                  isChecked
                                    ? [...prevSelected, product._id]
                                    : prevSelected.filter(
                                        (id) => id !== product._id
                                      )
                                );
                              }}
                            />
                            <label
                              htmlFor={product._id}
                              className="text-sm text-gray-700"
                            >
                              {product.name} - ₹{product.price.toFixed(2)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Input */}
                    {selectedProduct.length > 0 && (
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        {selectedProduct.map((productId) => {
                          const product = products.find(
                            (p) => p._id === productId
                          );
                          if (!product) return null;

                          return (
                            <div
                              key={productId}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="number"
                                min="1"
                                placeholder={`Qty for ${product.name}`}
                                value={quantities[productId] || ""}
                                onChange={(e) =>
                                  setQuantities({
                                    ...quantities,
                                    [productId]: e.target.value,
                                  })
                                }
                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
                              />
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                              >
                                <PackagePlus className="mr-2" size={18} />
                                Add product
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Cart Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <ShoppingCart className="mr-2" size={20} />
                  Order Summary
                </h3>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <ShoppingCart size={48} className="mx-auto" />
                    </div>
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add products to get started
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-gray-200">
                      {cart.map((item) => (
                        <div
                          key={item.product._id}
                          className="py-3 flex justify-between items-center"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₹{item.product.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product._id, -1)
                              }
                              className="p-1 text-gray-500 hover:text-blue-600 transition"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="mx-2 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.product._id, 1)
                              }
                              className="p-1 text-gray-500 hover:text-blue-600 transition"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleRemoveFromCart(item.product._id)
                              }
                              className="ml-3 p-1 text-red-500 hover:text-red-600 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          ₹
                          {cart
                            .reduce(
                              (sum, item) =>
                                sum + item.quantity * item.product.price,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Delivery:</span>
                        <span className="font-medium">₹0.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>
                          ₹
                          {cart
                            .reduce(
                              (sum, item) =>
                                sum + item.quantity * item.product.price,
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={handleCreateOrder}
                        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center"
                      >
                        Place Order
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;
