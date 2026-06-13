import React from "react";

export default function SuperAdminClinics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clinic Registry</h1>
          <p className="text-slate-400 mt-1">Onboard new clinic tenants and manage existing clinic records.</p>
        </div>
        <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition">
          + Onboard Clinic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "City Medical Center", city: "New York", docs: 18 },
          { name: "Riverside Clinic", city: "Los Angeles", docs: 12 },
          { name: "Metro Health Hub", city: "Chicago", docs: 24 },
        ].map((clinic, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-white/10 rounded-lg space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">{clinic.name}</h2>
                <p className="text-sm text-slate-500">{clinic.city}</p>
              </div>
              <span className="px-2 py-1 bg-emerald-900/40 text-emerald-400 rounded-full text-xs font-medium">Active</span>
            </div>
            <div className="text-sm text-slate-400">
              <span className="text-teal-400 font-medium">{clinic.docs}</span> registered doctors
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-300 transition">Manage</button>
              <button className="flex-1 py-1.5 bg-red-950 hover:bg-red-900 text-xs rounded text-red-400 transition">Deactivate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
