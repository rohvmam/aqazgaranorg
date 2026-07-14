import type { ZodType } from "zod";
import { prisma } from "@/lib/prisma";
import type { AppRole } from "@/lib/auth";
import {
  calendarEventSchema,
  clientSchema,
  contactSubmissionSchema,
  dealSchema,
  eventSchema,
  investmentSchema,
  invoiceSchema,
  jobOpeningSchema,
  marketplaceSchema,
  newsPostSchema,
  notificationSchema,
  partnerSchema,
  platformSchema,
  projectSchema,
  taskSchema,
  tradeRequestSchema,
  transactionSchema,
} from "@/lib/validators";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Delegate = {
  findMany: (args?: any) => Promise<any[]>;
  findUnique: (args: any) => Promise<any>;
  create: (args: any) => Promise<any>;
  update: (args: any) => Promise<any>;
  delete: (args: any) => Promise<any>;
  count: (args?: any) => Promise<number>;
};

export type EntityConfig = {
  delegate: Delegate;
  schema: ZodType;
  /** Fields matched by the `q` search param (string contains) */
  searchFields: string[];
  /** Minimum role for write operations (reads need any session) */
  writeRole: AppRole;
  orderBy?: Record<string, "asc" | "desc">;
  include?: Record<string, unknown>;
  label: string;
};

export const ENTITIES: Record<string, EntityConfig> = {
  clients: {
    delegate: prisma.client,
    schema: clientSchema,
    searchFields: ["nameEn", "nameFa", "company", "email", "country"],
    writeRole: "ANALYST",
    orderBy: { createdAt: "desc" },
    label: "client",
  },
  partners: {
    delegate: prisma.partner,
    schema: partnerSchema,
    searchFields: ["nameEn", "nameFa", "country"],
    writeRole: "MANAGER",
    orderBy: { since: "desc" },
    label: "partner",
  },
  projects: {
    delegate: prisma.project,
    schema: projectSchema,
    searchFields: ["titleEn", "titleFa", "sector", "country", "slug"],
    writeRole: "MANAGER",
    orderBy: { startDate: "desc" },
    include: { client: { select: { nameEn: true, nameFa: true } } },
    label: "project",
  },
  investments: {
    delegate: prisma.investment,
    schema: investmentSchema,
    searchFields: ["titleEn", "titleFa", "sector"],
    writeRole: "MANAGER",
    orderBy: { date: "desc" },
    label: "investment",
  },
  deals: {
    delegate: prisma.deal,
    schema: dealSchema,
    searchFields: ["titleEn", "titleFa", "counterparty", "country"],
    writeRole: "ANALYST",
    orderBy: { updatedAt: "desc" },
    include: { owner: { select: { name: true } } },
    label: "deal",
  },
  "trade-requests": {
    delegate: prisma.tradeRequest,
    schema: tradeRequestSchema,
    searchFields: ["refCode", "commodity", "originCountry", "destinationCountry"],
    writeRole: "ANALYST",
    orderBy: { createdAt: "desc" },
    include: { client: { select: { nameEn: true, nameFa: true } } },
    label: "trade request",
  },
  platforms: {
    delegate: prisma.platform,
    schema: platformSchema,
    searchFields: ["nameEn", "nameFa"],
    writeRole: "MANAGER",
    orderBy: { users: "desc" },
    label: "platform",
  },
  marketplace: {
    delegate: prisma.marketplaceListing,
    schema: marketplaceSchema,
    searchFields: ["titleEn", "titleFa", "category", "sellerName"],
    writeRole: "ANALYST",
    orderBy: { updatedAt: "desc" },
    label: "listing",
  },
  invoices: {
    delegate: prisma.invoice,
    schema: invoiceSchema,
    searchFields: ["number"],
    writeRole: "ANALYST",
    orderBy: { issueDate: "desc" },
    include: { client: { select: { nameEn: true, nameFa: true } }, items: true },
    label: "invoice",
  },
  transactions: {
    delegate: prisma.transaction,
    schema: transactionSchema,
    searchFields: ["category", "description", "ref"],
    writeRole: "MANAGER",
    orderBy: { date: "desc" },
    label: "transaction",
  },
  tasks: {
    delegate: prisma.task,
    schema: taskSchema,
    searchFields: ["title", "description"],
    writeRole: "VIEWER",
    orderBy: { createdAt: "desc" },
    include: {
      assignee: { select: { name: true } },
      project: { select: { titleEn: true, titleFa: true } },
    },
    label: "task",
  },
  "calendar-events": {
    delegate: prisma.calendarEvent,
    schema: calendarEventSchema,
    searchFields: ["title", "location"],
    writeRole: "VIEWER",
    orderBy: { start: "asc" },
    label: "calendar event",
  },
  notifications: {
    delegate: prisma.notification,
    schema: notificationSchema,
    searchFields: ["title", "body"],
    writeRole: "VIEWER",
    orderBy: { createdAt: "desc" },
    label: "notification",
  },
  news: {
    delegate: prisma.newsPost,
    schema: newsPostSchema,
    searchFields: ["titleEn", "titleFa", "category", "slug"],
    writeRole: "MANAGER",
    orderBy: { publishedAt: "desc" },
    label: "news post",
  },
  events: {
    delegate: prisma.event,
    schema: eventSchema,
    searchFields: ["titleEn", "titleFa", "location", "slug"],
    writeRole: "MANAGER",
    orderBy: { startDate: "desc" },
    label: "event",
  },
  jobs: {
    delegate: prisma.jobOpening,
    schema: jobOpeningSchema,
    searchFields: ["titleEn", "titleFa", "departmentEn", "location"],
    writeRole: "MANAGER",
    orderBy: { postedAt: "desc" },
    label: "job opening",
  },
  contacts: {
    delegate: prisma.contactSubmission,
    schema: contactSubmissionSchema,
    searchFields: ["name", "email", "topic", "company"],
    writeRole: "ANALYST",
    orderBy: { createdAt: "desc" },
    label: "contact submission",
  },
};

export async function logActivity(
  userId: string | undefined,
  action: string,
  entity: string,
  entityId?: string,
  detail?: string,
) {
  await prisma.activityLog.create({
    data: { userId, action, entity, entityId, detail },
  });
}
