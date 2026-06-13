"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/hooks/use-auth-store";
import { getInitials } from "@/lib/utils";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-white/10 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40 flex items-center px-6 gap-4">
      {/* Search bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/50 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification Bell */}
        <button className="relative w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-white/20 transition">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full border-2 border-slate-900" />
        </button>

        {/* User Avatar */}
        {user ? (
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-200 leading-none">{user.firstName} {user.lastName}</p>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5 capitalize">{user.role.toLowerCase().replace("_", " ")}</p>
            </div>
            <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer">
              {getInitials(user.firstName, user.lastName)}
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-slate-700 animate-shimmer" />
        )}
      </div>
    </header>
  );
}
