import Link from "next/link"
import { WhatsAppIcon, ChatIcon, ClipboardIcon, HomeIconSvg } from "./icons"
import { WA_LINK } from "./constants"

export default function HowSection() {
  return (
    <section className="ks-how-section" aria-labelledby="how-heading">
      <div className="container">
        <div className="ks-section-head">
          <p className="ks-eyebrow">How booking works</p>
          <h2 className="ks-section-head__h2" id="how-heading">Booking a Pandit is Simple</h2>
        </div>

        <div className="ks-steps">
          <div className="ks-step">
            <div className="ks-step__icon-wrap">
              <div className="ks-step__icon"><ChatIcon /></div>
              <span className="ks-step__num">01</span>
            </div>
            <div>
              <h3 className="ks-step__title">Tell Us What You Need</h3>
              <p className="ks-step__text">
                Share the pooja you want, preferred date, time and location in Noida.
              </p>
            </div>
          </div>

          <div className="ks-step">
            <div className="ks-step__icon-wrap">
              <div className="ks-step__icon"><ClipboardIcon /></div>
              <span className="ks-step__num">02</span>
            </div>
            <div>
              <h3 className="ks-step__title">We Confirm</h3>
              <p className="ks-step__text">
                We confirm pandit availability, pooja requirements and pricing.
              </p>
            </div>
          </div>

          <div className="ks-step">
            <div className="ks-step__icon-wrap">
              <div className="ks-step__icon"><HomeIconSvg /></div>
              <span className="ks-step__num">03</span>
            </div>
            <div>
              <h3 className="ks-step__title">Pandit Arrives</h3>
              <p className="ks-step__text">
                Your pandit arrives at your home with all the required samagri.
              </p>
            </div>
          </div>
        </div>

        <div className="ks-how__actions">
          <a className="ks-btn ks-btn--wa-outline ks-btn--sm" href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon size={16} />
            Chat on WhatsApp
          </a>
          <Link className="ks-btn ks-btn--outline ks-btn--sm" href="/enquiry">
            Send an Enquiry →
          </Link>
        </div>
      </div>
    </section>
  )
}
