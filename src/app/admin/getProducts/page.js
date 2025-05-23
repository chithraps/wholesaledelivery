"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "@/components/AdminNavbar";
import EditProductModal from "@/components/EditProductModal"; 

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/admin/products");
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`/api/admin/products/${productId}/delete`);
      toast.success("Product deleted successfully!");
      setProducts(products.filter((product) => product._id !== productId));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product); 
    setIsModalOpen(true); 
  };

  const handleUpdateSuccess = () => {
    fetchProducts(); 
    setIsModalOpen(false); 
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
  <AdminNavbar />
  <ToastContainer />
  <div className="flex-1 p-8 ml-[250px]">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-semibold text-gray-800">Product Management</h1>
      <button
        onClick={() => router.push("/admin/addProduct")}
        className="bg-indigo-600 text-white px-5 py-2 rounded-md shadow hover:bg-indigo-700 transition duration-200"
      >
        + Add Product
      </button>
    </div>

    {products.length === 0 ? (
      <div className="bg-white p-10 rounded shadow text-center text-gray-500 text-lg">
        No products available.
      </div>
    ) : (
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Image</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.stock}</td>
                <td className="px-6 py-4 text-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover mx-auto"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>

  {isModalOpen && (
    <EditProductModal
      product={selectedProduct}
      onClose={() => setIsModalOpen(false)}
      onUpdateSuccess={handleUpdateSuccess}
    />
  )}
</div>
  );
}
