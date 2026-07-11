import { cache } from "react"
import { BASE_URL, REVALIDATE } from "@/constants"
import PradoshDetails from "@/features/PradoshDetails";
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

const getPradoshData = cache(async (slug: string) => {
  try {
    const res = await fetch(`${BASE_URL}/pradoshes/slug/${slug}`, {
      next: { revalidate: REVALIDATE }
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

  const data = await getPradoshData(slug)
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
  const data = await getPradoshData(slug)

  if (!data) {
    return notFound()
  }

  return <PradoshDetails slug={slug} pradoshDetailData={data} />
}