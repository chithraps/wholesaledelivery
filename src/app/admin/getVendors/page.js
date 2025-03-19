"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "@/components/AdminNavbar";

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contact: "",
    email: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await axios.get("/api/admin/vendors");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.contact.trim()) {
      errors.contact = "Contact is required";
    } else if (!/^\d{10,15}$/.test(formData.contact)) {
      errors.contact = "Invalid contact number (10-15 digits)";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("/api/admin/vendors", formData);
      toast.success("Vendor added successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", location: "", contact: "", email: "" }); // Reset form
      fetchVendors(); // Refresh vendor list
    } catch (error) {
      console.error("Error adding vendor:", error);
      toast.error("Failed to add vendor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminNavbar />
      <ToastContainer />
      <div className="flex-1 p-6 ml-[250px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Vendor List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Vendor
          </button>
        </div>

        {loading ? (
          <p>Loading vendors...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <tr key={vendor._id} className="text-center">
                    <td className="border p-2">{vendor.name}</td>
                    <td className="border p-2">{vendor.location}</td>
                    <td className="border p-2">{vendor.contact}</td>
                    <td className="border p-2">{vendor.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border p-2 text-center">
                    No vendors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add Vendor</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border rounded px-2 py-1"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="mb-2">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full border rounded px-2 py-1"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              <div className="mb-2">
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="Contact"
                  className="w-full border rounded px-2 py-1"
                />
                {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
              </div>

              <div className="mb-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border rounded px-2 py-1"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  className="bg-gray-400 px-3 py-1 rounded"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
