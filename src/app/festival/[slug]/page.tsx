import { BASE_URL } from "@/constants"
import FestivalDetails from "../../../features/FestivalDetails"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

async function getFestivalMeta(slug: string) {
  try {
    const res = await fetch(`${BASE_URL}/festivals/slug/${slug}`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return null;
    }

    const text = await res.text();

    if (!text) return null;

    return JSON.parse(text);
  } catch (error) {
    console.error("Meta fetch failed:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const data = await getFestivalMeta(slug)
  const meta = data?.SEO;

  return {
    title: meta?.MetaTitle,
    description: meta?.MetaDescription,
    robots: meta?.MetaRobots || "index,follow",

    openGraph: {
      title: meta?.Open_Graph_Title || meta?.MetaTitle,
      description: meta?.Open_Graph_Description || meta?.MetaDescription,
      images: meta?.MetaImage ? [meta.MetaImage] : [],
    },
  }
}

async function getFestivalData(slug: string) {
  try {
    const res = await fetch(`${BASE_URL}/festivals/slug/${slug}`, {
      cache: "no-store"
    });

    if (!res.ok) {
      return null;
    }

    const text = await res.text();
    if (!text) return null;

    return JSON.parse(text);
  } catch (error) {
    console.error("Data fetch failed:", error);
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getFestivalData(slug)

  if (!data) {
    return notFound()
  }

  return <FestivalDetails slug={slug} festivalDetailData={data} />
}