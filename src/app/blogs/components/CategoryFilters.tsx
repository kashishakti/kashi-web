import Link from 'next/link'
import type { Category } from '../types'

interface Props {
  categories: Category[]
  activeSlug?: string
}

const CategoryFilters = ({ categories, activeSlug = 'all' }: Props) => {
  const allItems = [{ Title: 'All', Slug: 'all' }, ...categories]

  return (
    <div
      className="cf-wrap"
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '28px 40px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <style>{`
        @media(max-width:900px){.cf-wrap{padding:20px 20px 0!important}}
        @media(max-width:640px){.cf-wrap{padding:16px 16px 0!important;flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}.cf-wrap::-webkit-scrollbar{display:none}}
      `}</style>
      {allItems.map((cat) => {
        const isActive = cat.Slug === activeSlug
        const href = cat.Slug === 'all' ? '/blogs' : `/blogs?category=${encodeURIComponent(cat.Slug)}`
        return (
          <Link
            key={cat.Slug}
            href={href}
            style={{
              padding: '8px 20px',
              borderRadius: 100,
              border: `1.5px solid ${isActive ? '#D97235' : '#E2D8D0'}`,
              background: isActive ? '#D97235' : 'transparent',
              color: isActive ? '#fff' : '#6B5A50',
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              transition: 'all 0.18s ease',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            {cat.Title}
          </Link>
        )
      })}
    </div>
  )
}

export default CategoryFilters
