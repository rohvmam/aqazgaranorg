import {
  Activity,
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Container,
  FileText,
  Gauge,
  Handshake,
  Inbox,
  Landmark,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Users,
  UserSquare2,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  /** Key into the `dash` messages namespace */
  key: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  /** Key into the `dash` messages namespace */
  groupKey: string;
  items: NavItem[];
};

export const DASHBOARD_NAV: NavGroup[] = [
  {
    groupKey: "groupMain",
    items: [
      { key: "overview", href: "/dashboard", icon: Gauge },
      { key: "analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    groupKey: "groupBusiness",
    items: [
      { key: "clients", href: "/dashboard/clients", icon: Users },
      { key: "partners", href: "/dashboard/partners", icon: Handshake },
      { key: "projects", href: "/dashboard/projects", icon: Briefcase },
      { key: "investments", href: "/dashboard/investments", icon: Landmark },
      { key: "deals", href: "/dashboard/deals", icon: FileText },
      { key: "tradeRequests", href: "/dashboard/trade-requests", icon: Container },
      { key: "marketplace", href: "/dashboard/marketplace", icon: ShoppingBag },
      { key: "platforms", href: "/dashboard/platforms", icon: LayoutGrid },
    ],
  },
  {
    groupKey: "groupFinance",
    items: [
      { key: "invoices", href: "/dashboard/invoices", icon: FileText },
      { key: "finance", href: "/dashboard/finance", icon: Wallet },
      { key: "reports", href: "/dashboard/reports", icon: ClipboardList },
    ],
  },
  {
    groupKey: "groupWork",
    items: [
      { key: "tasks", href: "/dashboard/tasks", icon: ClipboardList },
      { key: "calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { key: "notifications", href: "/dashboard/notifications", icon: Bell },
      { key: "messages", href: "/dashboard/messages", icon: MessageSquare },
    ],
  },
  {
    groupKey: "groupSite",
    items: [
      { key: "newsManager", href: "/dashboard/news", icon: Newspaper },
      { key: "eventsManager", href: "/dashboard/events", icon: Ticket },
      { key: "jobsManager", href: "/dashboard/jobs", icon: UserSquare2 },
      { key: "contactInbox", href: "/dashboard/contacts", icon: Inbox },
    ],
  },
  {
    groupKey: "groupSystem",
    items: [
      { key: "roles", href: "/dashboard/roles", icon: ShieldCheck },
      { key: "activity", href: "/dashboard/activity", icon: Activity },
      { key: "settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];
