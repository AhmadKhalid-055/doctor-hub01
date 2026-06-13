"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentUploadPage({ params }: { params: { id: string } }) {
  const { id: paymentId } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) {
      toast.error("Please select a payment screenshot first");
      return;
    }
    setUploading(true);
    try {
      const res = await fetch(`/api/payments/${paymentId}/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ screenshotUrl: preview }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast.success("Payment screenshot submitted! Awaiting verification.");
      router.push("/dashboard/patient/appointments");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Payment</h1>
        <p className="text-slate-400 text-sm mt-1">Upload your payment screenshot to confirm your appointment booking.</p>
      </div>

      <Card className="p-6 space-y-6">
        <label
          htmlFor="screenshot"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-teal-500 transition-colors group"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-xl" />
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-3">📷</div>
              <p className="text-slate-400 text-sm group-hover:text-teal-400 transition-colors">Click to upload or drag & drop</p>
              <p className="text-slate-600 text-xs mt-1">PNG, JPG, JPEG accepted</p>
            </div>
          )}
          <input id="screenshot" type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>

        {preview && (
          <button onClick={() => setPreview(null)} className="text-xs text-slate-500 hover:text-red-400 transition">
            ✕ Remove and re-upload
          </button>
        )}

        <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
          ⚠️ Your appointment will only be confirmed after an assistant verifies your payment screenshot.
        </div>

        <Button className="w-full" onClick={handleUpload} isLoading={uploading} disabled={!preview}>
          Submit Payment Screenshot
        </Button>
      </Card>
    </div>
  );
}
