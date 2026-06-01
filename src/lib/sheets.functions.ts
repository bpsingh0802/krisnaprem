import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SHEET_ID = "14UPD2KeFa3yxBwNDh9Swl8iynogv6SNGfhDgj0puq68";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

const ADMIN_EMAIL = "krishnapremjyoti@gmail.com";
const ADMIN_PASSWORD = "KrishnaJyoti@1234";
const ADMIN_TOKEN = "kpj-admin-9f2c8b1a7e6d4c5b";

function authHeaders() {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");
  if (!GOOGLE_SHEETS_API_KEY) throw new Error("GOOGLE_SHEETS_API_KEY missing");
  return {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": GOOGLE_SHEETS_API_KEY,
    "Content-Type": "application/json",
  };
}

async function appendRow(tab: string, row: (string | number)[]) {
  const url = `${GATEWAY}/spreadsheets/${SHEET_ID}/values/${tab}!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets append failed [${res.status}]: ${text}`);
  }
}

async function readRows(tab: string): Promise<string[][]> {
  const url = `${GATEWAY}/spreadsheets/${SHEET_ID}/values/${tab}!A2:Z10000`;
  const res = await fetch(url, { method: "GET", headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sheets read failed [${res.status}]: ${text}`);
  }
  const json = (await res.json()) as { values?: string[][] };
  return json.values ?? [];
}

const admissionSchema = z.object({
  studentName: z.string().min(1).max(100),
  age: z.string().min(1).max(3),
  gender: z.string().min(1).max(20),
  bloodGroup: z.string().max(10).optional().default(""),
  mobile: z.string().min(10).max(15),
  aadhaar: z.string().min(12).max(12),
  address: z.string().min(1).max(500),
  fatherName: z.string().min(1).max(100),
  motherName: z.string().min(1).max(100),
  familyIncome: z.string().max(50).optional().default(""),
  casteCategory: z.string().max(30).optional().default(""),
  studentClass: z.string().min(1).max(50),
  qualification: z.string().max(100).optional().default(""),
  schoolName: z.string().min(1).max(150),
  disabilityStatus: z.string().max(5).optional().default("No"),
  isBlind: z.string().max(5).optional().default("No"),
  disabilityDetails: z.string().max(300).optional().default(""),
  guardianName: z.string().max(100).optional().default(""),
  emergencyContact: z.string().max(15).optional().default(""),
});

export const submitAdmission = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => admissionSchema.parse(d))
  .handler(async ({ data }) => {
    await appendRow("Admissions", [
      new Date().toISOString(),
      data.studentName,
      data.age,
      data.gender,
      data.bloodGroup,
      data.mobile,
      data.aadhaar,
      data.address,
      data.fatherName,
      data.motherName,
      data.familyIncome,
      data.casteCategory,
      data.studentClass,
      data.qualification,
      data.schoolName,
      data.disabilityStatus,
      data.isBlind,
      data.disabilityDetails,
      data.guardianName,
      data.emergencyContact,
    ]);
    return { ok: true };
  });

const MEALS = ["breakfast", "lunch", "dinner"] as const;
type MealId = (typeof MEALS)[number];

const feedingSchema = z.object({
  donorName: z.string().min(1).max(100),
  mobile: z.string().max(15).optional().default(""),
  email: z.string().max(150).optional().default(""),
  date: z.string().min(1).max(20),
  meal: z.enum(MEALS),
  occasion: z.string().max(200).optional().default(""),
  amount: z.number().min(0).max(10000000).optional().default(0),
  message: z.string().max(500).optional().default(""),
});

// Read raw feeding rows -> latest status per (date,meal)
async function loadMealStatusMap(): Promise<Record<string, Record<MealId, string>>> {
  const rows = await readRows("Feeding");
  const map: Record<string, Record<MealId, string>> = {};
  for (const r of rows) {
    const date = (r[4] ?? "").trim();
    const meal = (r[5] ?? "").trim().toLowerCase() as MealId;
    const status = (r[8] ?? "Booked").trim();
    if (!date || !MEALS.includes(meal)) continue;
    if (!map[date]) map[date] = { breakfast: "", lunch: "", dinner: "" };
    map[date][meal] = status;
  }
  return map;
}

export const submitFeeding = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => feedingSchema.parse(d))
  .handler(async ({ data }) => {
    const map = await loadMealStatusMap();
    const current = map[data.date]?.[data.meal as MealId];
    if (current === "Booked" || current === "Blocked") {
      throw new Error(`${data.meal} on ${data.date} is no longer available`);
    }
    await appendRow("Feeding", [
      new Date().toISOString(),
      data.donorName,
      data.mobile,
      data.email,
      data.date,
      data.meal,
      data.occasion,
      data.amount,
      "Booked",
      data.message,
    ]);
    return { ok: true };
  });

// Public availability — returns {date: {breakfast,lunch,dinner}} status map
export const getMealAvailability = createServerFn({ method: "GET" })
  .handler(async () => {
    return await loadMealStatusMap();
  });

const donationSchema = z.object({
  donorName: z.string().min(1).max(100),
  mobile: z.string().max(15).optional().default(""),
  amount: z.number().min(1).max(10000000),
  note: z.string().max(500).optional().default(""),
});

export const submitDonation = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => donationSchema.parse(d))
  .handler(async ({ data }) => {
    await appendRow("Donations", [
      new Date().toISOString(),
      data.donorName,
      data.mobile,
      data.amount,
      data.note,
    ]);
    return { ok: true };
  });

// --- Admin ---

const loginSchema = z.object({
  email: z.string().min(1).max(150),
  password: z.string().min(1).max(200),
});

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => loginSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.email.trim().toLowerCase() === ADMIN_EMAIL && data.password === ADMIN_PASSWORD) {
      return { ok: true, token: ADMIN_TOKEN };
    }
    throw new Error("Invalid credentials");
  });

const tokenSchema = z.object({ token: z.string().min(1).max(200) });

function requireAdmin(token: string) {
  if (token !== ADMIN_TOKEN) throw new Error("Unauthorized");
}

export const getAdmissions = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    requireAdmin(data.token);
    const rows = await readRows("Admissions");
    return rows.map((r) => ({
      timestamp: r[0] ?? "",
      studentName: r[1] ?? "",
      age: r[2] ?? "",
      gender: r[3] ?? "",
      bloodGroup: r[4] ?? "",
      mobile: r[5] ?? "",
      aadhaar: r[6] ?? "",
      address: r[7] ?? "",
      fatherName: r[8] ?? "",
      motherName: r[9] ?? "",
      familyIncome: r[10] ?? "",
      casteCategory: r[11] ?? "",
      studentClass: r[12] ?? "",
      qualification: r[13] ?? "",
      schoolName: r[14] ?? "",
      disabilityStatus: r[15] ?? "",
      isBlind: r[16] ?? "",
      disabilityDetails: r[17] ?? "",
      guardianName: r[18] ?? "",
      emergencyContact: r[19] ?? "",
    }));
  });

export const getFeedings = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    requireAdmin(data.token);
    const rows = await readRows("Feeding");
    return rows.map((r) => ({
      timestamp: r[0] ?? "",
      donorName: r[1] ?? "",
      mobile: r[2] ?? "",
      email: r[3] ?? "",
      date: r[4] ?? "",
      meal: r[5] ?? "",
      occasion: r[6] ?? "",
      amount: r[7] ?? "",
      status: r[8] ?? "Booked",
      message: r[9] ?? "",
    }));
  });

// Admin: append a status-override row to cancel a booking or block a meal slot
const adminMealActionSchema = z.object({
  token: z.string().min(1).max(200),
  date: z.string().min(1).max(20),
  meal: z.enum(MEALS),
  action: z.enum(["Cancelled", "Blocked", "Available"]),
  note: z.string().max(300).optional().default(""),
});

export const adminUpdateMealStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => adminMealActionSchema.parse(d))
  .handler(async ({ data }) => {
    requireAdmin(data.token);
    await appendRow("Feeding", [
      new Date().toISOString(),
      `ADMIN`,
      "",
      "",
      data.date,
      data.meal,
      data.note,
      0,
      data.action,
      `Admin action`,
    ]);
    return { ok: true };
  });

const blockDateSchema = z.object({
  token: z.string().min(1).max(200),
  date: z.string().min(1).max(20),
  note: z.string().max(300).optional().default(""),
});

export const adminBlockDate = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => blockDateSchema.parse(d))
  .handler(async ({ data }) => {
    requireAdmin(data.token);
    for (const meal of MEALS) {
      await appendRow("Feeding", [
        new Date().toISOString(), "ADMIN", "", "", data.date, meal, data.note, 0, "Blocked", "Admin block date",
      ]);
    }
    return { ok: true };
  });

export const getDonations = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    requireAdmin(data.token);
    const rows = await readRows("Donations");
    return rows.map((r) => ({
      timestamp: r[0] ?? "",
      donorName: r[1] ?? "",
      mobile: r[2] ?? "",
      amount: r[3] ?? "",
      note: r[4] ?? "",
    }));
  });
