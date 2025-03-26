import { useState } from "react";

import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";

import { menuRoutes } from "@/presentation/router/router";
import { SidebarMenuItem } from "@/presentation/components/sidebar/SidebarMenuItem";

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen relative pt-10 sm:pt-0">
      {!isSidebarOpen && (
        <button
          className="sm:hidden fixed top-2 right-5 z-50 p-2 bg-gray-800 text-white rounded-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <nav
        className={`fixed sm:fixed top-0 left-0 z-40 h-screen w-72 bg-gray-900 bg-opacity-95 
        p-5 transition-transform duration-300 sm:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button */}
        <button
          className="sm:hidden absolute top-4 right-4 p-2 text-white rounded-full 
          bg-gray-700 hover:bg-gray-600 transition-all"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={28} />
        </button>

        <h1 className="text-2xl font-bold text-white mb-5 mt-10 sm:mt-0">
          ReactGPT AI<span className="text-indigo-400">.</span>
        </h1>
        <span className="text-gray-400 text-lg">Bienvenido</span>

        <div className="border-gray-700 border my-3" />

        {/* Menu Options */}
        {menuRoutes.map((option) => (
          <SidebarMenuItem
            key={option.to}
            {...option}
            onClick={() => setIsSidebarOpen(false)}
          />
        ))}
      </nav>

      {/* Main content*/}
      <section className="flex-1 py-5 px-5 sm:ml-72 transition-all duration-300 overflow-y-auto">
        <Outlet />
      </section>
    </main>
  );
};
