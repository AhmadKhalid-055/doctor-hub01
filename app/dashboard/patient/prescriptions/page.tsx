"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
}

interface Prescription {
  id: string;
  diagnosis: string;
  notes: string | null;
  createdAt: string;
  doctor: { user: { firstName: string; lastName: string } };
  appointment: { dateTime: string };
  items: PrescriptionItem[];
}

export default function PatientPrescriptionsPage() {
  const { toast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await fetch("/api/prescriptions");
        const data = await res.json();
        if (res.ok) setPrescriptions(data.data || []);
      } catch {
        toast.error("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [toast]);

  const handleDownload = async (id: string) => {
    try {
      toast.success("Generating PDF... (PDF download feature requires jspdf integration)");
      // In production: window.open(`/api/prescriptions/${id}/pdf`, "_blank");
    } catch {
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Prescriptions</h1>
        <p className="text-slate-400 text-sm mt-1">All prescriptions issued by your doctors. Read-only — previous prescriptions cannot be edited.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">💊</div>
          <p className="text-slate-400">No prescriptions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <Card key={rx.id} className="p-5">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">Diagnosis: {rx.diagnosis}</h3>
                  <p className="text-teal-400 text-sm mt-1">
                    Dr. {rx.doctor.user.firstName} {rx.doctor.user.lastName}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">{new Date(rx.appointment.dateTime).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setExpanded(expanded === rx.id ? null : rx.id)}>
                    {expanded === rx.id ? "Collapse" : "View Details"}
                  </Button>
                  <Button onClick={() => handleDownload(rx.id)}>
                    ⬇ PDF
                  </Button>
                </div>
              </div>

              {expanded === rx.id && (
                <div className="mt-4 space-y-4 animate-fade-in-up">
                  {rx.notes && (
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <p className="text-slate-400 text-xs mb-1">Doctor's Notes</p>
                      <p className="text-slate-300 text-sm">{rx.notes}</p>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-800">
                          <th className="text-left text-slate-400 pb-2 pr-4">Medicine</th>
                          <th className="text-left text-slate-400 pb-2 pr-4">Dosage</th>
                          <th className="text-left text-slate-400 pb-2 pr-4">Frequency</th>
                          <th className="text-left text-slate-400 pb-2 pr-4">Duration</th>
                          <th className="text-left text-slate-400 pb-2">Instructions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rx.items.map((item) => (
                          <tr key={item.id} className="border-b border-slate-900">
                            <td className="py-2 pr-4 text-white font-medium">{item.medicineName}</td>
                            <td className="py-2 pr-4 text-slate-300">{item.dosage}</td>
                            <td className="py-2 pr-4 text-slate-300">{item.frequency}</td>
                            <td className="py-2 pr-4 text-slate-300">{item.duration}</td>
                            <td className="py-2 text-slate-400">{item.instructions || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
