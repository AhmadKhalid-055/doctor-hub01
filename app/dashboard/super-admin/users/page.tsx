import React from "react";

const roleColors: Record<string, string> = {
  PATIENT: "bg-sky-900/40 text-sky-400",
  DOCTOR: "bg-teal-900/40 text-teal-400",
  ASSISTANT: "bg-purple-900/40 text-purple-400",
  ADMIN: "bg-orange-900/40 text-orange-400",
  SUPER_ADMIN: "bg-red-900/40 text-red-400",
};

const users = [
  { name: "John Doe", email: "john@example.com", role: "PATIENT" },
  { name: "Dr. Smith", email: "smith@clinic.com", role: "DOCTOR" },
  { name: "Alice Manager", email: "alice@clinic.com", role: "ASSISTANT" },
  { name: "Bob Admin", email: "bob@clinic.com", role: "ADMIN" },
  { name: "Root Super", email: "root@doctorhub.com", role: "SUPER_ADMIN" },
];

export default function SuperAdminUsers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Roster</h1>
          <p className="text-slate-400 mt-1">Manage all platform users across all roles and clinics.</p>
        </div>
        <input
          placeholder="Search users..."
          className="p-2.5 rounded-lg bg-slate-900 border border-white/10 text-sm text-slate-200 placeholder-slate-500 w-60"
        />
      </div>

      <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {users.map((user, i) => (
              <tr key={i} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 text-slate-200 font-medium">{user.name}</td>
                <td className="px-6 py-4 text-slate-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>{user.role}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-xs bg-slate-800 text-slate-300 border border-white/10 px-2 py-1 rounded hover:bg-slate-700 transition">Edit</button>
                    <button className="text-xs bg-red-950 text-red-400 border border-red-900/50 px-2 py-1 rounded hover:bg-red-900 transition">Suspend</button>
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
