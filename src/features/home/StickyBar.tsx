import Link from "next/link"
import { WhatsAppIcon } from "./icons"
import { WA_LINK } from "./constants"

export default function StickyBar() {
  return (
    <div className="ks-sticky-bar" role="complementary" aria-label="Quick actions">
      <a
        className="ks-sticky-bar__btn ks-sticky-bar__btn--wa"
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        <WhatsAppIcon size={17} />
        <span>WhatsApp</span>
      </a>
      <Link className="ks-sticky-bar__btn ks-sticky-bar__btn--enquiry" href="/enquiry">
        Send Enquiry
      </Link>
    </div>
  )
}
