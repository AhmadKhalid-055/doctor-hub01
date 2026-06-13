import React from "react";

export default function DoctorPatients() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Directory</h1>
      <p className="text-slate-400">Search and access patient medical profiles from your clinic database.</p>

      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Search patients by name or ID..."
          className="flex-1 p-3 rounded-lg bg-slate-900 border border-white/10 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button className="px-5 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition">
          Search
        </button>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Blood Group</th>
              <th className="px-6 py-4">Last Visit</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {["A+", "O-", "B+"].map((blood, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 text-slate-200">Patient {i + 1}</td>
                <td className="px-6 py-4 text-slate-400">{blood}</td>
                <td className="px-6 py-4 text-slate-500">Oct {10 + i}, 2026</td>
                <td className="px-6 py-4">
                  <a href={`/dashboard/doctor/patients/${i + 1}`} className="text-xs text-teal-400 hover:underline">
                    View Records →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
