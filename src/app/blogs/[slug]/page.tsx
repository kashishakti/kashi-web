import { BASE_URL, REVALIDATE } from '@/constants'
import { formatDate } from '@/common/functions'
import type { BlogItem, ContentBlock } from '../types'
import RichTextRenderer from '../components/RichTextRenderer'
import MantraCardWidget from './MantraCardWidget'
import ExpertGuidanceSidebar from './ExpertGuidanceSidebar'
import './BlogDetail.css'

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

function renderBlock(block: ContentBlock, blogSlug: string) {
  if (block.__component === 'shared.rich-text') {
    return <RichTextRenderer key={block.id} content={block.RichText} />
  }
  if (block.__component === 'section.mantra-card-widget') {
    return <MantraCardWidget key={block.id} blogSlug={blogSlug} />
  }
  return null
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

  const primaryCategory = blog.categories?.[0]
  const author = blog.Author?.authors?.[0]
  const authorInitial = author?.Title?.charAt(0).toUpperCase() ?? 'K'

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
    </div>
  )
}
