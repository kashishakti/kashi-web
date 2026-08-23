import type { MetadataRoute } from "next";
import { BASE_URL, REVALIDATE } from "@/constants";

const SITE = "https://kashishakti.com";

interface SlugItem {
  Slug: string;
}

// Explicitly request only Slug + updatedAt so Strapi always returns both fields.
async function fetchSlugs(path: string): Promise<SlugItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/${path}?pageSize=500`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : json?.data ?? [];
  } catch {
    return [];
  }
}

function toEntries(
  items: SlugItem[],
  prefix: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified: string
): MetadataRoute.Sitemap {
  return items
    .filter((item) => item.Slug)
    .map((item) => ({
      url: `${SITE}/${prefix}/${item.Slug}`,
      lastModified,
      priority,
      changeFrequency,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const [
    blogs,
    ekadashis,
    amavasyas,
    festivals,
    pradoshes,
    purnimas,
    vratKathas,
    policies,
  ] = await Promise.all([
    fetchSlugs("blogs"),
    fetchSlugs("ekadashis"),
    fetchSlugs("amavasyas"),
    fetchSlugs("festivals"),
    fetchSlugs("pradoshes"),
    fetchSlugs("purnimas"),
    fetchSlugs("vrat-kathas"),
    fetchSlugs("policies"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE}/`,
      priority: 1.0,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${SITE}/blogs`,
      priority: 0.9,
      changeFrequency: "daily",
      lastModified: now,
    },
    {
      url: `${SITE}/festivals`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${SITE}/vrat`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${SITE}/temples`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${SITE}/puja`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${SITE}/samagri`,
      priority: 0.8,
      changeFrequency: "weekly",
      lastModified: now,
    },
    {
      url: `${SITE}/enquiry`,
      priority: 0.5,
      changeFrequency: "yearly",
      lastModified: now,
    },
  ];

  return [
    ...staticRoutes,
    ...toEntries(blogs, "blogs", 0.8, "monthly", now),
    ...toEntries(ekadashis, "ekadashi", 0.7, "monthly", now),
    ...toEntries(amavasyas, "amavasya", 0.7, "monthly", now),
    ...toEntries(festivals, "festival", 0.7, "monthly", now),
    ...toEntries(pradoshes, "pradosh", 0.7, "monthly", now),
    ...toEntries(purnimas, "purnima", 0.7, "monthly", now),
    ...toEntries(vratKathas, "vrat-katha", 0.7, "monthly", now),
    ...policies
      .filter((p) => p.Slug)
      .map((p) => ({
        url: `${SITE}/${p.Slug}`,
        lastModified: now,
        priority: 0.4,
        changeFrequency: "yearly" as const,
      })),
  ];
}
