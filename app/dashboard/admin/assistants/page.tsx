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

interface Assistant {
  id: string;
  clinic: Clinic;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: string;
  };
}

export default function AdminAssistants() {
  const { toast } = useToast();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
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
    clinicId: "",
  });

  const fetchAssistants = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/staff?type=assistant");
      if (!res.ok) throw new Error("Failed to load assistants");
      const data = await res.json();
      setAssistants(data.assistants || []);
    } catch {
      toast.error("Could not load assistants");
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
    fetchAssistants();
    fetchClinics();
  }, [fetchAssistants, fetchClinics]);

  const resetForm = () => {
    setForm({ firstName: "", lastName: "", email: "", password: "", phone: "", clinicId: "" });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clinicId) {
      toast.error("Please select a clinic for the assistant.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/staff?type=assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create assistant");
      toast.success("Assistant account created successfully!");
      setDialogOpen(false);
      resetForm();
      fetchAssistants();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name}? This action cannot be undone.`)) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`/api/admin/staff?type=assistant&userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove assistant");
      toast.success("Assistant removed successfully");
      setAssistants((prev) => prev.filter((a) => a.user.id !== userId));
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
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-slate-400 mt-1">
            Manage reception desk assistants and clinic support staff.
          </p>
        </div>
        <button
          id="add-assistant-btn"
          onClick={() => { resetForm(); setDialogOpen(true); }}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-semibold transition flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Assistant
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500">Loading staff...</div>
      ) : assistants.length === 0 ? (
        <div className="py-16 text-center text-slate-500 border border-white/10 rounded-xl bg-slate-900">
          No assistants registered yet. Click &quot;Add Assistant&quot; to onboard one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assistants.map((ast) => (
            <div
              key={ast.id}
              className="p-6 bg-slate-900 border border-white/10 rounded-xl space-y-3 hover:border-teal-500/30 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-700 flex items-center justify-center font-bold text-teal-400 text-lg shrink-0">
                  {ast.user.firstName[0]}{ast.user.lastName[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-200 truncate">
                    {ast.user.firstName} {ast.user.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{ast.user.email}</p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-400 flex items-center gap-1.5">
                <span>🏥</span>
                <span className="truncate">{ast.clinic?.name || "No clinic assigned"}</span>
              </div>
              {ast.user.phone && (
                <p className="text-xs text-slate-500">📞 {ast.user.phone}</p>
              )}
              <p className="text-xs text-slate-600">
                Joined {new Date(ast.user.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(ast.user.id, `${ast.user.firstName} ${ast.user.lastName}`)}
                disabled={deletingId === ast.user.id}
                className="w-full py-1.5 bg-red-950 hover:bg-red-900 text-xs rounded text-red-400 transition disabled:opacity-50"
              >
                {deletingId === ast.user.id ? "Removing..." : "Remove"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Assistant Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Add New Assistant"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={form.firstName} onChange={(e) => f("firstName", e.target.value)} placeholder="Sarah" />
            <Input label="Last Name" required value={form.lastName} onChange={(e) => f("lastName", e.target.value)} placeholder="Connor" />
          </div>
          <Input label="Email Address" type="email" required value={form.email} onChange={(e) => f("email", e.target.value)} placeholder="assistant@clinic.com" />
          <Input label="Phone (optional)" value={form.phone} onChange={(e) => f("phone", e.target.value)} placeholder="+1-555-000-0000" />
          <Input label="Password" type="password" required value={form.password} onChange={(e) => f("password", e.target.value)} placeholder="Min. 8 characters" hint="The assistant will use this to log in." />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">
              Assign to Clinic <span className="text-red-400">*</span>
            </label>
            {clinics.length === 0 ? (
              <p className="text-xs text-amber-400 bg-amber-950/30 border border-amber-800/40 px-3 py-2 rounded-lg">
                No clinics found. Please create a clinic first from the Clinic tab.
              </p>
            ) : (
              <select
                value={form.clinicId}
                onChange={(e) => f("clinicId", e.target.value)}
                required
                className="w-full rounded-lg bg-slate-800 border border-white/10 px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="">— Select a clinic —</option>
                {clinics.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={submitting}>
              Create Assistant Account
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
