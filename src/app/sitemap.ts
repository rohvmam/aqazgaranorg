import type { MetadataRoute } from "next";
import { BUSINESS_AREAS } from "@/content/business-areas";
import { routing } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

const BASE = process.env.SITE_URL ?? "http://localhost:3000";

const STATIC_PATHS = [
  "",
  "/about",
  "/vision",
  "/business",
  "/projects",
  "/partners",
  "/investors",
  "/news",
  "/events",
  "/careers",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, news] = await Promise.all([
    prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.newsPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const area of BUSINESS_AREAS) {
      entries.push({
        url: `${BASE}/${locale}/business/${area.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const project of projects) {
      entries.push({
        url: `${BASE}/${locale}/projects/${project.slug}`,
        lastModified: project.updatedAt,
        priority: 0.6,
      });
    }
    for (const post of news) {
      entries.push({
        url: `${BASE}/${locale}/news/${post.slug}`,
        lastModified: post.updatedAt,
        priority: 0.5,
      });
    }
  }
  return entries;
}
