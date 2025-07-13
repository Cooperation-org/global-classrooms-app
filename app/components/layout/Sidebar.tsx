"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { icons } from "../icons/icons";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const SidebarContent = () => (
    <>
      {/* Logo Section */}
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

      {/* Navigation */}
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
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-64 xl:w-72 lg:bg-white lg:border-r lg:border-gray-100 lg:flex lg:flex-col lg:px-6 lg:py-8 lg:z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-full max-w-sm sm:max-w-md bg-white border-r border-gray-100 flex flex-col px-4 sm:px-6 py-6 sm:py-8 z-50 lg:hidden transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Tablet Bottom Navigation (Optional Alternative) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40 md:hidden lg:hidden">
        <div className="flex justify-around items-center max-w-screen-sm mx-auto">
          {navItems.slice(0, 5).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 relative
                  ${
                    isActive
                      ? "text-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <span className="text-lg mb-1">
                  {icons[item.icon as keyof typeof icons]}
                </span>
                <span className="text-xs font-medium truncate max-w-[60px]">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
