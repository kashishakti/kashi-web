import { DiyaIcon } from "./icons"

export default function PhoneMockup() {
  return (
    <div className="ks-phone">
      <span className="ks-phone__btn ks-phone__btn--mute" aria-hidden="true" />
      <span className="ks-phone__btn ks-phone__btn--vol-up" aria-hidden="true" />
      <span className="ks-phone__btn ks-phone__btn--vol-dn" aria-hidden="true" />
      <span className="ks-phone__btn ks-phone__btn--power" aria-hidden="true" />

      <div className="ks-phone__screen">
        <span className="ks-phone__notch" aria-hidden="true" />

        <div className="ks-chat__header">
          <span className="ks-chat__avatar" aria-hidden="true">
            <DiyaIcon size={15} />
          </span>
          <span className="ks-chat__peer">
            <span className="ks-chat__name">Anjali Mehra</span>
            <span className="ks-chat__status">online</span>
          </span>
        </div>

        <ol className="ks-chat__log" aria-label="Sample booking conversation">
          <li className="ks-chat__row ks-chat__row--in">
            <div className="ks-bubble ks-bubble--in">
              <p className="ks-bubble__text">
                Namaste. I need a pandit for Satyanarayan Katha at home this Sunday, Sector 50.
              </p>
              <p className="ks-bubble__meta">
                <span className="ks-bubble__time">Fri 10:32</span>
              </p>
            </div>
          </li>

          <li className="ks-chat__row ks-chat__row--out">
            <div className="ks-bubble ks-bubble--out">
              <img className="ks-bubble__media" src="/images/wa-bubble-1.svg" alt="Kalash with offerings" />
              <p className="ks-bubble__text">
                Namaste 🙏 Pandit Ramesh Sharma — 18 years of practice — is confirmed for Sunday, 10:30 AM.
                All samagri included. Total ₹2,600, nothing extra on the day.
              </p>
              <p className="ks-bubble__meta">
                <span className="ks-bubble__time">Fri 10:34</span>
              </p>
            </div>
          </li>

          <li className="ks-chat__row ks-chat__row--out">
            <div className="ks-bubble ks-bubble--out">
              <p className="ks-bubble__text">
                For a same-day pooja we can have a pandit at your door within 60 minutes of a confirmed slot.
              </p>
              <p className="ks-bubble__meta">
                <span className="ks-bubble__time">Fri 10:35</span>
              </p>
            </div>
          </li>

          <li className="ks-chat__row ks-chat__row--in">
            <div className="ks-bubble ks-bubble--in">
              <img className="ks-bubble__media" src="/images/wa-bubble-2.svg" alt="Pandit performing pooja at home" />
              <p className="ks-bubble__text">
                Panditji arrived on time and did the katha beautifully. We did not have to arrange a single thing.
                Thank you 🙏
              </p>
              <p className="ks-bubble__meta">
                <span className="ks-bubble__time">Sun 1:14 PM</span>
              </p>
            </div>
          </li>
        </ol>

        <div className="ks-chat__composer" aria-hidden="true">
          <span className="ks-chat__input">Message</span>
          <span className="ks-chat__send">↑</span>
        </div>
      </div>
    </div>
  )
}
