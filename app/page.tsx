import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-slate-950">D</div>
            <span className="text-lg font-bold">Doctor Hub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#search" className="hover:text-white transition">Find a Doctor</a>
            <a href="#specialties" className="hover:text-white transition">Specialties</a>
            <a href="#about" className="hover:text-white transition">About</a>
          </nav>
          <div className="flex gap-3">
            <Link href="/login" className="px-4 py-2 text-sm border border-white/10 rounded-lg hover:bg-white/5 transition">Sign In</Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-500 rounded-lg transition font-medium">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-900/30 border border-teal-800/50 rounded-full text-teal-400 text-xs font-medium mb-6">
          🏥 Trusted by 24 clinics across the country
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Your Health,<br />Connected.
        </h1>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">
          Book consultations, manage prescriptions, and access your complete medical history — all in one secure platform.
        </p>

        {/* Doctor Search */}
        <div id="search" className="max-w-2xl mx-auto flex gap-3 p-2 bg-slate-900 border border-white/10 rounded-xl">
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            className="flex-1 px-4 py-3 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-sm"
          />
          <select className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none">
            <option value="">All Cities</option>
            <option value="new-york">New York</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="chicago">Chicago</option>
          </select>
          <button className="px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition whitespace-nowrap">
            Find Doctors
          </button>
        </div>
      </section>

      {/* Specialty Filter Chips */}
      <section id="specialties" className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">Browse by Specialty</h2>
        <div className="flex flex-wrap gap-3">
          {["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Orthopedics", "Psychiatry", "General Practice", "Ophthalmology"].map((spec) => (
            <button key={spec} className="px-4 py-2 bg-slate-900 border border-white/10 rounded-full text-sm text-slate-300 hover:border-teal-500/50 hover:text-teal-400 transition">
              {spec}
            </button>
          ))}
        </div>
      </section>

      {/* Doctor Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-6 text-slate-200">Featured Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Dr. Sarah Smith", spec: "Cardiology", clinic: "City Medical Center", rating: 4.9, fee: 120 },
            { name: "Dr. James Lee", spec: "Neurology", clinic: "Metro Health Hub", rating: 4.8, fee: 150 },
            { name: "Dr. Emily Johnson", spec: "Dermatology", clinic: "Riverside Clinic", rating: 4.7, fee: 80 },
          ].map((doc, i) => (
            <div key={i} className="p-6 bg-slate-900 border border-white/10 rounded-xl hover:border-teal-500/30 transition group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-bold text-lg">
                  {doc.name.split(" ")[2]?.[0] || "D"}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 group-hover:text-teal-400 transition">{doc.name}</h3>
                  <p className="text-sm text-slate-500">{doc.spec}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <p>🏥 {doc.clinic}</p>
                <p>⭐ {doc.rating} rating</p>
                <p>💵 ${doc.fee} consultation fee</p>
              </div>
              <Link href="/login" className="block text-center py-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition">
                Book Appointment
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 Doctor Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
