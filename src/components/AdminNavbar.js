"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuperAdmin } from "@/redux/AdminAction";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

const AdminNavbar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const admin = useSelector((state) => state.admin.admin);

    const [menuOpen, setMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false); 

    useEffect(() => {
        setIsMounted(true); 
    }, []);

    const handleLogout = () => {
        dispatch(logoutSuperAdmin());
        router.push("/admin");
    };

    if (!isMounted) return null;

    return (
        <>
            {/* Sidebar - Always visible on large screens */}
            <nav className={`fixed left-0 top-0 h-full w-[250px] bg-blue-300 text-white shadow-md transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <div className="flex flex-col py-6 space-y-6 px-4">
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    <span>Welcome,  Admin!</span>

                    <button onClick={() => router.push("/admin/dashboard")} className="hover:text-gray-200 text-left">
                        Dashboard
                    </button>
                    
                    <button onClick={handleLogout} className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
                        Logout
                    </button>
                </div>
            </nav>

            
            <button className="fixed top-4 left-4 md:hidden text-white bg-blue-500 p-2 rounded" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </>
    );
};

export default AdminNavbar;
