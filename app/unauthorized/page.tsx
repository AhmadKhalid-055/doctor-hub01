import React from "react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-6">Unauthorized Access</h2>
      <p className="text-slate-400 max-w-md mb-8">
        Your current account role does not have authorization permissions to view the requested dashboard.
      </p>
      <Link href="/login" className="px-6 py-2.5 rounded bg-teal-600 hover:bg-teal-500 font-semibold transition">
        Return to Login
      </Link>
    </div>
  );
}
