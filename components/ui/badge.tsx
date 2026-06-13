import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "pending" | "scheduled" | "completed" | "cancelled" | "no_show" |
                   "patient" | "doctor" | "assistant" | "admin" | "super_admin" | "default";

const variantMap: Record<BadgeVariant, string> = {
  pending:     "bg-yellow-900/40 text-yellow-400 border border-yellow-800/40",
  scheduled:   "bg-blue-900/40   text-blue-400   border border-blue-800/40",
  completed:   "bg-emerald-900/40 text-emerald-400 border border-emerald-800/40",
  cancelled:   "bg-red-900/40    text-red-400    border border-red-800/40",
  no_show:     "bg-slate-800     text-slate-400  border border-slate-700",
  patient:     "bg-sky-900/40    text-sky-400    border border-sky-800/40",
  doctor:      "bg-teal-900/40   text-teal-400   border border-teal-800/40",
  assistant:   "bg-purple-900/40 text-purple-400 border border-purple-800/40",
  admin:       "bg-orange-900/40 text-orange-400 border border-orange-800/40",
  super_admin: "bg-red-900/40    text-red-400    border border-red-800/40",
  default:     "bg-slate-800     text-slate-300  border border-slate-700",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      variantMap[variant],
      className
    )}>
      {children}
    </span>
  );
}
