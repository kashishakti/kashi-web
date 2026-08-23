import Link from "next/link"
import ArticleCard from "@/components/ArticleCard"
import type { BlogItem } from "@/app/blogs/types"

export default function BlogsSection({ blogs }: { blogs: BlogItem[] }) {
  if (!blogs.length) return null
  return (
    <section className="ks-blogs-section" aria-labelledby="blog-heading">
      <div className="container">
        <div className="ks-blogs-head">
          <h2 className="ks-blogs-head__h2" id="blog-heading">From Kashi Shakti</h2>
          <Link className="ks-blogs-head__more" href="/blogs">Explore All Blogs →</Link>
        </div>
        <div className="article-card-grid">
          {blogs.map(blog => (
            <ArticleCard
              key={blog.documentId}
              tag="Blog"
              title={blog.Title}
              excerpt={blog.ShortDescription}
              bgImg={blog.FeaturedImage?.url ?? null}
              slug={blog.Slug}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
