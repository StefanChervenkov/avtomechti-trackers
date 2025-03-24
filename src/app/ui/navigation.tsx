"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname to get the current route

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"
          } md:w-64`}
      >
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">Menu</h1>
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            ✕
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <Link
            href="/"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Home
          </Link>
          <Link
            href="/devices"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Devices
          </Link>
          <Link
            href="/active-devices"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Active Devices
          </Link>

          <Link
            href="/settings"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Settings
          </Link>
          <Link
            href="/logout"
            className="block py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Logout
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <header className="p-4 bg-gray-100 shadow-md w-full fixed top-0 left-0 z-10">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto px-4">
            <button
              onClick={toggleMenu}
              className="text-gray-800 focus:outline-none"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
        </header>
        <main className="pt-20 p-4">
          {/* Conditionally render the dashboard content */}
          {pathname === "/" && (
            <>
              <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
              <p className="mt-2 text-gray-600">
                This is the main content area. Resize the screen to see the
                responsive navigation in action.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}