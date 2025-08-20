"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { icons } from "../icons/icons";
import { usePathname } from "next/navigation";
import { RegistrationUser } from "@/app/types";
import { useDisconnect } from "wagmi";

const navItems = [
  { label: "Projects", icon: "projects", href: "/dashboard/projects" },
  { label: "Schools", icon: "schools", href: "/dashboard/schools" },
  {
    label: "Collaborations",
    icon: "collaborations",
    href: "/dashboard/collaborations",
    badge: "New",
  },
  {
    label: "Rewards",
    icon: "rewards",
    href: "/dashboard/rewards",
    badge: "New",
  },
  { label: "Impact", icon: "impact", href: "/dashboard/impact" },
  { label: "Donate", icon: "donate", href: "/dashboard/donate" },
  { label: "Settings", icon: "settings", href: "/dashboard/settings" },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open = false, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<RegistrationUser | null>(null);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Disconnect wallet if connected
    disconnect();

    // Clear all auth data
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");

    // Redirect to signin page
    router.push("/signin");
  };

  const getIcon = (iconName: string) => {
    if (iconName === "globe") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a10 10 0 000 20" />
        </svg>
      );
    }

    if (iconName === "schools") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <rect x="4" y="6" width="16" height="14" />
          <rect x="8" y="2" width="8" height="4" />
          <line x1="8" y1="10" x2="8" y2="10" />
          <line x1="12" y1="10" x2="12" y2="10" />
          <line x1="16" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="8" y2="14" />
          <line x1="12" y1="14" x2="12" y2="14" />
          <line x1="16" y1="14" x2="16" y2="14" />
          <rect x="10" y="16" width="4" height="4" />
        </svg>
      );
    }

    if (iconName === "collaborations") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <circle cx="16" cy="7" r="4" />
        </svg>
      );
    }

    return (
      icons[iconName as keyof typeof icons] ||
      (iconName === "user" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
        </svg>
      ) : null)
    );
  };

  return (
    <>
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col px-6 py-8 z-50 transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-500 hover:text-gray-800 z-50"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-lg text-green-800">EGR</div>
              <div className="text-xs text-green-600">
                Educating Global Resilience
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <span className="mr-3 text-lg w-5 h-5 flex items-center justify-center">
                      {getIcon(item.icon)}
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile and Logout */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          {user && (
            <div className="mb-4">
              <Link href="/dashboard/profile" className="block">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-green-50 cursor-pointer transition">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.full_name
                      ? user.full_name.charAt(0).toUpperCase()
                      : user.email
                      ? user.email.charAt(0).toUpperCase()
                      : user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.full_name || user.email || user.username}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <span className="mr-3 text-lg w-5 h-5 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;