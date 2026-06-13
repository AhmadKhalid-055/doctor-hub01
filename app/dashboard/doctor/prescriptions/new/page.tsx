"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

const EMPTY_ITEM: PrescriptionItem = {
  medicineName: "", dosage: "", frequency: "", duration: "", instructions: "",
};

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const appointmentId = searchParams.get("appointmentId") || "";
  const patientId = searchParams.get("patientId") || "";

  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([{ ...EMPTY_ITEM }]);
  const [submitting, setSubmitting] = useState(false);

  const updateItem = (index: number, field: keyof PrescriptionItem, value: string) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((prev) => [...prev, { ...EMPTY_ITEM }]);

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId || !patientId) {
      toast.error("Appointment or Patient ID is missing");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, patientId, diagnosis, notes, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create prescription");
      toast.success("Prescription created successfully!");
      router.push("/dashboard/doctor/appointments");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Create Prescription</h1>
        <p className="text-slate-400 text-sm mt-1">This prescription will be immutable once submitted.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Diagnosis & Notes</h2>
          <Input
            label="Diagnosis"
            required
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g., Type 2 Diabetes, Hypertension..."
          />
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Doctor's Notes (Optional)</label>
            <textarea
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-teal-500 transition min-h-[100px]"
              placeholder="Any additional instructions for the patient..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Medicines</h2>
            <Button type="button" variant="outline" onClick={addItem}>
              + Add Medicine
            </Button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm font-medium">Medicine #{index + 1}</span>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 text-sm transition">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Medicine Name"
                  required
                  value={item.medicineName}
                  onChange={(e) => updateItem(index, "medicineName", e.target.value)}
                  placeholder="e.g., Metformin"
                />
                <Input
                  label="Dosage"
                  required
                  value={item.dosage}
                  onChange={(e) => updateItem(index, "dosage", e.target.value)}
                  placeholder="e.g., 500mg"
                />
                <Input
                  label="Frequency"
                  required
                  value={item.frequency}
                  onChange={(e) => updateItem(index, "frequency", e.target.value)}
                  placeholder="e.g., Twice daily"
                />
                <Input
                  label="Duration"
                  required
                  value={item.duration}
                  onChange={(e) => updateItem(index, "duration", e.target.value)}
                  placeholder="e.g., 30 days"
                />
                <div className="md:col-span-2">
                  <Input
                    label="Instructions (Optional)"
                    value={item.instructions}
                    onChange={(e) => updateItem(index, "instructions", e.target.value)}
                    placeholder="e.g., Take after meals"
                  />
                </div>
              </div>
            </div>
          ))}
        </Card>

        <Button type="submit" className="w-full" isLoading={submitting}>
          Submit Prescription
        </Button>
      </form>
    </div>
  );
}
