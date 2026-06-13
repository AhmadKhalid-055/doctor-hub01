import React from "react";

export default function DoctorOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Doctor Portal</h1>
      <p className="text-slate-400">Manage consultations, issue prescriptions, and monitor earnings.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900 border border-teal-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Today's Patients</p>
          <p className="text-4xl font-bold text-teal-400 mt-2">8</p>
        </div>
        <div className="p-6 bg-slate-900 border border-emerald-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Earnings</p>
          <p className="text-4xl font-bold text-emerald-400 mt-2">$3,200</p>
        </div>
        <div className="p-6 bg-slate-900 border border-purple-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg. Rating</p>
          <p className="text-4xl font-bold text-purple-400 mt-2">4.8 ★</p>
        </div>
        <div className="p-6 bg-slate-900 border border-sky-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Prescriptions Issued</p>
          <p className="text-4xl font-bold text-sky-400 mt-2">64</p>
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Revenue Timeline (Chart Placeholder)</h2>
        <div className="h-48 bg-slate-800 rounded flex items-center justify-center text-slate-500 text-sm">
          Recharts RevenueLineChart renders here
        </div>
      </div>
    </div>
  );
}
