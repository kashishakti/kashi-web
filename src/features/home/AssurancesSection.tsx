import { SamagriIcon, VerifiedIcon, QuickIcon, RupeeIcon } from "./icons"

export default function AssurancesSection() {
  return (
    <section className="ks-assurances-section" aria-label="Our assurances">
      <div className="container">
        <ul className="ks-assurances">
          <li className="ks-assurance">
            <div className="ks-assurance__head">
              <span className="ks-assurance__icon"><SamagriIcon /></span>
              <h3 className="ks-assurance__title">Pooja Samagri Included</h3>
            </div>
            <p className="ks-assurance__text">
              All samagri required for the pooja is brought by the pandit.
            </p>
          </li>

          <li className="ks-assurance">
            <div className="ks-assurance__head">
              <span className="ks-assurance__icon"><VerifiedIcon /></span>
              <h3 className="ks-assurance__title">Experienced &amp; Verified Pandits</h3>
            </div>
            <p className="ks-assurance__text">Skilled, experienced and trusted by families.</p>
          </li>

          <li className="ks-assurance">
            <div className="ks-assurance__head">
              <span className="ks-assurance__icon"><QuickIcon /></span>
              <h3 className="ks-assurance__title">Quick &amp; Easy Booking</h3>
            </div>
            <p className="ks-assurance__text">
              Book conveniently on WhatsApp or send us your requirements.
            </p>
          </li>

          <li className="ks-assurance">
            <div className="ks-assurance__head">
              <span className="ks-assurance__icon"><RupeeIcon /></span>
              <h3 className="ks-assurance__title">Clear &amp; Fair Pricing</h3>
            </div>
            <p className="ks-assurance__text">Know the price before you book. No hidden charges.</p>
          </li>
        </ul>
      </div>
    </section>
  )
}
