import React from "react";

export default function AssistantAppointments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clinic Appointment Calendar</h1>
      <p className="text-slate-400">View and manage all doctor schedules across the clinic today.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Dr. Smith", "Dr. Johnson", "Dr. Lee"].map((doc, i) => (
          <div key={i} className="p-6 bg-slate-900 border border-white/10 rounded-lg">
            <h2 className="text-lg font-semibold text-teal-400 mb-4">{doc}</h2>
            <div className="space-y-2">
              {[1, 2, 3].map((slot) => (
                <div key={slot} className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-white/5">
                  <span className="text-sm text-slate-300">Patient #{slot} — 10:{slot * 10} AM</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${slot === 1 ? "bg-emerald-900/40 text-emerald-400" : "bg-yellow-900/40 text-yellow-400"}`}>
                    {slot === 1 ? "Checked In" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
