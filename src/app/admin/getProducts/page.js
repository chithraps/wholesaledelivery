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
      <div className="flex-1 p-6 ml-[250px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Products List</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => router.push("/admin/addProduct")}
          >
            Add Product
          </button>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No products available.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="text-center">
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">{product.price}</td>
                  <td className="border p-2">{product.category}</td>
                  <td className="border p-2">{product.stock}</td>
                  <td className="border p-2">
                    {product.image ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border p-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
