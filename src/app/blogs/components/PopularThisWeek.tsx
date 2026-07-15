import { getCategoryColors } from './blogUtils'
import type { BlogItem } from '../types'

interface Props {
  blogs: BlogItem[]
}

const PopularThisWeek = ({ blogs }: Props) => {
  if (!blogs.length) return null

  return (
    <div className="ptw-outer" style={{ maxWidth: 1280, margin: '52px auto 0', padding: '0 40px' }}>
      <style>{`
        .ptw-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(28,15,8,0.12)!important}
        @media(max-width:900px){.ptw-outer{padding:0 20px!important}}
        @media(max-width:640px){.ptw-outer{padding:0 16px!important}}
      `}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h2
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: 22,
              fontWeight: 700,
              color: '#1C0F08',
              letterSpacing: '-0.2px',
            }}
          >
            Popular This Week
          </h2>
          <span
            style={{
              background: '#FFF0E6',
              color: '#D97235',
              border: '1px solid rgba(217,114,53,0.25)',
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              padding: '3px 10px',
              borderRadius: 100,
              textTransform: 'uppercase',
            }}
          >
            Hot
          </span>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          overflowY: 'visible',
          paddingBottom: 24,
          paddingTop: 8,
          scrollbarWidth: 'thin',
        }}
      >
        {blogs.map((blog) => {
          const category = blog.categories?.[0]?.Title
          const author = blog.Author?.authors?.[0]?.Title ?? 'Kashi Shakti'
          const [c1, c2] = getCategoryColors(category)

          return (
            <a
              key={blog.documentId}
              href={`/blogs/${blog.Slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 'none' }}
            >
            <div
              className="ptw-card"
              style={{
                width: 275,
                background: '#fff',
                borderRadius: 14,
                overflow: 'hidden',
                border: '1px solid rgba(28,15,8,0.08)',
                cursor: 'pointer',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div
                style={{
                  height: 148,
                  background: blog.FeaturedImage
                    ? `url(${blog.FeaturedImage.url}) center/cover no-repeat`
                    : `linear-gradient(135deg,${c1},${c2})`,
                  position: 'relative',
                }}
              >
                {category && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(250,247,242,0.15)',
                      color: '#FAF7F2',
                      padding: '3px 10px',
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
              <div style={{ padding: '16px 18px' }}>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#1C0F08',
                    lineHeight: 1.35,
                    marginBottom: 10,
                  }}
                >
                  {blog.Title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: 12,
                      color: '#9C8B7E',
                    }}
                  >
                    {author}
                  </span>
                  {blog.ReadTime && (
                    <span
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: '11.5px',
                        color: '#C4BDB8',
                      }}
                    >
                      {blog.ReadTime} min
                    </span>
                  )}
                </div>
              </div>
            </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default PopularThisWeek
