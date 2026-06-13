"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useToast } from "@/components/ui/toast";

interface OverviewData {
  totalPatients: number;
  totalDoctors: number;
  totalClinics: number;
  totalRevenue: number;
  appointmentsByStatus: { status: string; _count: { status: number } }[];
  paymentsByStatus: { status: string; _count: { status: number } }[];
}

interface MonthlyData {
  appointmentsPerMonth: { month: string; count: number }[];
  revenuePerMonth: { month: string; revenue: number }[];
}

const COLORS = ["#14b8a6", "#6366f1", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"];

const KPICard = ({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) => (
  <Card className="p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </Card>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl text-sm">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SuperAdminDashboard() {
  const { toast } = useToast();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [monthly, setMonthly] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [overviewRes, monthlyRes] = await Promise.all([
          fetch("/api/analytics/overview"),
          fetch("/api/analytics/monthly"),
        ]);
        const [overviewData, monthlyData] = await Promise.all([overviewRes.json(), monthlyRes.json()]);
        setOverview(overviewData.data);
        setMonthly(monthlyData.data);
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 animate-pulse text-lg">Loading analytics...</div>
      </div>
    );
  }

  const paymentDistribution = overview?.paymentsByStatus.map((p) => ({
    name: p.status,
    value: p._count.status,
  })) || [];

  const appointmentDistribution = overview?.appointmentsByStatus.map((a) => ({
    name: a.status.replace("_", " "),
    value: a._count.status,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Analytics</h1>
        <p className="text-slate-400 text-sm mt-1">Platform-wide metrics and performance overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Patients" value={overview?.totalPatients ?? 0} icon="👥" color="bg-teal-500/20" />
        <KPICard label="Total Doctors" value={overview?.totalDoctors ?? 0} icon="🩺" color="bg-indigo-500/20" />
        <KPICard label="Total Clinics" value={overview?.totalClinics ?? 0} icon="🏥" color="bg-amber-500/20" />
        <KPICard
          label="Total Revenue"
          value={`$${Number(overview?.totalRevenue ?? 0).toLocaleString()}`}
          icon="💰"
          color="bg-emerald-500/20"
        />
      </div>

      {/* Revenue Line Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={monthly?.revenuePerMonth || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue ($)"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ fill: "#14b8a6", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Bar + Donut charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Appointments Per Month</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly?.appointmentsPerMonth || []} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Appointments" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Payment Verification Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={paymentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {paymentDistribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Appointment Status Distribution */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Appointment Status Distribution</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={appointmentDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis dataKey="name" type="category" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Count" fill="#14b8a6" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
