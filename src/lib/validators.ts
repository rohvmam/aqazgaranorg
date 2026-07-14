import { z } from "zod";

const money = z.coerce.number().min(0);
const date = z.coerce.date();

export const clientSchema = z.object({
  nameEn: z.string().min(1),
  nameFa: z.string().min(1),
  company: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  country: z.string().min(1),
  status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).default("LEAD"),
  value: money.default(0),
  notes: z.string().optional().nullable(),
});

export const partnerSchema = z.object({
  nameEn: z.string().min(1),
  nameFa: z.string().min(1),
  type: z.enum(["STRATEGIC", "FINANCIAL", "TECHNOLOGY", "LOGISTICS"]),
  country: z.string().min(1),
  website: z.string().url().optional().nullable().or(z.literal("")),
  since: date,
  status: z.enum(["ACTIVE", "PAUSED"]).default("ACTIVE"),
});

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  summaryEn: z.string().min(1),
  summaryFa: z.string().min(1),
  bodyEn: z.string().optional().nullable(),
  bodyFa: z.string().optional().nullable(),
  sector: z.string().min(1),
  country: z.string().min(1),
  status: z.enum(["PLANNING", "ACTIVE", "COMPLETED", "ON_HOLD"]).default("PLANNING"),
  value: money.default(0),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  featured: z.coerce.boolean().default(false),
  startDate: date,
  endDate: date.optional().nullable(),
  clientId: z.string().optional().nullable(),
});

export const investmentSchema = z.object({
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  sector: z.string().min(1),
  stage: z.enum(["SEED", "GROWTH", "EXPANSION", "MATURE"]),
  amount: money,
  currency: z.string().default("USD"),
  irr: z.coerce.number().optional().nullable(),
  status: z.enum(["ACTIVE", "EXITED", "HOLD"]).default("ACTIVE"),
  date,
  notes: z.string().optional().nullable(),
});

export const dealSchema = z.object({
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  counterparty: z.string().min(1),
  country: z.string().min(1),
  direction: z.enum(["INBOUND", "OUTBOUND"]),
  value: money,
  currency: z.string().default("USD"),
  stage: z
    .enum(["PROSPECT", "NEGOTIATION", "CONTRACT", "CLOSED_WON", "CLOSED_LOST"])
    .default("PROSPECT"),
  closeDate: date.optional().nullable(),
  ownerId: z.string().optional().nullable(),
});

export const tradeRequestSchema = z.object({
  refCode: z.string().min(1),
  type: z.enum(["IMPORT", "EXPORT"]),
  commodity: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unit: z.string().min(1),
  originCountry: z.string().min(1),
  destinationCountry: z.string().min(1),
  incoterm: z.string().default("FOB"),
  status: z
    .enum(["RECEIVED", "REVIEW", "QUOTED", "IN_TRANSIT", "DELIVERED", "CANCELLED"])
    .default("RECEIVED"),
  value: money.default(0),
  clientId: z.string().optional().nullable(),
});

export const platformSchema = z.object({
  nameEn: z.string().min(1),
  nameFa: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionFa: z.string().min(1),
  url: z.string().url().optional().nullable().or(z.literal("")),
  status: z.enum(["LIVE", "BETA", "DEVELOPMENT"]).default("DEVELOPMENT"),
  users: z.coerce.number().int().min(0).default(0),
  growth: z.coerce.number().default(0),
});

export const marketplaceSchema = z.object({
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  category: z.string().min(1),
  price: money,
  currency: z.string().default("USD"),
  stock: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "PAUSED", "SOLD_OUT"]).default("ACTIVE"),
  sellerName: z.string().min(1),
});

export const invoiceSchema = z.object({
  number: z.string().min(1),
  clientId: z.string().min(1),
  issueDate: date,
  dueDate: date,
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"]).default("DRAFT"),
  currency: z.string().default("USD"),
  total: money.default(0),
});

export const transactionSchema = z.object({
  date,
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  category: z.string().min(1),
  amount: money,
  currency: z.string().default("USD"),
  description: z.string().optional().nullable(),
  ref: z.string().optional().nullable(),
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  dueDate: date.optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

export const calendarEventSchema = z.object({
  title: z.string().min(1),
  start: date,
  end: date.optional().nullable(),
  type: z.enum(["MEETING", "DEADLINE", "TRAVEL", "EVENT"]).default("MEETING"),
  location: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const notificationSchema = z.object({
  userId: z.string().optional().nullable(),
  title: z.string().min(1),
  body: z.string().min(1),
  type: z.enum(["INFO", "SUCCESS", "WARNING", "ALERT"]).default("INFO"),
  read: z.coerce.boolean().default(false),
});

export const newsPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  excerptEn: z.string().min(1),
  excerptFa: z.string().min(1),
  bodyEn: z.string().min(1),
  bodyFa: z.string().min(1),
  category: z.string().min(1),
  published: z.coerce.boolean().default(true),
  publishedAt: date.optional().nullable(),
  readMinutes: z.coerce.number().int().min(1).default(4),
});

export const eventSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  descriptionEn: z.string().min(1),
  descriptionFa: z.string().min(1),
  location: z.string().min(1),
  startDate: date,
  endDate: date.optional().nullable(),
  type: z.enum(["SUMMIT", "EXPO", "WEBINAR", "FORUM"]).default("SUMMIT"),
  registrationUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export const jobOpeningSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  titleEn: z.string().min(1),
  titleFa: z.string().min(1),
  departmentEn: z.string().min(1),
  departmentFa: z.string().min(1),
  location: z.string().min(1),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "REMOTE"]).default("FULL_TIME"),
  descriptionEn: z.string().min(1),
  descriptionFa: z.string().min(1),
  open: z.coerce.boolean().default(true),
});

export const contactSubmissionSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().nullable(),
  topic: z.string().min(1),
  message: z.string().min(10),
  status: z.enum(["NEW", "IN_REVIEW", "RESPONDED", "ARCHIVED"]).default("NEW"),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[0-9]/, "One digit"),
});
