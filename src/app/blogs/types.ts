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

export interface SEO {
  id: number
  MetaTitle: string | null
  MetaDescription: string | null
  MetaRobots: string | null
  Open_Graph_Title: string | null
  Open_Graph_Description: string | null
  MetaImage: { url: string } | null
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

export interface ImageBlock {
  __component: 'shared.image'
  id: number
  image: {
    id: number
    documentId: string
    name: string
    alternativeText: string | null
    url: string
  }
}

export interface TableBlock {
  __component: 'shared.table'
  id: number
  TableJSON: {
    data: {
      columns: string[]
      values: string[][]
    }
  }
}

export type ContentBlock = RichTextBlock | MantraCardBlock | ImageBlock | TableBlock

export interface FAQBlock {
  __component: 'shared.fa-qs'
  id: number
  Question: string
  Answer: string
}

export interface RelatedItem {
  id: number
  documentId: string
  Title: string
  Slug: string
  ShortDescription: string | null
  FeaturedImage: { id: number; url: string; alternativeText: string | null } | null
}

export type RelatedBlock =
  | { __component: 'shared.related-vrat-katha';  id: number; vrat_kathas: RelatedItem[] }
  | { __component: 'shared.related-temples';      id: number; temples: RelatedItem[] }
  | { __component: 'shared.related-festivals';    id: number; festivals: RelatedItem[] }
  | { __component: 'shared.related-puja-vidhi';   id: number; puja_vidhis: RelatedItem[] }
  | { __component: 'shared.related-purnima';      id: number; purnimas: RelatedItem[] }
  | { __component: 'shared.related-pradosh';      id: number; pradoshes: RelatedItem[] }
  | { __component: 'shared.related-ekadashi';     id: number; ekadashis: RelatedItem[] }
  | { __component: 'shared.related-amavasya';     id: number; amavasyas: RelatedItem[] }
  | { __component: 'shared.related-blogs';        id: number; blogs: RelatedItem[] }

export interface BlogItem {
  id: number
  documentId: string
  Title: string
  Slug: string
  ShortDescription: string | null
  Description: string | null
  ReadTime: string | null
  createdAt?: string
  updatedAt?: string
  publishedAt: string | null
  FeaturedImage: { id: number; url: string; name: string; alternativeText: string | null } | null
  category: { id: number; documentId: string; Title: string; Slug: string; Description: string | null } | null
  BlogTags: Array<{ id: number; blog_tags: BlogTag[] }>
  Author: { id: number; authors: BlogAuthor[] } | null
  SEO: SEO | null
  FAQBlock: FAQBlock[]
  RelatedReadingBlock: RelatedBlock[]
  LeftBlock: ContentBlock[]
  RightBlock: ContentBlock[]
}

export interface Category {
  id: number
  documentId: string
  Title: string
  Slug: string
  Description: string | null
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
