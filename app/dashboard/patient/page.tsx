import React from "react";

export default function PatientOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Portal</h1>
      <p className="text-slate-400">Manage appointments, review prescriptions, and view your digital medical records.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
          <h3 className="font-semibold text-lg text-teal-400 mb-2">Upcoming Consultation</h3>
          <p className="text-sm text-slate-300">Dr. Smith - General Practice</p>
          <p className="text-xs text-slate-500 mt-1">Oct 24, 2026 at 10:00 AM</p>
        </div>
        <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
          <h3 className="font-semibold text-lg text-emerald-400 mb-2">Active Prescriptions</h3>
          <p className="text-sm text-slate-300">Amoxicillin 500mg</p>
          <p className="text-xs text-slate-500 mt-1">Take 3x daily for 7 days</p>
        </div>
        <div className="p-6 bg-slate-900 border border-white/10 rounded-lg">
          <h3 className="font-semibold text-lg text-purple-400 mb-2">Outstanding Invoices</h3>
          <p className="text-sm text-slate-300">$50.00 - Consultation Fee</p>
          <p className="text-xs text-slate-500 mt-1">Status: Pending Verification</p>
        </div>
      </div>
    </div>
  );
}
