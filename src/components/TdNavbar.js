// TdNavbar.jsx
"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutTd } from "@/redux/TruckDriverAction";
import { useRouter } from "next/navigation";
import { Menu, X, Truck, Package, List, LogOut, Home } from "lucide-react";

const TdNavbar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const truckDriver = useSelector((state) => state.truckDriver.truckDriver);

    const [menuOpen, setMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false); 

    useEffect(() => {
        setIsMounted(true); 
    }, []);

    const handleLogout = () => {
        dispatch(logoutTd());
        router.push("/");
    };

    if (!isMounted) return null;

    return (
        <>
            {/* Sidebar - Always visible on large screens */}
            <nav className={`fixed left-0 top-0 h-full w-[250px] bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-xl transition-transform duration-300 z-20 ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <div className="flex flex-col h-full py-6 px-4">
                    <div className="flex items-center mb-8 px-2">
                        <Truck className="mr-3" size={24} />
                        <h1 className="text-xl font-bold">Driver Portal</h1>
                    </div>
                    
                    <div className="flex items-center mb-6 px-2 py-3 bg-blue-700/30 rounded-lg">
                        <div className="bg-blue-500/20 p-2 rounded-full mr-3">
                            <Home size={18} />
                        </div>
                        <div>
                            <p className="text-sm">Welcome back,</p>
                            <p className="font-medium">{truckDriver?.name || "Driver"}</p>
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                        <button 
                            onClick={() => router.push("/truckDriver/tdDashboard")}
                            className="flex items-center w-full px-3 py-3 rounded-lg hover:bg-blue-700/50 transition text-left"
                        >
                            <Home className="mr-3" size={18} />
                            Dashboard
                        </button>
                        <button 
                            onClick={() => router.push("/truckDriver/orderManagement")}
                            className="flex items-center w-full px-3 py-3 rounded-lg hover:bg-blue-700/50 transition text-left"
                        >
                            <Package className="mr-3" size={18} />
                            Create Order
                        </button>
                        <button 
                            onClick={() => router.push("/truckDriver/viewOrders")}
                            className="flex items-center w-full px-3 py-3 rounded-lg hover:bg-blue-700/50 transition text-left"
                        >
                            <List className="mr-3" size={18} />
                            View Orders
                        </button>
                    </div>
                    
                    <div className="mt-auto">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-3 py-3 rounded-lg hover:bg-red-500/20 transition text-left text-red-100"
                        >
                            <LogOut className="mr-3" size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Overlay for mobile */}
            {menuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-10 md:hidden" 
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Toggle Button for Mobile */}
            <button 
                className={`fixed top-4 left-4 md:hidden text-white bg-blue-600 p-2 rounded-full z-30 transition-all ${menuOpen ? 'left-[210px] bg-red-500/90' : ''}`} 
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </>
    );
};

export default TdNavbar;