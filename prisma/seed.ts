import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000);
const daysAhead = (n: number) => new Date(now.getTime() + n * 86_400_000);

async function main() {
  console.info("Seeding…");

  // ——— Roles & permissions ———
  const permissionDefs: [string, string, string][] = [
    ["clients.write", "Manage clients", "مدیریت مشتریان"],
    ["partners.write", "Manage partners", "مدیریت شرکا"],
    ["projects.write", "Manage projects", "مدیریت پروژه‌ها"],
    ["investments.write", "Manage investments", "مدیریت سرمایه‌گذاری‌ها"],
    ["deals.write", "Manage deals", "مدیریت معاملات"],
    ["trade.write", "Manage trade requests", "مدیریت درخواست‌های تجاری"],
    ["finance.write", "Manage finance", "مدیریت مالی"],
    ["content.write", "Manage site content", "مدیریت محتوای سایت"],
    ["users.manage", "Manage users & roles", "مدیریت کاربران و نقش‌ها"],
    ["reports.view", "View reports", "مشاهده گزارش‌ها"],
    ["tasks.write", "Manage tasks", "مدیریت وظایف"],
    ["settings.manage", "Manage settings", "مدیریت تنظیمات"],
  ];
  const permissions = await Promise.all(
    permissionDefs.map(([key, labelEn, labelFa]) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key, labelEn, labelFa },
      }),
    ),
  );

  const roleDefs: [string, string, string, string[]][] = [
    ["ADMIN", "Full control of the platform", "کنترل کامل سکو", permissionDefs.map((p) => p[0])],
    [
      "MANAGER",
      "Manages business operations and content",
      "مدیریت عملیات کسب‌وکار و محتوا",
      permissionDefs.map((p) => p[0]).filter((k) => k !== "users.manage" && k !== "settings.manage"),
    ],
    [
      "ANALYST",
      "Works deals, clients, and reporting",
      "کار بر روی معاملات، مشتریان و گزارش‌ها",
      ["clients.write", "deals.write", "trade.write", "reports.view", "tasks.write"],
    ],
    ["VIEWER", "Read-only access", "دسترسی فقط خواندنی", ["reports.view", "tasks.write"]],
  ];

  const roles: Record<string, string> = {};
  for (const [name, descriptionEn, descriptionFa, keys] of roleDefs) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, descriptionEn, descriptionFa },
    });
    roles[name] = role.id;
    for (const key of keys) {
      const perm = permissions.find((p) => p.key === key)!;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // ——— Users ———
  const hash = await bcrypt.hash("Admin@1234", 12);
  const userDefs: [string, string, string, string][] = [
    ["Iman Soleimani", "admin@ata-holding.com", "ADMIN", "Chief Executive Officer"],
    ["Sara Mohammadi", "manager@ata-holding.com", "MANAGER", "Director of Operations"],
    ["Reza Karimi", "analyst@ata-holding.com", "ANALYST", "Trade Analyst"],
    ["Neda Rahimi", "viewer@ata-holding.com", "VIEWER", "Board Observer"],
  ];
  const users: Record<string, string> = {};
  for (const [name, email, role, title] of userDefs) {
    const u = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, passwordHash: hash, roleId: roles[role], title },
    });
    users[email] = u.id;
  }
  const adminId = users["admin@ata-holding.com"];
  const analystId = users["analyst@ata-holding.com"];

  // ——— Clients ———
  const clientDefs = [
    ["Caspian Foods Group", "گروه غذایی کاسپین", "Caspian Foods", "trade@caspianfoods.com", "Iran", "ACTIVE", 1_250_000],
    ["Gulf Horizon Trading", "بازرگانی افق خلیج", "Gulf Horizon LLC", "ops@gulfhorizon.ae", "UAE", "ACTIVE", 2_800_000],
    ["Anatolia Steelworks", "فولاد آناتولی", "Anatolia Steel", "export@anatoliasteel.tr", "Türkiye", "ACTIVE", 4_100_000],
    ["Silk Route Logistics", "لجستیک جاده ابریشم", "SRL Co.", "hello@silkroutelog.cn", "China", "LEAD", 0],
    ["Zagros Minerals", "کانی‌های زاگرس", "Zagros Mining Co.", "sales@zagrosminerals.ir", "Iran", "ACTIVE", 3_600_000],
    ["Baltic Grain Partners", "شرکای غلات بالتیک", "BGP", "desk@balticgrain.de", "Germany", "LEAD", 0],
    ["Nairobi AgriTech", "کشاورزی هوشمند نایروبی", "NAT Ltd.", "info@nairobiagritech.ke", "Kenya", "ACTIVE", 780_000],
    ["Mumbai Textile House", "خانه نساجی بمبئی", "MTH", "buy@mumbaitextile.in", "India", "INACTIVE", 450_000],
    ["Samarkand Fruits Co.", "میوه سمرقند", "SF Co.", "export@samfruits.uz", "Uzbekistan", "ACTIVE", 920_000],
    ["Doha Hospitality Group", "گروه هتلداری دوحه", "DHG", "invest@dohahospitality.qa", "Qatar", "LEAD", 0],
  ] as const;
  const clientIds: string[] = [];
  for (const [nameEn, nameFa, company, email, country, status, value] of clientDefs) {
    const c = await prisma.client.create({
      data: { nameEn, nameFa, company, email, country, status, value, phone: "+98 21 8899 0000" },
    });
    clientIds.push(c.id);
  }

  // ——— Partners ———
  const partnerDefs = [
    ["Meridian Capital", "سرمایه مریدین", "FINANCIAL", "UK", 2021],
    ["PortLink Global", "پورت‌لینک جهانی", "LOGISTICS", "Netherlands", 2020],
    ["NovaCloud Systems", "سیستم‌های نواکلود", "TECHNOLOGY", "Germany", 2022],
    ["Khaleej Ventures", "خلیج ونچرز", "FINANCIAL", "UAE", 2019],
    ["TransAsia Freight", "ترنس‌آسیا", "LOGISTICS", "Singapore", 2023],
    ["Aria Innovation Lab", "آزمایشگاه نوآوری آریا", "TECHNOLOGY", "Iran", 2021],
    ["EastBridge Advisory", "مشاوره ایست‌بریج", "STRATEGIC", "Türkiye", 2020],
    ["Sahara AgriCorp", "صحرا اگری‌کورپ", "STRATEGIC", "Morocco", 2024],
    ["Helvetia Trade Bank", "بانک تجارت هلوتیا", "FINANCIAL", "Switzerland", 2022],
    ["Pacific Rim Partners", "شرکای حاشیه اقیانوس آرام", "STRATEGIC", "Japan", 2023],
  ] as const;
  for (const [nameEn, nameFa, type, country, year] of partnerDefs) {
    await prisma.partner.create({
      data: { nameEn, nameFa, type, country, since: new Date(`${year}-03-01`), status: "ACTIVE" },
    });
  }

  // ——— Projects ———
  const projectDefs: {
    slug: string; titleEn: string; titleFa: string; summaryEn: string; summaryFa: string;
    sector: string; country: string; status: string; value: number; progress: number;
    featured: boolean; start: number; clientIdx?: number;
  }[] = [
    {
      slug: "caspian-agri-corridor",
      titleEn: "Caspian Agri Corridor",
      titleFa: "کریدور کشاورزی کاسپین",
      summaryEn: "A cold-chain export corridor moving premium produce from northern Iran to Gulf markets in under 48 hours.",
      summaryFa: "کریدور صادراتی زنجیره سرد برای انتقال محصولات ممتاز شمال ایران به بازارهای خلیج فارس در کمتر از ۴۸ ساعت.",
      sector: "Agriculture", country: "Iran → UAE", status: "ACTIVE", value: 8_500_000, progress: 64, featured: true, start: 400, clientIdx: 1,
    },
    {
      slug: "zagros-copper-expansion",
      titleEn: "Zagros Copper Expansion",
      titleFa: "توسعه مس زاگرس",
      summaryEn: "Financing and offtake structuring for a mid-scale copper concentrate operation in the Zagros belt.",
      summaryFa: "تأمین مالی و ساختاردهی قرارداد فروش برای یک واحد کنسانتره مس در کمربند زاگرس.",
      sector: "Mining", country: "Iran", status: "ACTIVE", value: 14_200_000, progress: 41, featured: true, start: 320, clientIdx: 4,
    },
    {
      slug: "tradebridge-platform",
      titleEn: "TradeBridge B2B Platform",
      titleFa: "پلتفرم تجارت بین‌بنگاهی ترید‌بریج",
      summaryEn: "A digital marketplace connecting verified regional exporters with international buyers, with escrow and logistics built in.",
      summaryFa: "بازارگاه دیجیتالی که صادرکنندگان معتبر منطقه را با خریداران بین‌المللی متصل می‌کند؛ همراه با امانت‌داری مالی و لجستیک یکپارچه.",
      sector: "Technology", country: "Global", status: "ACTIVE", value: 5_000_000, progress: 78, featured: true, start: 540,
    },
    {
      slug: "persepolis-heritage-route",
      titleEn: "Persepolis Heritage Route",
      titleFa: "مسیر گردشگری تخت‌جمشید",
      summaryEn: "A curated cultural tourism program pairing heritage sites with boutique hospitality across Fars province.",
      summaryFa: "برنامه گردشگری فرهنگی که آثار تاریخی استان فارس را با اقامتگاه‌های بوتیک پیوند می‌دهد.",
      sector: "Tourism", country: "Iran", status: "PLANNING", value: 3_800_000, progress: 12, featured: false, start: 90,
    },
    {
      slug: "smart-greenhouse-network",
      titleEn: "Smart Greenhouse Network",
      titleFa: "شبکه گلخانه‌های هوشمند",
      summaryEn: "IoT-managed greenhouse clusters producing year-round export-grade vegetables with 60% less water.",
      summaryFa: "مجموعه گلخانه‌های مدیریت‌شده با اینترنت اشیا برای تولید سبزیجات صادراتی در تمام سال با ۶۰٪ آب کمتر.",
      sector: "Agriculture", country: "Iran", status: "ACTIVE", value: 6_700_000, progress: 55, featured: false, start: 260, clientIdx: 6,
    },
    {
      slug: "ata-invest-fund-ii",
      titleEn: "ATA Invest Fund II",
      titleFa: "صندوق سرمایه‌گذاری آتا ۲",
      summaryEn: "A sector-agnostic growth fund backing knowledge-based companies scaling into regional markets.",
      summaryFa: "صندوق رشد برای شرکت‌های دانش‌بنیانی که به بازارهای منطقه‌ای وارد می‌شوند.",
      sector: "Investment", country: "Region", status: "ACTIVE", value: 25_000_000, progress: 47, featured: false, start: 200,
    },
    {
      slug: "anatolia-steel-supply",
      titleEn: "Anatolia Steel Supply Chain",
      titleFa: "زنجیره تأمین فولاد آناتولی",
      summaryEn: "Multi-year supply agreement and logistics orchestration for structural steel into Central Asian construction markets.",
      summaryFa: "قرارداد تأمین چندساله و هماهنگی لجستیک فولاد سازه‌ای برای بازارهای ساخت‌وساز آسیای مرکزی.",
      sector: "Trade", country: "Türkiye → Uzbekistan", status: "COMPLETED", value: 11_400_000, progress: 100, featured: false, start: 700, clientIdx: 2,
    },
    {
      slug: "tourport-booking-engine",
      titleEn: "TourPort Booking Engine",
      titleFa: "موتور رزرو تورپورت",
      summaryEn: "White-label booking infrastructure for regional tour operators, from inventory to payments.",
      summaryFa: "زیرساخت رزرو برای اپراتورهای گردشگری منطقه؛ از مدیریت ظرفیت تا پرداخت.",
      sector: "Technology", country: "Region", status: "ON_HOLD", value: 1_900_000, progress: 30, featured: false, start: 150,
    },
  ];
  for (const p of projectDefs) {
    await prisma.project.create({
      data: {
        slug: p.slug, titleEn: p.titleEn, titleFa: p.titleFa,
        summaryEn: p.summaryEn, summaryFa: p.summaryFa,
        sector: p.sector, country: p.country, status: p.status,
        value: p.value, progress: p.progress, featured: p.featured,
        startDate: daysAgo(p.start),
        clientId: p.clientIdx !== undefined ? clientIds[p.clientIdx] : undefined,
      },
    });
  }

  // ——— Investments ———
  const investmentDefs = [
    ["Rayan AI Diagnostics", "تشخیص هوشمند رایان", "HealthTech", "GROWTH", 1_800_000, 24.5, "ACTIVE"],
    ["GreenVolt Storage", "ذخیره‌سازی گرین‌ولت", "Energy", "EXPANSION", 4_500_000, 18.2, "ACTIVE"],
    ["Karafarin Marketplace", "بازارگاه کارآفرین", "E-commerce", "GROWTH", 2_200_000, 31.0, "ACTIVE"],
    ["Pars Robotics", "رباتیک پارس", "DeepTech", "SEED", 600_000, null, "ACTIVE"],
    ["Aftab Solar Farms", "مزارع خورشیدی آفتاب", "Energy", "MATURE", 7_900_000, 14.8, "ACTIVE"],
    ["Didar CRM", "دیدار سی‌آر‌ام", "SaaS", "GROWTH", 1_100_000, 27.3, "EXITED"],
    ["Saffron Origin Co.", "شرکت خاستگاه زعفران", "AgriFood", "EXPANSION", 3_300_000, 21.6, "ACTIVE"],
    ["Bourse Analytics", "تحلیل بورس", "FinTech", "SEED", 450_000, null, "HOLD"],
  ] as const;
  for (const [titleEn, titleFa, sector, stage, amount, irr, status] of investmentDefs) {
    await prisma.investment.create({
      data: { titleEn, titleFa, sector, stage, amount, irr, status, date: daysAgo(Math.floor(Math.random() * 500) + 30) },
    });
  }

  // ——— Deals ———
  const dealDefs = [
    ["Pistachio Annual Offtake", "قرارداد سالانه پسته", "Gulf Horizon Trading", "UAE", "OUTBOUND", 3_400_000, "CONTRACT"],
    ["Industrial Valve Import", "واردات شیرآلات صنعتی", "Rheinmetall Flow GmbH", "Germany", "INBOUND", 1_150_000, "NEGOTIATION"],
    ["Copper Concentrate Q3", "کنسانتره مس فصل سوم", "Jiangxi Metals", "China", "OUTBOUND", 6_800_000, "CLOSED_WON"],
    ["Medical Consumables Line", "خط مصرفی پزشکی", "MedSupply Asia", "Singapore", "INBOUND", 890_000, "PROSPECT"],
    ["Saffron EU Distribution", "توزیع زعفران در اروپا", "Alpina Foods AG", "Switzerland", "OUTBOUND", 2_100_000, "NEGOTIATION"],
    ["Textile Machinery Refit", "نوسازی ماشین‌آلات نساجی", "Mumbai Textile House", "India", "INBOUND", 1_600_000, "CLOSED_LOST"],
    ["Dates Ramadan Program", "برنامه خرما برای رمضان", "Doha Hospitality Group", "Qatar", "OUTBOUND", 740_000, "CONTRACT"],
    ["Grain Corridor Pilot", "پایلوت کریدور غلات", "Baltic Grain Partners", "Germany", "INBOUND", 5_200_000, "PROSPECT"],
  ] as const;
  for (const [titleEn, titleFa, counterparty, country, direction, value, stage] of dealDefs) {
    await prisma.deal.create({
      data: {
        titleEn, titleFa, counterparty, country, direction, value, stage,
        ownerId: Math.random() > 0.5 ? adminId : analystId,
        closeDate: stage.startsWith("CLOSED") ? daysAgo(Math.floor(Math.random() * 60)) : daysAhead(Math.floor(Math.random() * 90) + 10),
      },
    });
  }

  // ——— Trade requests ———
  const tradeDefs = [
    ["TR-2407", "EXPORT", "Pistachios (Akbari)", 120, "t", "Iran", "UAE", "CIF", "IN_TRANSIT", 960_000, 0],
    ["TR-2408", "EXPORT", "Saffron (Negin)", 450, "kg", "Iran", "Switzerland", "DAP", "QUOTED", 675_000, 8],
    ["TR-2409", "IMPORT", "CNC Machine Tools", 6, "unit", "Germany", "Iran", "FOB", "REVIEW", 480_000, 7],
    ["TR-2410", "EXPORT", "Copper Concentrate", 2_400, "t", "Iran", "China", "FOB", "DELIVERED", 5_800_000, 4],
    ["TR-2411", "IMPORT", "Pharma-grade Gelatin", 40, "t", "India", "Iran", "CIF", "RECEIVED", 210_000, 7],
    ["TR-2412", "EXPORT", "Dates (Mazafati)", 300, "t", "Iran", "Qatar", "CIF", "IN_TRANSIT", 420_000, 9],
    ["TR-2413", "EXPORT", "Fresh Kiwi", 180, "t", "Iran", "India", "CIF", "QUOTED", 150_000, 6],
    ["TR-2414", "IMPORT", "Solar Inverters", 220, "unit", "China", "Iran", "DDP", "REVIEW", 330_000, 3],
  ] as const;
  for (const [refCode, type, commodity, quantity, unit, origin, dest, incoterm, status, value, ci] of tradeDefs) {
    await prisma.tradeRequest.create({
      data: {
        refCode, type, commodity, quantity, unit,
        originCountry: origin, destinationCountry: dest,
        incoterm, status, value, clientId: clientIds[ci],
      },
    });
  }

  // ——— Platforms ———
  const platformDefs = [
    ["TradeBridge", "ترید‌بریج", "Verified B2B export marketplace with built-in escrow, inspection, and freight.", "بازارگاه صادراتی بین‌بنگاهی با امانت‌داری مالی، بازرسی و حمل یکپارچه.", "LIVE", 12_800, 14.2],
    ["AgriLink", "اگری‌لینک", "Farm-to-port supply chain visibility for perishable exports.", "شفافیت زنجیره تأمین از مزرعه تا بندر برای صادرات فاسدشدنی.", "LIVE", 4_600, 9.8],
    ["ATA Invest", "آتا اینوست", "Digital gateway for co-investment opportunities across the holding's portfolio.", "درگاه دیجیتال فرصت‌های سرمایه‌گذاری مشترک در سبد هلدینگ.", "BETA", 1_150, 22.5],
    ["TourPort", "تورپورت", "Booking and payments infrastructure for regional tour operators.", "زیرساخت رزرو و پرداخت برای اپراتورهای گردشگری منطقه.", "DEVELOPMENT", 0, 0],
  ] as const;
  for (const [nameEn, nameFa, descriptionEn, descriptionFa, status, usersCount, growth] of platformDefs) {
    await prisma.platform.create({
      data: { nameEn, nameFa, descriptionEn, descriptionFa, status, users: usersCount, growth },
    });
  }

  // ——— Marketplace listings ———
  const listingDefs = [
    ["Premium Pistachio — Akbari 22/24", "پسته اکبری ممتاز ۲۲/۲۴", "Nuts & Dried Fruit", 8_400, 85, "Caspian Foods Group"],
    ["Negin Saffron — Grade A+", "زعفران نگین درجه یک", "Spices", 1_450, 320, "Saffron Origin Co."],
    ["Mazafati Dates — 10kg Carton", "خرما مضافتی — کارتن ۱۰ کیلویی", "Dates", 38, 4_100, "Bam Growers Union"],
    ["Copper Cathode 99.99%", "کاتد مس ۹۹.۹۹٪", "Metals", 9_150, 60, "Zagros Minerals"],
    ["Thyme Honey — Export Pack", "عسل آویشن — بسته صادراتی", "Food", 24, 1_800, "Alborz Apiaries"],
    ["Hand-Knotted Rug — Nain 6la", "فرش دستباف نایین شش‌لا", "Handicrafts", 5_900, 12, "Isfahan Rug House"],
    ["Rosewater — Kashan Double-Distilled", "گلاب دوآتشه کاشان", "Food", 11, 6_500, "Kashan Rose Co."],
    ["Feta-style Cheese — 15kg Tin", "پنیر لیقوان — حلب ۱۵ کیلویی", "Dairy", 96, 900, "Sahand Dairy"],
  ] as const;
  for (const [titleEn, titleFa, category, price, stock, sellerName] of listingDefs) {
    await prisma.marketplaceListing.create({
      data: { titleEn, titleFa, category, price, stock, sellerName, status: stock > 0 ? "ACTIVE" : "SOLD_OUT" },
    });
  }

  // ——— Invoices + items ———
  for (let i = 0; i < 8; i++) {
    const statuses = ["PAID", "PAID", "SENT", "SENT", "OVERDUE", "DRAFT", "PAID", "SENT"];
    const bases = [96_000, 675_000, 480_000, 42_500, 210_000, 18_400, 122_000, 58_000];
    const items = [
      ["Commodity supply per contract", bases[i] * 0.86],
      ["Freight & insurance", bases[i] * 0.1],
      ["Inspection & documentation", bases[i] * 0.04],
    ] as const;
    await prisma.invoice.create({
      data: {
        number: `INV-24${(210 + i).toString()}`,
        clientId: clientIds[i % clientIds.length],
        issueDate: daysAgo(90 - i * 9),
        dueDate: daysAgo(60 - i * 9),
        status: statuses[i],
        total: bases[i],
        items: {
          create: items.map(([description, amount]) => ({
            description: description as string,
            qty: 1,
            unitPrice: amount as number,
            amount: amount as number,
          })),
        },
      },
    });
  }

  // ——— Transactions ———
  const txCategories = ["Trade settlement", "Logistics", "Payroll", "Platform revenue", "Advisory fees", "Office & admin"];
  for (let i = 0; i < 18; i++) {
    const income = i % 3 !== 2;
    await prisma.transaction.create({
      data: {
        date: daysAgo(i * 11 + 2),
        type: income ? "INCOME" : "EXPENSE",
        category: txCategories[i % txCategories.length],
        amount: income ? 40_000 + (i * 37_000) % 500_000 : 8_000 + (i * 13_000) % 90_000,
        description: income ? "Settlement received" : "Operating expense",
        ref: `TX-${5100 + i}`,
      },
    });
  }

  // ——— Tasks ———
  const taskDefs = [
    ["Finalize Gulf Horizon offtake annex", "IN_PROGRESS", "HIGH"],
    ["Prepare Q3 copper shipment docs", "TODO", "URGENT"],
    ["Review AgriLink cold-chain metrics", "REVIEW", "MEDIUM"],
    ["Draft Fund II LP update letter", "TODO", "HIGH"],
    ["Verify saffron lot certificates", "DONE", "MEDIUM"],
    ["Schedule Doha site visit", "TODO", "LOW"],
    ["Update TradeBridge escrow terms", "IN_PROGRESS", "HIGH"],
    ["Reconcile May settlements", "DONE", "MEDIUM"],
    ["Interview logistics coordinator", "TODO", "MEDIUM"],
    ["Renew Helvetia credit line", "REVIEW", "URGENT"],
  ] as const;
  for (const [title, status, priority] of taskDefs) {
    await prisma.task.create({
      data: {
        title, status, priority,
        assigneeId: Math.random() > 0.5 ? adminId : analystId,
        dueDate: daysAhead(Math.floor(Math.random() * 30) + 1),
      },
    });
  }

  // ——— Calendar ———
  const calDefs = [
    ["Board meeting — Q3 review", 3, "MEETING", "Tehran HQ"],
    ["Gulfood expo — Dubai", 12, "EVENT", "Dubai World Trade Centre"],
    ["Copper shipment ETA — Bandar Abbas", 6, "DEADLINE", "Bandar Abbas"],
    ["LP call — Fund II", 8, "MEETING", "Video"],
    ["Site visit — Zagros mine", 18, "TRAVEL", "Kerman"],
    ["TradeBridge v2.3 release", 9, "DEADLINE", "Remote"],
    ["Istanbul corridor workshop", 22, "EVENT", "Istanbul"],
    ["Audit kickoff", 27, "MEETING", "Tehran HQ"],
  ] as const;
  for (const [title, inDays, type, location] of calDefs) {
    await prisma.calendarEvent.create({
      data: { title, start: daysAhead(inDays), end: daysAhead(inDays), type, location },
    });
  }

  // ——— Notifications ———
  const notifDefs = [
    ["Shipment cleared customs", "TR-2410 copper concentrate cleared Shanghai customs.", "SUCCESS"],
    ["Invoice overdue", "INV-24214 for Zagros Minerals is 12 days overdue.", "WARNING"],
    ["New marketplace order", "3.2t Negin saffron ordered via TradeBridge.", "INFO"],
    ["Deal stage changed", "Saffron EU Distribution moved to Negotiation.", "INFO"],
    ["Platform milestone", "TradeBridge passed 12,800 active users.", "SUCCESS"],
    ["Security notice", "New sign-in from Windows • Tehran.", "ALERT"],
  ] as const;
  for (const [title, body, type] of notifDefs) {
    await prisma.notification.create({ data: { title, body, type, userId: adminId } });
  }

  // ——— Conversations ———
  const convo = await prisma.conversation.create({ data: { title: "Gulf Horizon — annual offtake" } });
  await prisma.message.createMany({
    data: [
      { conversationId: convo.id, senderId: analystId, body: "Annex B is back from their counsel. Two redlines on inspection windows." },
      { conversationId: convo.id, senderId: adminId, body: "Accept the 72h window, hold the line on moisture spec. Send the summary today." },
      { conversationId: convo.id, senderId: analystId, body: "Done. Summary sent, signing call proposed for Thursday." },
    ],
  });
  const convo2 = await prisma.conversation.create({ data: { title: "Fund II — LP reporting" } });
  await prisma.message.createMany({
    data: [
      { conversationId: convo2.id, senderId: adminId, body: "Draft the Q3 letter around the two new positions and the Didar exit." },
      { conversationId: convo2.id, senderId: analystId, body: "First draft in the reports folder. IRR table refreshed with June marks." },
    ],
  });

  // ——— News ———
  const newsDefs = [
    {
      slug: "tradebridge-crosses-12k-members",
      titleEn: "TradeBridge crosses 12,800 verified members",
      titleFa: "ترید‌بریج از مرز ۱۲٬۸۰۰ عضو تأییدشده گذشت",
      excerptEn: "Our B2B export marketplace closed the quarter with record activity across 34 countries.",
      excerptFa: "بازارگاه صادراتی ما فصل را با فعالیت بی‌سابقه در ۳۴ کشور به پایان رساند.",
      bodyEn: "TradeBridge, the holding's flagship digital marketplace, ended the quarter with 12,800 verified members and gross merchandise volume up 41% year over year. Escrowed settlement — introduced eighteen months ago — now covers 87% of transactions, and average dispute resolution time has fallen below four days.\n\nThe next release extends inspection scheduling to nine new ports and introduces multi-currency settlement, starting with dirham and yuan pairs.",
      bodyFa: "ترید‌بریج، بازارگاه دیجیتال پرچم‌دار هلدینگ، فصل را با ۱۲٬۸۰۰ عضو تأییدشده و رشد ۴۱ درصدی حجم ناخالص معاملات نسبت به سال گذشته به پایان رساند. تسویه امانی که هجده ماه پیش معرفی شد اکنون ۸۷٪ تراکنش‌ها را پوشش می‌دهد و میانگین زمان حل اختلاف به کمتر از چهار روز رسیده است.\n\nنسخه بعدی، زمان‌بندی بازرسی را به نُه بندر جدید گسترش می‌دهد و تسویه چندارزی را با جفت‌ارزهای درهم و یوان آغاز می‌کند.",
      category: "Platforms", days: 6, read: 4,
    },
    {
      slug: "caspian-corridor-first-shipment",
      titleEn: "First cold-chain shipment completes the Caspian Agri Corridor",
      titleFa: "نخستین محموله زنجیره سرد، کریدور کشاورزی کاسپین را تکمیل کرد",
      excerptEn: "Forty-six hours from orchard to Dubai shelf — the corridor's first end-to-end run beat its target.",
      excerptFa: "چهل‌وشش ساعت از باغ تا قفسه دبی — نخستین اجرای کامل کریدور از هدف خود پیشی گرفت.",
      bodyEn: "The Caspian Agri Corridor moved its first commercial shipment this week: 24 tonnes of premium kiwi from Talesh, delivered to Dubai retail 46 hours after harvest. Temperature variance across the journey stayed within 0.8°C.\n\nThe corridor combines pre-cooling at origin, bonded truck transfer, and priority air freight — a chain we control end to end with our logistics partners. Weekly rotations begin next month.",
      bodyFa: "کریدور کشاورزی کاسپین این هفته نخستین محموله تجاری خود را جابه‌جا کرد: ۲۴ تن کیوی ممتاز تالش که ۴۶ ساعت پس از برداشت به خرده‌فروشی دبی رسید. نوسان دما در کل مسیر کمتر از ۰٫۸ درجه سانتی‌گراد بود.\n\nاین کریدور پیش‌سرمایش در مبدأ، حمل با کامیون ترانزیتی و بار هوایی اولویت‌دار را ترکیب می‌کند — زنجیره‌ای که با شرکای لجستیکی خود به‌طور کامل کنترل می‌کنیم. چرخه‌های هفتگی از ماه آینده آغاز می‌شود.",
      category: "Trade", days: 14, read: 5,
    },
    {
      slug: "fund-ii-first-close",
      titleEn: "ATA Invest Fund II reaches first close",
      titleFa: "صندوق آتا اینوست ۲ به نخستین مرحله تکمیل رسید",
      excerptEn: "Anchored by two regional institutions, Fund II will back knowledge-based companies scaling across borders.",
      excerptFa: "صندوق ۲ با پشتیبانی دو نهاد منطقه‌ای، از شرکت‌های دانش‌بنیان در مسیر جهانی‌شدن حمایت می‌کند.",
      bodyEn: "Fund II held its first close with commitments from two regional anchor institutions and a group of family offices. The mandate is deliberately focused: knowledge-based companies with proven domestic traction and a credible path into regional markets.\n\nFirst deployments are expected within the quarter, in healthtech diagnostics and precision agriculture.",
      bodyFa: "صندوق ۲ نخستین مرحله تکمیل خود را با تعهد دو نهاد منطقه‌ای و گروهی از دفاتر خانوادگی برگزار کرد. مأموریت صندوق کاملاً متمرکز است: شرکت‌های دانش‌بنیان با موفقیت اثبات‌شده داخلی و مسیر معتبر ورود به بازارهای منطقه.\n\nنخستین سرمایه‌گذاری‌ها طی همین فصل در حوزه تشخیص پزشکی و کشاورزی دقیق انجام خواهد شد.",
      category: "Investment", days: 21, read: 3,
    },
    {
      slug: "zagros-offtake-agreement",
      titleEn: "Long-term offtake signed for Zagros copper",
      titleFa: "قرارداد بلندمدت فروش مس زاگرس امضا شد",
      excerptEn: "A three-year concentrate agreement secures the expansion's economics ahead of construction.",
      excerptFa: "قرارداد سه‌ساله کنسانتره، اقتصاد طرح توسعه را پیش از ساخت تضمین می‌کند.",
      bodyEn: "The Zagros Copper Expansion secured a three-year offtake agreement covering 70% of planned concentrate output. The structure pairs a fixed treatment charge with quotational-period optionality — protecting downside while keeping upside exposure to the copper cycle.\n\nSite works begin after the financing package completes in the autumn.",
      bodyFa: "طرح توسعه مس زاگرس قرارداد فروش سه‌ساله‌ای برای ۷۰٪ از تولید برنامه‌ریزی‌شده کنسانتره امضا کرد. ساختار قرارداد، هزینه ثابت فرآوری را با اختیار دوره قیمت‌گذاری ترکیب می‌کند — پوشش ریسک نزولی همراه با بهره‌مندی از چرخه صعودی مس.\n\nعملیات اجرایی پس از تکمیل بسته تأمین مالی در پاییز آغاز می‌شود.",
      category: "Mining", days: 34, read: 4,
    },
    {
      slug: "istanbul-office-opening",
      titleEn: "New regional office opens in Istanbul",
      titleFa: "دفتر منطقه‌ای جدید در استانبول افتتاح شد",
      excerptEn: "A permanent base on the Bosphorus anchors our Europe–Asia corridor operations.",
      excerptFa: "پایگاه دائمی در کنار بسفر، عملیات کریدور اروپا–آسیا را تثبیت می‌کند.",
      bodyEn: "The holding opened its Istanbul office this month, a base for corridor operations linking European buyers with Asian supply. The office hosts trade finance, inspection coordination, and the EastBridge advisory partnership.\n\nIstanbul joins Tehran and Dubai as the third node in the holding's regional network.",
      bodyFa: "هلدینگ این ماه دفتر استانبول خود را افتتاح کرد؛ پایگاهی برای عملیات کریدوری که خریداران اروپایی را به عرضه آسیایی متصل می‌کند. این دفتر میزبان تأمین مالی تجاری، هماهنگی بازرسی و همکاری مشاوره‌ای ایست‌بریج است.\n\nاستانبول در کنار تهران و دبی، سومین گره شبکه منطقه‌ای هلدینگ است.",
      category: "Company", days: 48, read: 3,
    },
    {
      slug: "agrilink-water-savings",
      titleEn: "AgriLink data shows 60% water savings across smart greenhouses",
      titleFa: "داده‌های اگری‌لینک: صرفه‌جویی ۶۰ درصدی آب در گلخانه‌های هوشمند",
      excerptEn: "A full season of telemetry confirms the network's resource model — and its export-grade consistency.",
      excerptFa: "یک فصل کامل داده‌برداری، مدل مصرف منابع شبکه و کیفیت صادراتی پایدار آن را تأیید می‌کند.",
      bodyEn: "Twelve months of AgriLink telemetry across the Smart Greenhouse Network shows water use down 60% against open-field baselines, with export-grade consistency above 94%. Sensor-driven fertigation and closed-loop climate control account for most of the gain.\n\nThe dataset now informs site selection for the network's next three clusters.",
      bodyFa: "دوازده ماه داده‌برداری اگری‌لینک در شبکه گلخانه‌های هوشمند نشان می‌دهد مصرف آب نسبت به کشت باز ۶۰٪ کاهش یافته و یکنواختی کیفیت صادراتی بالای ۹۴٪ بوده است. تغذیه هوشمند و کنترل اقلیمی حلقه‌بسته بیشترین سهم را در این دستاورد دارند.\n\nاین داده‌ها اکنون مبنای انتخاب مکان سه مجموعه بعدی شبکه است.",
      category: "Agriculture", days: 60, read: 5,
    },
  ];
  for (const n of newsDefs) {
    await prisma.newsPost.create({
      data: {
        slug: n.slug, titleEn: n.titleEn, titleFa: n.titleFa,
        excerptEn: n.excerptEn, excerptFa: n.excerptFa,
        bodyEn: n.bodyEn, bodyFa: n.bodyFa,
        category: n.category, published: true,
        publishedAt: daysAgo(n.days), readMinutes: n.read,
      },
    });
  }

  // ——— Events ———
  const eventDefs = [
    ["gulfood-2027", "Gulfood 2027 — ATA Pavilion", "غرفه آتا در گلفود ۲۰۲۷", "Meet our trade desk and taste the corridor: live cold-chain tracking, export-grade produce, and partnership sessions.", "با میز تجاری ما دیدار کنید: رهگیری زنده زنجیره سرد، محصولات صادراتی و نشست‌های همکاری.", "Dubai World Trade Centre", 12, "EXPO"],
    ["investor-day-2026", "Annual Investor Day", "روز سالانه سرمایه‌گذاران", "The holding's full-portfolio review: performance, pipeline, and the three-year corridor roadmap.", "مرور کامل سبد هلدینگ: عملکرد، فرصت‌های پیش‌رو و نقشه راه سه‌ساله کریدورها.", "Tehran — Espinas Palace", 33, "SUMMIT"],
    ["knowledge-economy-forum", "Knowledge Economy Forum", "همایش اقتصاد دانش‌بنیان", "A working forum with founders and funds on scaling knowledge-based companies into regional markets.", "نشستی کاری با بنیان‌گذاران و صندوق‌ها درباره جهانی‌سازی شرکت‌های دانش‌بنیان.", "Tehran — Innovation Factory", 52, "FORUM"],
    ["cold-chain-webinar", "Webinar: Inside the Caspian Cold Chain", "وبینار: درون زنجیره سرد کاسپین", "How 46-hour orchard-to-shelf works: pre-cooling, bonded transfer, and telemetry, with live Q&A.", "چگونه مسیر ۴۶ ساعته باغ تا قفسه ممکن شد: پیش‌سرمایش، ترانزیت و داده‌برداری، همراه با پرسش و پاسخ.", "Online", 20, "WEBINAR"],
    ["mining-tech-days", "Mining Technology Days", "روزهای فناوری معدن", "Two days on ore-body modelling, water stewardship, and concentrate logistics with our Zagros team.", "دو روز درباره مدل‌سازی کانسار، مدیریت آب و لجستیک کنسانتره با تیم زاگرس.", "Kerman", 75, "SUMMIT"],
  ] as const;
  for (const [slug, titleEn, titleFa, descriptionEn, descriptionFa, location, inDays, type] of eventDefs) {
    await prisma.event.create({
      data: {
        slug, titleEn, titleFa, descriptionEn, descriptionFa, location,
        startDate: daysAhead(inDays), type,
      },
    });
  }

  // ——— Jobs ———
  const jobDefs = [
    ["senior-trade-analyst", "Senior Trade Analyst", "تحلیلگر ارشد تجارت", "International Trade", "تجارت بین‌الملل", "Tehran", "FULL_TIME",
      "Own corridor economics end to end: pricing, incoterm structuring, and counterparty analysis for export programs moving eight figures annually. You will sit between the trade desk and logistics, and your models will decide what ships.",
      "مالکیت کامل اقتصاد کریدورها: قیمت‌گذاری، ساختاردهی اینکوترمز و تحلیل طرف‌های معامله برای برنامه‌های صادراتی. شما میان میز تجاری و لجستیک قرار می‌گیرید و مدل‌های شما تعیین می‌کند چه محموله‌ای ارسال شود."],
    ["frontend-engineer-platforms", "Frontend Engineer — Platforms", "مهندس فرانت‌اند — پلتفرم‌ها", "Technology", "فناوری", "Remote / Tehran", "REMOTE",
      "Build TradeBridge and AgriLink interfaces used by thousands of exporters daily. React, TypeScript, and an obsession with fast, accessible UI. You ship weekly and own what you ship.",
      "رابط‌های ترید‌بریج و اگری‌لینک را بسازید که روزانه هزاران صادرکننده استفاده می‌کنند. ری‌اکت، تایپ‌اسکریپت و وسواس روی رابط سریع و در دسترس. هر هفته انتشار می‌دهید و مالک کار خود هستید."],
    ["investment-associate", "Investment Associate — Fund II", "کارشناس سرمایه‌گذاری — صندوق ۲", "Investment", "سرمایه‌گذاری", "Tehran", "FULL_TIME",
      "Source and evaluate knowledge-based companies for Fund II. You will build the models, sit in the diligence room, and draft the memos that go to IC.",
      "شناسایی و ارزیابی شرکت‌های دانش‌بنیان برای صندوق ۲. شما مدل‌ها را می‌سازید، در جلسات ارزیابی حضور دارید و گزارش‌های کمیته سرمایه‌گذاری را می‌نویسید."],
    ["logistics-coordinator", "Logistics Coordinator — Cold Chain", "هماهنگ‌کننده لجستیک — زنجیره سرد", "Supply Chain", "زنجیره تأمین", "Bandar Anzali", "FULL_TIME",
      "Run the daily rhythm of the Caspian corridor: pre-cooling schedules, bonded transfers, and telemetry monitoring. When the variance alarm fires at 2 AM, you know who to call.",
      "ریتم روزانه کریدور کاسپین را اداره کنید: زمان‌بندی پیش‌سرمایش، ترانزیت و پایش داده‌ها. وقتی هشدار دما نیمه‌شب فعال شود، می‌دانید با چه کسی تماس بگیرید."],
    ["brand-designer", "Brand Designer", "طراح برند", "Branding", "برندینگ", "Tehran", "FULL_TIME",
      "Give shape to a family of brands — from commodity export marks to consumer-facing platforms. Systems thinking, typographic craft, and the judgment to know when less is more.",
      "به خانواده‌ای از برندها شکل دهید — از نشان‌های صادراتی تا پلتفرم‌های مصرف‌کننده. تفکر سیستمی، مهارت تایپوگرافی و قضاوتِ دانستن اینکه کجا کمتر، بیشتر است."],
    ["tourism-product-manager", "Tourism Product Manager", "مدیر محصول گردشگری", "Tourism", "گردشگری", "Shiraz", "CONTRACT",
      "Design the Persepolis Heritage Route's guest experience: itineraries, boutique stays, and the operational playbook that makes a cultural route run like clockwork.",
      "تجربه مهمان مسیر تخت‌جمشید را طراحی کنید: برنامه سفر، اقامتگاه‌های بوتیک و دستورالعمل عملیاتی که یک مسیر فرهنگی را مثل ساعت دقیق می‌کند."],
  ] as const;
  for (const [slug, titleEn, titleFa, departmentEn, departmentFa, location, type, descriptionEn, descriptionFa] of jobDefs) {
    await prisma.jobOpening.create({
      data: { slug, titleEn, titleFa, departmentEn, departmentFa, location, type, descriptionEn, descriptionFa, postedAt: daysAgo(Math.floor(Math.random() * 30) + 2) },
    });
  }

  // ——— Contact submissions ———
  const contactDefs = [
    ["David Chen", "d.chen@pacificrim.jp", "Pacific Rim Partners", "Partnership", "We are exploring corridor partnerships for Japanese specialty foods into the Gulf. Could we schedule a call?"],
    ["Leyla Aydın", "leyla@anatoliasteel.tr", "Anatolia Steelworks", "Trade", "Requesting a quote for 800t structural steel, Mersin to Tashkent, Q4 delivery."],
    ["Omar Al-Rashid", "omar@khaleejventures.ae", "Khaleej Ventures", "Investment", "Interested in Fund II co-investment terms for the healthtech position."],
    ["Priya Sharma", "priya.s@mumbaitextile.in", "Mumbai Textile House", "Trade", "Following up on the machinery refit discussion from Gulfood."],
  ] as const;
  for (const [name, email, company, topic, message] of contactDefs) {
    await prisma.contactSubmission.create({ data: { name, email, company, topic, message } });
  }

  console.info("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
