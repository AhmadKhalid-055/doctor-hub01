import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["PATIENT", "DOCTOR", "ASSISTANT", "ADMIN"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const doctorSearchSchema = z.object({
  query: z.string().optional(),
  treatmentType: z.enum(["ALLOPATHIC", "HOMEOPATHIC", "HERBAL"]).optional(),
  specialty: z.string().optional(),
  sortBy: z.enum(["rating_desc", "fee_asc", "fee_desc", "experience_desc"]).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export const bookAppointmentSchema = z.object({
  doctorId: z.string().uuid(),
  clinicId: z.string().uuid(),
  dateTime: z.string().datetime(), // ISO string
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const prescriptionSchema = z.object({
  appointmentId: z.string().uuid(),
  patientId: z.string().uuid(),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      medicineName: z.string().min(1, "Medicine name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      duration: z.string().min(1, "Duration is required"),
      instructions: z.string().optional(),
    })
  ).min(1, "At least one medicine must be prescribed"),
});

export const paymentVerificationSchema = z.object({
  status: z.enum(["COMPLETED", "REJECTED"]),
  rejectionReason: z.string().optional(),
});
