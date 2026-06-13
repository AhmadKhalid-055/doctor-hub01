"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/hooks/use-auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setAuth(data.user, "placeholder-token-managed-in-cookies");
      toast.success("Login successful!");
      
      // Redirect based on role
      const role = data.user.role.toLowerCase().replace("_", "-");
      router.push(`/dashboard/${role}`);
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
          <div className="w-12 h-12 rounded-xl gradient-teal flex items-center justify-center font-bold text-white text-xl shadow-lg mx-auto mb-4">D</div>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-slate-400 mt-2">Sign in to your Doctor Hub account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
          />
          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
            <div className="text-right">
              <Link href="/forgot-password" className="text-xs text-teal-400 hover:text-teal-300 transition">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link href="/register" className="text-teal-400 font-medium hover:text-teal-300 transition">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
