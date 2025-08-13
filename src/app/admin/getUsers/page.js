"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { getTruckDrivers, deleteUser,addTruckDriver,updateTruckDriver } from "@/services/adminService";
import AdminNavbar from "@/components/AdminNavbar";
import { STATUS_CODES } from "@/Constants/codeStatus";
import {
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  FileText,
  Search,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function GetUsersPage() {
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    licenseNumber: "",
    password: "",
  });
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [truckDrivers, setTruckDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});
  const driversPerPage = 4;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTruckDrivers(currentPage, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  const fetchTruckDrivers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const { status, data, error } = await getTruckDrivers(
        page,
        driversPerPage,
        search
      );

      if (status === STATUS_CODES.OK) {
        setTruckDrivers(data.data);
        setTotalDrivers(data.total);
      } else {
        console.error("Error fetching truck drivers:", error);
        setError("Failed to fetch truck drivers.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch truck drivers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const { status, error } = await deleteUser(id);

    if (status === STATUS_CODES.OK) {
      toast.success("Truck driver deleted successfully");
      setTruckDrivers((prev) => prev.filter((driver) => driver._id !== id));
    } else {
      console.error("Failed to delete truck driver:", error);
      toast.error("Failed to delete truck driver");
    }
  };

  const openUpdateModal = (driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
    const { status, error } = await updateTruckDriver(selectedDriver._id, selectedDriver);

    if (status === STATUS_CODES.OK) {
      toast.success("Truck driver updated successfully");
      setIsModalOpen(false);
      fetchTruckDrivers();
    } else {
      toast.error("Failed to update truck driver");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
  };
  const validateNewUser = () => {
    const newErrors = {};

    if (!newUser.name.trim()) newErrors.name = "Name is required";

    if (!newUser.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!newUser.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(newUser.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit number";
    }

    if (!newUser.address.trim()) newErrors.address = "Address is required";

    if (!newUser.licenseNumber.trim())
      newErrors.licenseNumber = "License number is required";

    if (!newUser.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (newUser.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNewUser = async () => {
    if (!validateNewUser()) return;
    const { data, status, error } = await addTruckDriver(newUser);

    if (status === 201) {
      toast.success("Truck driver added successfully");
      setIsNewUserModalOpen(false);
      setNewUser({
        name: "",
        email: "",
        mobile: "",
        address: "",
        licenseNumber: "",
      });
      fetchTruckDrivers();
    } else {
      console.error(error);
      toast.error("Failed to add truck driver");
    }
  };
  const currentDrivers = truckDrivers;
  const totalPages = Math.ceil(totalDrivers / driversPerPage);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 p-6 ml-[250px] flex items-center justify-center">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminNavbar />
        <div className="flex-1 p-6 ml-[250px] flex items-center justify-center">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminNavbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 p-6 ml-0 md:ml-[250px] transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Truck Drivers Management
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage all registered truck drivers
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsNewUserModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <User size={18} />
                Add New User
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Drivers</p>
                  <p className="text-xl font-bold">{truckDrivers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Licenses</p>
                  <p className="text-xl font-bold">{truckDrivers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Drivers Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <User className="mr-2" size={16} />
                        Name
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <Phone className="mr-2" size={16} />
                        Mobile
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <MapPin className="mr-2" size={16} />
                        Address
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center">
                        <FileText className="mr-2" size={16} />
                        License Number
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDrivers.length > 0 ? (
                    currentDrivers.map((driver) => (
                      <tr
                        key={driver._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              <User size={18} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {driver.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {driver.mobile}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {driver.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {driver.licenseNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => openUpdateModal(driver)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(driver._id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No truck drivers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                <ChevronLeft className="inline-block mr-1" /> Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {Math.ceil(totalDrivers / driversPerPage)}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(totalDrivers / driversPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage >= Math.ceil(totalDrivers / driversPerPage)
                }
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next <ChevronRight className="inline-block ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-800">
                Update Driver Details
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDriver.name}
                  onChange={(e) =>
                    setSelectedDriver({
                      ...selectedDriver,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDriver.mobile}
                  onChange={(e) =>
                    setSelectedDriver({
                      ...selectedDriver,
                      mobile: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDriver.address}
                  onChange={(e) =>
                    setSelectedDriver({
                      ...selectedDriver,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedDriver.licenseNumber}
                  onChange={(e) =>
                    setSelectedDriver({
                      ...selectedDriver,
                      licenseNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 border-t border-gray-200 p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h2 className="text-xl font-bold text-gray-800">
                Add New Driver
              </h2>
              <button
                onClick={() => {
                  setIsNewUserModalOpen(false);
                  setErrors("");
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newUser.mobile}
                  onChange={(e) =>
                    setNewUser({ ...newUser, mobile: e.target.value })
                  }
                />
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newUser.address}
                  onChange={(e) =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newUser.licenseNumber}
                  onChange={(e) =>
                    setNewUser({ ...newUser, licenseNumber: e.target.value })
                  }
                />
                {errors.licenseNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.licenseNumber}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-3 border-t border-gray-200 p-4">
              <button
                onClick={() => {
                  setIsNewUserModalOpen(false), setErrors("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Add Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
