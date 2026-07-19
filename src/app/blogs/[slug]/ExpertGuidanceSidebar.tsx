'use client'

import { useState } from 'react'
import AskPanditModal from './AskPanditModal'

const CHIPS = [
  'How serious is my situation?',
  'What should I do first?',
  'Which puja is right for me?',
]

export default function ExpertGuidanceSidebar() {
  const [modalQuestion, setModalQuestion] = useState<string | null>(null)

  function openModal(question = '') {
    setModalQuestion(question)
  }

  function closeModal() {
    setModalQuestion(null)
  }

  return (
    <>
      <aside className="blog-detail__right">
        <div className="expert-guidance">
          <div className="expert-guidance__accent" />
          <div className="expert-guidance__body">
            <div className="expert-guidance__eyebrow">Expert Guidance</div>

            <div className="expert-guidance__card-header">
              <div className="expert-guidance__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#C07840" aria-hidden="true">
                  <path d="M12 2a1 1 0 00-1 1v.6C7.2 4.6 4.5 7.9 4.5 12v3.5L3 17v1h18v-1l-1.5-1.5V12c0-4.1-2.7-7.4-6.5-8.4V3a1 1 0 00-1-1zm0 19.5a2.5 2.5 0 002.5-2.5h-5a2.5 2.5 0 002.5 2.5z" />
                </svg>
              </div>
              <div>
                <div className="expert-guidance__title-label">Ask a Pandit</div>
                <div className="expert-guidance__title">Still have questions after reading this?</div>
              </div>
            </div>

            <div className="expert-guidance__rating-row">
              <span className="expert-guidance__stars">★★★★★</span>
              <span className="expert-guidance__rating-score">4.9</span>
              <span className="expert-guidance__rating-count">(2,100+ answers)</span>
            </div>

            <div className="expert-guidance__stats">
              <div className="expert-guidance__stat">
                <div className="expert-guidance__stat-label">Response</div>
                <div className="expert-guidance__stat-value">&lt; 2 hrs</div>
              </div>
              <div className="expert-guidance__stat">
                <div className="expert-guidance__stat-label">Price</div>
                <div className="expert-guidance__stat-value">Free!</div>
              </div>
            </div>

            <div className="expert-guidance__verified">
              <span className="expert-guidance__verified-icon">✓</span>
              <span className="expert-guidance__verified-text">Verified Kashi-trained Pandits</span>
            </div>

            <div className="expert-guidance__testimonial">
              <p className="expert-guidance__testimonial-text">
                &ldquo;The Pandit&rsquo;s answer gave me real clarity on what to do next.&rdquo;
              </p>
              <span className="expert-guidance__testimonial-attr">— Sunita R., Pune</span>
            </div>

            <div className="expert-guidance__chips">
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  className="expert-guidance__chip"
                  type="button"
                  onClick={() => openModal(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="expert-guidance__input" role="button" tabIndex={0} onClick={() => openModal()} onKeyDown={e => e.key === 'Enter' && openModal()}>
              Describe your concern…
            </div>

            <button className="expert-guidance__cta" type="button" onClick={() => openModal()}>
              <span>Ask a Pandit — Free →</span>
            </button>
            <div className="expert-guidance__cta-footer">WhatsApp · No call · 2 hr SLA</div>
          </div>
        </div>
      </aside>

      {modalQuestion !== null && (
        <AskPanditModal initialQuestion={modalQuestion} onClose={closeModal} />
      )}
    </>
  )
}
