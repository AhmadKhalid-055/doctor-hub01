import React from "react";

export default function AdminClinic() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clinic Settings</h1>
      <p className="text-slate-400">Manage clinic information, operating hours, and contact details.</p>

      <div className="p-6 bg-slate-900 border border-white/10 rounded-lg space-y-4 max-w-2xl">
        <h2 className="text-lg font-semibold text-teal-400">Clinic Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Clinic Name</label>
            <input defaultValue="City Medical Center" className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">City</label>
            <input defaultValue="New York" className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-400 mb-1 block">Full Address</label>
            <input defaultValue="123 Medical Avenue, NY 10001" className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Phone Number</label>
            <input defaultValue="+1 555-100-2000" className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Email Address</label>
            <input defaultValue="contact@citymedical.com" className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200" />
          </div>
        </div>
        <div>
          <label className="text-sm text-slate-400 mb-1 block">Logo Upload</label>
          <div className="p-4 border-2 border-dashed border-white/10 rounded-lg text-center text-slate-500 text-sm cursor-pointer hover:border-teal-500/50 transition">
            Click or drag to upload clinic logo
          </div>
        </div>
        <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 rounded text-sm font-semibold transition">
          Update Clinic Info
        </button>
      </div>
    </div>
  );
}
