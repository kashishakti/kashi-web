import { BASE_URL, REVALIDATE } from '@/constants'
import type { BlogItem } from '../types'

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

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--font-dm-sans), sans-serif', color: '#9C8B7E' }}>Blog not found.</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      <p>{blog.Title}</p>
    </div>
  )
}
