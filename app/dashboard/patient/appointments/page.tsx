import React from "react";

export default function PatientAppointments() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Appointments</h1>
      <p className="text-slate-400">Book new visits and view your reservation schedules.</p>
      
      <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-teal-400">Schedule Consultation</h2>
        {/* Placeholder slot picker inputs list */}
        <div className="text-slate-500">Booking form widgets reside here.</div>
      </div>
    </div>
  );
}
