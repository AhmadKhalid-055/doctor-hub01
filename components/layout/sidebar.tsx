"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/hooks/use-auth-store";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navByRole: Record<string, NavItem[]> = {
  PATIENT: [
    { label: "Overview",        href: "/dashboard/patient",               icon: "🏠" },
    { label: "Appointments",    href: "/dashboard/patient/appointments",   icon: "📅" },
    { label: "Medical History", href: "/dashboard/patient/medical-history",icon: "📋" },
    { label: "Prescriptions",   href: "/dashboard/patient/prescriptions",  icon: "💊" },
    { label: "Billing",         href: "/dashboard/patient/billing",        icon: "💳" },
  ],
  DOCTOR: [
    { label: "Overview",       href: "/dashboard/doctor",                     icon: "🏠" },
    { label: "Appointments",   href: "/dashboard/doctor/appointments",         icon: "📅" },
    { label: "Patients",       href: "/dashboard/doctor/patients",             icon: "👥" },
    { label: "New Prescription",href: "/dashboard/doctor/prescriptions/new",  icon: "✍️" },
    { label: "My Schedule",    href: "/dashboard/doctor/schedule",             icon: "🗓️" },
  ],
  ASSISTANT: [
    { label: "Overview",     href: "/dashboard/assistant",              icon: "🏠" },
    { label: "Appointments", href: "/dashboard/assistant/appointments",  icon: "📅" },
    { label: "Payments",     href: "/dashboard/assistant/payments",      icon: "💰" },
  ],
  ADMIN: [
    { label: "Overview",    href: "/dashboard/admin",              icon: "🏠" },
    { label: "Doctors",     href: "/dashboard/admin/doctors",       icon: "👨‍⚕️" },
    { label: "Assistants",  href: "/dashboard/admin/assistants",    icon: "👩‍💼" },
    { label: "Clinic Info", href: "/dashboard/admin/clinic",        icon: "🏥" },
  ],
  SUPER_ADMIN: [
    { label: "Platform",  href: "/dashboard/super-admin",           icon: "🌐" },
    { label: "Clinics",   href: "/dashboard/super-admin/clinics",   icon: "🏥" },
    { label: "All Users", href: "/dashboard/super-admin/users",     icon: "👥" },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role ?? "PATIENT";
  const navItems = navByRole[role] ?? [];

  const roleLabels: Record<string, string> = {
    PATIENT: "Patient Portal",
    DOCTOR: "Doctor Portal",
    ASSISTANT: "Assistant Portal",
    ADMIN: "Admin Panel",
    SUPER_ADMIN: "Super Admin",
  };

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-slate-900/80 backdrop-blur-md flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center font-bold text-white text-sm shadow-lg">D</div>
          <div>
            <p className="text-sm font-bold text-white leading-none">Doctor Hub</p>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">{roleLabels[role]}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-teal-600/20 text-teal-300 border border-teal-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-teal flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 animate-pulse" />
            <div className="h-4 bg-slate-700 rounded animate-pulse flex-1" />
          </div>
        )}
        <Link
          href="/api/auth/logout"
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs text-red-400 bg-red-950/50 hover:bg-red-900/50 border border-red-900/40 rounded-lg transition font-medium"
        >
          🚪 Sign Out
        </Link>
      </div>
    </aside>
  );
}
