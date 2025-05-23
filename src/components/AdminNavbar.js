"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuperAdmin } from "@/redux/AdminAction";
import { useRouter } from "next/navigation";
import { Menu, X, Users, Store, Package, ListOrdered, LogOut, Home, Settings, Activity } from "lucide-react";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const admin = useSelector((state) => state.admin.admin);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeRoute, setActiveRoute] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setActiveRoute(window.location.pathname);
  }, []);

  const handleLogout = () => {
    dispatch(logoutSuperAdmin());
    router.push("/admin");
  };

  if (!isMounted) return null;

  const navItems = [
    { 
      path: "/admin/dashboard", 
      name: "Dashboard", 
      icon: <Home className="w-5 h-5" />,
      comingSoon: false
    },
    { 
      path: "/admin/getUsers", 
      name: "User Management", 
      icon: <Users className="w-5 h-5" />,
      comingSoon: false
    },
    { 
      path: "/admin/getVendors", 
      name: "Vendor Management", 
      icon: <Store className="w-5 h-5" />,
      comingSoon: false
    },
    { 
      path: "/admin/getProducts", 
      name: "Product Management", 
      icon: <Package className="w-5 h-5" />,
      comingSoon: false
    },
    { 
      path: "/admin/getOrder", 
      name: "Order Management", 
      icon: <ListOrdered className="w-5 h-5" />,
      comingSoon: false
    }
    
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-700 to-blue-600 text-white shadow-2xl z-50 transition-all duration-300 transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="px-4 py-6 border-b border-blue-500/30">
            <h1 className="text-2xl font-bold flex items-center">
              <span className="bg-white/10 p-2 rounded-lg mr-3">
                <Package className="text-white" />
              </span>
              Admin Panel
            </h1>
            <p className="text-blue-100 mt-2 text-sm">Welcome, {admin?.name || "Admin"}!</p>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      if (!item.comingSoon) {
                        router.push(item.path);
                        setActiveRoute(item.path);
                        setMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                      activeRoute === item.path 
                        ? "bg-white/20 text-white font-medium" 
                        : "text-blue-100 hover:bg-white/10"
                    } ${item.comingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    {item.comingSoon && (
                      <span className="ml-auto bg-white/10 text-xs px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t border-blue-500/30 pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
            <div className="mt-4 text-center text-xs text-blue-200">
              v1.0.0 • Admin Panel
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Toggle Button */}
      <button
        className={`fixed top-4 left-4 md:hidden z-50 text-white bg-blue-600 p-3 rounded-full shadow-xl transition-all ${
          menuOpen ? "left-56 bg-red-500/90" : ""
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </>
  );
};

export default AdminNavbar;