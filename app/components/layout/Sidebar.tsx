"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { icons } from "../icons/icons";
import { RegistrationUser } from "@/app/types";
import { useDisconnect } from "wagmi";

const navItems = [
  { label: "Home", icon: "home", href: "/dashboard" },
  { label: "Live Projects", icon: "projects", href: "/dashboard/projects" },
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

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const [user, setUser] = useState<RegistrationUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
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
    disconnect();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    router.push("/signin");
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) return null;

  return (
    <aside className="w-full lg:w-64 bg-white p-4 lg:p-6 border-r border-gray-200">
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 sm:space-x-3"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="text-xl sm:text-2xl">🌐</span>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-base sm:text-lg lg:text-xl text-green-800 truncate">
              Global Classrooms
            </div>
            <div className="text-xs sm:text-sm text-green-600 leading-tight">
              Environmental Education
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Platform
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1 sm:space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-green-50 text-green-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="mr-3 sm:mr-4 text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
                    {icons[item.icon as keyof typeof icons]}
                  </span>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-200 pt-4 mt-4">
        {user && (
          <div className="mb-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user.full_name?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase() ||
                  user.username?.charAt(0).toUpperCase() ||
                  "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.full_name || user.email || user.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
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
  );
};

export default Sidebar;
