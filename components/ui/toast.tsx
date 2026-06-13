"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const typeStyles = {
  success: "border-emerald-500/50 bg-emerald-900/30 text-emerald-300",
  error:   "border-red-500/50    bg-red-900/30    text-red-300",
  info:    "border-teal-500/50   bg-teal-900/30   text-teal-300",
  warning: "border-yellow-500/50 bg-yellow-900/30 text-yellow-300",
};

const typeIcons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };

export function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium",
            "backdrop-blur-md pointer-events-auto animate-fade-in-up",
            typeStyles[toast.type]
          )}
        >
          <span className="text-base">{typeIcons[toast.type]}</span>
          <span>{toast.message}</span>
          <button
            onClick={() => onDismiss(toast.id)}
            className="ml-2 opacity-60 hover:opacity-100 transition"
            aria-label="Dismiss"
          >✕</button>
        </div>
      ))}
    </div>
  );
}

// Simple standalone hook for toast management
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), 4000);
  };

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return { toasts, dismiss, toast: { success: (m: string) => add(m, "success"), error: (m: string) => add(m, "error"), info: (m: string) => add(m, "info"), warning: (m: string) => add(m, "warning") } };
}
