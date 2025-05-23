"use client";
import TdNavbar from "@/components/TdNavbar";

const TdDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <TdNavbar />

      <div className="flex-1 p-8 md:ml-[250px]">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <p className="text-gray-600 mb-8">Welcome to your truck driver dashboard. Use the options on the left to manage your orders.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600">Create Order</h3>
            <p className="text-gray-500 mt-2">Quickly create a new delivery order.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-green-600">View Orders</h3>
            <p className="text-gray-500 mt-2">See all your active and past orders.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-red-600">Notifications</h3>
            <p className="text-gray-500 mt-2">Stay updated with delivery alerts.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TdDashboard;
