import React from "react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-900/40 text-yellow-400",
  SCHEDULED: "bg-blue-900/40 text-blue-400",
  COMPLETED: "bg-emerald-900/40 text-emerald-400",
  CANCELLED: "bg-red-900/40 text-red-400",
  NO_SHOW: "bg-slate-800 text-slate-400",
};

export default function DoctorAppointments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Appointment Queue</h1>
      <p className="text-slate-400">Manage your daily schedule, update statuses, and add consultation notes.</p>

      <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {["PENDING", "SCHEDULED", "COMPLETED"].map((status, i) => (
              <tr key={i}>
                <td className="px-6 py-4 text-slate-200">John Patient {i + 1}</td>
                <td className="px-6 py-4 text-slate-400">Oct {14 + i}, 2026 @ 10:00 AM</td>
                <td className="px-6 py-4 text-slate-400">Routine Checkup</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>{status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-xs bg-teal-900/50 text-teal-400 border border-teal-900/50 px-2 py-1 rounded hover:bg-teal-900 transition">Complete</button>
                    <button className="text-xs bg-slate-800 text-slate-400 border border-white/10 px-2 py-1 rounded hover:bg-slate-700 transition">Notes</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
