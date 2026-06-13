"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface MedicalRecord {
  id: string;
  recordType: string;
  title: string;
  description: string;
  attachmentUrl: string | null;
  recordedBy: string;
  recordedAt: string;
}

export default function PatientMedicalHistoryPage() {
  const { toast } = useToast();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/medical-records");
      const data = await res.json();
      if (res.ok) setRecords(data.data || []);
    } catch {
      toast.error("Failed to load medical history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, []);

  const recordTypeColors: Record<string, string> = {
    "Lab Report": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Prescription": "bg-teal-500/20 text-teal-400 border-teal-500/30",
    "Diagnosis": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Surgery": "bg-red-500/20 text-red-400 border-red-500/30",
    "Vaccination": "bg-green-500/20 text-green-400 border-green-500/30",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Medical History</h1>
        <p className="text-slate-400 text-sm mt-1">Your complete medical history. Records cannot be edited or deleted.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading medical history...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🏥</div>
          <p className="text-slate-400">No medical records yet.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800 hidden md:block" />
          <div className="space-y-4">
            {records.map((record) => (
              <div key={record.id} className="relative flex gap-6">
                {/* Timeline dot */}
                <div className="hidden md:flex w-12 h-12 rounded-full bg-slate-800 border-2 border-teal-500 items-center justify-center flex-shrink-0 z-10 text-lg">
                  🗂️
                </div>
                <Card className="flex-1 p-5">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{record.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">Recorded by {record.recordedBy}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${recordTypeColors[record.recordType] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
                        {record.recordType}
                      </span>
                      <span className="text-slate-500 text-xs">{new Date(record.recordedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{record.description}</p>
                  {record.attachmentUrl && (
                    <a href={record.attachmentUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-teal-400 text-sm mt-3 hover:text-teal-300 transition">
                      📎 View Attachment
                    </a>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
