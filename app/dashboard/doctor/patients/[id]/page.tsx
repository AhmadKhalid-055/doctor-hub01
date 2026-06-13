import React from "react";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-2xl font-bold">P</div>
        <div>
          <h1 className="text-3xl font-bold">Patient #{id}</h1>
          <p className="text-slate-500 text-sm">Patient Profile & Health Records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <h2 className="text-lg font-semibold text-teal-400">Demographics</h2>
          <div className="text-sm text-slate-400 space-y-2">
            <p><span className="text-slate-200 font-medium">DOB:</span> Jan 15, 1990</p>
            <p><span className="text-slate-200 font-medium">Blood Group:</span> A+</p>
            <p><span className="text-slate-200 font-medium">Gender:</span> Male</p>
            <p><span className="text-slate-200 font-medium">Emergency Contact:</span> +1 555-000-1234</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-white/10 rounded-lg space-y-3">
          <h2 className="text-lg font-semibold text-emerald-400">Add Medical Record</h2>
          <input placeholder="Record Type (e.g. DIAGNOSIS)" className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200" />
          <input placeholder="Title" className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200" />
          <textarea placeholder="Description..." className="w-full p-2.5 rounded bg-slate-800 border border-white/10 text-sm text-slate-200 h-20 resize-none" />
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm font-semibold transition">
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}
