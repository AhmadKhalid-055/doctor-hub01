import React from "react";

export default function PatientBilling() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Billing & Payments</h1>
      <p className="text-slate-400">View outstanding invoices and manage your payment receipts.</p>
      <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Appointment</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            <tr>
              <td className="px-6 py-4 text-slate-200">Dr. Smith - Oct 12, 2026</td>
              <td className="px-6 py-4 text-slate-300">$50.00</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-yellow-900/40 text-yellow-400 rounded-full text-xs font-medium">Pending</span>
              </td>
              <td className="px-6 py-4">
                <button className="text-xs bg-teal-900/50 text-teal-400 border border-teal-900/50 px-3 py-1 rounded hover:bg-teal-900 transition">Pay Now</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
