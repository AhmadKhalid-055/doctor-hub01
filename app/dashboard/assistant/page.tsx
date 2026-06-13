import React from "react";

export default function AssistantOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assistant Portal</h1>
      <p className="text-slate-400">Manage patient check-ins, route consultations, and verify payment transactions.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-teal-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Patients in Queue</p>
          <p className="text-4xl font-bold text-teal-400 mt-2">12</p>
        </div>
        <div className="p-6 bg-slate-900 border border-emerald-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Checked In Today</p>
          <p className="text-4xl font-bold text-emerald-400 mt-2">34</p>
        </div>
        <div className="p-6 bg-slate-900 border border-yellow-500/20 rounded-lg">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending Payments</p>
          <p className="text-4xl font-bold text-yellow-400 mt-2">7</p>
        </div>
      </div>

      <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Today's Waiting Queue</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5">
              <div>
                <p className="font-medium text-slate-200">Patient #{i} — Dr. Smith</p>
                <p className="text-xs text-slate-500">Scheduled at 10:{i * 10} AM</p>
              </div>
              <button className="text-xs bg-teal-900/50 text-teal-400 border border-teal-900/50 px-3 py-1 rounded hover:bg-teal-900 transition">
                Check In
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
