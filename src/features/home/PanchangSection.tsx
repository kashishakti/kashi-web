import Link from "next/link"

export default function PanchangSection() {
  return (
    <section className="ks-panchang-section" aria-label="Vrat and festival calendar">
      <div className="container">
        <div className="ks-panchang-wrap">
          <div className="ks-panchang">
            <div className="ks-panchang__header">
              <div className="ks-panchang__icon-wrap">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="9" width="28" height="25" rx="3" fill="none" stroke="#9A5A28" strokeWidth="1.9" />
                  <path d="M6 16h28" stroke="#9A5A28" strokeWidth="1.9" />
                  <path d="M13 5v7M27 5v7" stroke="#C07840" strokeWidth="2.2" strokeLinecap="round" />
                  <rect x="12" y="21" width="6" height="5" rx="1" fill="#C07840" />
                  <rect x="22" y="21" width="6" height="5" rx="1" fill="#4E7A62" opacity="0.6" />
                </svg>
              </div>
              <div>
                <p className="ks-panchang__title">Looking for the Right Day, Ritual or Vrat?</p>
                <p className="ks-panchang__subtitle">Explore important dates and plan your poojas.</p>
              </div>
            </div>

            <div className="ks-panchang__grid">
              <Link href="/vrat?tab=ekadashi" className="ks-panchang__item" scroll={false}>
                <div className="ks-panchang__item-icon">
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <path d="M31 8C16 8 9 16 9 25c0 4 2 7 2 7s10 1 15-5 5-19 5-19z" fill="#4E7A62" />
                    <path d="M11 33C15 24 22 16 30 10" fill="none" stroke="#2E5A44" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="ks-panchang__item-label">Ekadashi</p>
              </Link>

              <Link href="/vrat?tab=purnima" className="ks-panchang__item" scroll={false}>
                <div className="ks-panchang__item-icon">
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="13" fill="#9A6B1E" />
                  </svg>
                </div>
                <p className="ks-panchang__item-label">Purnima</p>
              </Link>

              <Link href="/vrat?tab=amavasya" className="ks-panchang__item" scroll={false}>
                <div className="ks-panchang__item-icon">
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="13" fill="#5E4A7A" />
                    <circle cx="20" cy="20" r="13" fill="none" stroke="#C8B8D8" strokeWidth="1.4" />
                  </svg>
                </div>
                <p className="ks-panchang__item-label">Amavasya</p>
              </Link>

              <Link href="/vrat?tab=pradosh" className="ks-panchang__item" scroll={false}>
                <div className="ks-panchang__item-icon">
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <path d="M20 34V10" stroke="#C07840" strokeWidth="2.6" strokeLinecap="round" />
                    <path d="M11 16V6l4 5 5-8 5 8 4-5v10" fill="none" stroke="#C07840" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 24h12" stroke="#C07840" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="ks-panchang__item-label">Pradosh</p>
              </Link>

              <Link href="/festivals" className="ks-panchang__item">
                <div className="ks-panchang__item-icon">
                  <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                    <ellipse cx="20" cy="24" rx="5" ry="12" fill="#C07840" />
                    <ellipse cx="9" cy="27" rx="4.5" ry="10" transform="rotate(-38 9 27)" fill="#E8A860" />
                    <ellipse cx="31" cy="27" rx="4.5" ry="10" transform="rotate(38 31 27)" fill="#E8A860" />
                    <circle cx="20" cy="10" r="2.6" fill="#9A6B1E" />
                  </svg>
                </div>
                <p className="ks-panchang__item-label">Festivals</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
