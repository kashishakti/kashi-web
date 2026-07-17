'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import './Vrat.css'

type FestivalTab = 'festivals' | 'vratkatha'

type FestivalsProps = {
  year?: number
  serverNow?: number
  festivalsData?: unknown
  vratKathasData?: unknown
}

type FestivalItem = {
  date: string
  name: string
  deva: string
  hinduMonth: string
  deity: string
  description: string
  timing: string
  special: string
  href?: string
  imageUrl?: string
}

type KathaItem = {
  name: string
  deva: string
  type: string
  deity: string
  description: string
  duration: string
  sym: string
  href?: string
}

const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const parseDate = (date: string) => new Date(`${date}T00:00:00`)
const formatShort = (date: string) => {
  const d = parseDate(date)
  return `${d.getDate()} ${monthShort[d.getMonth()]}`
}
const formatLong = (date: string) => {
  const d = parseDate(date)
  return `${monthLong[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

const getString = (value: unknown) => (typeof value === 'string' ? value : '')
const normalizeDate = (date?: string) => date?.split('T')[0] ?? ''

const getRecords = (payload: unknown): Record<string, any>[] => {
  const source = payload && typeof payload === 'object' && 'data' in payload ? (payload as { data?: unknown }).data : payload
  const list = Array.isArray(source)
    ? source
    : source && typeof source === 'object'
      ? Object.values(source).find(Array.isArray) ?? []
      : []

  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, any>
      return record.attributes && typeof record.attributes === 'object'
        ? { id: record.id, ...(record.attributes as Record<string, any>) }
        : record
    })
    .filter(Boolean) as Record<string, any>[]
}

const getImageUrl = (image: unknown) => {
  if (!image || typeof image !== 'object') return ''

  const record = image as Record<string, any>
  return (
    getString(record.url) ||
    getString(record.data?.attributes?.url) ||
    getString(record.data?.url) ||
    getString(record.attributes?.url)
  )
}

const formatTime = (dateTime?: string) => {
  if (!dateTime) return ''

  const date = new Date(dateTime)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const formatTimeRange = (range?: { StartTime?: string; EndTime?: string }) => {
  const start = formatTime(range?.StartTime)
  const end = formatTime(range?.EndTime)

  if (start && end) return `${start}-${end}`
  return start || end || ''
}

const getToday = (serverNow?: number) => {
  const now = serverNow ? new Date(serverNow) : new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const daysLabel = (date: string, today: Date) => {
  const days = Math.round((parseDate(date).getTime() - today.getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return days > 0 ? `in ${days}d` : 'completed'
}

const scrollToMonth = (key: string) => {
  const element = document.getElementById(`festival-month-${key}`)
  if (!element) return

  const offset = 132
  const top = element.getBoundingClientRect().top + window.scrollY - offset

  window.scrollTo({
    top,
    behavior: 'smooth',
  })
}

const getFirstLetter = (text: string) => text.trim().charAt(0) || 'क'

const normalizeFestivalItems = (payload: unknown) => {
  return getRecords(payload)
    .map((item): FestivalItem | null => {
      const title = getString(item.Title) || getString(item.Name)
      const slug = getString(item.Slug) || getString(item.slug)
      const date = normalizeDate(
        getString(item.FestivalDate) ||
        getString(item.Date) ||
        getString(item.StartDate) ||
        getString(item.EventDate),
      )

      if (!title || !date) return null

      return {
        date,
        name: title,
        deity: item?.Deity?.Deity || '',
        description: item?.ShortDescription || '',
        hinduMonth: item?.HinduMonth?.Month,
        deva: getString(item.HindiTitle) || getString(item.SanskritTitle) || title,
        timing: formatTimeRange(item.Muhurat) || formatTimeRange(item.FestivalTimings) || formatTime(item.MoonriseTime) || 'See details',
        special: getString(item.ShortDescription) || getString(item.Special) || getString(item.Type),
        href: slug ? `/festival/${slug}` : undefined,
        imageUrl: getImageUrl(item.FeaturedImage),
      }
    })
    .filter((item): item is FestivalItem => Boolean(item))
    .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()) as FestivalItem[]
}

const normalizeKathaItems = (payload: unknown) => {
  return getRecords(payload)
    .map((item): KathaItem | null => {
      const title = getString(item.Title) || getString(item.Name)
      const slug = getString(item.Slug) || getString(item.slug)
      const rawType = getString(item.Type) || getString(item.Type?.Type) || getString(item.Type?.Title)

      if (!title) return null

      return {
        name: title,
        deva: getString(item.HindiTitle) || getString(item.SanskritTitle) || title,
        type: rawType,
        description: item?.ShortDescription || '',
        deity: 'Deity',
        duration: getString(item.Duration) || getString(item.ReadingTime) || 'Read',
        sym: getFirstLetter(title),
        href: slug ? `/vrat-katha/${slug}` : undefined,
      }
    })
    .filter((item): item is KathaItem => Boolean(item))
}

const Festivals = ({
  year = new Date().getFullYear(),
  serverNow,
  festivalsData,
  vratKathasData,
}: FestivalsProps) => {
  const [activeTab, setActiveTab] = useState<FestivalTab>('festivals')
  const [search, setSearch] = useState('')
  const today = useMemo(() => getToday(serverNow), [serverNow])
  const query = search.trim().toLowerCase()

  const festivalItems = useMemo(() => normalizeFestivalItems(festivalsData), [festivalsData])
  const kathaItems = useMemo(() => normalizeKathaItems(vratKathasData), [vratKathasData])

  const filteredFestivals = useMemo(
    () => festivalItems.filter((item) => !query || `${item.name} ${item.deva} ${item.special}`.toLowerCase().includes(query)),
    [festivalItems, query],
  )
  const filteredKathas = useMemo(
    () => kathaItems.filter((item) => !query || `${item.name} ${item.deva} ${item.type} ${item.deity}`.toLowerCase().includes(query)),
    [kathaItems, query],
  )

  const upcomingFestivals = useMemo(
    () => filteredFestivals.filter((item) => parseDate(item.date).getTime() >= today.getTime()),
    [filteredFestivals, today],
  )
  const featured = upcomingFestivals[0] ?? filteredFestivals[0] ?? null
  const heroItems = upcomingFestivals.slice(0, 8)

  const groupedFestivals = useMemo(() => {
    return filteredFestivals.reduce<Record<string, FestivalItem[]>>((acc, item) => {
      const d = parseDate(item.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      acc[key] = acc[key] ?? []
      acc[key].push(item)
      return acc
    }, {})
  }, [filteredFestivals])

  return (
    <div className="vrat-page">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-bg">उत्सव</div>
          <div>
            <div className="hero-kicker">हिन्दू पर्व-पंचांग · Sacred Festival Calendar</div>
            <h1 className="hero-h1">The Festival <br/><em>Almanac</em></h1>
            <div className="hero-deva">पर्व एवं व्रत कथा · {year}</div>
            <p className="hero-sub">
              A month-wise calendar of Hindu festivals, temple observances, and the vrat kathas connected to festival rituals and stories.
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-n">30+</div><div className="hero-stat-l">Festivals</div></div>
            <div className="hero-stat"><div className="hero-stat-n">{kathaItems.length}</div><div className="hero-stat-l">Vrat kathas</div></div>
            <div className="hero-stat"><div className="hero-stat-n">{upcomingFestivals.length}</div><div className="hero-stat-l">Upcoming this year</div></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-panel-lbl">Upcoming festivals</div>
          <div className="vrat-list">
            {heroItems.length ? (
              heroItems.map((item) => (
                <Link className="vrow" href={item.href || '#'} key={`${item.date}-${item.name}`}>
                  <span className="vrow-date">{formatShort(item.date)}</span>
                  <div>
                    <div className="vrow-name">{item.name}</div>
                    <div className="vrow-deva">{item.deva}</div>
                  </div>
                  <div><div className="vrow-rel">{daysLabel(item.date, today)}</div></div>
                </Link>
              ))
            ) : (
              <div className="vrow-empty">No upcoming festivals available.</div>
            )}
          </div>
        </div>
      </section>

      <div className="filter" id="filterBar">
        <div className="filter-in">
          <div className="tabs">
            <button className={`tab${activeTab === 'festivals' ? ' on' : ''}`} onClick={() => setActiveTab('festivals')} type="button">
              Festivals <span className="n">{festivalItems.length}</span>
            </button>
            <button className={`tab${activeTab === 'vratkatha' ? ' on' : ''}`} onClick={() => setActiveTab('vratkatha')} type="button">
              Vrat Kathas <span className="n">{kathaItems.length}</span>
            </button>
          </div>
          <div className="fsearch">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="text" placeholder="Search..." autoComplete="off" />
          </div>
        </div>
      </div>

      <main>
        {activeTab === 'festivals' && (
          <>
            {featured && (
              <section className="feat">
                <div className="feat-in">
                  <div>
                    <div className="feat-badge"><span className="feat-dot"></span>Featured festival</div>
                    <h2 className="feat-h">{featured.name.split(' ')[0]} <em>{featured.name.split(' ').slice(1).join(' ')}</em></h2>
                    <div className="feat-deva" style={{ marginTop: '10px', marginBottom: '20px' }}>{featured.description}</div>
                    {/* <p className="feat-desc">{featured.special || 'Explore festival date, muhurat, story, and observance details.'}</p> */}
                    <div className="timing">
                      <div className="timing-h">Festival timing</div>
                      <div className="timing-row">
                        <div className="timing-cell"><div className="timing-lbl">Date</div><div className="timing-val">{formatLong(featured.date)}</div></div>
                        <div className="timing-cell"><div className="timing-lbl">Muhurat</div><div className="timing-val">{featured.timing}</div></div>
                        <div className="timing-cell"><div className="timing-lbl">Status</div><div className="timing-val">{daysLabel(featured.date, today)}</div></div>
                      </div>
                    </div>
                    <div className="feat-actions">
                      <Link className="btn btn-pr btn-sm" href={featured.href || '#'}>View festival →</Link>
                    </div>
                  </div>
                  <div
                    className="feat-art g-ganesh"
                    style={featured.imageUrl ? {
                      backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.55)), url("${featured.imageUrl}")`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    } : undefined}
                  >
                    <div className="feat-art-top"><span className="feat-art-btag">Festival</span></div>
                    <div className="feat-art-deva">{featured.imageUrl ? '' : 'उत्सव'}</div>
                    <div className="feat-art-bot"><span className="feat-art-label">{featured.name}</span><span className="feat-art-month">{formatShort(featured.date)}</span></div>
                  </div>
                </div>
              </section>
            )}

            <div className="tl-wrap">
              <div className="tl-top">
                <div>
                  <div className="sec-eye">Festival calendar · {year}</div>
                  <h2 className="tl-h">Month-wise <em>festivals</em></h2>
                </div>
                <div className="tl-total">{filteredFestivals.length} festivals · {upcomingFestivals.length} upcoming</div>
              </div>
              <div className="tl-jumps">
                {Object.keys(groupedFestivals).map((key) => {
                  const first = groupedFestivals[key][0]
                  const d = parseDate(first.date)
                  return (
                    <button
                      className={`tl-jump${d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() ? ' cur' : ''}`}
                      onClick={() => scrollToMonth(key)}
                      type="button"
                      key={key}
                    >
                      {monthShort[d.getMonth()]}
                    </button>
                  )
                })}
              </div>
              {Object.entries(groupedFestivals).length ? (
                Object.entries(groupedFestivals).map(([key, items]) => {
                  const d = parseDate(items[0].date)
                  return (
                    <div className="tl-month-sec" id={`festival-month-${key}`} key={key}>
                      <div className="tl-mhdr">
                        <div className={`tl-mname${d.getMonth() === today.getMonth() ? ' cur' : ''}`}>{monthLong[d.getMonth()]} {d.getFullYear()}</div>
                        <div className="tl-mcnt">{items.length} festivals</div>
                      </div>
                      {items.map((item) => {
                        const rowDate = parseDate(item.date)
                        const rowTime = rowDate.getTime()
                        const todayTime = today.getTime()
                        return (
                          <Link className={`tlr${rowTime === todayTime ? ' tod' : rowTime < todayTime ? ' past' : ''}`} href={item.href || '#'} key={`${item.date}-${item.name}`}>
                            <div className="tlr-date"><span className="tlr-d">{formatShort(item.date)}</span><span className="tlr-dw">{dayShort[rowDate.getDay()]}</span></div>
                            <span className="tlr-badge b-purnima">{item.hinduMonth}</span>
                            <div className="tlr-nb"><div className="tlr-name">{item.name}</div><div className="tlr-deva">{item.deity}</div></div>
                            <span className="tlr-sp">{' '}</span>
                            <div className="tlr-info"><div className="tlr-tlbl">Muhurat</div><div className="tlr-tval">{item.timing}</div></div>
                            <div className="tlr-arr">→</div>
                          </Link>
                        )
                      })}
                    </div>
                  )
                })
              ) : (
                <div className="tl-empty">No festivals found.</div>
              )}
            </div>
          </>
        )}

        {activeTab === 'vratkatha' && (
          <div className="type-view">
            <div className="type-hdr">
              <div className="type-hdr-in type-hdr-single">
                <div>
                  <div className="th-row">
                    <div className="th-sym g-shiva">कथा</div>
                    <div>
                      <div className="th-name">Vrat Kathas <em>· व्रत कथा</em></div>
                      <div className="th-deva">Sacred stories connected to festivals</div>
                    </div>
                  </div>
                  <p className="th-desc">Festival vrat kathas are listed together for quick reading.</p>
                </div>
              </div>
            </div>
            <div className="vc-section">
              {filteredKathas.length ? (
                <div className="kv-grid">
                  {filteredKathas.map((item) => (
                    <Link className="kvc" href={item.href || '#'} key={`${item.type}-${item.name}`}>
                      <div className="kvc-left"><div className="kvc-sym g-vishnu">{item.sym}</div></div>
                      <div className="kvc-body">
                        <div className="kvc-name">{item.name}</div>
                        <div className="kvc-deva">{item.description}</div>
                        {/* <div className="kvc-meta"><span className="kvc-pill">{item.deity}</span><span className="kvc-pill">{item.duration}</span></div> */}
                        <div className="kvc-occ">{item.type}</div>
                      </div>
                      <div className="kvc-arr">→</div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="tl-empty">No vrat kathas found.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Festivals
