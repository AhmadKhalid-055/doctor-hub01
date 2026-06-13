"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces for the API response
interface Doctor {
  id: string;
  specialty: string;
  treatmentType: string;
  consultationFee: number;
  experienceYears: number;
  rating: number;
  diseasesTreated: string[];
  user: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  clinics: { name: string; city: string }[];
}

export default function DoctorSearchPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    query: "",
    specialty: "",
    treatmentType: "",
    sortBy: "rating_desc",
    page: 1,
  });
  
  const [meta, setMeta] = useState({ totalPages: 1 });

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.query) params.append("query", filters.query);
      if (filters.specialty) params.append("specialty", filters.specialty);
      if (filters.treatmentType) params.append("treatmentType", filters.treatmentType);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      params.append("page", filters.page.toString());

      const res = await fetch(`/api/doctors/search?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch doctors");

      setDoctors(data.data);
      setMeta(data.meta);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce the API call
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on filter change
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Find a Doctor</h1>
          <p className="text-slate-400">Search by specialty, disease, or treatment type.</p>
        </div>
      </div>

      <Card className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Search"
          placeholder="Name or disease..."
          value={filters.query}
          onChange={(e) => handleFilterChange("query", e.target.value)}
        />
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Specialty</label>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-teal-500 transition"
            value={filters.specialty}
            onChange={(e) => handleFilterChange("specialty", e.target.value)}
          >
            <option value="">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Neurology">Neurology</option>
            <option value="General Practice">General Practice</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Treatment Type</label>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-teal-500 transition"
            value={filters.treatmentType}
            onChange={(e) => handleFilterChange("treatmentType", e.target.value)}
          >
            <option value="">All Types</option>
            <option value="ALLOPATHIC">Allopathic</option>
            <option value="HOMEOPATHIC">Homeopathic</option>
            <option value="HERBAL">Herbal</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-300">Sort By</label>
          <select
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-teal-500 transition"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="rating_desc">Highest Rating</option>
            <option value="experience_desc">Most Experience</option>
            <option value="fee_asc">Fee (Low to High)</option>
            <option value="fee_desc">Fee (High to Low)</option>
          </select>
        </div>
      </Card>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Searching doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12 text-slate-400">No doctors found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Card key={doc.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center text-white font-bold text-lg">
                    {doc.user.firstName[0]}{doc.user.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Dr. {doc.user.firstName} {doc.user.lastName}</h3>
                    <p className="text-teal-400 text-sm">{doc.specialty}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Treatment</span>
                    <span className="text-white capitalize">{doc.treatmentType.toLowerCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Experience</span>
                    <span className="text-white">{doc.experienceYears} Years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Fee</span>
                    <span className="text-white font-medium">${doc.consultationFee.toString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Rating</span>
                    <span className="text-amber-400 font-medium">★ {doc.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => router.push(`/dashboard/patient/appointments/book/${doc.id}`)}
              >
                Book Appointment
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>
          <div className="flex items-center px-4 text-slate-300">
            Page {filters.page} of {meta.totalPages}
          </div>
          <Button
            variant="outline"
            disabled={filters.page === meta.totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
