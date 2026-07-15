import type { EntityManagerConfig, FieldOption } from "./entity-types";

const opt = (value: string, en: string, fa: string): FieldOption => ({
  value,
  labelEn: en,
  labelFa: fa,
});

export const CLIENTS_CONFIG: EntityManagerConfig = {
  entity: "clients",
  columns: [
    { key: "name", labelEn: "Name", labelFa: "نام", localePair: true },
    { key: "company", labelEn: "Company", labelFa: "شرکت" },
    { key: "country", labelEn: "Country", labelFa: "کشور" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "value", labelEn: "Value", labelFa: "ارزش", type: "money" },
    { key: "createdAt", labelEn: "Created", labelFa: "ایجاد", type: "date" },
  ],
  fields: [
    { name: "nameEn", labelEn: "Name (EN)", labelFa: "نام (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "nameFa", labelEn: "Name (FA)", labelFa: "نام (فارسی)", type: "text", required: true },
    { name: "company", labelEn: "Company", labelFa: "شرکت", type: "text" },
    { name: "email", labelEn: "Email", labelFa: "ایمیل", type: "email", required: true, ltr: true },
    { name: "phone", labelEn: "Phone", labelFa: "تلفن", type: "text", ltr: true },
    { name: "country", labelEn: "Country", labelFa: "کشور", type: "text", required: true },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select", required: true,
      options: [opt("LEAD", "Lead", "سرنخ"), opt("ACTIVE", "Active", "فعال"), opt("INACTIVE", "Inactive", "غیرفعال")],
    },
    { name: "value", labelEn: "Value (USD)", labelFa: "ارزش (دلار)", type: "number" },
    { name: "notes", labelEn: "Notes", labelFa: "یادداشت", type: "textarea" },
  ],
};

export const PARTNERS_CONFIG: EntityManagerConfig = {
  entity: "partners",
  columns: [
    { key: "name", labelEn: "Name", labelFa: "نام", localePair: true },
    { key: "type", labelEn: "Type", labelFa: "نوع", type: "badge" },
    { key: "country", labelEn: "Country", labelFa: "کشور" },
    { key: "since", labelEn: "Since", labelFa: "از تاریخ", type: "date" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
  ],
  fields: [
    { name: "nameEn", labelEn: "Name (EN)", labelFa: "نام (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "nameFa", labelEn: "Name (FA)", labelFa: "نام (فارسی)", type: "text", required: true },
    {
      name: "type", labelEn: "Type", labelFa: "نوع", type: "select", required: true,
      options: [
        opt("STRATEGIC", "Strategic", "راهبردی"),
        opt("FINANCIAL", "Financial", "مالی"),
        opt("TECHNOLOGY", "Technology", "فناوری"),
        opt("LOGISTICS", "Logistics", "لجستیک"),
      ],
    },
    { name: "country", labelEn: "Country", labelFa: "کشور", type: "text", required: true },
    { name: "website", labelEn: "Website", labelFa: "وب‌سایت", type: "text", ltr: true },
    { name: "since", labelEn: "Partner since", labelFa: "همکاری از", type: "date", required: true },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [opt("ACTIVE", "Active", "فعال"), opt("PAUSED", "Paused", "متوقف")],
    },
  ],
};

export const PROJECTS_CONFIG: EntityManagerConfig = {
  entity: "projects",
  columns: [
    { key: "title", labelEn: "Title", labelFa: "عنوان", localePair: true },
    { key: "sector", labelEn: "Sector", labelFa: "بخش" },
    { key: "country", labelEn: "Country", labelFa: "کشور" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "progress", labelEn: "Progress", labelFa: "پیشرفت", type: "percent" },
    { key: "value", labelEn: "Value", labelFa: "ارزش", type: "money" },
    { key: "featured", labelEn: "Featured", labelFa: "ویژه", type: "boolean" },
  ],
  fields: [
    { name: "slug", labelEn: "Slug (URL)", labelFa: "اسلاگ (آدرس)", type: "text", required: true, ltr: true },
    { name: "sector", labelEn: "Sector", labelFa: "بخش", type: "text", required: true },
    { name: "titleEn", labelEn: "Title (EN)", labelFa: "عنوان (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "titleFa", labelEn: "Title (FA)", labelFa: "عنوان (فارسی)", type: "text", required: true },
    { name: "summaryEn", labelEn: "Summary (EN)", labelFa: "خلاصه (انگلیسی)", type: "textarea", required: true },
    { name: "summaryFa", labelEn: "Summary (FA)", labelFa: "خلاصه (فارسی)", type: "textarea", required: true },
    { name: "bodyEn", labelEn: "Body (EN)", labelFa: "متن (انگلیسی)", type: "textarea" },
    { name: "bodyFa", labelEn: "Body (FA)", labelFa: "متن (فارسی)", type: "textarea" },
    { name: "country", labelEn: "Country", labelFa: "کشور", type: "text", required: true },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [
        opt("PLANNING", "Planning", "برنامه‌ریزی"),
        opt("ACTIVE", "Active", "فعال"),
        opt("COMPLETED", "Completed", "تکمیل‌شده"),
        opt("ON_HOLD", "On hold", "متوقف"),
      ],
    },
    { name: "value", labelEn: "Value (USD)", labelFa: "ارزش (دلار)", type: "number" },
    { name: "progress", labelEn: "Progress %", labelFa: "درصد پیشرفت", type: "number" },
    { name: "startDate", labelEn: "Start date", labelFa: "تاریخ آغاز", type: "date", required: true },
    { name: "endDate", labelEn: "End date", labelFa: "تاریخ پایان", type: "date" },
    { name: "clientId", labelEn: "Client", labelFa: "مشتری", type: "select", optionsFrom: { entity: "clients", labelBase: "name" } },
    { name: "featured", labelEn: "Featured on site", labelFa: "نمایش ویژه در سایت", type: "switch" },
  ],
};

export const INVESTMENTS_CONFIG: EntityManagerConfig = {
  entity: "investments",
  columns: [
    { key: "title", labelEn: "Title", labelFa: "عنوان", localePair: true },
    { key: "sector", labelEn: "Sector", labelFa: "بخش" },
    { key: "stage", labelEn: "Stage", labelFa: "مرحله", type: "badge" },
    { key: "amount", labelEn: "Amount", labelFa: "مبلغ", type: "money" },
    { key: "irr", labelEn: "IRR", labelFa: "بازده", type: "percent" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "date", labelEn: "Date", labelFa: "تاریخ", type: "date" },
  ],
  fields: [
    { name: "titleEn", labelEn: "Title (EN)", labelFa: "عنوان (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "titleFa", labelEn: "Title (FA)", labelFa: "عنوان (فارسی)", type: "text", required: true },
    { name: "sector", labelEn: "Sector", labelFa: "بخش", type: "text", required: true },
    {
      name: "stage", labelEn: "Stage", labelFa: "مرحله", type: "select", required: true,
      options: [
        opt("SEED", "Seed", "بذری"),
        opt("GROWTH", "Growth", "رشد"),
        opt("EXPANSION", "Expansion", "توسعه"),
        opt("MATURE", "Mature", "بالغ"),
      ],
    },
    { name: "amount", labelEn: "Amount (USD)", labelFa: "مبلغ (دلار)", type: "number", required: true },
    { name: "irr", labelEn: "IRR %", labelFa: "بازده داخلی ٪", type: "number" },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [opt("ACTIVE", "Active", "فعال"), opt("EXITED", "Exited", "خارج‌شده"), opt("HOLD", "Hold", "نگه‌داشت")],
    },
    { name: "date", labelEn: "Date", labelFa: "تاریخ", type: "date", required: true },
    { name: "notes", labelEn: "Notes", labelFa: "یادداشت", type: "textarea" },
  ],
};

export const DEALS_CONFIG: EntityManagerConfig = {
  entity: "deals",
  columns: [
    { key: "title", labelEn: "Deal", labelFa: "معامله", localePair: true },
    { key: "counterparty", labelEn: "Counterparty", labelFa: "طرف معامله" },
    { key: "country", labelEn: "Country", labelFa: "کشور" },
    { key: "direction", labelEn: "Direction", labelFa: "جهت", type: "badge" },
    { key: "stage", labelEn: "Stage", labelFa: "مرحله", type: "badge" },
    { key: "value", labelEn: "Value", labelFa: "ارزش", type: "money" },
    { key: "owner", labelEn: "Owner", labelFa: "مسئول", type: "relation" },
  ],
  fields: [
    { name: "titleEn", labelEn: "Title (EN)", labelFa: "عنوان (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "titleFa", labelEn: "Title (FA)", labelFa: "عنوان (فارسی)", type: "text", required: true },
    { name: "counterparty", labelEn: "Counterparty", labelFa: "طرف معامله", type: "text", required: true },
    { name: "country", labelEn: "Country", labelFa: "کشور", type: "text", required: true },
    {
      name: "direction", labelEn: "Direction", labelFa: "جهت", type: "select", required: true,
      options: [opt("INBOUND", "Inbound", "ورودی"), opt("OUTBOUND", "Outbound", "خروجی")],
    },
    { name: "value", labelEn: "Value (USD)", labelFa: "ارزش (دلار)", type: "number", required: true },
    {
      name: "stage", labelEn: "Stage", labelFa: "مرحله", type: "select",
      options: [
        opt("PROSPECT", "Prospect", "شناسایی"),
        opt("NEGOTIATION", "Negotiation", "مذاکره"),
        opt("CONTRACT", "Contract", "قرارداد"),
        opt("CLOSED_WON", "Closed — won", "بسته — موفق"),
        opt("CLOSED_LOST", "Closed — lost", "بسته — ناموفق"),
      ],
    },
    { name: "closeDate", labelEn: "Close date", labelFa: "تاریخ بستن", type: "date" },
  ],
};

export const TRADE_REQUESTS_CONFIG: EntityManagerConfig = {
  entity: "trade-requests",
  columns: [
    { key: "refCode", labelEn: "Ref", labelFa: "کد" },
    { key: "type", labelEn: "Type", labelFa: "نوع", type: "badge" },
    { key: "commodity", labelEn: "Commodity", labelFa: "کالا" },
    { key: "originCountry", labelEn: "Origin", labelFa: "مبدأ" },
    { key: "destinationCountry", labelEn: "Destination", labelFa: "مقصد" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "value", labelEn: "Value", labelFa: "ارزش", type: "money" },
  ],
  fields: [
    { name: "refCode", labelEn: "Reference code", labelFa: "کد پیگیری", type: "text", required: true, ltr: true },
    {
      name: "type", labelEn: "Type", labelFa: "نوع", type: "select", required: true,
      options: [opt("IMPORT", "Import", "واردات"), opt("EXPORT", "Export", "صادرات")],
    },
    { name: "commodity", labelEn: "Commodity", labelFa: "کالا", type: "text", required: true },
    { name: "quantity", labelEn: "Quantity", labelFa: "مقدار", type: "number", required: true },
    { name: "unit", labelEn: "Unit", labelFa: "واحد", type: "text", required: true },
    { name: "originCountry", labelEn: "Origin country", labelFa: "کشور مبدأ", type: "text", required: true },
    { name: "destinationCountry", labelEn: "Destination country", labelFa: "کشور مقصد", type: "text", required: true },
    { name: "incoterm", labelEn: "Incoterm", labelFa: "اینکوترم", type: "text", ltr: true },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [
        opt("RECEIVED", "Received", "دریافت‌شده"),
        opt("REVIEW", "In review", "در بررسی"),
        opt("QUOTED", "Quoted", "قیمت‌داده‌شده"),
        opt("IN_TRANSIT", "In transit", "در حال حمل"),
        opt("DELIVERED", "Delivered", "تحویل‌شده"),
        opt("CANCELLED", "Cancelled", "لغوشده"),
      ],
    },
    { name: "value", labelEn: "Value (USD)", labelFa: "ارزش (دلار)", type: "number" },
    { name: "clientId", labelEn: "Client", labelFa: "مشتری", type: "select", optionsFrom: { entity: "clients", labelBase: "name" } },
  ],
};

export const MARKETPLACE_CONFIG: EntityManagerConfig = {
  entity: "marketplace",
  columns: [
    { key: "title", labelEn: "Listing", labelFa: "آگهی", localePair: true },
    { key: "category", labelEn: "Category", labelFa: "دسته" },
    { key: "sellerName", labelEn: "Seller", labelFa: "فروشنده" },
    { key: "price", labelEn: "Price", labelFa: "قیمت", type: "money" },
    { key: "stock", labelEn: "Stock", labelFa: "موجودی", type: "number" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
  ],
  fields: [
    { name: "titleEn", labelEn: "Title (EN)", labelFa: "عنوان (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "titleFa", labelEn: "Title (FA)", labelFa: "عنوان (فارسی)", type: "text", required: true },
    { name: "category", labelEn: "Category", labelFa: "دسته", type: "text", required: true },
    { name: "sellerName", labelEn: "Seller", labelFa: "فروشنده", type: "text", required: true },
    { name: "price", labelEn: "Price (USD)", labelFa: "قیمت (دلار)", type: "number", required: true },
    { name: "stock", labelEn: "Stock", labelFa: "موجودی", type: "number" },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [opt("ACTIVE", "Active", "فعال"), opt("PAUSED", "Paused", "متوقف"), opt("SOLD_OUT", "Sold out", "تمام‌شده")],
    },
  ],
};

export const PLATFORMS_CONFIG: EntityManagerConfig = {
  entity: "platforms",
  columns: [
    { key: "name", labelEn: "Platform", labelFa: "پلتفرم", localePair: true },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "users", labelEn: "Users", labelFa: "کاربران", type: "number" },
    { key: "growth", labelEn: "Growth", labelFa: "رشد", type: "percent" },
  ],
  fields: [
    { name: "nameEn", labelEn: "Name (EN)", labelFa: "نام (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "nameFa", labelEn: "Name (FA)", labelFa: "نام (فارسی)", type: "text", required: true },
    { name: "descriptionEn", labelEn: "Description (EN)", labelFa: "توضیح (انگلیسی)", type: "textarea", required: true },
    { name: "descriptionFa", labelEn: "Description (FA)", labelFa: "توضیح (فارسی)", type: "textarea", required: true },
    { name: "url", labelEn: "URL", labelFa: "آدرس", type: "text", ltr: true },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [opt("LIVE", "Live", "فعال"), opt("BETA", "Beta", "بتا"), opt("DEVELOPMENT", "In development", "در توسعه")],
    },
    { name: "users", labelEn: "Users", labelFa: "کاربران", type: "number" },
    { name: "growth", labelEn: "Monthly growth %", labelFa: "رشد ماهانه ٪", type: "number" },
  ],
};

export const INVOICES_CONFIG: EntityManagerConfig = {
  entity: "invoices",
  columns: [
    { key: "number", labelEn: "Number", labelFa: "شماره" },
    { key: "client", labelEn: "Client", labelFa: "مشتری", type: "relation" },
    { key: "issueDate", labelEn: "Issued", labelFa: "صدور", type: "date" },
    { key: "dueDate", labelEn: "Due", labelFa: "سررسید", type: "date" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "total", labelEn: "Total", labelFa: "مبلغ", type: "money" },
  ],
  fields: [
    { name: "number", labelEn: "Invoice number", labelFa: "شماره فاکتور", type: "text", required: true, ltr: true },
    { name: "clientId", labelEn: "Client", labelFa: "مشتری", type: "select", required: true, optionsFrom: { entity: "clients", labelBase: "name" } },
    { name: "issueDate", labelEn: "Issue date", labelFa: "تاریخ صدور", type: "date", required: true },
    { name: "dueDate", labelEn: "Due date", labelFa: "سررسید", type: "date", required: true },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [
        opt("DRAFT", "Draft", "پیش‌نویس"),
        opt("SENT", "Sent", "ارسال‌شده"),
        opt("PAID", "Paid", "پرداخت‌شده"),
        opt("OVERDUE", "Overdue", "سررسید گذشته"),
        opt("VOID", "Void", "باطل"),
      ],
    },
    { name: "total", labelEn: "Total (USD)", labelFa: "مبلغ کل (دلار)", type: "number", required: true },
  ],
};

export const TRANSACTIONS_CONFIG: EntityManagerConfig = {
  entity: "transactions",
  columns: [
    { key: "date", labelEn: "Date", labelFa: "تاریخ", type: "date" },
    { key: "type", labelEn: "Type", labelFa: "نوع", type: "badge" },
    { key: "category", labelEn: "Category", labelFa: "دسته" },
    { key: "description", labelEn: "Description", labelFa: "توضیح" },
    { key: "amount", labelEn: "Amount", labelFa: "مبلغ", type: "money" },
  ],
  fields: [
    { name: "date", labelEn: "Date", labelFa: "تاریخ", type: "date", required: true },
    {
      name: "type", labelEn: "Type", labelFa: "نوع", type: "select", required: true,
      options: [opt("INCOME", "Income", "درآمد"), opt("EXPENSE", "Expense", "هزینه"), opt("TRANSFER", "Transfer", "انتقال")],
    },
    { name: "category", labelEn: "Category", labelFa: "دسته", type: "text", required: true },
    { name: "amount", labelEn: "Amount (USD)", labelFa: "مبلغ (دلار)", type: "number", required: true },
    { name: "description", labelEn: "Description", labelFa: "توضیح", type: "textarea" },
    { name: "ref", labelEn: "Reference", labelFa: "مرجع", type: "text", ltr: true },
  ],
};

export const TASKS_CONFIG: EntityManagerConfig = {
  entity: "tasks",
  columns: [
    { key: "title", labelEn: "Task", labelFa: "وظیفه" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "priority", labelEn: "Priority", labelFa: "اولویت", type: "badge" },
    { key: "assignee", labelEn: "Assignee", labelFa: "مسئول", type: "relation" },
    { key: "project", labelEn: "Project", labelFa: "پروژه", type: "relation" },
    { key: "dueDate", labelEn: "Due", labelFa: "سررسید", type: "date" },
  ],
  fields: [
    { name: "title", labelEn: "Title", labelFa: "عنوان", type: "text", required: true, wide: true },
    { name: "description", labelEn: "Description", labelFa: "توضیح", type: "textarea" },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [
        opt("TODO", "To do", "انجام‌نشده"),
        opt("IN_PROGRESS", "In progress", "در حال انجام"),
        opt("REVIEW", "In review", "در بررسی"),
        opt("DONE", "Done", "انجام‌شده"),
      ],
    },
    {
      name: "priority", labelEn: "Priority", labelFa: "اولویت", type: "select",
      options: [
        opt("LOW", "Low", "کم"),
        opt("MEDIUM", "Medium", "متوسط"),
        opt("HIGH", "High", "زیاد"),
        opt("URGENT", "Urgent", "فوری"),
      ],
    },
    { name: "dueDate", labelEn: "Due date", labelFa: "سررسید", type: "date" },
    { name: "projectId", labelEn: "Project", labelFa: "پروژه", type: "select", optionsFrom: { entity: "projects", labelBase: "title" } },
  ],
};

export const CALENDAR_CONFIG: EntityManagerConfig = {
  entity: "calendar-events",
  columns: [
    { key: "title", labelEn: "Event", labelFa: "رویداد" },
    { key: "type", labelEn: "Type", labelFa: "نوع", type: "badge" },
    { key: "start", labelEn: "Start", labelFa: "آغاز", type: "date" },
    { key: "end", labelEn: "End", labelFa: "پایان", type: "date" },
    { key: "location", labelEn: "Location", labelFa: "مکان" },
  ],
  fields: [
    { name: "title", labelEn: "Title", labelFa: "عنوان", type: "text", required: true, wide: true },
    { name: "start", labelEn: "Start", labelFa: "آغاز", type: "date", required: true },
    { name: "end", labelEn: "End", labelFa: "پایان", type: "date" },
    {
      name: "type", labelEn: "Type", labelFa: "نوع", type: "select",
      options: [
        opt("MEETING", "Meeting", "جلسه"),
        opt("DEADLINE", "Deadline", "مهلت"),
        opt("TRAVEL", "Travel", "سفر"),
        opt("EVENT", "Event", "رویداد"),
      ],
    },
    { name: "location", labelEn: "Location", labelFa: "مکان", type: "text" },
    { name: "notes", labelEn: "Notes", labelFa: "یادداشت", type: "textarea" },
  ],
};

export const NOTIFICATIONS_CONFIG: EntityManagerConfig = {
  entity: "notifications",
  columns: [
    { key: "title", labelEn: "Title", labelFa: "عنوان" },
    { key: "body", labelEn: "Body", labelFa: "متن" },
    { key: "type", labelEn: "Type", labelFa: "نوع", type: "badge" },
    { key: "read", labelEn: "Read", labelFa: "خوانده‌شده", type: "boolean" },
    { key: "createdAt", labelEn: "Created", labelFa: "زمان", type: "date" },
  ],
  fields: [
    { name: "title", labelEn: "Title", labelFa: "عنوان", type: "text", required: true, wide: true },
    { name: "body", labelEn: "Body", labelFa: "متن", type: "textarea", required: true },
    {
      name: "type", labelEn: "Type", labelFa: "نوع", type: "select",
      options: [
        opt("INFO", "Info", "اطلاع"),
        opt("SUCCESS", "Success", "موفقیت"),
        opt("WARNING", "Warning", "هشدار"),
        opt("ALERT", "Alert", "اخطار"),
      ],
    },
    { name: "read", labelEn: "Read", labelFa: "خوانده‌شده", type: "switch" },
  ],
};

export const NEWS_CONFIG: EntityManagerConfig = {
  entity: "news",
  columns: [
    { key: "title", labelEn: "Title", labelFa: "عنوان", localePair: true },
    { key: "category", labelEn: "Category", labelFa: "دسته" },
    { key: "published", labelEn: "Published", labelFa: "منتشرشده", type: "boolean" },
    { key: "publishedAt", labelEn: "Date", labelFa: "تاریخ", type: "date" },
    { key: "readMinutes", labelEn: "Min read", labelFa: "دقیقه", type: "number" },
  ],
  fields: [
    { name: "slug", labelEn: "Slug (URL)", labelFa: "اسلاگ (آدرس)", type: "text", required: true, ltr: true },
    { name: "category", labelEn: "Category", labelFa: "دسته", type: "text", required: true },
    { name: "titleEn", labelEn: "Title (EN)", labelFa: "عنوان (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "titleFa", labelEn: "Title (FA)", labelFa: "عنوان (فارسی)", type: "text", required: true },
    { name: "excerptEn", labelEn: "Excerpt (EN)", labelFa: "خلاصه (انگلیسی)", type: "textarea", required: true },
    { name: "excerptFa", labelEn: "Excerpt (FA)", labelFa: "خلاصه (فارسی)", type: "textarea", required: true },
    { name: "bodyEn", labelEn: "Body (EN)", labelFa: "متن (انگلیسی)", type: "textarea", required: true },
    { name: "bodyFa", labelEn: "Body (FA)", labelFa: "متن (فارسی)", type: "textarea", required: true },
    { name: "publishedAt", labelEn: "Publish date", labelFa: "تاریخ انتشار", type: "date" },
    { name: "readMinutes", labelEn: "Minutes to read", labelFa: "دقیقه مطالعه", type: "number" },
    { name: "published", labelEn: "Published on site", labelFa: "انتشار در سایت", type: "switch" },
  ],
};

export const EVENTS_CONFIG: EntityManagerConfig = {
  entity: "events",
  columns: [
    { key: "title", labelEn: "Event", labelFa: "رویداد", localePair: true },
    { key: "type", labelEn: "Type", labelFa: "نوع", type: "badge" },
    { key: "location", labelEn: "Location", labelFa: "مکان" },
    { key: "startDate", labelEn: "Date", labelFa: "تاریخ", type: "date" },
  ],
  fields: [
    { name: "slug", labelEn: "Slug (URL)", labelFa: "اسلاگ (آدرس)", type: "text", required: true, ltr: true },
    { name: "location", labelEn: "Location", labelFa: "مکان", type: "text", required: true },
    { name: "titleEn", labelEn: "Title (EN)", labelFa: "عنوان (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "titleFa", labelEn: "Title (FA)", labelFa: "عنوان (فارسی)", type: "text", required: true },
    { name: "descriptionEn", labelEn: "Description (EN)", labelFa: "توضیح (انگلیسی)", type: "textarea", required: true },
    { name: "descriptionFa", labelEn: "Description (FA)", labelFa: "توضیح (فارسی)", type: "textarea", required: true },
    { name: "startDate", labelEn: "Start date", labelFa: "تاریخ آغاز", type: "date", required: true },
    { name: "endDate", labelEn: "End date", labelFa: "تاریخ پایان", type: "date" },
    {
      name: "type", labelEn: "Type", labelFa: "نوع", type: "select",
      options: [
        opt("SUMMIT", "Summit", "اجلاس"),
        opt("EXPO", "Expo", "نمایشگاه"),
        opt("WEBINAR", "Webinar", "وبینار"),
        opt("FORUM", "Forum", "همایش"),
      ],
    },
    { name: "registrationUrl", labelEn: "Registration URL", labelFa: "آدرس ثبت‌نام", type: "text", ltr: true },
  ],
};

export const JOBS_CONFIG: EntityManagerConfig = {
  entity: "jobs",
  columns: [
    { key: "title", labelEn: "Role", labelFa: "موقعیت", localePair: true },
    { key: "department", labelEn: "Department", labelFa: "واحد", localePair: true },
    { key: "location", labelEn: "Location", labelFa: "مکان" },
    { key: "type", labelEn: "Type", labelFa: "نوع", type: "badge" },
    { key: "open", labelEn: "Open", labelFa: "باز", type: "boolean" },
  ],
  fields: [
    { name: "slug", labelEn: "Slug (URL)", labelFa: "اسلاگ (آدرس)", type: "text", required: true, ltr: true },
    { name: "location", labelEn: "Location", labelFa: "مکان", type: "text", required: true },
    { name: "titleEn", labelEn: "Title (EN)", labelFa: "عنوان (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "titleFa", labelEn: "Title (FA)", labelFa: "عنوان (فارسی)", type: "text", required: true },
    { name: "departmentEn", labelEn: "Department (EN)", labelFa: "واحد (انگلیسی)", type: "text", required: true, ltr: true },
    { name: "departmentFa", labelEn: "Department (FA)", labelFa: "واحد (فارسی)", type: "text", required: true },
    { name: "descriptionEn", labelEn: "Description (EN)", labelFa: "توضیح (انگلیسی)", type: "textarea", required: true },
    { name: "descriptionFa", labelEn: "Description (FA)", labelFa: "توضیح (فارسی)", type: "textarea", required: true },
    {
      name: "type", labelEn: "Type", labelFa: "نوع", type: "select",
      options: [
        opt("FULL_TIME", "Full-time", "تمام‌وقت"),
        opt("PART_TIME", "Part-time", "پاره‌وقت"),
        opt("CONTRACT", "Contract", "قراردادی"),
        opt("REMOTE", "Remote", "دورکاری"),
      ],
    },
    { name: "open", labelEn: "Open for applications", labelFa: "پذیرش درخواست", type: "switch" },
  ],
};

export const CONTACTS_CONFIG: EntityManagerConfig = {
  entity: "contacts",
  noCreate: true,
  columns: [
    { key: "name", labelEn: "Name", labelFa: "نام" },
    { key: "email", labelEn: "Email", labelFa: "ایمیل" },
    { key: "company", labelEn: "Company", labelFa: "شرکت" },
    { key: "topic", labelEn: "Topic", labelFa: "موضوع" },
    { key: "message", labelEn: "Message", labelFa: "پیام" },
    { key: "status", labelEn: "Status", labelFa: "وضعیت", type: "badge" },
    { key: "createdAt", labelEn: "Received", labelFa: "دریافت", type: "date" },
  ],
  fields: [
    { name: "name", labelEn: "Name", labelFa: "نام", type: "text", required: true },
    { name: "email", labelEn: "Email", labelFa: "ایمیل", type: "email", required: true, ltr: true },
    { name: "company", labelEn: "Company", labelFa: "شرکت", type: "text" },
    { name: "topic", labelEn: "Topic", labelFa: "موضوع", type: "text", required: true },
    { name: "message", labelEn: "Message", labelFa: "پیام", type: "textarea", required: true },
    {
      name: "status", labelEn: "Status", labelFa: "وضعیت", type: "select",
      options: [
        opt("NEW", "New", "جدید"),
        opt("IN_REVIEW", "In review", "در بررسی"),
        opt("RESPONDED", "Responded", "پاسخ‌داده‌شده"),
        opt("ARCHIVED", "Archived", "بایگانی"),
      ],
    },
  ],
};
