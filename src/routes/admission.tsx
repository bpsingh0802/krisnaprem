import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitAdmission } from "@/lib/sheets.functions";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHero, FadeIn } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admission")({
  head: () => ({ meta: [
    { title: "Online Admission — Krishna Prem Jyoti Trust" },
    { name: "description", content: "Apply online for free admission to Krishna Prem Jyoti Trust's pathshala and welfare programs." },
  ]}),
  component: AdmissionPage,
});

const schema = z.object({
  // Personal
  studentName: z.string().trim().min(2, "Name is required").max(80),
  age: z.string().regex(/^\d{1,3}$/, "Enter a valid age"),
  gender: z.string().min(1, "Select gender"),
  bloodGroup: z.string().max(10).optional().default(""),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  address: z.string().trim().min(5, "Address is required").max(300),
  // Family
  fatherName: z.string().trim().min(2, "Father's name is required").max(80),
  motherName: z.string().trim().min(2, "Mother's name is required").max(80),
  familyIncome: z.string().max(30).optional().default(""),
  casteCategory: z.string().min(1, "Select category"),
  // Education
  studentClass: z.string().min(1, "Class is required").max(50),
  qualification: z.string().max(100).optional().default(""),
  schoolName: z.string().trim().min(2).max(120),
  // Disability
  disabilityStatus: z.enum(["Yes", "No"]),
  isBlind: z.enum(["Yes", "No"]),
  disabilityDetails: z.string().max(300).optional().default(""),
  // Guardian
  guardianName: z.string().max(80).optional().default(""),
  emergencyContact: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit number"),
});
type FormData = z.input<typeof schema>;

function AdmissionPage() {
  const [submitted, setSubmitted] = useState(false);
  const submitFn = useServerFn(submitAdmission);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { disabilityStatus: "No", isBlind: "No" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await submitFn({ data });
      toast.success("Application submitted! We will contact you shortly.");
      setSubmitted(true);
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Submission failed. Please try again.");
    }
  };

  const gender = watch("gender");
  const bloodGroup = watch("bloodGroup");
  const casteCategory = watch("casteCategory");
  const disabilityStatus = watch("disabilityStatus");
  const isBlind = watch("isBlind");

  return (
    <SiteLayout>
      <PageHero eyebrow="Admission" title="Begin a new chapter"
        subtitle="Free education, books, uniforms and meals — apply online in minutes." />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <FadeIn>
              <div className="rounded-3xl bg-card border border-gold/40 p-12 text-center shadow-glow">
                <CheckCircle2 className="h-16 w-16 mx-auto text-primary" />
                <h2 className="mt-4 font-display text-3xl font-semibold">Application Received</h2>
                <p className="mt-3 text-muted-foreground">Thank you. Our admission team will contact you within 3 working days.</p>
                <Button onClick={() => setSubmitted(false)} className="mt-6 bg-gradient-saffron text-primary-foreground">Submit another</Button>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl bg-card border border-border p-8 md:p-10 shadow-card space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="h-12 w-12 rounded-xl bg-gradient-saffron grid place-items-center text-primary-foreground"><GraduationCap className="h-6 w-6" /></div>
                  <div>
                    <h2 className="font-display text-2xl font-semibold">Student Admission Form</h2>
                    <p className="text-sm text-muted-foreground">Please fill all sections carefully</p>
                  </div>
                </div>

                <Section title="Student Personal Details">
                  <Field label="Full Name" error={errors.studentName?.message}><Input {...register("studentName")} /></Field>
                  <Field label="Age" error={errors.age?.message}><Input type="number" min={1} max={120} {...register("age")} /></Field>
                  <Field label="Gender" error={errors.gender?.message}>
                    <Select value={gender} onValueChange={(v) => setValue("gender", v, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Blood Group" error={errors.bloodGroup?.message}>
                    <Select value={bloodGroup} onValueChange={(v) => setValue("bloodGroup", v, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["A+","A-","B+","B-","AB+","AB-","O+","O-","Unknown"].map(b => (
                          <SelectItem key={b} value={b}>{b}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Mobile Number" error={errors.mobile?.message}><Input type="tel" maxLength={10} {...register("mobile")} /></Field>
                  <Field label="Aadhaar Number" error={errors.aadhaar?.message}><Input maxLength={12} {...register("aadhaar")} /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Address" error={errors.address?.message}><Textarea rows={2} {...register("address")} /></Field>
                  </div>
                </Section>

                <Section title="Family Details">
                  <Field label="Father's Name" error={errors.fatherName?.message}><Input {...register("fatherName")} /></Field>
                  <Field label="Mother's Name" error={errors.motherName?.message}><Input {...register("motherName")} /></Field>
                  <Field label="Family Yearly Income (₹)" error={errors.familyIncome?.message}><Input placeholder="e.g. 80000" {...register("familyIncome")} /></Field>
                  <Field label="Caste Category" error={errors.casteCategory?.message}>
                    <Select value={casteCategory} onValueChange={(v) => setValue("casteCategory", v, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["General","OBC","SC","ST","EWS","Other"].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </Section>

                <Section title="Education Details">
                  <Field label="Current Study / Class" error={errors.studentClass?.message}><Input placeholder="e.g. 6th" {...register("studentClass")} /></Field>
                  <Field label="Highest Qualification Passed" error={errors.qualification?.message}><Input placeholder="e.g. 5th Pass" {...register("qualification")} /></Field>
                  <div className="sm:col-span-2">
                    <Field label="School / College Name" error={errors.schoolName?.message}><Input {...register("schoolName")} /></Field>
                  </div>
                </Section>

                <Section title="Disability Information">
                  <Field label="Disability Status" error={errors.disabilityStatus?.message}>
                    <Select value={disabilityStatus} onValueChange={(v) => setValue("disabilityStatus", v as "Yes"|"No", { shouldValidate: true })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Blind" error={errors.isBlind?.message}>
                    <Select value={isBlind} onValueChange={(v) => setValue("isBlind", v as "Yes"|"No", { shouldValidate: true })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Other Disability Details (if any)" error={errors.disabilityDetails?.message}>
                      <Textarea rows={2} placeholder="Describe any other disability" {...register("disabilityDetails")} />
                    </Field>
                  </div>
                </Section>

                <Section title="Guardian & Emergency">
                  <Field label="Guardian Name" error={errors.guardianName?.message}><Input {...register("guardianName")} /></Field>
                  <Field label="Emergency Contact Number" error={errors.emergencyContact?.message}><Input type="tel" maxLength={10} {...register("emergencyContact")} /></Field>
                </Section>

                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full bg-gradient-saffron text-primary-foreground shadow-glow">
                  {isSubmitting ? "Submitting…" : "Submit Application"}
                </Button>
              </form>
            </FadeIn>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-primary border-l-4 border-primary pl-3">{title}</h3>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
