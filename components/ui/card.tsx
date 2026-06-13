import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
}

export function Card({ children, className, glass = false, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 p-6",
        glass
          ? "bg-slate-900/60 backdrop-blur-md"
          : "bg-slate-900",
        hover && "transition-all duration-200 hover:border-teal-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-900/20",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps { children: React.ReactNode; className?: string; }
export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

interface CardTitleProps { children: React.ReactNode; className?: string; }
export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cn("text-lg font-semibold text-slate-100", className)}>{children}</h3>;
}

interface CardContentProps { children: React.ReactNode; className?: string; }
export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

interface KPICardProps {
  label: string;
  value: string | number;
  accent?: "teal" | "emerald" | "purple" | "sky" | "yellow" | "red";
  icon?: React.ReactNode;
  trend?: { value: string; up: boolean };
}

const accentMap: Record<string, string> = {
  teal:    "text-teal-400    border-teal-500/20",
  emerald: "text-emerald-400 border-emerald-500/20",
  purple:  "text-purple-400  border-purple-500/20",
  sky:     "text-sky-400     border-sky-500/20",
  yellow:  "text-yellow-400  border-yellow-500/20",
  red:     "text-red-400     border-red-500/20",
};

export function KPICard({ label, value, accent = "teal", icon, trend }: KPICardProps) {
  const colors = accentMap[accent];
  return (
    <div className={cn("rounded-xl border bg-slate-900 p-6 space-y-2", colors)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        {icon && <span className="opacity-50">{icon}</span>}
      </div>
      <p className={cn("text-4xl font-bold", colors.split(" ")[0])}>{value}</p>
      {trend && (
        <p className={cn("text-xs font-medium", trend.up ? "text-emerald-400" : "text-red-400")}>
          {trend.up ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
