"use client";
import AdminNavbar from "@/components/AdminNavbar";
import axios from "axios";
import { useEffect, useState } from "react";
const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    users: 0,
    vendors: 0,
    ordersToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all counts in parallel
    const fetchCounts = async () => {
      try {
        const [usersRes, vendorsRes, ordersRes] = await Promise.all([
          axios.get("/api/admin/countUser"),
          axios.get("/api/admin/countvendor"),
          axios.get("/api/admin/countOrder"),
        ]);

        setCounts({
          users: usersRes.data.count,
          vendors: vendorsRes.data.count,
          ordersToday: ordersRes.data.count,
        });
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <AdminNavbar />
      
      <div className="flex-1 ml-[250px] p-8 transition-all">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Dashboard</h2>
          <p className="text-gray-600 text-lg">Welcome to your admin panel! You can manage users, vendors, products, and orders from here.</p>
        </div>

        {/* Placeholder for dashboard stats/cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="mt-2 text-3xl font-bold">{counts.users}</p>
          </div>
          <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Total Vendors</h3>
            <p className="mt-2 text-3xl font-bold">{counts.vendors}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold">Orders Today</h3>
            <p className="mt-2 text-3xl font-bold">{counts.ordersToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
