"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { submitEnquiry } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  message: z.string().optional(),
  location: z.string().optional(),
  plot_dimensions: z.string().optional(),
  construction_type: z.string().optional(),
  floors: z.coerce.number().optional(),
  budget: z.string().optional(),
  preferred_visit_date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function EnquiryForm({
  enquiryType = "general",
  propertyId,
  title = "Send Enquiry",
}: {
  enquiryType?: "general" | "property" | "construction" | "site_visit";
  propertyId?: number;
  title?: string;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    try {
      await submitEnquiry({
        enquiry_type: enquiryType,
        property: propertyId,
        ...values,
        email: values.email || "",
      });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const showConstruction = enquiryType === "construction";
  const showVisit = enquiryType === "site_visit";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-soft">
      <h3 className="font-display text-xl text-navy-900">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input className="field" {...register("name")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className="field" {...register("phone")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="field" type="email" {...register("email")} />
        </Field>
        {showConstruction && (
          <>
            <Field label="Location">
              <input className="field" {...register("location")} />
            </Field>
            <Field label="Plot dimensions">
              <input className="field" placeholder="e.g. 40x60 ft" {...register("plot_dimensions")} />
            </Field>
            <Field label="Construction type">
              <input className="field" {...register("construction_type")} />
            </Field>
            <Field label="Number of floors">
              <input className="field" type="number" min={0} {...register("floors")} />
            </Field>
            <Field label="Approximate budget">
              <input className="field" {...register("budget")} />
            </Field>
          </>
        )}
        {showVisit && (
          <Field label="Preferred visit date">
            <input className="field" type="date" {...register("preferred_visit_date")} />
          </Field>
        )}
      </div>
      <Field label="Message" error={errors.message?.message}>
        <textarea className="field min-h-28" {...register("message")} />
      </Field>
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Submitting..." : "Submit Enquiry"}
      </Button>
      {status === "success" && <p className="text-sm text-emerald-700">Thank you. Our team will contact you shortly.</p>}
      {status === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again or call us directly.</p>}
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-navy-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}
