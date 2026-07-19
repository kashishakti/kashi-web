import type { Metadata } from 'next'
import { BASE_URL, REVALIDATE } from '@/constants'
import { formatDate } from '@/common/functions'
import type { BlogItem, ContentBlock, FAQBlock, RelatedBlock, RelatedItem } from '../types'
import RichTextRenderer from '../components/RichTextRenderer'
import MantraCardWidget from './MantraCardWidget'
import ExpertGuidanceSidebar from './ExpertGuidanceSidebar'
import FAQItem from '@/components/FAQItem'
import ArticleCard from '@/components/ArticleCard'
import ContentTable from '@/components/ContentTable'
import './BlogDetail.css'
import '@/components/FAQ.css'
import '@/components/Recommended.css'
import '@/components/ContentTable.css'

async function getBlog(slug: string): Promise<BlogItem | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/blogs/slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: REVALIDATE } }
    )
    if (!res.ok) return null
    return res.json() as Promise<BlogItem>
  } catch {
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  const seo = blog?.SEO
  return {
    title: seo?.MetaTitle ?? blog?.Title ?? 'Blog',
    description: seo?.MetaDescription ?? blog?.ShortDescription ?? undefined,
    robots: seo?.MetaRobots ?? 'index,follow',
    openGraph: {
      title: seo?.Open_Graph_Title ?? seo?.MetaTitle ?? blog?.Title ?? undefined,
      description: seo?.Open_Graph_Description ?? seo?.MetaDescription ?? undefined,
      images: seo?.MetaImage?.url
        ? [{ url: seo.MetaImage.url }]
        : blog?.FeaturedImage?.url
        ? [{ url: blog.FeaturedImage.url }]
        : undefined,
    },
  }
}

function renderBlock(block: ContentBlock, blogSlug: string) {
  if (block.__component === 'shared.rich-text') {
    return <RichTextRenderer key={block.id} content={block.RichText} />
  }
  if (block.__component === 'section.mantra-card-widget') {
    return <MantraCardWidget key={block.id} blogSlug={blogSlug} />
  }
  if (block.__component === 'shared.image') {
    return (
      <div key={block.id} className="blog-inline-image">
        <img
          src={block.image.url}
          alt={block.image.alternativeText ?? ''}
        />
      </div>
    )
  }
  if (block.__component === 'shared.table') {
    return <ContentTable key={block.id} data={block.TableJSON.data} />
  }
  return null
}

function flattenRelated(blocks: RelatedBlock[]): Array<RelatedItem & { type: string }> {
  const out: Array<RelatedItem & { type: string }> = []
  for (const block of blocks) {
    switch (block.__component) {
      case 'shared.related-vrat-katha':
        block.vrat_kathas.forEach(i => out.push({ ...i, type: 'Vrat Katha' })); break
      case 'shared.related-temples':
        block.temples.forEach(i => out.push({ ...i, type: 'Temple' })); break
      case 'shared.related-festivals':
        block.festivals.forEach(i => out.push({ ...i, type: 'Festival' })); break
      case 'shared.related-puja-vidhi':
        block.puja_vidhis.forEach(i => out.push({ ...i, type: 'Puja Vidhi' })); break
      case 'shared.related-purnima':
        block.purnimas.forEach(i => out.push({ ...i, type: 'Purnima' })); break
      case 'shared.related-pradosh':
        block.pradoshes.forEach(i => out.push({ ...i, type: 'Pradosh' })); break
      case 'shared.related-ekadashi':
        block.ekadashis.forEach(i => out.push({ ...i, type: 'Ekadashi' })); break
      case 'shared.related-amavasya':
        block.amavasyas.forEach(i => out.push({ ...i, type: 'Amavasya' })); break
      case 'shared.related-blogs':
        block.blogs.forEach(i => out.push({ ...i, type: 'Blog' })); break
    }
  }
  return out
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 72 }}>
        <p style={{ color: 'var(--ink-muted)' }}>Blog not found.</p>
      </div>
    )
  }

  const dateStr = blog.publishedAt ?? blog.createdAt ?? ''
  const displayDate = dateStr ? formatDate(dateStr) : ''
  const readTime = blog.ReadTime ? `${blog.ReadTime} min read` : ''

  const primaryCategory = blog.category
  const author = blog.Author?.authors?.[0]
  const authorInitial = author?.Title?.charAt(0).toUpperCase() ?? 'K'

  const faqs: FAQBlock[] = blog.FAQBlock ?? []
  const related = flattenRelated(blog.RelatedReadingBlock ?? [])

  return (
    <div className="blog-detail">
      <div className="blog-detail__inner">
        <div className="blog-detail__card">

          {/* Accent bar */}
          <div className="blog-detail__accent-bar" aria-hidden="true" />

          {/* Header */}
          <header className="blog-detail__header">
            <div className="blog-detail__meta">
              {primaryCategory && (
                <span className="blog-detail__category-badge">
                  {primaryCategory.Title.toUpperCase()}
                </span>
              )}
              {(displayDate || readTime) && (
                <span className="blog-detail__date-read">
                  {[displayDate, readTime].filter(Boolean).join(' · ')}
                </span>
              )}
            </div>

            <h1 className="blog-detail__title">{blog.Title}</h1>

            {author && (
              <div className="blog-detail__author">
                <div className="blog-detail__author-avatar">
                  {author.FeaturedImage ? (
                    <img src={author.FeaturedImage.url} alt={author.Title} />
                  ) : (
                    authorInitial
                  )}
                </div>
                <div className="blog-detail__author-name">{author.Title}</div>
              </div>
            )}
          </header>

          {/* Body: 8:4 grid */}
          <div className="blog-detail__body">

            {/* Left column: LeftBlock dynamic zone */}
            <article className="blog-detail__left">
              {blog.LeftBlock && blog.LeftBlock.length > 0
                ? blog.LeftBlock.map(block => renderBlock(block, slug))
                : blog.Description && (
                    <RichTextRenderer content={blog.Description} />
                  )
              }
            </article>

            {/* Right column: always Expert Guidance */}
            <ExpertGuidanceSidebar />

          </div>

        </div>
      </div>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="faq-section">
          <div className="faq-section__wrap">
            <div className="faq-section__head">
              <h2>Frequently Asked Questions</h2>
              <p>Common questions about {blog.Title}.</p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={faq.id}
                  question={faq.Question}
                  answer={faq.Answer}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommended Section */}
      {related.length > 0 && (
        <section className="recommended-section">
          <div className="recommended-section__inner">
            <div className="recommended-section__head">
              <div className="recommended-section__eyebrow">Further Reading</div>
              <h2>Recommended for you</h2>
            </div>
            <div className="article-card-grid">
              {related.map(item => (
                <ArticleCard
                  key={`${item.type}-${item.id}`}
                  tag={item.type}
                  title={item.Title}
                  excerpt={item.ShortDescription}
                  bgImg={item.FeaturedImage?.url ?? null}
                  slug={item.Slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
