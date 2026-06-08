"use client"
import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import './EkadashiDetails.css';
import { formatDate, formatDateTime, getDayFromDate } from '../common/functions';

interface PradoshDetailsProps {
  slug: string
  pradoshDetailData: any
}

const PradoshDetails = ({ slug, pradoshDetailData }: PradoshDetailsProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('eka-significance');

  const recommendedData = useMemo(() => {
    const temples = pradoshDetailData?.PradoshBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-temples')?.temples?.map((temple: any) => ({ ... temple, type: 'Temple', id: `temple-${temple.id}`}));
    const festivals = pradoshDetailData?.PradoshBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-festivals')?.festivals?.map((festival: any) => ({ ... festival, type: 'Festival', id: `festival-${festival.id}`}));
    const pujaVidhis = pradoshDetailData?.PradoshBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-puja-vidhi')?.puja_vidhis?.map((puja: any) => ({ ... puja, type: 'Puja Vidhi', id: `puja-${puja.id}`}));
    const vratKathas = pradoshDetailData?.PradoshBlock?.find((item: { __component: string }) => item?.__component === 'shared.related-vrat-katha')?.vrat_kathas?.map((katha: any) => ({ ... katha, type: 'Vrat Katha', id: `katha-${katha.id}`}));
    return [...(temples || []), ...(festivals || []), ...(pujaVidhis || []), ...(vratKathas || [])];
  }, [pradoshDetailData])
  

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

  const renderChildText = (bold: boolean, italic: boolean, type: string, url: string, text: string, linkText: string) => {
    if (bold) {
      return <strong key={text}>{text}</strong>;
    } else if (italic) {
      return <em key={text}>{text}</em>;
    } else if (bold && italic) {
      return <em key={text}><strong>{text}</strong></em>;
    } else if (type === 'link') {
      return <a key={text} href={url} style={{ color: 'darkred', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{linkText}</a>;
    } else if (bold && type === 'link') {
      return <a key={text} href={url} style={{ color: 'darkred', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer"><strong>{linkText}</strong></a>;
    } else if (italic && type === 'link') {
      return <a key={text} href={url} style={{ color: 'darkred', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer"><em>{linkText}</em></a>;
    } else if (bold && italic && type === 'link') {
      return <a key={text} href={url} style={{ color: 'darkred', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer"><em><strong>{linkText}</strong></em></a>;
    } else {
      return text || '';
    }
  }

  return (
    <div style={{ paddingBottom: 0 }}>
      {/* Hero Section */}
      <div className="pradosh-hero" style={{ paddingTop: '122px' }}>
        <div className="pradosh-trishul">
          <svg width="240" height="400" viewBox="0 0 240 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="120" y1="60" x2="120" y2="390" stroke="#9A88E0" stroke-width="12" stroke-linecap="round"></line>

      <path d="M120 60 Q108 38 102 16 M120 60 L120 16 M120 60 Q132 38 138 16" stroke="#C0B0F0" stroke-width="7" fill="none" stroke-linecap="round"></path>

      <ellipse cx="98" cy="180" rx="20" ry="34" fill="#7060B0" opacity="0.85"></ellipse>
      <ellipse cx="142" cy="180" rx="20" ry="34" fill="#7060B0" opacity="0.85"></ellipse>
      <rect x="98" y="174" width="44" height="12" rx="6" fill="#5A4890" opacity="0.9"></rect>
    </svg>
        </div>
        <div className="eka-hero-inner">
          <div>
            <div className="eka-eyebrow">{pradoshDetailData?.HinduMonth?.Month} · {pradoshDetailData?.TrayodashiPaksha}</div>
            <h1 className="eka-title">
              {pradoshDetailData?.Title?.split(' ').map((word: string, index: number) => (
                <span key={index}>
                  {word}
                  <br />
                </span>
              ))}
            </h1>
            {/* <div className="eka-title-deva">{'not available'}</div> */}
            <p className="eka-title-deva">
              {pradoshDetailData?.ShortDescription}
            </p>
            {/* <p className="eka-subtitle">
              {amavasyaDetailData?.ShortDescription}
            </p> */}
            <div className="eka-meta-row">
              <div className="eka-meta">
                <div className="eka-meta-label">Vikrama Samvata</div>
                <div className="eka-meta-value">{pradoshDetailData?.VikramSamvataYear}</div>
              </div>
              <div className="eka-meta">
                <div className="eka-meta-label">Paksha</div>
                <div className="eka-meta-value">{pradoshDetailData?.TrayodashiPaksha}</div>
              </div>
              <div className="eka-meta">
                <div className="eka-meta-label">Hindu Month</div>
                <div className="eka-meta-value">{pradoshDetailData?.HinduMonth?.Month}</div>
              </div>
              <div className="eka-meta">
                <div className="eka-meta-label">Deity</div>
                <div className="eka-meta-value">{pradoshDetailData?.Deity?.Deity}</div>
              </div>
            </div>
          </div>

          {/* Feature Card */}
          <div className="eka-feature-card">
            <div className="eka-feature-img" style={{
              background: `url("${pradoshDetailData?.FeaturedImage?.url || ''}") center/cover no-repeat`
            }}></div>
            <div className="eka-feature-body">
              <div className="eka-feature-eyebrow">Observance Date</div>
              <div className="eka-feature-title">{`${getDayFromDate(pradoshDetailData?.Date || '')} • ${formatDate(pradoshDetailData?.Date)}`}</div>
              <div className="eka-dates-grid">
                <div className="eka-date-cell">
                  <div className="eka-date-label">Muharat Begins</div>
                  <div className="eka-date-value">{formatDateTime(pradoshDetailData?.Muhurat?.StartTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(pradoshDetailData?.Muhurat?.StartTime || '').formattedDate}</div>
                </div>
                <div className="eka-date-cell">
                  <div className="eka-date-label">Muharat Ends</div>
                  <div className="eka-date-value">{formatDateTime(pradoshDetailData?.Muhurat?.EndTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(pradoshDetailData?.Muhurat?.EndTime || '').formattedDate}</div>
                </div>
                <div className="eka-date-cell">
                  <div className="eka-date-label">Pradosh Begins</div>
                  <div className="eka-date-value">{formatDateTime(pradoshDetailData?.DayPradoshaTime?.StartTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(pradoshDetailData?.DayPradoshaTime?.StartTime || '').formattedDate}</div>
                </div>
                <div className="eka-date-cell">
                  <div className="eka-date-label">Pradosh Ends</div>
                  <div className="eka-date-value">{formatDateTime(pradoshDetailData?.DayPradoshaTime?.EndTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(pradoshDetailData?.DayPradoshaTime?.EndTime || '').formattedDate}</div>
                </div>
                <div className="eka-date-cell">
                  <div className="eka-date-label">Trayodashi Begins</div>
                  <div className="eka-date-value">{formatDateTime(pradoshDetailData?.TrayodashiTithi?.StartTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(pradoshDetailData?.TrayodashiTithi?.StartTime || '').formattedDate}</div>
                </div>
                <div className="eka-date-cell">
                  <div className="eka-date-label">Trayodashi Ends</div>
                  <div className="eka-date-value">{formatDateTime(pradoshDetailData?.TrayodashiTithi?.EndTime || '').time}</div>
                  <div className="eka-date-sub">{formatDateTime(pradoshDetailData?.TrayodashiTithi?.EndTime || '').formattedDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="eka-body">
        <div className="eka-content">
          {pradoshDetailData?.Description?.map((description: { type?: string; level?: number; children?: { children?: { text?: string }[]; text?: string, bold?: boolean, italic?: boolean, type?: string, url?: string }[]; format?: string }, index: number) => {
            if (description?.type === 'heading') {
              switch (description?.level) {
                case 1:
                  return <h1 id={String(index)} key={index}>{description?.children?.map((child) => renderChildText(child?.bold || false, child?.italic || false, child?.type || '', child?.url || '', child?.text || '', child?.children?.[0]?.text || ''))}</h1>;
                case 2:
                  return <h2 id={String(index)} key={index}>{description?.children?.map((child) => renderChildText(child?.bold || false, child?.italic || false, child?.type || '', child?.url || '', child?.text || '', child?.children?.[0]?.text || ''))}</h2>;
                case 3:
                  return <h3 id={String(index)} key={index}>{description?.children?.map((child) => renderChildText(child?.bold || false, child?.italic || false, child?.type || '', child?.url || '', child?.text || '', child?.children?.[0]?.text || ''))}</h3>;
                default:
                  return null;
              }
            } else if (description?.type === 'paragraph') {
              return <p key={index}>{description?.children?.map((child) => renderChildText(child?.bold || false, child?.italic || false, child?.type || '', child?.url || '', child?.text || '', child?.children?.[0]?.text || ''))}</p>;
              // return <p key={index} className="lead">{description?.children?.[0]?.text}</p>;
            } else if (description?.type === 'list') {
              switch (description?.format) {
                case 'ordered':
                  return <ol key={index}>{description?.children?.map((item: { children?: { text?: string, bold?: boolean, italic?: boolean, type?: string, url?: string, children?: { text?: string }[] }[] }, idx: number) => <li key={idx}>{item?.children?.map((child) => renderChildText(child?.bold || false, child?.italic || false, child?.type || '', child?.url || '', child?.text || '', child?.children?.[0]?.text || ''))}</li>)}</ol>;
                case 'unordered':
                  return <ul key={index}>{description?.children?.map((item: { children?: { text?: string, bold?: boolean, italic?: boolean, type?: string, url?: string, children?: { text?: string }[] }[] }, idx: number) => <li key={idx}>{item?.children?.map((child) => renderChildText(child?.bold || false, child?.italic || false, child?.type || '', child?.url || '', child?.text || '', child?.children?.[0]?.text || ''))}</li>)}</ul>;
                default:
                  return null;
              }
            } else {
              return null;
            }
          })}






          {pradoshDetailData?.Notes?.trim()?.length > 0 && (
            <div className="eka-callout">
              <div className="eka-callout-title">Important Notes</div>
              <p>{pradoshDetailData?.Notes}</p>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <aside className="eka-side">
          <div className="eka-side-card">
            <h3>On This Page</h3>
            <ul className="eka-side-toc">
              {pradoshDetailData?.Description?.map((desc: { type?: string; id?: string; level: number; children?: { text?: string }[] }, index: number) => (desc?.type === 'heading' && desc?.level === 2 ? (
                <li key={index}>
                  <a href={`#${index}`} className={activeTab === String(index) ? 'active' : ''} onClick={(e) => handleTocClick(e, String(index))}>
                    {desc?.children?.[0]?.text}
                  </a>
                </li>
              ) : null))}
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
            <p>Common queries about observing {pradoshDetailData?.Title || 'Pradosh'} correctly.</p>
          </div>
          <div className="eka-faq-list">
            {pradoshDetailData?.PradoshBlock?.filter((block: { __component: string }) => block?.__component === 'shared.fa-qs')?.map((faqBlock: { id: number; Question: string; Answer: string }, index: number) => (
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
            <div className="eka-next-eyebrow">{`Up Next · ${pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.HinduMonth?.Month || ''} · ${pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.TrayodashiPaksha || ''}`}</div>
            <h2 className="eka-next-title">{pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Title}</h2>
            <div className="eka-next-deva">{pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.ShortDescription}</div>
            <div className="eka-next-meta">
              <span><strong>{formatDate(pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Date)}</strong> · {getDayFromDate(pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Date)}</span>
              <span>Muhrat begins <strong>{formatDateTime(pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Muhurat?.StartTime || '').formattedDate} · {formatDateTime(pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Muhurat?.StartTime || '').time}</strong></span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ background: 'var(--gold-bright)', borderColor: 'var(--gold-bright)', color: 'var(--ink)', padding: '16px 28px', fontSize: 15 }} onClick={() => router.push(pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Slug ? `/pradosh/${pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Slug}` : '/') }>
            {`View ${pradoshDetailData?.NextPradoshLink?.pradoshes?.[0]?.Title} →`}
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

export default PradoshDetails;
