export interface BlogTag {
  id: number
  documentId: string
  Title: string
  Slug: string
  ShortDescription: string
}

export interface BlogAuthor {
  id: number
  documentId: string
  Title: string
  Slug: string
  ShortDescription: string
  Description: string | null
  FeaturedImage: { id: number; url: string; name: string } | null
}

export interface RichTextBlock {
  __component: 'shared.rich-text'
  id: number
  RichText: string
}

export interface MantraCardBlock {
  __component: 'section.mantra-card-widget'
  id: number
  mantra_cards: Array<{
    id: number
    documentId: string
    Title: string
    Slug: string
    ShortDescription: string
    Price: number | null
  }>
}

export type ContentBlock = RichTextBlock | MantraCardBlock

export interface BlogItem {
  id: number
  documentId: string
  Title: string
  Slug: string
  ShortDescription: string
  Description: string | null
  ReadTime: string
  createdAt?: string
  updatedAt?: string
  publishedAt: string | null
  FeaturedImage: { id: number; url: string; name: string; alternativeText: string | null } | null
  categories: Array<{ id: number; documentId: string; Title: string; Slug: string; Description: string | null }>
  BlogTags: Array<{ id: number; blog_tags: BlogTag[] }>
  Author: { id: number; authors: BlogAuthor[] }
  SEO: null
  LeftBlock: ContentBlock[]
  RightBlock: ContentBlock[]
}

export interface Category {
  id: number
  documentId: string
  Title: string
  Slug: string
  Description: string | null
  blogs: BlogItem[];
}

export interface BlogPageData {
  FeaturedBlog: { blogs: BlogItem[] }
  EditorsPicks: { blogs: BlogItem[] }
  PopularThisWeek: { blogs: BlogItem[] }
}

export interface BlogListResponse {
  data: BlogItem[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}
