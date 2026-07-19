import { redirect } from 'next/navigation'
import { BASE_URL, REVALIDATE } from '@/constants'
import BlogHero from './components/BlogHero'
import CategoryFilters from './components/CategoryFilters'
import FeaturedSection from './components/FeaturedSection'
import PopularThisWeek from './components/PopularThisWeek'
import LatestArticles from './components/LatestArticles'
import CategoryArticles from './components/CategoryArticles'
import type { BlogPageData, Category, BlogItem } from './types'

// Featured blog, editor's picks, and popular-this-week come from a single CMS page config.
async function getBlogPageData(): Promise<BlogPageData | null> {
  try {
    const res = await fetch(`${BASE_URL}/blog-page`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json ?? []
  } catch {
    return []
  }
}

async function getBlogsByCategory(categorySlug: string): Promise<BlogItem[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/blogs?category=${encodeURIComponent(categorySlug)}`,
      { next: { revalidate: REVALIDATE } }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json ?? []
  } catch {
    return []
  }
}

// Initial page of blogs shown in the Latest Articles section.
async function getBlogs(): Promise<BlogItem[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/blogs?page=1&pageSize=6`,
      { next: { revalidate: REVALIDATE } }
    )
    if (!res.ok) return []
    const json = await res.json()
    return json ?? []
  } catch {
    return []
  }
}

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogsPage({ searchParams }: PageProps) {
  const { category: categorySlug } = await searchParams
  const categories = await getCategories()

  // Category view: show hero + chips + filtered articles.
  if (categorySlug) {
    const activeCategory = categories.find((c) => c.Slug === categorySlug)
    if (!activeCategory) redirect('/blogs')

    const initialBlogs = await getBlogsByCategory(categorySlug)

    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh', fontFamily: "var(--font-playfair), serif" }}>
        <BlogHero />
        <CategoryFilters categories={categories} activeSlug={categorySlug} />
        <CategoryArticles initialBlogs={initialBlogs} />
        <div style={{ height: 80 }} />
      </div>
    )
  }

  // Home view: full layout with featured, popular, and latest sections.
  const [pageData, initialBlogs] = await Promise.all([
    getBlogPageData(),
    getBlogs(),
  ])

  const featured = pageData?.FeaturedBlog?.blogs?.[0] ?? null
  const editorsPicks = pageData?.EditorsPicks?.blogs ?? []
  const popularBlogs = pageData?.PopularThisWeek?.blogs ?? []

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', fontFamily: "var(--font-playfair), serif" }}>
      <BlogHero />
      <CategoryFilters categories={categories} />
      <FeaturedSection featured={featured} editorsPicks={editorsPicks} />
      <PopularThisWeek blogs={popularBlogs} />
      <LatestArticles initialBlogs={initialBlogs} />
      <div style={{ height: 80 }} />
    </div>
  )
}
