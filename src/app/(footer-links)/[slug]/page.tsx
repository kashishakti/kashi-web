import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BASE_URL, REVALIDATE } from '@/constants'
import RichTextRenderer from '@/components/RichTextRenderer'
import '@/components/PageCard.css'
import '@/components/RichText.css'
import './policy.css'

interface PolicyPage {
  id: number
  documentId: string
  Title: string
  ShortDescription: string | null
  Slug: string
  Description: string
  SEO: {
    MetaTitle: string | null
    MetaDescription: string | null
    MetaRobots: string | null
    Open_Graph_Title: string | null
    Open_Graph_Description: string | null
    MetaImage: { url: string } | null
  } | null
}

async function getPolicy(slug: string): Promise<PolicyPage | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/policies/slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE } }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPolicy(slug)
  const seo = page?.SEO
  return {
    title: seo?.MetaTitle ?? page?.Title ?? 'Kashi Shakti',
    description: seo?.MetaDescription ?? page?.ShortDescription ?? undefined,
    robots: seo?.MetaRobots ?? 'index,follow',
    openGraph: {
      title: seo?.Open_Graph_Title ?? seo?.MetaTitle ?? page?.Title ?? undefined,
      description: seo?.Open_Graph_Description ?? seo?.MetaDescription ?? undefined,
      images: seo?.MetaImage?.url ? [{ url: seo.MetaImage.url }] : undefined,
    },
  }
}

export default async function PolicyPageRoute({ params }: PageProps) {
  const { slug } = await params
  const page = await getPolicy(slug)

  if (!page) notFound()

  return (
    <div className="page-card">
      <div className="page-card__inner">
        <div className="page-card__card">
          <div className="page-card__accent-bar" aria-hidden="true" />
          <header className="page-card__header">
            <h1 className="page-card__title">{page.Title}</h1>
            {page.ShortDescription && (
              <p className="page-card__subtitle">{page.ShortDescription}</p>
            )}
          </header>
          <article className="policy-body">
            <RichTextRenderer content={page.Description} />
          </article>
        </div>
      </div>
    </div>
  )
}
