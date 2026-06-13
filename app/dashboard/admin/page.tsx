import React from "react";

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Control Panel</h1>
      <p className="text-slate-400">Monitor clinic performance, manage staff, and review analytics.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900 border border-teal-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Doctors</p>
          <p className="text-4xl font-bold text-teal-400 mt-2">18</p>
        </div>
        <div className="p-6 bg-slate-900 border border-emerald-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Patients</p>
          <p className="text-4xl font-bold text-emerald-400 mt-2">342</p>
        </div>
        <div className="p-6 bg-slate-900 border border-purple-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Revenue</p>
          <p className="text-4xl font-bold text-purple-400 mt-2">$18.4k</p>
        </div>
        <div className="p-6 bg-slate-900 border border-sky-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg. Wait Time</p>
          <p className="text-4xl font-bold text-sky-400 mt-2">12 min</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Weekly Appointment Footfall (Placeholder)</h2>
          <div className="h-40 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-sm">
            Recharts BarChart renders here
          </div>
        </div>
        <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Specialty Distribution (Placeholder)</h2>
          <div className="h-40 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-sm">
            Recharts PieChart renders here
          </div>
        </div>
      </div>
    </div>
  );
}
