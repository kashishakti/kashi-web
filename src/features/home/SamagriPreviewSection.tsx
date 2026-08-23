import Link from "next/link"
import { BASE_URL, REVALIDATE } from "@/constants"
import { UploadIcon, GiftIcon } from "./icons"

interface PoojaKit {
  documentId: string
  Title: string
  Price: string
  Items: string
}

async function getKits(): Promise<PoojaKit[]> {
  try {
    const res = await fetch(`${BASE_URL}/pooja-kits`, {
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json?.data ?? []
  } catch {
    return []
  }
}

export default async function SamagriPreviewSection() {
  const kits = await getKits()
  return (
    <section className="ks-samagri-preview" id="samagri" aria-labelledby="samagri-preview-heading">
      <div className="container">
        <div className="ks-samagri-preview__card">
          <div className="ks-rule-gradient" />
          <div className="ks-samagri-preview__body">
            <div className="ks-samagri-preview__head">
              <div>
                <p className="ks-eyebrow ks-eyebrow--sage">Samagri delivered · Noida</p>
                <h2 className="ks-samagri-preview__title" id="samagri-preview-heading">
                  Already have a pandit? Get the samagri.
                </h2>
                <p className="ks-samagri-preview__lede">
                  Send us the list your pandit gave you, or pick a ready kit for a known pooja. We assemble it,
                  quality-check every item, and deliver to your door in 24–48 hours.
                </p>
              </div>
              <div className="ks-samagri-preview__badge">
                <span className="ks-samagri-preview__badge-dot" />
                <span>24–48 HR DELIVERY</span>
              </div>
            </div>

            <div className="ks-samagri-preview__grid">
              <div className="ks-samagri-preview__option">
                <div className="ks-samagri-preview__option-head">
                  <div className="ks-samagri-preview__option-icon">
                    <UploadIcon />
                  </div>
                  <div>
                    <p className="ks-samagri-preview__option-eyebrow">Option 1</p>
                    <p className="ks-samagri-preview__option-title">Upload your pandit&apos;s list</p>
                  </div>
                </div>
                <p className="ks-samagri-preview__option-desc">
                  A photo of the handwritten list, a PDF, or just type it out. We read it, source every item, and tell
                  you the price before you pay.
                </p>
                <ul className="ks-samagri-preview__bullets">
                  <li><span className="ks-samagri-preview__check">✔</span>Photo, PDF or typed — whatever you have</li>
                  <li><span className="ks-samagri-preview__check">✔</span>Itemised quote on WhatsApp within 2 hours</li>
                  <li><span className="ks-samagri-preview__check">✔</span>Anything unavailable is flagged, never substituted quietly</li>
                </ul>
                <Link className="ks-samagri-preview__cta ks-samagri-preview__cta--primary" href="/samagri?mode=upload">
                  Upload my list →
                </Link>
              </div>

              <div className="ks-samagri-preview__option ks-samagri-preview__option--sage">
                <div className="ks-samagri-preview__option-head">
                  <div className="ks-samagri-preview__option-icon ks-samagri-preview__option-icon--sage">
                    <GiftIcon />
                  </div>
                  <div>
                    <p className="ks-samagri-preview__option-eyebrow ks-samagri-preview__option-eyebrow--sage">Option 2</p>
                    <p className="ks-samagri-preview__option-title">Pick a ready pooja kit</p>
                  </div>
                </div>
                <p className="ks-samagri-preview__option-desc">
                  Complete kits assembled to the traditional vidhi for the poojas families book most. Fixed price,
                  nothing missing.
                </p>
                {kits.length > 0 && (
                  <ul className="ks-samagri-preview__kits">
                    {kits.map(kit => (
                      <li key={kit.documentId} className="ks-samagri-preview__kit-row">
                        <div className="ks-samagri-preview__kit-info">
                          <p className="ks-samagri-preview__kit-name">{kit.Title}</p>
                          <p className="ks-samagri-preview__kit-items">{kit.Items} items</p>
                        </div>
                        <p className="ks-samagri-preview__kit-price">
                          ₹{Number(kit.Price).toLocaleString('en-IN')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <Link className="ks-samagri-preview__cta ks-samagri-preview__cta--sage" href="/samagri?mode=kit">
                  See all kits →
                </Link>
              </div>
            </div>

            <div className="ks-samagri-preview__promo">
              <div className="ks-samagri-preview__promo-left">
                <span className="ks-samagri-preview__promo-icon">🪔</span>
                <div>
                  <p className="ks-samagri-preview__promo-title">Don&apos;t have a pandit yet?</p>
                  <p className="ks-samagri-preview__promo-text">
                    Book pandit + samagri together from Kashi Shakti — one price, one confirmation.
                  </p>
                </div>
              </div>
              <Link className="ks-samagri-preview__promo-cta" href="/enquiry">
                Book pandit + samagri →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
