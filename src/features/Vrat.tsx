'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import './Vrat.css'

type VratType = 'all' | 'ekadashi' | 'pradosh' | 'purnima' | 'amavasya' | 'vratkatha'

type VratMeta = {
  name: string
  deva: string
  sym: string
  grad: string
  deity: string
  fastType: string
  breakFast: string
  timingLabel: string
  count: number
  desc: string
}

type VratItem = {
  date: string
  name: string
  deity: string
  deva: string
  description: string
  paksha: 'Krishna' | 'Shukla'
  timing: string
  special?: string
  href?: string
  featuredImageUrl?: string
}

type KathaItem = {
  name: string
  deva: string
  group: string
  type: string
  description: string
  sym: string
  grad: string
  duration: string
  href?: string
}

type VratFestivalsPageProps = {
  year?: number
  serverNow?: number
  ekadashisData?: unknown
  purnimasData?: unknown
  amavasyasData?: unknown
  pradoshesData?: unknown
  vratKathasData?: unknown
}

const typeMeta: Record<Exclude<VratType, 'all' | 'vratkatha'>, VratMeta> = {
  ekadashi: {
    name: 'Ekadashi',
    deva: 'एकादशी',
    sym: 'ए',
    grad: 'g-vishnu',
    deity: 'Vishnu · विष्णु',
    fastType: 'Grains & pulses avoided',
    breakFast: 'Parana next morning',
    timingLabel: 'Parana window',
    count: 24,
    desc: 'The 11th tithi of each lunar fortnight, sacred to Vishnu. Fasting removes sins and steadies the mind through devotion, japa, and restraint.',
  },
  pradosh: {
    name: 'Pradosh',
    deva: 'प्रदोष',
    sym: 'प्र',
    grad: 'g-shiva',
    deity: 'Shiva · शिव',
    fastType: 'Day-long; evening puja',
    breakFast: 'After Pradosh kaal',
    timingLabel: 'Pradosh kaal',
    count: 24,
    desc: 'The Trayodashi tithi at twilight, when Shiva and Parvati are worshipped in the sacred evening window. Som and Bhaum Pradosh are especially revered.',
  },
  purnima: {
    name: 'Purnima',
    deva: 'पूर्णिमा',
    sym: 'पू',
    grad: 'g-purnima',
    deity: 'Vishnu / Chandra',
    fastType: 'Satyanarayan Vrat',
    breakFast: 'After moonrise arghya',
    timingLabel: 'Moonrise',
    count: 12,
    desc: 'The full moon tithi. Each month has its own Purnima observance, with Ganga snan, Satyanarayan Katha, and chandra arghya at moonrise.',
  },
  amavasya: {
    name: 'Amavasya',
    deva: 'अमावस्या',
    sym: 'अ',
    grad: 'g-amavasya',
    deity: 'Pitru · पितृ',
    fastType: 'Tarpan & pind-daan',
    breakFast: 'After Brahma Muhurat',
    timingLabel: 'Tarpan window',
    count: 12,
    desc: 'The new moon tithi, sacred for tarpan, remembrance, and ancestral offerings. In Kashi, Pishachmochan and Manikarnika are central to the observance.',
  },
}

const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const parseDate = (date: string) => new Date(`${date}T00:00:00`)
const formatLong = (date: string) => {
  const d = parseDate(date)
  return `${monthLong[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
const formatShort = (date: string) => {
  const d = parseDate(date)
  return `${d.getDate()} ${monthShort[d.getMonth()]}`
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

const normalizeDate = (date?: string) => date?.split('T')[0] ?? ''

const getString = (value: unknown) => (typeof value === 'string' ? value : '')

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

const normalizePaksha = (paksha: unknown, defaultPaksha: 'Krishna' | 'Shukla') => {
  return paksha === 'Krishna' || paksha === 'Shukla' ? paksha : defaultPaksha
}

const getFirstLetter = (text: string) => text.trim().charAt(0) || 'व'

const normalizeVratItems = (
  payload: unknown,
  type: Exclude<VratType, 'all' | 'vratkatha'>,
) => {
  const records = getRecords(payload)
  if (!records.length) return []

  const items = records
    .map((item): VratItem | null => {
      const title = getString(item.Title) || getString(item.Name)
      const slug = getString(item.Slug) || getString(item.slug)
      const date =
        type === 'purnima'
          ? normalizeDate(getString(item.PurnimaDate))
          : type === 'amavasya'
            ? normalizeDate(getString(item.AmavasyaDate))
            : normalizeDate(getString(item.Date))

      if (!title || !date) return null

      const timing =
        type === 'ekadashi'
          ? formatTimeRange(item.ParanaTime) || formatTimeRange(item.EkadashiTime)
          : type === 'purnima'
            ? formatTime(item.MoonriseTime) || formatTimeRange(item.PurnimaTimings)
            : type === 'amavasya'
              ? formatTimeRange(item.AmavasyaTimings)
              : formatTimeRange(item.Muhurat) || formatTimeRange(item.DayPradoshaTime)

      const paksha =
        type === 'ekadashi'
          ? normalizePaksha(item.EkadashiPaksha, 'Krishna')
          : type === 'purnima'
            ? 'Shukla'
            : type === 'amavasya'
              ? 'Krishna'
              : normalizePaksha(item.PradoshPaksha || item.Paksha, 'Krishna')

      return {
        date,
        name: title,
        deity: item?.Deity?.Deity || '',
        description: item?.ShortDescription || '',
        deva: getString(item.HindiTitle) || getString(item.SanskritTitle) || title,
        paksha,
        timing: timing || 'See details',
        special: getString(item.Special) || getString(item.ShortDescription),
        href: slug ? `/${type}/${slug}` : undefined,
        featuredImageUrl: getImageUrl(item.FeaturedImage),
      }
    })
    .filter(Boolean) as VratItem[]

  return items
}

const normalizeKathaItems = (payload: unknown) => {
  const records = getRecords(payload)
  if (!records.length) return []

  const items = records
    .map((item): KathaItem | null => {
      const title = getString(item.Title) || getString(item.Name)
      const slug = getString(item.Slug) || getString(item.slug)
      if (!title) return null

      return {
        name: title,
        deva: getString(item.HindiTitle) || getString(item.SanskritTitle) || title,
        group: getString(item.Category) || getString(item.VratType) || 'Vrat Katha',
        type: getString(item.Type) || getString(item.Type?.Type) || getString(item.Type?.Title) || 'Other',
        description: item?.ShortDescription || '',
        sym: getFirstLetter(title),
        grad: 'g-vishnu',
        duration: getString(item.Duration) || getString(item.ReadingTime) || 'Read',
        href: slug ? `/vrat-katha/${slug}` : undefined,
      }
    })
    .filter(Boolean) as KathaItem[]

  return items
}

const getToday = (serverNow?: number) => {
  const now = serverNow ? new Date(serverNow) : new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const scrollToMonth = (key: string) => {
  const element = document.getElementById(`timeline-month-${key}`)
  if (!element) return

  const offset = 132
  const top = element.getBoundingClientRect().top + window.scrollY - offset

  window.scrollTo({
    top,
    behavior: 'smooth',
  })
}

const daysLabel = (date: string, today: Date) => {
  const days = Math.round((parseDate(date).getTime() - today.getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return days > 0 ? `in ${days}d` : 'completed'
}

const VratCard = ({ item, meta, today }: { item: VratItem; meta: VratMeta; today: Date }) => {
  const isToday = (date: string) => parseDate(date).getTime() === today.getTime()
  const isPast = (date: string) => parseDate(date).getTime() < today.getTime()
  const d = parseDate(item.date)
  const stateClass = isToday(item.date) ? ' today' : isPast(item.date) ? ' past' : ''

  return (
    <Link className={`vc${stateClass}`} href={item.href || '#'}>
      <div className="vc-dt">
        <div className="vc-dd">{d.getDate()}</div>
        <div className="vc-dm">{monthShort[d.getMonth()]}</div>
        <div className="vc-dw">{dayShort[d.getDay()]}</div>
      </div>
      <div className="vc-body">
        <div className="vc-name">{item.name}</div>
        <div className="vc-deva">{item.description}</div>
        <div className="vc-chips">
          <span className={`chip ${item.paksha === 'Krishna' ? 'chip-kr' : 'chip-sh'}`}>{item.paksha}</span>
          {/* {item.special && <span className="chip chip-sp">{item.special}</span>} */}
        </div>
        <div className="vc-row">
          <div className="vc-tlbl">{meta.timingLabel}</div>
          <div className="vc-tval">{item.timing}</div>
        </div>
      </div>
      <div className="vc-arr">→</div>
    </Link>
  )
}

const VratFestivalsPage = ({
  year = new Date().getFullYear(),
  serverNow,
  ekadashisData,
  purnimasData,
  amavasyasData,
  pradoshesData,
  vratKathasData,
}: VratFestivalsPageProps) => {
  const [activeTab, setActiveTab] = useState<VratType>('all')
  const [search, setSearch] = useState('')
  const today = useMemo(() => getToday(serverNow), [serverNow])
  const isToday = (date: string) => parseDate(date).getTime() === today.getTime()
  const isPast = (date: string) => parseDate(date).getTime() < today.getTime()

  const vratItems = useMemo(
    () => ({
      ekadashi: normalizeVratItems(ekadashisData, 'ekadashi'),
      pradosh: normalizeVratItems(pradoshesData, 'pradosh'),
      purnima: normalizeVratItems(purnimasData, 'purnima'),
      amavasya: normalizeVratItems(amavasyasData, 'amavasya'),
    }),
    [amavasyasData, ekadashisData, pradoshesData, purnimasData],
  )
  const kathaItems = useMemo(() => normalizeKathaItems(vratKathasData), [vratKathasData])
  const upcomingItems = useMemo(
    () =>
      Object.entries(vratItems)
        .flatMap(([type, list]) => list.map((item) => ({ ...item, type: type as keyof typeof typeMeta })))
        .filter((item) => !isPast(item.date) || isToday(item.date))
        .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()),
    [today, vratItems],
  )
  const heroItems = upcomingItems.slice(0, 8)
  const totalVratCount = Object.values(vratItems).reduce((total, list) => total + list.length, 0)
  const heroStartDate = heroItems[0] ? parseDate(heroItems[0].date) : today
  const heroEndDate = heroItems[heroItems.length - 1] ? parseDate(heroItems[heroItems.length - 1].date) : heroStartDate
  const heroLabel =
    heroStartDate.getMonth() === heroEndDate.getMonth() && heroStartDate.getFullYear() === heroEndDate.getFullYear()
      ? `${monthLong[heroStartDate.getMonth()]} ${heroStartDate.getFullYear()}`
      : heroStartDate.getFullYear() === heroEndDate.getFullYear()
        ? `${monthLong[heroStartDate.getMonth()]}-${monthLong[heroEndDate.getMonth()]} ${heroStartDate.getFullYear()}`
        : `${monthLong[heroStartDate.getMonth()]} ${heroStartDate.getFullYear()}-${monthLong[heroEndDate.getMonth()]} ${heroEndDate.getFullYear()}`
  const tabs: { type: VratType; label: string; count: number }[] = [
    { type: 'all', label: 'All', count: totalVratCount + kathaItems.length },
    { type: 'ekadashi', label: 'Ekadashi', count: vratItems.ekadashi.length },
    { type: 'pradosh', label: 'Pradosh', count: vratItems.pradosh.length },
    { type: 'purnima', label: 'Purnima', count: vratItems.purnima.length },
    { type: 'amavasya', label: 'Amavasya', count: vratItems.amavasya.length },
    { type: 'vratkatha', label: 'Vrat Katha', count: kathaItems.length },
  ]

  const query = search.trim().toLowerCase()

  const filteredUpcoming = useMemo(
    () => upcomingItems.filter((item) => !query || `${item.name} ${item.deva} ${item.type}`.toLowerCase().includes(query)),
    [query, upcomingItems],
  )

  const featured = filteredUpcoming[0] ?? upcomingItems[0] ?? null
  const featuredMeta = featured ? typeMeta[featured.type] : null

  const groupedTimeline = useMemo(() => {
    return filteredUpcoming.reduce<Record<string, typeof filteredUpcoming>>((acc, item) => {
      const d = parseDate(item.date)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      acc[key] = acc[key] ?? []
      acc[key].push(item)
      return acc
    }, {})
  }, [filteredUpcoming])

  const selectedType = activeTab !== 'all' && activeTab !== 'vratkatha' ? activeTab : null
  const selectedMeta = selectedType ? typeMeta[selectedType] : null
  const selectedItems = selectedType
    ? vratItems[selectedType].filter((item) => !query || `${item.name} ${item.deva} ${item.paksha} ${item.special ?? ''}`.toLowerCase().includes(query))
    : []
  const nextSelected = selectedItems.find((item) => !isPast(item.date) || isToday(item.date))
  const selectedPast = selectedType ? vratItems[selectedType].filter((item) => isPast(item.date) && !isToday(item.date)).length : 0
  const selectedUpcoming = selectedType ? vratItems[selectedType].length - selectedPast : 0
  const selectedProgress = selectedType && vratItems[selectedType].length ? Math.round((selectedPast / vratItems[selectedType].length) * 100) : 0
  const filteredKathaItems = useMemo(
    () => kathaItems.filter((item) => !query || `${item.name} ${item.deva} ${item.group} ${item.type}`.toLowerCase().includes(query)),
    [kathaItems, query],
  )

  const groupedKathaItems = useMemo(() => {
    return filteredKathaItems.reduce<Record<string, KathaItem[]>>((acc, item) => {
      acc[item.type] = acc[item.type] ?? []
      acc[item.type].push(item)
      return acc
    }, {})
  }, [filteredKathaItems])

  const groupedSelected = selectedItems.reduce<Record<string, VratItem[]>>((acc, item) => {
    const d = parseDate(item.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    acc[key] = acc[key] ?? []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="vrat-page">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-bg">व्रत</div>
          <div>
            {/* <div className="hero-bc"><span>2026</span></div> */}
            <div className="hero-kicker">व्रत एवं उपवास · Fasting Observances</div>
            <h1 className="hero-h1">Vrat &<br/><em>Upavas</em></h1>
            <div className="hero-deva">व्रत एवं उपवास · {year}</div>
            <p className="hero-sub">
              Every tithi carries its own energy — the fortnightly Ekadashi, the twilight Pradosh, the full-moon Purnima.
              Eighty fasting observances that order the Hindu year, with Kashi at the centre.
            </p>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-n">{vratItems.ekadashi.length}</div><div className="hero-stat-l">Ekadashi / yr</div></div>
            <div className="hero-stat"><div className="hero-stat-n">{vratItems.pradosh.length}</div><div className="hero-stat-l">Pradosh / yr</div></div>
            <div className="hero-stat"><div className="hero-stat-n">{vratItems.purnima.length}</div><div className="hero-stat-l">Purnima / yr</div></div>
            <div className="hero-stat"><div className="hero-stat-n">{vratItems.amavasya.length}</div><div className="hero-stat-l">Amavasya / yr</div></div>
            <div className="hero-stat"><div className="hero-stat-n">{totalVratCount}</div><div className="hero-stat-l">Total vrats</div></div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-panel-lbl">Upcoming — {heroLabel}</div>
          <div className="vrat-list">
            {heroItems.length ? (
              heroItems.map((item) => (
                <Link
                  className={`vrow${isToday(item.date) ? ' on' : ''}`}
                  href={item.href || '#'}
                  key={`${item.type}-${item.date}-${item.name}`}
                >
                  <span className="vrow-date">{formatShort(item.date)}</span>
                  <div>
                    <div className="vrow-name">{item.name}</div>
                    <div className="vrow-deva">{item.deva}</div>
                  </div>
                  <div><div className="vrow-rel">{daysLabel(item.date, today)}</div></div>
                </Link>
              ))
            ) : (
              <div className="vrow-empty">No upcoming observances available.</div>
            )}
          </div>
        </div>
      </section>

      <div className="filter" id="filterBar">
        <div className="filter-in">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                className={`tab${activeTab === tab.type ? ' on' : ''}`}
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                type="button"
              >
                {tab.label} <span className="n">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="fsearch">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="text" placeholder="Search vrats..." autoComplete="off" />
          </div>
        </div>
      </div>

      <main>
        {activeTab === 'all' && (
          <>
            {featured && featuredMeta && (
              <section className="feat">
                <div className="feat-in">
                  <div>
                    <div className="feat-badge"><span className="feat-dot"></span>Featured upcoming</div>
                    <h2 className="feat-h">{featured.name.split(' ')[0]} <em>{featured.name.split(' ').slice(1).join(' ')}</em></h2>
                    <div className="feat-deva">{featured.description}</div>
                    <p className="feat-desc">{featuredMeta.desc}</p>
                    <div className="timing">
                      <div className="timing-h">Observance timing</div>
                      <div className="timing-row">
                        <div className="timing-cell"><div className="timing-lbl">Date</div><div className="timing-val">{formatLong(featured.date)}</div></div>
                        <div className="timing-cell"><div className="timing-lbl">{featuredMeta.timingLabel}</div><div className="timing-val">{featured.timing}</div></div>
                        <div className="timing-cell"><div className="timing-lbl">Fast type</div><div className="timing-val">{featuredMeta.name}</div></div>
                      </div>
                    </div>
                    <div className="feat-actions">
                      <Link className="btn btn-pr btn-sm" href={featured.href || '#'}>View vrat vidhi →</Link>
                      <button className="btn btn-gh btn-sm" onClick={() => setActiveTab(featured.type)} type="button">All {featuredMeta.name}s {year}</button>
                    </div>
                  </div>
                  <div
                    className={`feat-art ${featuredMeta.grad}`}
                    style={featured.featuredImageUrl ? {
                      backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.5)), url("${featured.featuredImageUrl}")`,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    } : undefined}
                  >
                    <div className="feat-art-top"><span className="feat-art-btag">{featuredMeta.deity}</span></div>
                    <div className="feat-art-deva">{featured.featuredImageUrl ? '' : featuredMeta.sym}</div>
                    <div className="feat-art-bot"><span className="feat-art-label">{featuredMeta.name}</span><span className="feat-art-month">{formatShort(featured.date)}</span></div>
                  </div>
                </div>
              </section>
            )}

            <div className="tl-wrap">
              <div className="tl-top">
                <div>
                  <div className="sec-eye">All types combined · {year}</div>
                  <h2 className="tl-h">Upcoming <em>observances</em></h2>
                </div>
                <div className="tl-total">{filteredUpcoming.length} remaining this year</div>
              </div>
              <div className="tl-jumps">
                {Object.keys(groupedTimeline).map((key) => {
                  const first = groupedTimeline[key][0]
                  const d = parseDate(first.date)
                  return (
                    <button
                      className={`tl-jump${d.getMonth() === today.getMonth() ? ' cur' : ''}`}
                      onClick={() => scrollToMonth(key)}
                      type="button"
                      key={key}
                    >
                      {monthShort[d.getMonth()]}
                    </button>
                  )
                })}
              </div>
              {Object.entries(groupedTimeline).length ? (
                Object.entries(groupedTimeline).map(([key, items]) => {
                  const d = parseDate(items[0].date)
                  return (
                    <div className="tl-month-sec" id={`timeline-month-${key}`} key={key}>
                      <div className="tl-mhdr">
                        <div className={`tl-mname${d.getMonth() === today.getMonth() ? ' cur' : ''}`}>{monthLong[d.getMonth()]} {d.getFullYear()}</div>
                        <div className="tl-mcnt">{items.length} observances</div>
                      </div>
                      {items.map((item) => {
                        const meta = typeMeta[item.type]
                        const rowDate = parseDate(item.date)
                        return (
                          <Link className={`tlr${isToday(item.date) ? ' tod' : ''}`} href={item.href || '#'} key={`${item.type}-${item.date}-${item.name}`}>
                            <div className="tlr-date"><span className="tlr-d">{formatShort(item.date)}</span><span className="tlr-dw">{dayShort[rowDate.getDay()]}</span></div>
                            <span className={`tlr-badge ${item.type === 'ekadashi' ? 'b-vishnu' : item.type === 'purnima' ? 'b-purnima' : 'b-shiva'}`}>{meta.name}</span>
                            <div className="tlr-nb"><div className="tlr-name">{item.name}</div><div className="tlr-deva">{item.deity}</div></div>
                            <span className="tlr-sp">{meta.deity.split(' ')[0].toUpperCase()}</span>
                            <div className="tlr-info"><div className="tlr-tlbl">{meta.timingLabel}</div><div className="tlr-tval">{item.timing}</div></div>
                            <div className="tlr-arr">→</div>
                          </Link>
                        )
                      })}
                    </div>
                  )
                })
              ) : (
                <div className="tl-empty">No observances found for {year}.</div>
              )}
            </div>
          </>
        )}

        {selectedType && selectedMeta && (
          <div className="type-view">
            <div className="type-hdr">
              <div className="type-hdr-in">
                <div>
                  <div className="th-row">
                    <div className={`th-sym ${selectedMeta.grad}`}>{selectedMeta.sym}</div>
                    <div>
                      <div className="th-name">{selectedMeta.name} <em>· {selectedMeta.deva}</em></div>
                      <div className="th-deva">{selectedMeta.deity}</div>
                    </div>
                  </div>
                  <p className="th-desc">{selectedMeta.desc}</p>
                  <div className="th-pills">
                    <div><div className="th-pill-l">Fast type</div><div className="th-pill-v">{selectedMeta.fastType}</div></div>
                    <div><div className="th-pill-l">Break fast</div><div className="th-pill-v">{selectedMeta.breakFast}</div></div>
                    <div><div className="th-pill-l">Timing</div><div className="th-pill-v">{selectedMeta.timingLabel}</div></div>
                  </div>
                </div>
                <div className="th-next">
                  <div className="th-next-lbl"><span className="th-next-dot"></span>Next upcoming</div>
                  {nextSelected ? (
                    <>
                      <div className="th-next-name">{nextSelected.name}</div>
                      <div className="th-next-deva">{nextSelected.description}</div>
                      <div className="th-next-row"><div className="th-next-date">{formatLong(nextSelected.date)}</div><div className="th-next-cd">{daysLabel(nextSelected.date, today)}</div></div>
                      <hr className="th-next-hr" />
                      <div className="th-next-tlbl">{selectedMeta.timingLabel}</div>
                      <div className="th-next-tval">{nextSelected.timing}</div>
                      <Link className="btn btn-pr btn-sm" href={nextSelected.href || '#'}>View vidhi →</Link>
                    </>
                  ) : (
                    <div className="th-next-empty">No matching upcoming vrat</div>
                  )}
                </div>
              </div>
            </div>
            <div className="vc-section">
              <div className="vc-top">
                <div className="vc-title">All <em>{selectedMeta.name}s</em> · {year}</div>
                <div className="vc-meta">{selectedPast} completed · {selectedUpcoming} upcoming</div>
              </div>
              <div className="vc-prog"><div className="vc-prog-fill" style={{ width: `${selectedProgress}%` }}></div></div>
              {Object.entries(groupedSelected).length ? (
                <div className={`vc-grid ${selectedMeta.count >= 24 ? 'vc-grid-two' : 'vc-grid-three'}`}>
                  {Object.entries(groupedSelected).map(([key, items]) => {
                    const d = parseDate(items[0].date)
                    const isCurrent = d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
                    const done = items.every((item) => isPast(item.date) && !isToday(item.date))
                    return (
                      <div className="vc-month-group" key={key}>
                        <div className={`vg-sep${isCurrent ? ' cur' : ''}`}>
                          <span>{monthLong[d.getMonth()]} {d.getFullYear()}</span>
                          {isCurrent && <span className="vg-sep-cur">Current</span>}
                          {done && !isCurrent && <span className="vg-sep-done">Completed</span>}
                        </div>
                        <div className="vc-month-cards">
                          {items.map((item) => <VratCard item={item} meta={selectedMeta} today={today} key={`${item.date}-${item.name}`} />)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="tl-empty">No {selectedMeta.name} observances found for {year}.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vratkatha' && (
          <div className="type-view">
            <div className="type-hdr">
              <div className="type-hdr-in type-hdr-single">
                <div>
                  <div className="th-row">
                    <div className="th-sym g-shiva">कथा</div>
                    <div>
                      <div className="th-name">Vrat Katha <em>· व्रत कथा</em></div>
                      <div className="th-deva">Sacred Stories of Fasting Observances</div>
                    </div>
                  </div>
                  <p className="th-desc">The katha is the sacred narrative at the heart of every vrat, recited after puja to remember the origin, blessing, and deity of the observance.</p>
                </div>
              </div>
            </div>
            <div className="vc-section">
              {Object.entries(groupedKathaItems).length ? (
                <div className="kv-groups">
                  {Object.entries(groupedKathaItems).map(([type, items]) => (
                    <div className="kv-group" key={type}>
                      <div className="kv-group-h">
                        <span>{type}</span>
                        <span>{items.length} kathas</span>
                      </div>
                      <div className="kv-grid">
                        {items.map((item) => (
                          <Link className="kvc" href={item.href || '#'} key={`${item.type}-${item.name}`}>
                            <div className="kvc-left"><div className={`kvc-sym ${item.grad}`}>{item.sym}</div></div>
                            <div className="kvc-body">
                              <div className="kvc-name">{item.name}</div>
                              <div className="kvc-deva">{item.description}</div>
                              {/* <div className="kvc-meta"><span className="kvc-pill">{item.deity}</span><span className="kvc-pill">{item.duration}</span></div> */}
                              <div className="kvc-occ">{item.group}</div>
                            </div>
                            <div className="kvc-arr">→</div>
                          </Link>
                        ))}
                      </div>
                    </div>
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

export default VratFestivalsPage
