import { BASE_URL, REVALIDATE } from "@/constants"
import type { BlogItem } from "@/app/blogs/types"
import "@/components/Recommended.css"
import "./Home.css"

import HeroSection from "./HeroSection"
import AssurancesSection from "./AssurancesSection"
import HowSection from "./HowSection"
import PanchangSection from "./PanchangSection"
import SamagriPreviewSection from "./SamagriPreviewSection"
import BlogsSection from "./BlogsSection"
import StickyBar from "./StickyBar"

async function getHomeBlogs(): Promise<BlogItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/blogs?page=1&pageSize=3`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json ?? []
  } catch {
    return []
  }
}

export default async function Home() {
  const blogs = await getHomeBlogs()
  return (
    <div className="ks-home page-enter">
      <HeroSection />
      <AssurancesSection />
      <HowSection />
      <PanchangSection />
      <SamagriPreviewSection />
      <BlogsSection blogs={blogs} />
      <StickyBar />
    </div>
  )
}
