"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

interface Payment {
  id: string;
  amount: string | number;
  status: string;
  screenshotUrl: string | null;
  createdAt: string;
  patient: { user: { firstName: string; lastName: string; email: string } };
  appointment: {
    dateTime: string;
    doctor: { user: { firstName: string; lastName: string } };
    clinic: { name: string };
  };
}

export default function AssistantPaymentsPage() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/assistant/payments/list");
      const data = await res.json();
      if (res.ok) setPayments(data.data || []);
    } catch (e) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleVerify = async (status: "COMPLETED" | "REJECTED") => {
    if (!selected) return;
    if (status === "REJECTED" && !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setProcessing(true);
    try {
      const res = await fetch(`/api/assistant/payments/${selected.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: status === "REJECTED" ? rejectionReason : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process payment");
      toast.success(data.message);
      setSelected(null);
      setRejectionReason("");
      fetchPayments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment Verification Queue</h1>
        <p className="text-slate-400 text-sm mt-1">Review and verify submitted payment screenshots.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading payment queue...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-slate-400">No pending payments to verify.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <p className="text-white font-semibold">
                  {payment.patient.user.firstName} {payment.patient.user.lastName}
                </p>
                <p className="text-slate-400 text-sm">{payment.patient.user.email}</p>
                <p className="text-slate-400 text-sm">
                  Dr. {payment.appointment.doctor.user.firstName} {payment.appointment.doctor.user.lastName}
                  {" · "}{payment.appointment.clinic.name}
                </p>
                <p className="text-slate-500 text-xs">{new Date(payment.appointment.dateTime).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-teal-400 font-bold text-lg">${Number(payment.amount).toFixed(2)}</span>
                <Button onClick={() => setSelected(payment)} variant="outline">
                  Review Screenshot
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selected} onClose={() => { setSelected(null); setRejectionReason(""); }} title="Verify Payment" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Patient</p>
                <p className="text-white font-medium">{selected.patient.user.firstName} {selected.patient.user.lastName}</p>
              </div>
              <div>
                <p className="text-slate-400">Amount</p>
                <p className="text-teal-400 font-bold text-lg">${Number(selected.amount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-400">Doctor</p>
                <p className="text-white">Dr. {selected.appointment.doctor.user.firstName} {selected.appointment.doctor.user.lastName}</p>
              </div>
              <div>
                <p className="text-slate-400">Clinic</p>
                <p className="text-white">{selected.appointment.clinic.name}</p>
              </div>
            </div>

            {selected.screenshotUrl ? (
              <div className="rounded-xl overflow-hidden border border-slate-700">
                <img src={selected.screenshotUrl} alt="Payment Screenshot" className="w-full max-h-64 object-contain bg-slate-900" />
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 border border-slate-700 rounded-xl">No screenshot uploaded</div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Rejection Reason (required if rejecting)</label>
              <textarea
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-red-500 transition min-h-[80px]"
                placeholder="Reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                isLoading={processing}
                onClick={() => handleVerify("REJECTED")}
              >
                Reject Payment
              </Button>
              <Button
                className="flex-1"
                isLoading={processing}
                onClick={() => handleVerify("COMPLETED")}
              >
                Approve & Confirm
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
