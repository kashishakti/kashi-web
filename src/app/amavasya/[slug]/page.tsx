import { BASE_URL } from "@/constants"
import AmavasyaDetails from "@/features/AmavasyaDetails";
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

async function getAmavasyaMeta(slug: string) {
  try {
    const res = await fetch(`${BASE_URL}/amavasyas/slug/${slug}`, {
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

  const data = await getAmavasyaMeta(slug)
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

async function getAmavasyaData(slug: string) {
  try {
    const res = await fetch(`${BASE_URL}/amavasyas/slug/${slug}`, {
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
  const data = await getAmavasyaData(slug)

  if (!data) {
    return notFound()
  }

  return <AmavasyaDetails slug={slug} amavasyaDetailData={data} />
}