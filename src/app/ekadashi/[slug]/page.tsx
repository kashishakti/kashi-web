import { cache } from "react"
import { BASE_URL } from "@/constants"
import EkadashiDetails from "../../../features/EkadashiDetails"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const revalidate = 600

type Props = {
  params: Promise<{ slug: string }>
}

const getEkadashiData = cache(async (slug: string) => {
  try {
    const res = await fetch(`${BASE_URL}/ekadashis/slug/${slug}`, {
      next: { revalidate: 600 }
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
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const data = await getEkadashiData(slug)
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getEkadashiData(slug)

  if (!data) {
    return notFound()
  }

  return <EkadashiDetails slug={slug} ekadashiDetailData={data} />
}