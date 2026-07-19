'use client'

import { useState } from 'react'
import MantraCardModal from './MantraCardModal'


interface Props {
  blogSlug: string
}

export default function MantraCardWidget({ blogSlug }: Props) {
  const [modalOpen, setModalOpen] = useState(false)


  return (
    <>
      <div className="mantra-card-widget">
        <div className="mantra-card-widget__header">
          <div className="mantra-card-widget__header-left">
            <svg width="16" height="20" viewBox="0 0 28 34" aria-hidden="true">
              <ellipse cx="14" cy="29" rx="9" ry="3.5" fill="#E8C06A" />
              <path d="M7 25 Q14 20 21 25 L19.5 29 Q14 32 8.5 29Z" fill="#C4A030" />
              <path d="M14 23C12 18 10 11 12.5 5.5C13.2 3.8 14 3 14 3C14 3 14.8 3.8 15.5 5.5C18 11 16 18 14 23Z" fill="#C07840" />
              <path d="M14 22C12.5 17 11.5 12 13.5 7.5C14 6 14 5.5 14 5.5C14 5.5 14 6 14.5 7.5C16.5 12 15.5 17 14 22Z" fill="#E8C06A" />
            </svg>
            <span className="mantra-card-widget__label">Mantra Card</span>
          </div>
          <span className="mantra-card-widget__sub">Free · Personalised · WhatsApp-ready</span>
        </div>

        <div className="mantra-card-widget__body">
          <div className="mantra-card-widget__om" aria-hidden="true">&#x950;</div>
          <div className="mantra-card-widget__content">
            <div className="mantra-card-widget__title">Get Your Personalised Mantra Card</div>
            <div className="mantra-card-widget__desc">
              Personalised to you · Printed with your name · Shareable on WhatsApp instantly
            </div>
            <div className="mantra-card-widget__cta-row">
              <button
                className="mantra-card-widget__btn"
                type="button"
                onClick={() => setModalOpen(true)}
              >
                <span>Create My Card — Free →</span>
              </button>
              <div className="mantra-card-widget__rating">
                <span className="mantra-card-widget__stars">★★★★★</span>
                <span className="mantra-card-widget__rating-text">4.8 · 8,200+ cards</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <MantraCardModal
          onClose={() => setModalOpen(false)}
          blogSlug={blogSlug}
        />
      )}
    </>
  )
}
