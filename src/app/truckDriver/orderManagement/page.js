"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import TdNavbar from "@/components/TdNavbar";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const OrderManagementPage = () => {
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState("");
    const [cart, setCart] = useState([]);
    const [quantities, setQuantities] = useState({});
    const truckDriver = useSelector((state) => state.truckDriver.truckDriver);

    useEffect(() => {
        const fetchData = async () => {
            const [vendorsRes, productsRes] = await Promise.all([
                axios.get("/api/truckDriver/getVendors"),
                axios.get("/api/truckDriver/getProducts")
            ]);
            setVendors(vendorsRes.data);
            setProducts(productsRes.data);
        };
        fetchData();
    }, []);

    const handleAddToCart = (product) => {
        const quantity = parseInt(quantities[product._id] || 0);
        if (quantity <= 0) return;
        const exists = cart.find(item => item.product._id === product._id);
        if (exists) {
            setCart(cart.map(item =>
                item.product._id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity }]);
        }
        setQuantities({ ...quantities, [product._id]: 0 });
    };

    const handleRemoveFromCart = (id) => {
        setCart(cart.filter(item => item.product._id !== id));
    };

    const handleCreateOrder = async () => {
        if (!selectedVendor || cart.length === 0) return toast.warn("Select a vendor and add products");

        const orderData = {
            vendor: selectedVendor,
            truckDriver: truckDriver._id,
            products: cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalAmount: cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
        };

        await axios.post("/api/truckDriver/orders", orderData);
        toast.success("Order created!");
        setCart([]);
        setSelectedVendor("");
    };

    return (
        <div className="ml-[250px] p-6">
            <TdNavbar />
            <ToastContainer />
            <h2 className="text-2xl font-semibold mb-4">Order Management</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium">Select Vendor:</label>
                <select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} className="mt-1 p-2 border rounded w-full">
                    <option value="">-- Select Vendor --</option>
                    {vendors.map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 shadow rounded">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm">Price: ₹{product.price}</p>
                        <input
                            type="number"
                            min="0"
                            placeholder="Quantity"
                            value={quantities[product._id] || ""}
                            onChange={(e) => setQuantities({ ...quantities, [product._id]: e.target.value })}
                            className="mt-2 p-1 border rounded w-full"
                        />
                        <button onClick={() => handleAddToCart(product)} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">Cart Summary</h3>
                {cart.length === 0 ? (
                    <p className="text-gray-500">No items in cart</p>
                ) : (
                    <table className="min-w-full bg-white shadow rounded overflow-hidden">
                        <thead>
                            <tr className="bg-blue-200">
                                <th className="text-left p-2">Product</th>
                                <th className="text-left p-2">Quantity</th>
                                <th className="text-left p-2">Total</th>
                                <th className="text-left p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.product._id}>
                                    <td className="p-2">{item.product.name}</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">₹{item.quantity * item.product.price}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleRemoveFromCart(item.product._id)} className="text-red-500 hover:underline">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {cart.length > 0 && (
                    <div className="mt-4">
                        <p className="font-bold">Total: ₹{cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0)}</p>
                        <button onClick={handleCreateOrder} className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Create Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderManagementPage;
