"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface Clinic {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  specialty: string;
  treatmentType: string;
  consultationFee: number;
  experienceYears: number;
  rating: number;
  licenseNumber: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: string;
  };
  clinics: Clinic[];
}

const TREATMENT_TYPES = ["ALLOPATHIC", "HOMEOPATHIC", "HERBAL"];

export default function AdminDoctors() {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    treatmentType: "ALLOPATHIC",
    licenseNumber: "",
    consultationFee: "",
    experienceYears: "",
    bio: "",
    clinicId: "",
  });

  const fetchDoctors = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/staff?type=doctor");
      if (!res.ok) throw new Error("Failed to load doctors");
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch {
      toast.error("Could not load doctors");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchClinics = useCallback(async () => {
    try {
      const res = await fetch("/api/clinics");
      if (!res.ok) return;
      const data = await res.json();
      setClinics(data.data || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
    fetchClinics();
  }, [fetchDoctors, fetchClinics]);

  const resetForm = () => {
    setForm({
      firstName: "", lastName: "", email: "", password: "",
      phone: "", specialty: "", treatmentType: "ALLOPATHIC",
      licenseNumber: "", consultationFee: "", experienceYears: "", bio: "", clinicId: "",
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/staff?type=doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          consultationFee: parseFloat(form.consultationFee) || 0,
          experienceYears: parseInt(form.experienceYears) || 0,
          clinicId: form.clinicId || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create doctor");
      toast.success("Doctor account created successfully!");
      setDialogOpen(false);
      resetForm();
      fetchDoctors();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Remove Dr. ${name}? This action cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/staff?type=doctor&userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove doctor");
      toast.success("Doctor removed successfully");
      setDoctors((prev) => prev.filter((d) => d.user.id !== userId));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const f = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctor Management</h1>
          <p className="text-slate-400 mt-1">
            Onboard new doctors, edit consultation fees, and manage clinic assignments.
          </p>
        </div>
        <button
          id="add-doctor-btn"
          onClick={() => { resetForm(); setDialogOpen(true); }}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Doctor
        </button>
      </div>

      {/* Table */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Specialty</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Fee</th>
              <th className="px-6 py-4">Exp.</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Clinic</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                  Loading doctors...
                </td>
              </tr>
            ) : doctors.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                  No doctors registered yet. Click &quot;Add Doctor&quot; to onboard one.
                </td>
              </tr>
            ) : (
              doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-200">
                        Dr. {doc.user.firstName} {doc.user.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{doc.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{doc.specialty}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-teal-900/50 text-teal-300 border border-teal-700/40">
                      {doc.treatmentType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">${Number(doc.consultationFee).toFixed(0)}</td>
                  <td className="px-6 py-4 text-slate-400">{doc.experienceYears} yr</td>
                  <td className="px-6 py-4 text-yellow-400">★ {doc.rating.toFixed(1)}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {doc.clinics.length > 0 ? doc.clinics.map((c) => c.name).join(", ") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(doc.user.id, `${doc.user.firstName} ${doc.user.lastName}`)}
                      disabled={deletingId === doc.user.id}
                      className="text-xs bg-red-950 text-red-400 border border-red-900/50 px-2 py-1 rounded hover:bg-red-900 transition disabled:opacity-50"
                    >
                      {deletingId === doc.user.id ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Doctor Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add New Doctor"
        size="xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={form.firstName} onChange={(e) => f("firstName", e.target.value)} placeholder="James" />
            <Input label="Last Name" required value={form.lastName} onChange={(e) => f("lastName", e.target.value)} placeholder="Smith" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email Address" type="email" required value={form.email} onChange={(e) => f("email", e.target.value)} placeholder="doctor@example.com" />
            <Input label="Phone (optional)" value={form.phone} onChange={(e) => f("phone", e.target.value)} placeholder="+1-555-000-0000" />
          </div>
          <Input label="Password" type="password" required value={form.password} onChange={(e) => f("password", e.target.value)} placeholder="Min. 8 characters" hint="The doctor will use this to log in." />
          
          <hr className="border-white/10" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Specialty" required value={form.specialty} onChange={(e) => f("specialty", e.target.value)} placeholder="e.g. Cardiology" />
            <Input label="License Number" required value={form.licenseNumber} onChange={(e) => f("licenseNumber", e.target.value)} placeholder="LIC-12345" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Consultation Fee ($)" type="number" required value={form.consultationFee} onChange={(e) => f("consultationFee", e.target.value)} placeholder="50" />
            <Input label="Experience (years)" type="number" required value={form.experienceYears} onChange={(e) => f("experienceYears", e.target.value)} placeholder="5" />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Treatment Type</label>
              <select
                value={form.treatmentType}
                onChange={(e) => f("treatmentType", e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                {TREATMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          {clinics.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Assign to Clinic (optional)</label>
              <select
                value={form.clinicId}
                onChange={(e) => f("clinicId", e.target.value)}
                className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="">— No clinic —</option>
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Bio (optional)</label>
            <textarea
              value={form.bio}
              onChange={(e) => f("bio", e.target.value)}
              placeholder="Brief description about the doctor..."
              rows={3}
              className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2.5 text-sm text-slate-200 resize-none placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={submitting}>
              Create Doctor Account
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
