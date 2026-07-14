import type { LucideIcon } from "lucide-react";
import {
  Award,
  Container,
  Cpu,
  Gem,
  Globe2,
  Landmark,
  LayoutGrid,
  Leaf,
  Lightbulb,
  Compass,
  Handshake,
} from "lucide-react";
import type { L } from "@/lib/content";

export type BusinessArea = {
  slug: string;
  icon: LucideIcon;
  name: L;
  tagline: L;
  description: L;
  capabilities: { title: L; body: L }[];
  process: { title: L; body: L }[];
  stats: { value: number; prefix?: string; suffix?: string; label: L }[];
};

export const BUSINESS_AREAS: BusinessArea[] = [
  {
    slug: "international-trade",
    icon: Globe2,
    name: { en: "International Trade", fa: "تجارت بین‌الملل" },
    tagline: {
      en: "Corridors, not transactions.",
      fa: "کریدور می‌سازیم، نه معامله.",
    },
    description: {
      en: "We design and operate recurring trade corridors — pricing, counterparties, financing, and logistics engineered as one system, so goods move on schedule and margins survive the journey.",
      fa: "ما کریدورهای تجاری تکرارشونده را طراحی و اداره می‌کنیم — قیمت‌گذاری، طرف‌های معامله، تأمین مالی و لجستیک به‌عنوان یک سیستم واحد، تا کالا طبق برنامه حرکت کند و حاشیه سود در طول مسیر حفظ شود.",
    },
    capabilities: [
      {
        title: { en: "Corridor design", fa: "طراحی کریدور" },
        body: {
          en: "Route economics, incoterm structuring, and counterparty vetting for repeatable flows.",
          fa: "اقتصاد مسیر، ساختاردهی اینکوترمز و اعتبارسنجی طرف‌ها برای جریان‌های تکرارپذیر.",
        },
      },
      {
        title: { en: "Trade finance", fa: "تأمین مالی تجاری" },
        body: {
          en: "LC advisory, escrowed settlement, and working-capital lines through partner banks.",
          fa: "مشاوره اعتبار اسنادی، تسویه امانی و خطوط سرمایه در گردش از طریق بانک‌های همکار.",
        },
      },
      {
        title: { en: "Market entry", fa: "ورود به بازار" },
        body: {
          en: "Regulatory mapping, distribution partnerships, and first-shipment execution.",
          fa: "شناخت مقررات، شراکت‌های توزیع و اجرای نخستین محموله.",
        },
      },
    ],
    process: [
      {
        title: { en: "Map", fa: "نگاشت" },
        body: {
          en: "We model the corridor end to end before a single container moves.",
          fa: "پیش از حرکت حتی یک کانتینر، کریدور را به‌طور کامل مدل می‌کنیم.",
        },
      },
      {
        title: { en: "Pilot", fa: "پایلوت" },
        body: {
          en: "A controlled first shipment proves the economics and the partners.",
          fa: "نخستین محموله کنترل‌شده، اقتصاد مسیر و شرکا را می‌آزماید.",
        },
      },
      {
        title: { en: "Scale", fa: "مقیاس" },
        body: {
          en: "Weekly rotations, hedged pricing, and continuous telemetry.",
          fa: "چرخه‌های هفتگی، قیمت‌گذاری پوشش‌داده‌شده و پایش مستمر.",
        },
      },
    ],
    stats: [
      { value: 34, label: { en: "Active markets", fa: "بازار فعال" } },
      { value: 120, prefix: "$", suffix: "M+", label: { en: "Annual trade volume", fa: "حجم تجارت سالانه" } },
      { value: 11, label: { en: "Live corridors", fa: "کریدور فعال" } },
    ],
  },
  {
    slug: "import-export",
    icon: Container,
    name: { en: "Import & Export", fa: "واردات و صادرات" },
    tagline: {
      en: "From origin to shelf, accountable at every step.",
      fa: "از مبدأ تا قفسه، پاسخگو در هر مرحله.",
    },
    description: {
      en: "Full-service execution for physical trade: sourcing, quality inspection, customs, cold chain, and last-mile documentation — handled by one team with one point of accountability.",
      fa: "اجرای کامل تجارت فیزیکی: تأمین، بازرسی کیفیت، گمرک، زنجیره سرد و اسناد تحویل نهایی — توسط یک تیم با یک نقطه پاسخگویی.",
    },
    capabilities: [
      {
        title: { en: "Sourcing & QC", fa: "تأمین و کنترل کیفیت" },
        body: {
          en: "Origin-verified suppliers with lot-level inspection and certification.",
          fa: "تأمین‌کنندگان اعتبارسنجی‌شده با بازرسی و گواهی در سطح هر محموله.",
        },
      },
      {
        title: { en: "Customs & compliance", fa: "گمرک و انطباق" },
        body: {
          en: "Classification, documentation, and clearance across 20+ jurisdictions.",
          fa: "طبقه‌بندی، اسناد و ترخیص در بیش از ۲۰ حوزه گمرکی.",
        },
      },
      {
        title: { en: "Cold chain", fa: "زنجیره سرد" },
        body: {
          en: "Temperature-controlled corridors with live telemetry from orchard to shelf.",
          fa: "کریدورهای دما‌کنترل با پایش زنده از باغ تا قفسه.",
        },
      },
    ],
    process: [
      {
        title: { en: "Source", fa: "تأمین" },
        body: { en: "Verified origin, inspected lots, locked specs.", fa: "مبدأ معتبر، محموله بازرسی‌شده، مشخصات قطعی." },
      },
      {
        title: { en: "Move", fa: "حمل" },
        body: { en: "Bonded transfer with telemetry and priority freight.", fa: "ترانزیت با پایش لحظه‌ای و حمل اولویت‌دار." },
      },
      {
        title: { en: "Deliver", fa: "تحویل" },
        body: { en: "Cleared, documented, and settled through escrow.", fa: "ترخیص، مستندسازی و تسویه امانی." },
      },
    ],
    stats: [
      { value: 48, suffix: "h", label: { en: "Orchard to Gulf shelf", fa: "از باغ تا قفسه خلیج" } },
      { value: 2400, suffix: "+", label: { en: "Shipments handled", fa: "محموله انجام‌شده" } },
      { value: 99.2, suffix: "%", label: { en: "On-spec delivery", fa: "تحویل مطابق مشخصات" } },
    ],
  },
  {
    slug: "investment",
    icon: Landmark,
    name: { en: "Investment", fa: "سرمایه‌گذاری" },
    tagline: {
      en: "Patient capital with an operator's eye.",
      fa: "سرمایه صبور با نگاه یک بهره‌بردار.",
    },
    description: {
      en: "We invest where we operate. Fund vehicles and direct positions in companies whose growth we can accelerate through the holding's corridors, platforms, and partners.",
      fa: "جایی سرمایه‌گذاری می‌کنیم که خود در آن فعالیت داریم. صندوق‌ها و سرمایه‌گذاری مستقیم در شرکت‌هایی که رشدشان را با کریدورها، پلتفرم‌ها و شرکای هلدینگ شتاب می‌دهیم.",
    },
    capabilities: [
      {
        title: { en: "Growth funds", fa: "صندوق‌های رشد" },
        body: {
          en: "Sector-focused vehicles backing knowledge-based companies scaling regionally.",
          fa: "صندوق‌های تخصصی برای شرکت‌های دانش‌بنیان در مسیر رشد منطقه‌ای.",
        },
      },
      {
        title: { en: "Direct investment", fa: "سرمایه‌گذاری مستقیم" },
        body: {
          en: "Control and significant-minority positions in trade-adjacent operators.",
          fa: "مالکیت کنترلی و اقلیت مؤثر در شرکت‌های مرتبط با زنجیره تجارت.",
        },
      },
      {
        title: { en: "Co-investment", fa: "سرمایه‌گذاری مشترک" },
        body: {
          en: "Structured entry for institutions and family offices alongside the holding.",
          fa: "ورود ساختاریافته نهادها و دفاتر خانوادگی در کنار هلدینگ.",
        },
      },
    ],
    process: [
      {
        title: { en: "Thesis", fa: "تز سرمایه‌گذاری" },
        body: { en: "Sectors where our operations give an information edge.", fa: "بخش‌هایی که عملیات ما مزیت اطلاعاتی می‌دهد." },
      },
      {
        title: { en: "Diligence", fa: "ارزیابی موشکافانه" },
        body: { en: "Operator-led diligence, not spreadsheet tourism.", fa: "ارزیابی توسط بهره‌بردار، نه صرفاً تحلیل روی کاغذ." },
      },
      {
        title: { en: "Build", fa: "ساختن" },
        body: { en: "Post-investment access to corridors, platforms, and buyers.", fa: "دسترسی پس از سرمایه‌گذاری به کریدورها، پلتفرم‌ها و خریداران." },
      },
    ],
    stats: [
      { value: 25, prefix: "$", suffix: "M", label: { en: "Fund II target", fa: "هدف صندوق ۲" } },
      { value: 8, label: { en: "Portfolio companies", fa: "شرکت در سبد" } },
      { value: 23, suffix: "%", label: { en: "Median portfolio IRR", fa: "میانه بازده سبد" } },
    ],
  },
  {
    slug: "technology",
    icon: Cpu,
    name: { en: "Technology", fa: "فناوری" },
    tagline: {
      en: "Software where trade actually happens.",
      fa: "نرم‌افزار در نقطه‌ای که تجارت واقعاً رخ می‌دهد.",
    },
    description: {
      en: "An in-house engineering group building the systems our businesses run on — marketplaces, logistics telemetry, AI-assisted pricing — then offering them to the market as products.",
      fa: "گروه مهندسی داخلی که سیستم‌های زیربنایی کسب‌وکارهای ما را می‌سازد — بازارگاه‌ها، پایش لجستیک، قیمت‌گذاری هوشمند — و سپس آن‌ها را به‌عنوان محصول به بازار عرضه می‌کند.",
    },
    capabilities: [
      {
        title: { en: "Platform engineering", fa: "مهندسی پلتفرم" },
        body: {
          en: "Web-scale marketplaces and portals with payments, escrow, and identity built in.",
          fa: "بازارگاه‌ها و درگاه‌های مقیاس‌پذیر با پرداخت، امانت‌داری و احراز هویت یکپارچه.",
        },
      },
      {
        title: { en: "Applied AI", fa: "هوش مصنوعی کاربردی" },
        body: {
          en: "Pricing models, demand forecasting, and document intelligence for trade ops.",
          fa: "مدل‌های قیمت‌گذاری، پیش‌بینی تقاضا و هوشمندی اسناد برای عملیات تجاری.",
        },
      },
      {
        title: { en: "IoT & telemetry", fa: "اینترنت اشیا و پایش" },
        body: {
          en: "Sensor networks for cold chain, greenhouses, and mining operations.",
          fa: "شبکه‌های حسگر برای زنجیره سرد، گلخانه‌ها و عملیات معدنی.",
        },
      },
    ],
    process: [
      {
        title: { en: "Embed", fa: "استقرار" },
        body: { en: "Engineers sit inside the operating business first.", fa: "مهندسان ابتدا درون کسب‌وکار عملیاتی مستقر می‌شوند." },
      },
      {
        title: { en: "Systemize", fa: "سیستم‌سازی" },
        body: { en: "What works becomes a product with an SLA.", fa: "آنچه جواب می‌دهد به محصولی با تعهد خدمات تبدیل می‌شود." },
      },
      {
        title: { en: "License", fa: "عرضه" },
        body: { en: "Proven systems are offered to partners and the market.", fa: "سیستم‌های اثبات‌شده به شرکا و بازار عرضه می‌شوند." },
      },
    ],
    stats: [
      { value: 40, suffix: "+", label: { en: "Engineers & data scientists", fa: "مهندس و دانشمند داده" } },
      { value: 4, label: { en: "Products in production", fa: "محصول در بهره‌برداری" } },
      { value: 17000, suffix: "+", label: { en: "Platform users", fa: "کاربر پلتفرم‌ها" } },
    ],
  },
  {
    slug: "digital-platforms",
    icon: LayoutGrid,
    name: { en: "Digital Platforms", fa: "پلتفرم‌های دیجیتال" },
    tagline: {
      en: "Marketplaces with settlement you can trust.",
      fa: "بازارگاه‌هایی با تسویه‌ای قابل اعتماد.",
    },
    description: {
      en: "TradeBridge, AgriLink, ATA Invest, TourPort — a family of platforms that digitize the holding's businesses and open them to thousands of counterparties.",
      fa: "ترید‌بریج، اگری‌لینک، آتا اینوست و تورپورت — خانواده‌ای از پلتفرم‌ها که کسب‌وکارهای هلدینگ را دیجیتال می‌کنند و به روی هزاران طرف معامله می‌گشایند.",
    },
    capabilities: [
      {
        title: { en: "B2B marketplaces", fa: "بازارگاه بین‌بنگاهی" },
        body: {
          en: "Verified sellers, escrowed settlement, inspection scheduling, and freight in one flow.",
          fa: "فروشندگان تأییدشده، تسویه امانی، زمان‌بندی بازرسی و حمل در یک جریان واحد.",
        },
      },
      {
        title: { en: "Supply-chain visibility", fa: "شفافیت زنجیره تأمین" },
        body: {
          en: "Farm-to-port telemetry that buyers can watch in real time.",
          fa: "پایش مزرعه تا بندر که خریدار به‌صورت زنده می‌بیند.",
        },
      },
      {
        title: { en: "Investment gateway", fa: "درگاه سرمایه‌گذاری" },
        body: {
          en: "Digital onboarding for co-investment across the holding's pipeline.",
          fa: "ورود دیجیتال به فرصت‌های سرمایه‌گذاری مشترک هلدینگ.",
        },
      },
    ],
    process: [
      {
        title: { en: "Digitize", fa: "دیجیتال‌سازی" },
        body: { en: "Start with a flow the holding already runs physically.", fa: "از جریانی آغاز می‌کنیم که هلدینگ به‌صورت فیزیکی اداره می‌کند." },
      },
      {
        title: { en: "Open", fa: "گشودن" },
        body: { en: "Third parties join once the flow is proven.", fa: "پس از اثبات جریان، طرف‌های ثالث می‌پیوندند." },
      },
      {
        title: { en: "Network", fa: "شبکه‌سازی" },
        body: { en: "Liquidity compounds as both sides grow.", fa: "با رشد دو سوی بازار، نقدشوندگی مرکب می‌شود." },
      },
    ],
    stats: [
      { value: 12800, suffix: "+", label: { en: "Verified members", fa: "عضو تأییدشده" } },
      { value: 87, suffix: "%", label: { en: "Escrowed transactions", fa: "تراکنش امانی" } },
      { value: 41, suffix: "%", label: { en: "GMV growth, YoY", fa: "رشد سالانه حجم معاملات" } },
    ],
  },
  {
    slug: "consulting",
    icon: Compass,
    name: { en: "Business Consulting", fa: "مشاوره کسب‌وکار" },
    tagline: {
      en: "Advice from people who ship.",
      fa: "مشاوره از کسانی که خودشان اجرا کرده‌اند.",
    },
    description: {
      en: "Market-entry, corridor, and growth advisory grounded in our own operations — the playbooks we sell are the ones we run.",
      fa: "مشاوره ورود به بازار، کریدور و رشد بر پایه عملیات واقعی خودمان — راهبردهایی که ارائه می‌کنیم همان‌هایی است که خود اجرا می‌کنیم.",
    },
    capabilities: [
      {
        title: { en: "Market entry", fa: "ورود به بازار" },
        body: {
          en: "Regulation, channel, and partner mapping for new geographies.",
          fa: "نگاشت مقررات، کانال و شرکا برای جغرافیای جدید.",
        },
      },
      {
        title: { en: "Trade operations", fa: "عملیات تجاری" },
        body: {
          en: "Incoterm and settlement design, logistics audit, and risk controls.",
          fa: "طراحی اینکوترمز و تسویه، ممیزی لجستیک و کنترل ریسک.",
        },
      },
      {
        title: { en: "Corporate development", fa: "توسعه شرکتی" },
        body: {
          en: "Partnership structuring, JV design, and negotiation support.",
          fa: "ساختاردهی شراکت، طراحی سرمایه‌گذاری مشترک و پشتیبانی مذاکره.",
        },
      },
    ],
    process: [
      {
        title: { en: "Diagnose", fa: "تشخیص" },
        body: { en: "Two weeks inside your numbers and your flow.", fa: "دو هفته درون اعداد و جریان کاری شما." },
      },
      {
        title: { en: "Design", fa: "طراحی" },
        body: { en: "A plan priced to outcomes, not hours.", fa: "برنامه‌ای مبتنی بر نتیجه، نه ساعت کاری." },
      },
      {
        title: { en: "Deliver", fa: "اجرا" },
        body: { en: "We stay through execution — often as a partner.", fa: "تا پایان اجرا می‌مانیم — اغلب به‌عنوان شریک." },
      },
    ],
    stats: [
      { value: 60, suffix: "+", label: { en: "Engagements delivered", fa: "پروژه مشاوره انجام‌شده" } },
      { value: 14, label: { en: "Countries covered", fa: "کشور پوشش‌داده‌شده" } },
      { value: 70, suffix: "%", label: { en: "Clients who return", fa: "مشتریانی که بازمی‌گردند" } },
    ],
  },
  {
    slug: "branding",
    icon: Award,
    name: { en: "Brand Development", fa: "توسعه برند" },
    tagline: {
      en: "Origin stories the world can taste.",
      fa: "روایت خاستگاه، به زبانی جهانی.",
    },
    description: {
      en: "We turn commodities into brands: identity, packaging, certification, and route-to-shelf strategy that captures the value origin deserves.",
      fa: "کالا را به برند تبدیل می‌کنیم: هویت، بسته‌بندی، گواهی‌ها و استراتژی رسیدن به قفسه، تا ارزشی که شایسته خاستگاه است به دست آید.",
    },
    capabilities: [
      {
        title: { en: "Brand strategy", fa: "استراتژی برند" },
        body: {
          en: "Positioning and architecture for export brands and platforms.",
          fa: "جایگاه‌یابی و معماری برند برای برندهای صادراتی و پلتفرم‌ها.",
        },
      },
      {
        title: { en: "Identity & packaging", fa: "هویت و بسته‌بندی" },
        body: {
          en: "Design systems that survive a freight journey and win a shelf.",
          fa: "سیستم‌های طراحی که مسیر حمل را تاب می‌آورند و قفسه را می‌برند.",
        },
      },
      {
        title: { en: "Origin certification", fa: "گواهی خاستگاه" },
        body: {
          en: "GI, organic, and quality marks that command premium pricing.",
          fa: "نشان جغرافیایی، ارگانیک و کیفیت برای قیمت‌گذاری ممتاز.",
        },
      },
    ],
    process: [
      {
        title: { en: "Uncover", fa: "کشف" },
        body: { en: "The product's true story, from soil to craft.", fa: "روایت واقعی محصول، از خاک تا هنر ساخت." },
      },
      {
        title: { en: "Shape", fa: "شکل‌دادن" },
        body: { en: "Identity, voice, and packaging as one system.", fa: "هویت، لحن و بسته‌بندی به‌عنوان یک سیستم." },
      },
      {
        title: { en: "Launch", fa: "عرضه" },
        body: { en: "Route-to-shelf through our own corridors.", fa: "مسیر تا قفسه از طریق کریدورهای خودمان." },
      },
    ],
    stats: [
      { value: 20, suffix: "+", label: { en: "Brands developed", fa: "برند توسعه‌یافته" } },
      { value: 3.2, suffix: "x", label: { en: "Avg. price uplift vs. bulk", fa: "افزایش قیمت نسبت به فله" } },
      { value: 9, label: { en: "Export markets on shelf", fa: "بازار صادراتی روی قفسه" } },
    ],
  },
  {
    slug: "agriculture",
    icon: Leaf,
    name: { en: "Agriculture", fa: "کشاورزی" },
    tagline: {
      en: "Export-grade, water-smart, data-run.",
      fa: "صادرات‌محور، کم‌آب‌بر، داده‌محور.",
    },
    description: {
      en: "Smart greenhouses, contract farming, and cold-chain corridors that turn regional produce into a reliable export category.",
      fa: "گلخانه‌های هوشمند، کشت قراردادی و کریدورهای زنجیره سرد که محصولات منطقه را به یک دسته صادراتی قابل اتکا تبدیل می‌کند.",
    },
    capabilities: [
      {
        title: { en: "Smart greenhouses", fa: "گلخانه هوشمند" },
        body: {
          en: "IoT-run clusters producing year-round with 60% less water.",
          fa: "مجموعه‌های مبتنی بر اینترنت اشیا با تولید تمام‌سال و ۶۰٪ آب کمتر.",
        },
      },
      {
        title: { en: "Contract farming", fa: "کشت قراردادی" },
        body: {
          en: "Guaranteed offtake with agronomy support and input financing.",
          fa: "خرید تضمینی همراه با پشتیبانی زراعی و تأمین مالی نهاده‌ها.",
        },
      },
      {
        title: { en: "Perishable logistics", fa: "لجستیک فاسدشدنی" },
        body: {
          en: "Pre-cooling, bonded transfer, and 48-hour corridor delivery.",
          fa: "پیش‌سرمایش، ترانزیت و تحویل ۴۸ ساعته در کریدور.",
        },
      },
    ],
    process: [
      {
        title: { en: "Grow", fa: "کاشت" },
        body: { en: "Controlled environments, verified inputs.", fa: "محیط کنترل‌شده و نهاده‌های معتبر." },
      },
      {
        title: { en: "Grade", fa: "درجه‌بندی" },
        body: { en: "Lot-level QC against export specs.", fa: "کنترل کیفیت هر محموله مطابق مشخصات صادراتی." },
      },
      {
        title: { en: "Ship", fa: "ارسال" },
        body: { en: "Cold chain with live telemetry to the buyer.", fa: "زنجیره سرد با پایش زنده برای خریدار." },
      },
    ],
    stats: [
      { value: 60, suffix: "%", label: { en: "Water saved vs. open field", fa: "صرفه‌جویی آب نسبت به کشت باز" } },
      { value: 94, suffix: "%", label: { en: "Export-grade consistency", fa: "یکنواختی کیفیت صادراتی" } },
      { value: 12, label: { en: "Greenhouse clusters", fa: "مجموعه گلخانه‌ای" } },
    ],
  },
  {
    slug: "mining",
    icon: Gem,
    name: { en: "Mining", fa: "معدن" },
    tagline: {
      en: "Responsible extraction, structured offtake.",
      fa: "استخراج مسئولانه، فروش ساختاریافته.",
    },
    description: {
      en: "Development capital and offtake structuring for mid-scale mineral operations — copper, and industrial minerals — with water stewardship engineered in from day one.",
      fa: "سرمایه توسعه و ساختاردهی قرارداد فروش برای عملیات معدنی میان‌مقیاس — مس و مواد معدنی صنعتی — با مدیریت مسئولانه آب از روز نخست.",
    },
    capabilities: [
      {
        title: { en: "Project development", fa: "توسعه پروژه" },
        body: {
          en: "Resource modelling, feasibility, and financing packages.",
          fa: "مدل‌سازی ذخیره، امکان‌سنجی و بسته‌های تأمین مالی.",
        },
      },
      {
        title: { en: "Offtake structuring", fa: "ساختاردهی فروش" },
        body: {
          en: "Multi-year concentrate agreements balancing certainty and upside.",
          fa: "قراردادهای چندساله کنسانتره با توازن قطعیت و پتانسیل رشد.",
        },
      },
      {
        title: { en: "Concentrate logistics", fa: "لجستیک کنسانتره" },
        body: {
          en: "Bulk handling, port coordination, and quality settlement.",
          fa: "جابه‌جایی فله، هماهنگی بندر و تسویه بر اساس کیفیت.",
        },
      },
    ],
    process: [
      {
        title: { en: "Prove", fa: "اثبات" },
        body: { en: "Independent resource verification before capital.", fa: "راستی‌آزمایی مستقل ذخیره پیش از تزریق سرمایه." },
      },
      {
        title: { en: "Structure", fa: "ساختاردهی" },
        body: { en: "Offtake first — the mine is financed by its buyers.", fa: "ابتدا قرارداد فروش — معدن با خریدارانش تأمین مالی می‌شود." },
      },
      {
        title: { en: "Operate", fa: "بهره‌برداری" },
        body: { en: "Water, safety, and community metrics reported quarterly.", fa: "گزارش فصلی شاخص‌های آب، ایمنی و جامعه محلی." },
      },
    ],
    stats: [
      { value: 14.2, prefix: "$", suffix: "M", label: { en: "Zagros expansion value", fa: "ارزش طرح توسعه زاگرس" } },
      { value: 70, suffix: "%", label: { en: "Output under offtake", fa: "تولید تحت قرارداد فروش" } },
      { value: 3, label: { en: "Active operations", fa: "عملیات فعال" } },
    ],
  },
  {
    slug: "tourism",
    icon: Handshake,
    name: { en: "Tourism", fa: "گردشگری" },
    tagline: {
      en: "Heritage, hosted properly.",
      fa: "میراث، با میزبانی درخور.",
    },
    description: {
      en: "Curated cultural routes and the booking infrastructure behind them — pairing heritage sites with boutique hospitality and running it all on our own platform.",
      fa: "مسیرهای فرهنگی برگزیده و زیرساخت رزرو پشت آن‌ها — پیوند آثار تاریخی با اقامتگاه‌های بوتیک، بر بستر پلتفرم خودمان.",
    },
    capabilities: [
      {
        title: { en: "Route design", fa: "طراحی مسیر" },
        body: {
          en: "Multi-day cultural itineraries with vetted guides and stays.",
          fa: "برنامه‌های چندروزه فرهنگی با راهنمایان و اقامتگاه‌های ارزیابی‌شده.",
        },
      },
      {
        title: { en: "Hospitality investment", fa: "سرمایه‌گذاری اقامتی" },
        body: {
          en: "Boutique property development along signature routes.",
          fa: "توسعه اقامتگاه‌های بوتیک در طول مسیرهای شاخص.",
        },
      },
      {
        title: { en: "Booking infrastructure", fa: "زیرساخت رزرو" },
        body: {
          en: "TourPort: inventory, payments, and operator tooling.",
          fa: "تورپورت: مدیریت ظرفیت، پرداخت و ابزار اپراتورها.",
        },
      },
    ],
    process: [
      {
        title: { en: "Curate", fa: "گزینش" },
        body: { en: "Few routes, done to an exacting standard.", fa: "مسیرهای اندک، با استانداردی سخت‌گیرانه." },
      },
      {
        title: { en: "Host", fa: "میزبانی" },
        body: { en: "Trained hosts, boutique stays, honest pricing.", fa: "میزبانان آموزش‌دیده، اقامت بوتیک و قیمت منصفانه." },
      },
      {
        title: { en: "Measure", fa: "سنجش" },
        body: { en: "Guest experience scored trip by trip.", fa: "تجربه مهمان، سفر به سفر سنجیده می‌شود." },
      },
    ],
    stats: [
      { value: 5, label: { en: "Signature routes", fa: "مسیر شاخص" } },
      { value: 4.8, label: { en: "Avg. guest rating", fa: "میانگین امتیاز مهمانان" } },
      { value: 30, suffix: "+", label: { en: "Boutique partners", fa: "شریک بوتیک" } },
    ],
  },
  {
    slug: "knowledge-based",
    icon: Lightbulb,
    name: { en: "Knowledge-Based Services", fa: "خدمات دانش‌بنیان" },
    tagline: {
      en: "From lab bench to trade lane.",
      fa: "از میز آزمایشگاه تا مسیر تجارت.",
    },
    description: {
      en: "We help knowledge-based companies cross the hardest gap — from certified product to international revenue — with capital, corridors, and commercial muscle.",
      fa: "به شرکت‌های دانش‌بنیان کمک می‌کنیم سخت‌ترین فاصله را طی کنند — از محصول گواهی‌شده تا درآمد بین‌المللی — با سرمایه، کریدور و توان تجاری.",
    },
    capabilities: [
      {
        title: { en: "Commercialization", fa: "تجاری‌سازی" },
        body: {
          en: "Pricing, certification, and first-customer programs abroad.",
          fa: "قیمت‌گذاری، اخذ گواهی و برنامه نخستین مشتری خارجی.",
        },
      },
      {
        title: { en: "Export readiness", fa: "آمادگی صادراتی" },
        body: {
          en: "Compliance, packaging, and channel design for technical products.",
          fa: "انطباق، بسته‌بندی و طراحی کانال برای محصولات فنی.",
        },
      },
      {
        title: { en: "Growth capital", fa: "سرمایه رشد" },
        body: {
          en: "Fund II positions with operational support attached.",
          fa: "سرمایه‌گذاری صندوق ۲ همراه با پشتیبانی عملیاتی.",
        },
      },
    ],
    process: [
      {
        title: { en: "Qualify", fa: "احراز" },
        body: { en: "Proven domestic traction and a certifiable product.", fa: "موفقیت داخلی اثبات‌شده و محصول قابل گواهی." },
      },
      {
        title: { en: "Equip", fa: "تجهیز" },
        body: { en: "Certification, pricing, and pilot buyers arranged.", fa: "گواهی، قیمت‌گذاری و خریداران آزمایشی فراهم می‌شود." },
      },
      {
        title: { en: "Export", fa: "صادرات" },
        body: { en: "First shipments ride our existing corridors.", fa: "نخستین محموله‌ها با کریدورهای موجود ما ارسال می‌شوند." },
      },
    ],
    stats: [
      { value: 15, suffix: "+", label: { en: "Companies supported", fa: "شرکت پشتیبانی‌شده" } },
      { value: 6, label: { en: "First-export programs live", fa: "برنامه فعال نخستین صادرات" } },
      { value: 2, prefix: "$", suffix: "M+", label: { en: "New export revenue created", fa: "درآمد صادراتی جدید" } },
    ],
  },
];

export function getBusinessArea(slug: string) {
  return BUSINESS_AREAS.find((a) => a.slug === slug);
}
