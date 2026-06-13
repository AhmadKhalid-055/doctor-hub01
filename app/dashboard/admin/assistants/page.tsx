import React from "react";

export default function AdminAssistants() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-slate-400 mt-1">Manage reception desk assistants and clinic support staff.</p>
        </div>
        <button className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition">
          + Add Assistant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {["Alice Manager", "Bob Reception", "Carol Desk"].map((name, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-white/10 rounded-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-teal-400">
                {name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-200">{name}</p>
                <p className="text-xs text-slate-500">assistant@clinic.com</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-300 transition">Edit</button>
              <button className="flex-1 py-1.5 bg-red-950 hover:bg-red-900 text-xs rounded text-red-400 transition">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
