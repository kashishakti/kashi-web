"use client"
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import './EkadashiDetails.css';
import { formatDate, formatDateTime, getDayFromDate } from '../common/functions';

interface FestivalDetailsProps {
  slug: string
  festivalDetailData: any
}

const FestivalDetails = ({ slug, festivalDetailData }: FestivalDetailsProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('eka-significance');

  const recommendedData = useMemo(() => {
    const temples = festivalDetailData?.FestivalBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-temples')?.temples?.map((temple: any) => ({ ... temple, type: 'Temple', id: `temple-${temple.id}`}));
    const festivals = festivalDetailData?.FestivalBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-festivals')?.festivals?.map((festival: any) => ({ ... festival, type: 'Festival', id: `festival-${festival.id}`}));
    const pujaVidhis = festivalDetailData?.FestivalBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-puja-vidhi')?.puja_vidhis?.map((puja: any) => ({ ... puja, type: 'Puja Vidhi', id: `puja-${puja.id}`}));
    const vratKathas = festivalDetailData?.FestivalBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-vrat-katha')?.vrat_kathas?.map((katha: any) => ({ ... katha, type: 'Vrat Katha', id: `katha-${katha.id}`}));
    return [...(temples || []), ...(festivals || []), ...(pujaVidhis || []), ...(vratKathas || [])];
  }, [festivalDetailData])
  

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setActiveTab(sectionId);

    if (typeof window === "undefined") return;

    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 72; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20; // 20px extra padding

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const getDescriptionHtml = (description: any) => {
    if (!description) return null
    if (typeof description === 'string') return description
    if (typeof description === 'object') {
      if (typeof description?.html === 'string') return description.html
      if (typeof description?.value === 'string') return description.value
      if (typeof description?.data === 'string') return description.data
      if (typeof description?.content === 'string') return description.content
      if (typeof description?.data?.html === 'string') return description.data.html
      if (typeof description?.data?.value === 'string') return description.data.value
      if (typeof description?.data?.content === 'string') return description.data.content
    }
    return null
  }

  const escapeHtml = (value: string) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const parseInlineMarkdown = (text: string) => {
    // Process in a specific order to avoid re-matching: links first, then formatting
    let result = text
    
    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Triple patterns: ***text***, ___text___, _**text**_, **_text_**, etc.
    result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    result = result.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>')
    result = result.replace(/\*\*_(.+?)_\*\*/g, '<strong><em>$1</em></strong>')
    result = result.replace(/_\*\*(.+?)\*\*_/g, '<strong><em>$1</em></strong>')
    
    // Double patterns: **text**, __text__, *text*, _text_
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>')
    result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
    result = result.replace(/_(.+?)_/g, '<em>$1</em>')
    
    // Strikethrough: ~~text~~
    result = result.replace(/~~(.+?)~~/g, '<del>$1</del>')
    
    // Code: `text`
    result = result.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    return result
  }

  const parseMarkdownToHtml = (value: string) => {
    const normalized = value.replace(/\r\n/g, '\n').replace(/\t/g, ' ')
    const unescaped = normalized.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

    let html = unescaped
      .replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${escapeHtml(code.trim())}</code></pre>`)
      .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
      .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
      .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
      .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
      .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
      .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')

    const lines = html.split('\n')
    const output: string[] = []
    let inUl = false
    let inOl = false

    const closeLists = () => {
      if (inUl) {
        output.push('</ul>')
        inUl = false
      }
      if (inOl) {
        output.push('</ol>')
        inOl = false
      }
    }

    for (let line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        closeLists()
        continue
      }

      const codeBlockMatch = /^<pre><code>[\s\S]*<\/code><\/pre>$/.test(trimmed)
      const headingMatch = /^<h[1-6]>/.test(trimmed)
      const blockquoteMatch = /^>\s*(.+)$/.exec(trimmed)
      const unorderedMatch = /^[-*+]\s+(.+)$/.exec(trimmed)
      const orderedMatch = /^\d+\.\s+(.+)$/.exec(trimmed)

      if (codeBlockMatch) {
        closeLists()
        output.push(trimmed)
        continue
      }

      if (headingMatch) {
        closeLists()
        output.push(trimmed)
        continue
      }

      if (blockquoteMatch) {
        closeLists()
        output.push(`<blockquote>${parseInlineMarkdown(blockquoteMatch[1].trim())}</blockquote>`)
        continue
      }

      if (unorderedMatch) {
        if (inOl) {
          output.push('</ol>')
          inOl = false
        }
        if (!inUl) {
          output.push('<ul>')
          inUl = true
        }
        output.push(`<li>${parseInlineMarkdown(unorderedMatch[1].trim())}</li>`)
        continue
      }

      if (orderedMatch) {
        if (inUl) {
          output.push('</ul>')
          inUl = false
        }
        if (!inOl) {
          output.push('<ol>')
          inOl = true
        }
        output.push(`<li>${parseInlineMarkdown(orderedMatch[1].trim())}</li>`)
        continue
      }

      const imageMatch = /^!\[(.*?)\]\((.*?)\)$/.exec(trimmed)
      if (imageMatch) {
        closeLists()
        output.push(`<figure><img src="${imageMatch[2]}" alt="${imageMatch[1]}" /><figcaption>${imageMatch[1]}</figcaption></figure>`)
        continue
      }

      output.push(`<p>${parseInlineMarkdown(trimmed)}</p>`)
    }

    closeLists()
    return output.join('')
  }

  const stripHtmlTags = (value: string) => value.replace(/<[^>]+>/g, '').trim()

  const simpleHash = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36).substring(0, 8)
  }

  const { descriptionHtml, tocItems } = useMemo(() => {
    const description = festivalDetailData?.Description
    const rawHtml = getDescriptionHtml(description)
    const html = rawHtml ? parseMarkdownToHtml(rawHtml) : null

    if (html) {
      const headings: { id: string; text: string; level: number }[] = []

      const htmlWithHeadingIds = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
        const text = stripHtmlTags(inner)
        const existingId = attrs.match(/\bid=['"]([^'"]+)['"]/)?.[1]
        const id = existingId || `heading-${simpleHash(text)}`

        headings.push({ id, text: text || `section-${headings.length + 1}`, level: Number(level) })

        if (existingId) {
          return match
        }

        return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
      })

      const h2Headings = headings.filter((heading) => heading.level === 2)
      return { descriptionHtml: htmlWithHeadingIds, tocItems: h2Headings }
    }

    return { descriptionHtml: null, tocItems: [] }
  }, [festivalDetailData?.Description])

  return (
    <div style={{ paddingBottom: 0 }}>
      {/* Hero Section */}
      <div className="festival-hero" style={{ paddingTop: '122px' }}>
        <div className="eka-hero-inner">
          <div>
            <div className="eka-eyebrow">{festivalDetailData?.HinduMonth?.Month} · {festivalDetailData?.FestivalPaksha} · {festivalDetailData?.Date?.slice(0,4)}</div>
            <h1 className="eka-title">
              {festivalDetailData?.Title?.split(' ').map((word: string, index: number) => (
                <span key={index}>
                  {word}
                  <br />
                </span>
              ))}
            </h1>
            {/* <div className="eka-title-deva">{'not available'}</div> */}
            <p className="eka-title-deva">
              {festivalDetailData?.ShortDescription}
            </p>
            {/* <p className="eka-subtitle">
              {festivalDetailData?.ShortDescription}
            </p> */}
            <div className="eka-meta-row">
              <div className="eka-meta">
                <div className="eka-meta-label">Hindu Month</div>
                <div className="eka-meta-value">{festivalDetailData?.HinduMonth?.Month}</div>
              </div>
              <div className="eka-meta">
                <div className="eka-meta-label">Paksha</div>
                <div className="eka-meta-value">{festivalDetailData?.FestivalPaksha}</div>
              </div>
              <div className="eka-meta">
                <div className="eka-meta-label">Preciding Deity</div>
                <div className="eka-meta-value">{festivalDetailData?.Deity?.Deity}</div>
              </div>
            </div>
          </div>

          {/* Feature Card */}
          <div className="eka-feature-card">
            <div className="eka-feature-img" style={{
              background: `url("${festivalDetailData?.FeaturedImage?.url || ''}") center/cover no-repeat`
            }}></div>
            <div className="eka-feature-body">
              <div className="eka-feature-eyebrow">Observance Date</div>
              <div className="eka-feature-title">{`${getDayFromDate(festivalDetailData?.Date || '')} • ${formatDate(festivalDetailData?.Date)}`}</div>
              <div className="eka-dates-grid">
                <div className="eka-date-cell">
                  <div className="eka-date-label">{festivalDetailData?.MuhuratBeginLabel}</div>
                  <div className="eka-date-value">{formatDateTime(festivalDetailData?.FestivalTimings?.StartTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(festivalDetailData?.FestivalTimings?.StartTime || '').formattedDate}</div>
                </div>
                <div className="eka-date-cell">
                  <div className="eka-date-label">{festivalDetailData?.MuhuratEndLabel}</div>
                  <div className="eka-date-value">{formatDateTime(festivalDetailData?.FestivalTimings?.EndTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(festivalDetailData?.FestivalTimings?.EndTime || '').formattedDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="eka-body">
        <div className="eka-content">
          {descriptionHtml && (
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          )}

                    {festivalDetailData?.Notes?.trim()?.length > 0 && (
            <div className="eka-callout">
              <div className="eka-callout-title">Important Notes</div>
              <p>{festivalDetailData?.Notes}</p>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <aside className="eka-side">
          <div className="eka-side-card">
            <h3>On This Page</h3>
            <ul className="eka-side-toc">
              {tocItems?.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'toc-subitem' : ''}>
                  <a href={`#${item.id}`} className={activeTab === item.id ? 'active' : ''} onClick={(e) => handleTocClick(e, item.id)}>
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="eka-side-card">
            <h3>Share This Page</h3>
            <div className="eka-share">
              <button className="eka-share-btn wa">WhatsApp</button>
              <button className="eka-share-btn">𝕏</button>
              <button className="eka-share-btn">f</button>
              <button className="eka-share-btn">📋</button>
            </div>
          </div> */}
        </aside>
      </div>

      {/* FAQ Section */}
      <div className="eka-faq-section">
        <div className="eka-faq-wrap">
          <div className="eka-faq-head">
            <h2>Frequently Asked Questions</h2>
            <p>Common queries about observing {festivalDetailData?.Title || 'Ekadashi'} correctly.</p>
          </div>
          <div className="eka-faq-list">
            {festivalDetailData?.FestivalBlock?.filter((block: { __component: string }) => block?.__component === 'shared.fa-qs')?.map((faqBlock: { id: number; Question: string; Answer: string }, index: number) => (
              <FAQItem
                key={faqBlock?.id}
                question={faqBlock?.Question}
                answer={faqBlock?.Answer}
                defaultOpen={index === 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Articles Section */}
      <section className="eka-related-section">
        <div className="eka-related-inner">
          <div className="eka-related-head">
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Further Reading</div>
              <h2>Recommended for you</h2>
            </div>
            {/* <a href="#" className="btn-link">View all articles →</a> */}
          </div>

          <div className="eka-card-grid">
            {recommendedData?.map((item: any) => (
              <ArticleCard
                key={item?.id}
                tag={item?.type}
                title={item?.Title}
                excerpt={item?.ShortDescription}
                bgImg={item?.FeaturedImage?.url || null}
                slug={item?.Slug}
                router={router}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Next Ekadashi CTA Section */}
      <div className="eka-next">
        <div className="eka-next-inner">
          <div>
            {/* <div className="eka-next-eyebrow">{`Up Next · ${festivalDetailData?.NextFestivalLink?.festivals?.[0]?.EkadashiPaksha} · ${festivalDetailData?.NextFestivalLink?.festivals?.[0]?.EkadashiMonth?.Month}`}</div> */}
            <div className="eka-next-eyebrow">{`Up Next`}</div>
            <h2 className="eka-next-title">{festivalDetailData?.NextFestivalLink?.festivals?.[0]?.Title}</h2>
            <div className="eka-next-deva">{festivalDetailData?.NextFestivalLink?.festivals?.[0]?.ShortDescription}</div>
            <div className="eka-next-meta">
              <span><strong>{formatDate(festivalDetailData?.NextFestivalLink?.festivals?.[0]?.Date)}</strong> · {getDayFromDate(festivalDetailData?.NextFestivalLink?.festivals?.[0]?.Date)}</span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ background: 'var(--gold-bright)', borderColor: 'var(--gold-bright)', color: 'var(--ink)', padding: '16px 28px', fontSize: 15 }} onClick={() => router.push(festivalDetailData?.NextFestivalLink?.festivals?.[0]?.Slug ? `/festival/${festivalDetailData?.NextFestivalLink?.festivals?.[0]?.Slug}` : '/') }>
            {`View ${festivalDetailData?.NextFestivalLink?.festivals?.[0]?.Title} →`}
          </button>
        </div>
      </div>

      {/* Page Divider */}
      <div className="page-divider">
        <span className="page-divider-mark">॥ ॐ ॥</span>
      </div>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

interface ArticleCardProps {
  tag: string;
  title: string;
  excerpt: string;
  bgImg: string;
  slug: string;
  router: any;
}

const getLink = (type: string, slug: string) => {
  switch (type) {
    case 'Vrat Katha':
      return `/vrat-katha/${slug}`;
      case 'Temple':
        return `/temple/${slug}`;
      case 'Festival':
        return `/festival/${slug}`;
      case 'Puja Vidhi':
        return `/puja-vidhi/${slug}`;
    default:
      return '/';
  }
}

const ArticleCard: React.FC<ArticleCardProps> = ({ tag, title, excerpt, bgImg, slug, router }) => {
  return (
    <a onClick={() => router.push(getLink(tag, slug))} className="article-card" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
      <div className="article-card-img">
        <img className="recom-card-img" src={bgImg} alt={title} />
      </div>
      <div className="article-card-body">
        <div className="article-card-tag">{tag}</div>
        <h3 className="article-card-title">{title}</h3>
        <p className="article-card-excerpt">{excerpt}</p>
        {/* <div className="article-card-meta">
          <span>{readTime}</span>
          <span className="dot"></span>
          <span>{author}</span>
        </div> */}
      </div>
    </a>
  );
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`eka-faq-item ${!isOpen ? 'closed' : ''}`}>
      <div className="eka-faq-q" onClick={() => setIsOpen(!isOpen)}>
        {question} <span className="icon"></span>
      </div>
      <div className="eka-faq-a">{answer}</div>
    </div>
  );
};

export default FestivalDetails;
