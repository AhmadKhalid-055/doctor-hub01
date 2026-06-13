"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export default function DoctorSchedulePage() {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
  });

  const fetchAvailability = async () => {
    try {
      const res = await fetch("/api/availabilities");
      const data = await res.json();
      if (res.ok) setAvailability(data.data || []);
    } catch {
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAvailability(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/availabilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save schedule");
      toast.success("Schedule saved!");
      setShowDialog(false);
      fetchAvailability();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/availabilities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to remove slot");
      toast.success("Availability removed");
      fetchAvailability();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Schedule</h1>
          <p className="text-slate-400 text-sm mt-1">Set your working days and available time slots.</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>+ Add Availability</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Loading schedule...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day, index) => {
            const slot = availability.find((a) => a.dayOfWeek === index);
            return (
              <Card key={day} className={`p-5 ${slot ? "border-teal-500/30" : "opacity-50"}`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-semibold">{day}</h3>
                  {slot && (
                    <button onClick={() => handleDelete(slot.id)} className="text-red-400 hover:text-red-300 text-xs transition">Remove</button>
                  )}
                </div>
                {slot ? (
                  <div className="space-y-1 text-sm">
                    <p className="text-teal-400">🕐 {slot.startTime} – {slot.endTime}</p>
                    <p className="text-slate-400">⏱ {slot.slotDuration}-minute slots</p>
                    <p className="text-slate-500">
                      ≈ {Math.floor(
                        (parseInt(slot.endTime.split(":")[0]) * 60 + parseInt(slot.endTime.split(":")[1]) -
                          parseInt(slot.startTime.split(":")[0]) * 60 - parseInt(slot.startTime.split(":")[1])) / slot.slotDuration
                      )} slots available
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">No availability set</p>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showDialog} onClose={() => setShowDialog(false)} title="Set Availability" size="md">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Day of Week</label>
            <select
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-teal-500 transition"
              value={form.dayOfWeek}
              onChange={(e) => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })}
            >
              {DAYS.map((day, idx) => (
                <option key={day} value={idx}>{day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              label="Start Time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <Input
              type="time"
              label="End Time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Slot Duration (minutes)</label>
            <select
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-teal-500 transition"
              value={form.slotDuration}
              onChange={(e) => setForm({ ...form, slotDuration: parseInt(e.target.value) })}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <Button className="w-full" onClick={handleSave} isLoading={saving}>
            Save Availability
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
