import Link from "next/link";
import { WhatsAppIcon, MailIcon, VerifiedIcon, GiftIcon } from "./icons";
import PhoneMockup from "./PhoneMockup";
import { WA_LINK, POOJAS } from "./constants";

export default function HeroSection() {
  return (
    <section className="ks-hero" aria-labelledby="hero-heading">
      <div className="container">
        <div className="ks-hero__card">
          {/* Left: copy */}
          <div className="ks-hero__copy">
            <ul className="ks-hero__badges">
              <li className="ks-pill">
                <span className="ks-pill__dot" aria-hidden="true" />
                Serving Noida
              </li>
              <li className="ks-pill ks-pill--sage">✓ Pandit in 60 mins</li>
            </ul>

            <h1 className="ks-hero__title" id="hero-heading">
              Book a Pandit for Your Pooja at Home
            </h1>

            <p className="ks-hero__lede">
              Experienced &amp; verified pandits for home pooja services in
              Noida. Samagri, muhurat and the pandit — arranged in one message.
            </p>

            <div className="ks-hero__actions">
              <a
                className="ks-btn ks-btn--wa"
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon size={18} />
                Book on WhatsApp
              </a>
              <Link className="ks-btn ks-btn--outline" href="/enquiry">
                <MailIcon />
                Send an Enquiry
              </Link>
            </div>

            <div className="ks-hero__poojas">
              <p className="ks-eyebrow ks-eyebrow--muted">
                Poojas we perform at home
              </p>
              <ul className="ks-pooja-grid">
                {POOJAS.map(({ label, img }) => (
                  <li key={label} className="ks-pooja-tile">
                    <figure className="ks-pooja-tile__img" aria-hidden="true">
                      <img src={img} alt="" />
                    </figure>
                    <span className="ks-pooja-tile__label">{label}</span>
                  </li>
                ))}
              </ul>
              <p className="ks-tiles-more">
                and many more, including Mundan Sanskar, Ganesh Puja and Shradh.
              </p>
            </div>

            <ul className="ks-hero__trust">
              <li>
                <span className="ks-tick" aria-hidden="true">
                  ✓
                </span>
                Samagri Included
              </li>
              <li>
                <span className="ks-tick" aria-hidden="true">
                  ✓
                </span>
                Clear &amp; Fair Pricing
              </li>
            </ul>
          </div>

          {/* Right: phone mockup — hidden on mobile via CSS */}
          <aside
            className="ks-hero__aside"
            aria-label="Sample WhatsApp booking conversation"
          >
            <PhoneMockup />
          </aside>

          {/* Action cards — full-width strip spanning both columns */}
          <div className="ks-hero__action-strip">
            <Link
              className="ks-hero__action-card ks-hero__action-card--pandit"
              href="/enquiry"
            >
              <span className="ks-hero__action-icon">
                <VerifiedIcon />
              </span>
              <div className="ks-hero__action-content">
                <p className="ks-hero__action-eyebrow">I need a pandit</p>
                <p className="ks-hero__action-title">Book a pandit at home</p>
                <p className="ks-hero__action-desc">
                  Verified pandit with all samagri included · from ₹1,600
                </p>
              </div>
              <span className="ks-hero__action-arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <Link
              className="ks-hero__action-card ks-hero__action-card--samagri"
              href="/samagri"
            >
              <span className="ks-hero__action-icon ks-hero__action-icon--sage">
                <GiftIcon />
              </span>
              <div className="ks-hero__action-content">
                <p className="ks-hero__action-eyebrow">I have a pandit</p>
                <p className="ks-hero__action-title">Get samagri delivered</p>
                <p className="ks-hero__action-desc">
                  Upload your list or pick a kit · delivered in 24–48 hrs
                </p>
              </div>
              <span className="ks-hero__action-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
