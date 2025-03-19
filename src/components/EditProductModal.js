import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EditProductModal({ product, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    category: product.category,
    stock: product.stock,
    imageUrl: product.imageUrl,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/admin/products/${product._id}/update`, formData);
      toast.success("Product updated successfully!");
      onUpdateSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm font-semibold">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" className="bg-gray-400 px-3 py-1 rounded" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
