"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
}

export default function DoctorClinicsPage() {
  const { toast } = useToast();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Clinic | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ id: "", name: "", address: "", city: "", phone: "", email: "" });

  const fetchClinics = async () => {
    try {
      const res = await fetch("/api/clinics");
      const data = await res.json();
      if (res.ok) setClinics(data.data || []);
    } catch {
      toast.error("Failed to load clinics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClinics(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ id: "", name: "", address: "", city: "", phone: "", email: "" });
    setShowDialog(true);
  };

  const openEdit = (clinic: Clinic) => {
    setEditing(clinic);
    setForm({ id: clinic.id, name: clinic.name, address: clinic.address, city: clinic.city, phone: clinic.phone || "", email: clinic.email || "" });
    setShowDialog(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/clinics", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save clinic");
      toast.success(`Clinic ${editing ? "updated" : "created"} successfully!`);
      setShowDialog(false);
      fetchClinics();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">My Clinics</h1>
          <p className="text-slate-400 text-sm mt-1">Manage the clinics you operate from.</p>
        </div>
        <Button onClick={openAdd}>+ Add Clinic</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading clinics...</div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏥</div>
          <p className="text-slate-400 mb-4">No clinics added yet.</p>
          <Button onClick={openAdd}>Add Your First Clinic</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg gradient-teal flex items-center justify-center text-white text-lg">🏥</div>
                <button onClick={() => openEdit(clinic)} className="text-sm text-teal-400 hover:text-teal-300 transition">Edit</button>
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{clinic.name}</h3>
              <p className="text-slate-400 text-sm">{clinic.address}</p>
              <p className="text-slate-400 text-sm">{clinic.city}</p>
              {clinic.phone && <p className="text-slate-500 text-sm mt-2">📞 {clinic.phone}</p>}
              {clinic.email && <p className="text-slate-500 text-sm">✉️ {clinic.email}</p>}
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title={editing ? "Edit Clinic" : "Add New Clinic"}
        size="md"
      >
        <div className="space-y-4">
          <Input label="Clinic Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., City Care Clinic" />
          <Input label="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" />
          <Input label="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 890" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="clinic@example.com" />
          </div>
          <Button className="w-full" onClick={handleSave} isLoading={saving}>
            {editing ? "Save Changes" : "Create Clinic"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
