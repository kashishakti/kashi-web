import Link from 'next/link'
import { getLinkFromType } from './getLinkFromType'

interface Props {
  tag: string
  title: string
  excerpt: string | null
  bgImg: string | null
  slug: string
}

export default function ArticleCard({ tag, title, excerpt, bgImg, slug }: Props) {
  return (
    <Link href={getLinkFromType(tag, slug)} className="article-card">
      <div className="article-card__img">
        {bgImg && <img className="article-card__img-inner" src={bgImg} alt={title} />}
      </div>
      <div className="article-card__body">
        <div className="article-card__tag">{tag}</div>
        <h3 className="article-card__title">{title}</h3>
        {excerpt && <p className="article-card__excerpt">{excerpt}</p>}
      </div>
    </Link>
  )
}
