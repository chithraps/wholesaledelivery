"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import AdminNavbar from "@/components/AdminNavbar";

export default function GetUsersPage() {
  const [truckDrivers, setTruckDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetchTruckDrivers();
  }, []);

  const fetchTruckDrivers = async () => {
    try {
      const response = await axios.get("/api/admin/getusers");
      if (response.status === 200) {
        setTruckDrivers(response.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch truck drivers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  
    try {
     const response = await axios.delete(`/api/admin/deleteuser/${id}`);
      if(response.status === 200){
      toast.success("Truck driver deleted successfully");
      setTruckDrivers(truckDrivers.filter((driver) => driver._id !== id));
    }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete truck driver");
    }
  };

  const openUpdateModal = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/admin/updateuser/${selectedDriver._id}`, selectedDriver);
      toast.success("Truck driver updated successfully");
      setIsModalOpen(false);
      fetchTruckDrivers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update truck driver");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminNavbar />
      <ToastContainer />
      <div className="flex-1 p-6 ml-[250px]">
        <h1 className="text-2xl font-bold mb-4">Truck Drivers List</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">License Number</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {truckDrivers.map((driver) => (
              <tr key={driver._id} className="text-center">
                <td className="border p-2">{driver.name}</td>
                <td className="border p-2">{driver.mobile}</td>
                <td className="border p-2">{driver.address}</td>
                <td className="border p-2">{driver.licenseNumber}</td>
                <td className="border p-2 flex justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => openUpdateModal(driver)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDelete(driver._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedDriver && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-5 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Update Driver</h2>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={selectedDriver.name}
              onChange={(e) => setSelectedDriver({ ...selectedDriver, name: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={selectedDriver.mobile}
              onChange={(e) => setSelectedDriver({ ...selectedDriver, mobile: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={selectedDriver.address}
              onChange={(e) => setSelectedDriver({ ...selectedDriver, address: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={selectedDriver.licenseNumber}
              onChange={(e) => setSelectedDriver({ ...selectedDriver, licenseNumber: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button className="bg-gray-400 px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpdate}>Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
