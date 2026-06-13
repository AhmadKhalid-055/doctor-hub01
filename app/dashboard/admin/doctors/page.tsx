import React from "react";

export default function AdminDoctors() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctor Management</h1>
          <p className="text-slate-400 mt-1">Onboard new doctors, edit consultation fees, and manage clinic assignments.</p>
        </div>
        <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition">
          + Add Doctor
        </button>
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Specialty</th>
              <th className="px-6 py-4">Fee</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {[
              { name: "Dr. Smith", spec: "Cardiology", fee: "$120", rating: "4.9" },
              { name: "Dr. Johnson", spec: "Dermatology", fee: "$80", rating: "4.7" },
              { name: "Dr. Lee", spec: "Neurology", fee: "$150", rating: "4.8" },
            ].map((doc, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 text-slate-200 font-medium">{doc.name}</td>
                <td className="px-6 py-4 text-slate-400">{doc.spec}</td>
                <td className="px-6 py-4 text-slate-300">{doc.fee}</td>
                <td className="px-6 py-4 text-yellow-400">★ {doc.rating}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-xs bg-slate-800 text-slate-300 border border-white/10 px-2 py-1 rounded hover:bg-slate-700 transition">Edit</button>
                    <button className="text-xs bg-red-950 text-red-400 border border-red-900/50 px-2 py-1 rounded hover:bg-red-900 transition">Remove</button>
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
