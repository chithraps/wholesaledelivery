"use client";
import AdminNavbar from "@/components/AdminNavbar";

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminNavbar />

            
            <div className="flex-1 p-6 ml-[250px]">
                <h2 className="text-2xl font-semibold">Dashboard</h2>
                <p className="text-gray-700 mt-2">Welcome to your dashboard!</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
