import type { L } from "@/lib/content";

export const HERO = {
  eyebrow: {
    en: "Investment & International Trade Holding",
    fa: "هلدینگ سرمایه‌گذاری و تجارت بین‌الملل",
  } as L,
  headline: {
    en: "We build the trade routes of tomorrow.",
    fa: "ما مسیرهای تجارت فردا را می‌سازیم.",
  } as L,
  sub: {
    en: "Aghazgaran Tejarat Ayandeh connects capital, technology, and production to international markets — one ecosystem, engineered to move first.",
    fa: "آغازگران تجارت آینده سرمایه، فناوری و تولید را به بازارهای بین‌المللی متصل می‌کند — یک اکوسیستم، ساخته‌شده برای پیشگامی.",
  } as L,
  chips: [
    { en: "Trade Corridors", fa: "کریدورهای تجاری" },
    { en: "Applied AI", fa: "هوش مصنوعی کاربردی" },
    { en: "Growth Capital", fa: "سرمایه رشد" },
  ] as L[],
};

export const INTRO = {
  eyebrow: { en: "The Holding", fa: "هلدینگ" } as L,
  manifesto: {
    en: "Trade is no longer about moving goods. It is about moving trust — across borders, currencies, and systems. We build the infrastructure that makes trust travel.",
    fa: "تجارت دیگر جابه‌جایی کالا نیست؛ جابه‌جایی اعتماد است — میان مرزها، ارزها و سیستم‌ها. ما زیرساختی می‌سازیم که اعتماد را به حرکت درمی‌آورد.",
  } as L,
  body1: {
    en: "Aghazgaran Tejarat Ayandeh is a holding built around one conviction: the next decade of trade belongs to those who own the full chain — origin, finance, logistics, platform, and brand.",
    fa: "آغازگران تجارت آینده هلدینگی است که حول یک باور ساخته شده: دهه آینده تجارت از آنِ کسانی است که تمام زنجیره را در اختیار دارند — از خاستگاه و تأمین مالی تا لجستیک، پلتفرم و برند.",
  } as L,
  body2: {
    en: "Eleven divisions operate as one system. Our corridors feed our platforms; our platforms inform our investments; our investments strengthen the corridors. The compounding is deliberate.",
    fa: "یازده بخش به‌عنوان یک سیستم واحد کار می‌کنند. کریدورهای ما پلتفرم‌ها را تغذیه می‌کنند؛ پلتفرم‌ها به سرمایه‌گذاری‌ها جهت می‌دهند؛ و سرمایه‌گذاری‌ها کریدورها را قوی‌تر می‌کنند. این هم‌افزایی مرکب، عامدانه است.",
  } as L,
};

export const ECOSYSTEM = {
  eyebrow: { en: "The Ecosystem", fa: "اکوسیستم" } as L,
  title: {
    en: "One connected system, eight forces in motion",
    fa: "یک سیستم متصل، هشت نیروی در حرکت",
  } as L,
  lead: {
    en: "Hover each node to see how the holding routes value between capital, technology, production, and international markets.",
    fa: "روی هر گره بروید تا ببینید هلدینگ چگونه ارزش را میان سرمایه، فناوری، تولید و بازارهای بین‌المللی هدایت می‌کند.",
  } as L,
  center: { en: "ATA", fa: "آتا" } as L,
  nodes: [
    { id: "capital", label: { en: "Capital", fa: "سرمایه" } as L },
    { id: "technology", label: { en: "Technology", fa: "فناوری" } as L },
    { id: "innovation", label: { en: "Innovation", fa: "نوآوری" } as L },
    { id: "production", label: { en: "Production", fa: "تولید" } as L },
    { id: "supply", label: { en: "Supply Chain", fa: "زنجیره تأمین" } as L },
    { id: "brands", label: { en: "Brands", fa: "برندها" } as L },
    { id: "investors", label: { en: "Investors", fa: "سرمایه‌گذاران" } as L },
    { id: "markets", label: { en: "Global Markets", fa: "بازارهای جهانی" } as L },
  ],
};

export const SERVICES = {
  eyebrow: { en: "Core Services", fa: "خدمات اصلی" } as L,
  title: {
    en: "What we run, end to end",
    fa: "آنچه سرتاسر اداره می‌کنیم",
  } as L,
  lead: {
    en: "Six disciplines, one accountability. Every engagement is run by the team that owns the outcome.",
    fa: "شش تخصص، یک پاسخگویی. هر پروژه را تیمی اداره می‌کند که مالک نتیجه است.",
  } as L,
};

export const REGIONS = [
  {
    name: { en: "Middle East & Gulf", fa: "خاورمیانه و خلیج فارس" } as L,
    markets: 9,
    note: { en: "Home corridor — Tehran, Dubai, Doha", fa: "کریدور اصلی — تهران، دبی، دوحه" } as L,
  },
  {
    name: { en: "East & South Asia", fa: "شرق و جنوب آسیا" } as L,
    markets: 11,
    note: { en: "Shanghai, Singapore, Mumbai", fa: "شانگهای، سنگاپور، بمبئی" } as L,
  },
  {
    name: { en: "Europe", fa: "اروپا" } as L,
    markets: 10,
    note: { en: "Istanbul, Frankfurt, London", fa: "استانبول، فرانکفورت، لندن" } as L,
  },
  {
    name: { en: "Africa & Americas", fa: "آفریقا و قاره آمریکا" } as L,
    markets: 4,
    note: { en: "Nairobi, São Paulo, New York", fa: "نایروبی، سائوپائولو، نیویورک" } as L,
  },
];

export const GLOBAL = {
  eyebrow: { en: "Global Network", fa: "شبکه جهانی" } as L,
  title: {
    en: "Thirty-four markets, one operating rhythm",
    fa: "سی‌وچهار بازار، یک ریتم عملیاتی",
  } as L,
};

export const STATS = {
  eyebrow: { en: "In Numbers", fa: "به روایت اعداد" } as L,
  items: [
    { value: 120, prefix: "$", suffix: "M+", label: { en: "Annual trade volume", fa: "حجم تجارت سالانه" } as L },
    { value: 34, label: { en: "Active markets", fa: "بازار فعال" } as L },
    { value: 11, label: { en: "Business divisions", fa: "بخش کسب‌وکار" } as L },
    { value: 17000, suffix: "+", label: { en: "Platform users", fa: "کاربر پلتفرم‌ها" } as L },
  ],
};

export const PROJECTS_SECTION = {
  eyebrow: { en: "Selected Projects", fa: "پروژه‌های منتخب" } as L,
  title: {
    en: "Work that moves markets",
    fa: "کارهایی که بازارها را حرکت می‌دهند",
  } as L,
};

export const OPPORTUNITIES = {
  eyebrow: { en: "Investment Opportunities", fa: "فرصت‌های سرمایه‌گذاری" } as L,
  title: {
    en: "Open positions for aligned capital",
    fa: "فرصت‌های باز برای سرمایه هم‌راستا",
  } as L,
  lead: {
    en: "Co-investment structures alongside the holding, in operations we already run.",
    fa: "ساختارهای سرمایه‌گذاری مشترک در کنار هلدینگ، در عملیاتی که خود اداره می‌کنیم.",
  } as L,
  items: [
    {
      title: { en: "Caspian Agri Corridor — Phase II", fa: "کریدور کشاورزی کاسپین — فاز ۲" } as L,
      sector: { en: "Agriculture / Logistics", fa: "کشاورزی / لجستیک" } as L,
      ticket: { en: "From $250k", fa: "از ۲۵۰ هزار دلار" } as L,
      horizon: { en: "4-year horizon", fa: "افق ۴ ساله" } as L,
      trend: [12, 18, 15, 24, 30, 28, 41],
    },
    {
      title: { en: "ATA Invest Fund II", fa: "صندوق آتا اینوست ۲" } as L,
      sector: { en: "Knowledge-based growth", fa: "رشد دانش‌بنیان" } as L,
      ticket: { en: "From $500k", fa: "از ۵۰۰ هزار دلار" } as L,
      horizon: { en: "7-year fund life", fa: "عمر ۷ ساله صندوق" } as L,
      trend: [8, 11, 14, 13, 19, 26, 32],
    },
    {
      title: { en: "Zagros Copper Expansion", fa: "توسعه مس زاگرس" } as L,
      sector: { en: "Mining / Offtake-backed", fa: "معدن / با پشتوانه قرارداد فروش" } as L,
      ticket: { en: "From $1M", fa: "از ۱ میلیون دلار" } as L,
      horizon: { en: "Offtake secured to 70%", fa: "۷۰٪ فروش تضمین‌شده" } as L,
      trend: [20, 22, 21, 27, 33, 38, 45],
    },
  ],
};

export const PLATFORMS_SECTION = {
  eyebrow: { en: "Digital Platforms", fa: "پلتفرم‌های دیجیتال" } as L,
  title: {
    en: "The holding, as software",
    fa: "هلدینگ، در قالب نرم‌افزار",
  } as L,
  lead: {
    en: "Every platform digitizes a flow we already operate physically — that is why they work.",
    fa: "هر پلتفرم جریانی را دیجیتال می‌کند که پیش‌تر به‌صورت فیزیکی اداره کرده‌ایم — راز کارآمدی همین است.",
  } as L,
};

export const WHY_US = {
  eyebrow: { en: "Why ATA", fa: "چرا آتا" } as L,
  title: {
    en: "Five commitments we run the holding by",
    fa: "پنج تعهدی که هلدینگ را با آن اداره می‌کنیم",
  } as L,
  items: [
    {
      title: { en: "We own the outcome", fa: "مالک نتیجه‌ایم" } as L,
      body: {
        en: "One team is accountable from contract to delivery. No hand-offs into the void.",
        fa: "یک تیم از قرارداد تا تحویل پاسخگوست. هیچ واگذاری بی‌سرانجامی در کار نیست.",
      } as L,
    },
    {
      title: { en: "Skin in every game", fa: "شریک در ریسک" } as L,
      body: {
        en: "We invest our own capital in the corridors and companies we advise.",
        fa: "سرمایه خودمان را در کریدورها و شرکت‌هایی که مشاوره می‌دهیم به کار می‌گیریم.",
      } as L,
    },
    {
      title: { en: "Data before opinion", fa: "داده پیش از نظر" } as L,
      body: {
        en: "Telemetry, settlement records, and market data drive decisions — not seniority.",
        fa: "پایش لحظه‌ای، سوابق تسویه و داده بازار تصمیم می‌سازند — نه سلسله‌مراتب.",
      } as L,
    },
    {
      title: { en: "Trust is engineered", fa: "اعتماد مهندسی می‌شود" } as L,
      body: {
        en: "Escrow, inspection, and certification are built into every flow by default.",
        fa: "امانت‌داری، بازرسی و گواهی به‌صورت پیش‌فرض در هر جریان تعبیه شده است.",
      } as L,
    },
    {
      title: { en: "Long games only", fa: "فقط بازی بلندمدت" } as L,
      body: {
        en: "We build corridors and companies meant to compound for a decade, not a quarter.",
        fa: "کریدورها و شرکت‌هایی می‌سازیم که برای یک دهه رشد مرکب طراحی شده‌اند، نه یک فصل.",
      } as L,
    },
  ],
};

export const TIMELINE = {
  eyebrow: { en: "The Journey", fa: "مسیر ما" } as L,
  title: {
    en: "From first shipment to full ecosystem",
    fa: "از نخستین محموله تا اکوسیستم کامل",
  } as L,
  milestones: [
    {
      year: "2019",
      title: { en: "The first corridor", fa: "نخستین کریدور" } as L,
      body: {
        en: "Founded in Tehran; first export program ships pistachios to the Gulf.",
        fa: "تأسیس در تهران؛ نخستین برنامه صادراتی، پسته را به خلیج فارس رساند.",
      } as L,
    },
    {
      year: "2021",
      title: { en: "Trade meets software", fa: "تلاقی تجارت و نرم‌افزار" } as L,
      body: {
        en: "The technology group forms; TradeBridge begins as an internal tool.",
        fa: "گروه فناوری شکل گرفت؛ ترید‌بریج به‌عنوان ابزار داخلی آغاز شد.",
      } as L,
    },
    {
      year: "2022",
      title: { en: "Capital joins the chain", fa: "پیوستن سرمایه به زنجیره" } as L,
      body: {
        en: "First fund closes; investments begin in knowledge-based exporters.",
        fa: "نخستین صندوق تکمیل شد؛ سرمایه‌گذاری در صادرکنندگان دانش‌بنیان آغاز شد.",
      } as L,
    },
    {
      year: "2024",
      title: { en: "The platform opens", fa: "گشایش پلتفرم" } as L,
      body: {
        en: "TradeBridge opens to third parties; escrowed settlement passes 80%.",
        fa: "ترید‌بریج به روی طرف‌های ثالث گشوده شد؛ تسویه امانی از ۸۰٪ گذشت.",
      } as L,
    },
    {
      year: "2026",
      title: { en: "One ecosystem", fa: "یک اکوسیستم" } as L,
      body: {
        en: "Eleven divisions, 34 markets, three regional offices — operating as one system.",
        fa: "یازده بخش، ۳۴ بازار و سه دفتر منطقه‌ای — در قالب یک سیستم واحد.",
      } as L,
    },
  ],
};

export const TESTIMONIALS = {
  eyebrow: { en: "What Partners Say", fa: "نظر شرکا" } as L,
  items: [
    {
      quote: {
        en: "They quoted a 48-hour corridor and delivered in 46. In fifteen years of importing produce, no one had ever put telemetry in front of me before asking for payment.",
        fa: "کریدور ۴۸ ساعته را وعده دادند و در ۴۶ ساعت تحویل دادند. در پانزده سال واردات محصولات تازه، هیچ‌کس پیش از درخواست پرداخت، داده رهگیری را جلوی من نگذاشته بود.",
      } as L,
      name: "Khalid Al-Mansoori",
      role: { en: "Procurement Director, Gulf Horizon", fa: "مدیر تدارکات، افق خلیج" } as L,
    },
    {
      quote: {
        en: "ATA structured our offtake before asking for a single dollar. That sequence — buyers first, capital second — told me everything about how they think.",
        fa: "آتا پیش از درخواست حتی یک دلار، قرارداد فروش ما را ساختاردهی کرد. این ترتیب — اول خریدار، بعد سرمایه — همه‌چیز را درباره طرز فکرشان گفت.",
      } as L,
      name: "Elif Demir",
      role: { en: "CEO, Anatolia Steelworks", fa: "مدیرعامل، فولاد آناتولی" } as L,
    },
    {
      quote: {
        en: "As an LP, what I value is that they invest where they operate. The fund's edge is not analysis — it is information from their own corridors.",
        fa: "به‌عنوان سرمایه‌گذار، آنچه برایم ارزشمند است این است که جایی سرمایه‌گذاری می‌کنند که خودشان فعالیت دارند. مزیت صندوق تحلیل نیست — اطلاعاتِ برخاسته از کریدورهای خودشان است.",
      } as L,
      name: "Marcus Weber",
      role: { en: "Partner, Helvetia Trade Bank", fa: "شریک، بانک تجارت هلوتیا" } as L,
    },
    {
      quote: {
        en: "Our saffron sold as a commodity for twenty years. Their brand team took it to European shelves at three times the bulk price in one season.",
        fa: "زعفران ما بیست سال به‌صورت فله فروخته می‌شد. تیم برند آن‌ها در یک فصل، آن را با سه برابر قیمت فله به قفسه‌های اروپا رساند.",
      } as L,
      name: "Fatemeh Hosseini",
      role: { en: "Founder, Saffron Origin Co.", fa: "بنیان‌گذار، خاستگاه زعفران" } as L,
    },
  ],
};

export const FAQ = {
  eyebrow: { en: "Questions", fa: "پرسش‌ها" } as L,
  title: { en: "Asked often, answered plainly", fa: "پرسش‌های پرتکرار، پاسخ‌های روشن" } as L,
  items: [
    {
      q: { en: "What does the holding actually do?", fa: "هلدینگ دقیقاً چه می‌کند؟" } as L,
      a: {
        en: "We build and operate the full chain of international trade: sourcing and production, trade finance, logistics corridors, digital platforms, and export brands — plus an investment arm that backs companies fitting this ecosystem.",
        fa: "ما زنجیره کامل تجارت بین‌الملل را می‌سازیم و اداره می‌کنیم: تأمین و تولید، تأمین مالی تجاری، کریدورهای لجستیک، پلتفرم‌های دیجیتال و برندهای صادراتی — به‌علاوه بازوی سرمایه‌گذاری که از شرکت‌های هم‌راستا با این اکوسیستم حمایت می‌کند.",
      } as L,
    },
    {
      q: { en: "How do I start trading with you?", fa: "چطور همکاری تجاری را آغاز کنم؟" } as L,
      a: {
        en: "Send your requirements through the contact form or join TradeBridge directly. A trade analyst responds within two business days with a corridor assessment and indicative terms.",
        fa: "نیازمندی خود را از طریق فرم تماس ارسال کنید یا مستقیماً به ترید‌بریج بپیوندید. تحلیلگر تجاری ظرف دو روز کاری با ارزیابی کریدور و شرایط اولیه پاسخ می‌دهد.",
      } as L,
    },
    {
      q: { en: "Can I co-invest alongside the holding?", fa: "می‌توانم در کنار هلدینگ سرمایه‌گذاری کنم؟" } as L,
      a: {
        en: "Yes. Qualified investors join through fund vehicles or deal-by-deal co-investment. We publish open opportunities on the Investors page; every position is one we also hold ourselves.",
        fa: "بله. سرمایه‌گذاران واجد شرایط از طریق صندوق‌ها یا سرمایه‌گذاری مشترک مورد به مورد وارد می‌شوند. فرصت‌های باز در صفحه سرمایه‌گذاران منتشر می‌شود؛ هر موقعیتی که عرضه می‌کنیم، خودمان نیز در آن سهیم هستیم.",
      } as L,
    },
    {
      q: { en: "Which markets do you cover?", fa: "کدام بازارها را پوشش می‌دهید؟" } as L,
      a: {
        en: "Thirty-four markets across the Gulf, Asia, Europe, Africa, and the Americas, anchored by offices in Tehran, Dubai, and Istanbul.",
        fa: "سی‌وچهار بازار در خلیج فارس، آسیا، اروپا، آفریقا و قاره آمریکا، با پشتیبانی دفاتر تهران، دبی و استانبول.",
      } as L,
    },
    {
      q: { en: "How is payment risk handled?", fa: "ریسک پرداخت چگونه مدیریت می‌شود؟" } as L,
      a: {
        en: "Escrowed settlement by default: funds release against inspection certificates and shipping documents. For recurring corridors we add LC structures and credit insurance through partner banks.",
        fa: "تسویه امانی به‌صورت پیش‌فرض: وجوه در برابر گواهی بازرسی و اسناد حمل آزاد می‌شود. برای کریدورهای تکرارشونده، اعتبار اسنادی و بیمه اعتباری از طریق بانک‌های همکار اضافه می‌شود.",
      } as L,
    },
    {
      q: { en: "Do you work with early-stage companies?", fa: "با شرکت‌های نوپا هم کار می‌کنید؟" } as L,
      a: {
        en: "Selectively. Fund II backs knowledge-based companies with proven domestic traction; the export-readiness program takes them to their first international revenue.",
        fa: "به‌صورت گزینشی. صندوق ۲ از شرکت‌های دانش‌بنیان با موفقیت داخلی اثبات‌شده حمایت می‌کند و برنامه آمادگی صادراتی، آن‌ها را به نخستین درآمد بین‌المللی می‌رساند.",
      } as L,
    },
  ],
};

export const NEWS_SECTION = {
  eyebrow: { en: "Latest News", fa: "تازه‌ترین اخبار" } as L,
  title: { en: "Signals from the network", fa: "سیگنال‌هایی از شبکه" } as L,
};

export const CTA = {
  eyebrow: { en: "Start the Conversation", fa: "گفت‌وگو را آغاز کنید" } as L,
  title: {
    en: "The next corridor could be yours.",
    fa: "کریدور بعدی می‌تواند از آنِ شما باشد.",
  } as L,
  body: {
    en: "Tell us what you make, what you need, or what you want to back. A senior member of the team replies within two business days.",
    fa: "بگویید چه تولید می‌کنید، چه نیاز دارید یا از چه می‌خواهید حمایت کنید. یکی از اعضای ارشد تیم ظرف دو روز کاری پاسخ می‌دهد.",
  } as L,
};
