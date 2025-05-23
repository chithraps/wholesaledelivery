"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-4xl text-center space-y-6">
        <div className="inline-block bg-indigo-100 px-4 py-2 rounded-full mb-4">
          <span className="text-indigo-800 font-medium text-sm">Efficiency Redefined</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Wholesale Delivery <span className="text-indigo-600">Management</span> System
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Our application helps streamline and manage the entire wholesale delivery process — 
          from assigning delivery drivers to tracking orders and managing inventory.
          Designed specifically for businesses that deliver products in bulk, this platform 
          improves operational efficiency, reduces manual errors, and enables real-time tracking and updates.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/truckDriver/login")}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-indigo-200 font-medium text-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
            </svg>
            Truck Driver Login
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-gray-200 font-medium text-lg flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            Admin Login
          </button>
        </div>
      </div>

      <section className="mt-20 w-full max-w-6xl text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 relative inline-block">
          Why Choose Our Platform?
          <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-200 transform translate-y-2"></span>
        </h2>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
          {[
            { icon: "🚚", title: "Real-time Tracking", desc: "Monitor deliveries live on interactive maps" },
            { icon: "📦", title: "Inventory Control", desc: "Manage stock levels and product availability" },
            { icon: "👷", title: "Driver Management", desc: "Assign and track driver performance" },
            { icon: "📈", title: "Powerful Analytics", desc: "Get insights into delivery performance" },
            { icon: "🔒", title: "Secure Access", desc: "Role-based permissions and authentication" },
            { icon: "💬", title: "Smart Alerts", desc: "Instant notifications for all stakeholders" }
          ].map((item, index) => (
            <li 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-indigo-100 group"
            >
              <div className="text-4xl mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-20 text-gray-500 text-sm">
        © {new Date().getFullYear()} Wholesale Delivery System. All rights reserved.
      </footer>
    </main>
  );
}