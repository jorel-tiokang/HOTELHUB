"use client";

import Link from "next/link";
import { X, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  unreadCount?: number;
}

interface DashboardSidebarProps {
  navItems: NavItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarExpanded: boolean;
  setSidebarHovered: (v: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  userName?: string;
  userInitial?: string;
  roleLabel: string;
  espaceLabel: string;
  logoutLabel: string;
  onLogout: () => void;
  logoSubtitle?: string;
}

export default function DashboardSidebar({
  navItems,
  activeTab,
  setActiveTab,
  isSidebarExpanded,
  setSidebarHovered,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  userName,
  userInitial = "D",
  roleLabel,
  espaceLabel,
  logoutLabel,
  onLogout,
  logoSubtitle,
}: DashboardSidebarProps) {
  return (
    <aside
      onMouseEnter={() => setSidebarHovered(true)}
      onMouseLeave={() => setSidebarHovered(false)}
      className={`fixed left-0 top-0 h-full backdrop-blur-xl bg-black/90 md:bg-black/40 z-50 transition-all duration-300 ease-in-out flex flex-col ${
        isMobileMenuOpen ? "translate-x-0 w-[240px]" : "-translate-x-full md:translate-x-0"
      } ${isSidebarExpanded ? "md:w-[240px]" : "md:w-[72px]"}`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex item-center gap-3">
            <img
              src="/hotelhublogo.png"
              alt="HotelHub Logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            <p
              className="font-black text-purple text-lg whitespace-nowrap"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              HOTELHUB
            </p>
            <p className="text-gold text-xs whitespace-nowrap">
              {logoSubtitle ?? roleLabel}
            </p>
          </div>
        </Link>
        {isMobileMenuOpen && (
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? "bg-purple/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple rounded-r-full" />
              )}
              <div className="relative shrink-0">
                <Icon className="w-5 h-5" />
                {(item.unreadCount ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
                )}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold shrink-0">
            {userInitial}
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
            }`}
          >
            <p className="text-white font-semibold text-sm whitespace-nowrap">
              {userName ?? roleLabel}
            </p>
            <p className="text-white/40 text-xs whitespace-nowrap">{espaceLabel}</p>
          </div>
        </div>
        <Link href="/login">
          <button
            onClick={onLogout}
            className={`mt-3 w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:text-white rounded-lg hover:bg-white/5 transition-all ${
              isSidebarExpanded ? "" : "justify-center"
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span
              className={`text-xs overflow-hidden transition-all duration-300 ${
                isSidebarExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              {logoutLabel}
            </span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
