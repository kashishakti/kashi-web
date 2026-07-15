'use client'

import { useState } from 'react'
import { getCategoryColors } from './blogUtils'
import type { BlogItem } from '../types'

const PAGE_SIZE = 6

interface Props {
  initialBlogs: BlogItem[]
}

const LatestArticles = ({ initialBlogs }: Props) => {
  const [blogs, setBlogs] = useState<BlogItem[]>(initialBlogs)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  async function loadMore() {
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetch(
        `https://productive-breeze-327fa74162.strapiapp.com/api/blogs?page=${nextPage}&pageSize=${PAGE_SIZE}`
      )
      if (!res.ok) { setHasMore(false); return }
      const json = await res.json()
      const incoming: BlogItem[] = json ?? []
      if (incoming.length === 0) { setHasMore(false); return }
      setBlogs((prev) => [...prev, ...incoming])
      setPage(nextPage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="la-outer" style={{ maxWidth: 1280, margin: '52px auto 0', padding: '0 40px' }}>
      <style>{`
        .la-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(28,15,8,0.12)!important}
        @media(max-width:900px){.la-outer{padding:0 20px!important}.la-grid{grid-template-columns:repeat(2,1fr)!important}}
        @media(max-width:600px){.la-outer{padding:0 16px!important}.la-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: 22,
            fontWeight: 700,
            color: '#1C0F08',
            letterSpacing: '-0.2px',
          }}
        >
          Latest Articles
        </h2>
      </div>

      {/* Articles grid */}
      <div
        className="la-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
        }}
      >
        {blogs.map((blog) => {
          const category = blog.categories?.[0]?.Title
          const author = blog.Author?.authors?.[0]?.Title ?? 'Kashi Shakti'
          const authorInitial = author.charAt(0).toUpperCase()
          const [c1, c2] = getCategoryColors(category)
          const date = blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : ''

          return (
            <a
              key={blog.documentId}
              href={`/blogs/${blog.Slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
            <article
              className="la-card"
              style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(28,15,8,0.07)',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              {/* Card image / color block */}
              <div
                style={{
                  height: 188,
                  background: blog.FeaturedImage
                    ? `url(${blog.FeaturedImage.url}) center/cover no-repeat`
                    : `linear-gradient(135deg,${c1},${c2})`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(ellipse at 30% 60%,rgba(217,114,53,0.3),transparent 60%)',
                  }}
                />
                {category && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 14,
                      background: 'rgba(250,247,242,0.15)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(250,247,242,0.2)',
                      color: '#FAF7F2',
                      padding: '4px 10px',
                      borderRadius: 100,
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {category}
                  </span>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: 20 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: 17,
                    fontWeight: 600,
                    color: '#1C0F08',
                    lineHeight: 1.35,
                    marginBottom: 9,
                  }}
                >
                  {blog.Title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: '13.5px',
                    color: '#6B5A50',
                    lineHeight: 1.65,
                    marginBottom: 16,
                  }}
                >
                  {blog.ShortDescription}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg,${c1},${c2})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: "var(--font-playfair), serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#fff',
                      }}
                    >
                      {authorInitial}
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: 12,
                        color: '#9C8B7E',
                      }}
                    >
                      {author}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 11,
                      color: '#C4BDB8',
                    }}
                  >
                    {blog.ReadTime} min{date ? ` · ${date}` : ''}
                  </span>
                </div>
              </div>
            </article>
            </a>
          )
        })}
      </div>

      {/* Load more */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              background: 'transparent',
              border: '1.5px solid #D97235',
              color: '#D97235',
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: '13.5px',
              fontWeight: 600,
              padding: '11px 32px',
              borderRadius: 100,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Loading…' : 'Load more articles'}
          </button>
        </div>
      )}
    </div>
  )
}

export default LatestArticles
