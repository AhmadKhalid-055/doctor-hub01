"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setSubmitted(true);
      
      // Developer helper: show the simulated email link
      if (data._dev_resetLink) {
        toast.info("DEV MODE: Check console or use this link: " + data._dev_resetLink);
        console.log("DEV RESET LINK:", data._dev_resetLink);
      } else {
        toast.success("Reset link sent!");
      }
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md p-8 glass-card">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center font-bold text-white text-xl shadow-lg mx-auto mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-sm text-slate-400 mt-2">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 animate-fade-in-up">
            <div className="p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-400 text-sm">
              If an account with that email exists, we have sent a password reset link to it.
            </div>
            <Link href="/login" className="block w-full text-center py-2 text-sm text-slate-300 hover:text-white transition">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Send Reset Link
            </Button>
            
            <Link href="/login" className="block text-center mt-4 text-sm text-slate-400 hover:text-white transition">
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
