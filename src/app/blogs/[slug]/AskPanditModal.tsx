'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { BASE_URL } from '@/constants'
import './AskPanditModal.css'

interface Props {
  initialQuestion?: string
  onClose: () => void
}

interface FormState {
  question: string
  name: string
  phone: string
}

interface Errors {
  question?: string
  name?: string
  phone?: string
}

const CHIPS = [
  'How serious is my situation?',
  'What should I do first?',
  'Which puja is right for me?',
]

function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return 'Phone number is required'
  const digits = phone.replace(/\s/g, '')
  if (!/^[6-9]\d{9}$/.test(digits)) return 'Enter a valid 10-digit Indian mobile number'
}

export default function AskPanditModal({ initialQuestion = '', onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 'done'>(1)
  const [form, setForm] = useState<FormState>({ question: initialQuestion, name: '', phone: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [refId, setRefId] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Trap focus and close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  function setField(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validateStep1(): boolean {
    const next: Errors = {}
    if (!form.question.trim()) next.question = 'Please describe your question'
    if (!form.name.trim()) next.name = 'Name is required'
    const phoneErr = validatePhone(form.phone)
    if (phoneErr) next.phone = phoneErr
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleContinue() {
    if (validateStep1()) setStep(2)
  }

  async function handleSend() {
    setSubmitting(true)
    try {
      const res = await fetch(`${BASE_URL}/pandit-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            Name: form.name.trim(),
            Number: form.phone.trim(),
            Question: form.question.trim(),
            SubmittedAt: new Date().toISOString(),
          },
        }),
      })
      const json = await res.json()
      const documentId: string = json?.data?.documentId ?? ''
      setRefId(documentId.slice(0, 8).toUpperCase())
      setStep('done')
    } catch {
      setStep('done')
    } finally {
      setSubmitting(false)
    }
  }

  const progressWidth = step === 1 ? '50%' : step === 2 ? '100%' : '100%'

  const modal = (
    <div className="ask-pandit-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Ask a Pandit">
      <div className="ask-pandit-modal">

        {step !== 'done' && (
          <>
            <div className="ask-pandit__topbar">
              {step === 2 && (
                <button className="ask-pandit__back" onClick={() => setStep(1)} aria-label="Go back">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <span className="ask-pandit__title">
                {step === 1 ? 'Ask a Pandit' : 'Review Your Question'}
              </span>
              <button className="ask-pandit__close" onClick={onClose} aria-label="Close">✕</button>
            </div>

            <div className="ask-pandit__step-label">
              Step {step} of 2 · {step === 1 ? 'Your question' : 'Review'}
            </div>
            <div className="ask-pandit__progress-track">
              <div className="ask-pandit__progress-bar" style={{ width: progressWidth }} />
            </div>
            <hr className="ask-pandit__progress-divider" />
          </>
        )}

        {step === 1 && (
          <div className="ask-pandit__body">
            <div className="ask-pandit__desc-card">
              <div className="ask-pandit__desc-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#C07840" aria-hidden="true">
                  <path d="M12 2a1 1 0 00-1 1v.6C7.2 4.6 4.5 7.9 4.5 12v3.5L3 17v1h18v-1l-1.5-1.5V12c0-4.1-2.7-7.4-6.5-8.4V3a1 1 0 00-1-1zm0 19.5a2.5 2.5 0 002.5-2.5h-5a2.5 2.5 0 002.5 2.5z" />
                </svg>
              </div>
              <p className="ask-pandit__desc-text">
                Describe your concern — a verified Kashi-trained Pandit replies within 2 hours on WhatsApp.
              </p>
            </div>

            <div className="ask-pandit__chips">
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  className={`ask-pandit__chip${form.question === chip ? ' ask-pandit__chip--active' : ''}`}
                  onClick={() => setField('question', chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className={`ask-pandit__field${errors.question ? ' ask-pandit__field--error' : ''}`}>
              <label className="ask-pandit__label" htmlFor="apq-question">Your Question</label>
              <textarea
                id="apq-question"
                className="ask-pandit__textarea"
                placeholder="e.g. I want to know which puja is right for my home..."
                value={form.question}
                onChange={e => setField('question', e.target.value)}
              />
              {errors.question && <div className="ask-pandit__error">{errors.question}</div>}
            </div>

            <div className="ask-pandit__input-row">
              <div className={`ask-pandit__field${errors.name ? ' ask-pandit__field--error' : ''}`}>
                <label className="ask-pandit__label" htmlFor="apq-name">Your Name</label>
                <input
                  id="apq-name"
                  className="ask-pandit__input"
                  type="text"
                  placeholder="e.g. Sunita Rao"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                />
                {errors.name && <div className="ask-pandit__error">{errors.name}</div>}
              </div>

              <div className={`ask-pandit__field${errors.phone ? ' ask-pandit__field--error' : ''}`}>
                <label className="ask-pandit__label" htmlFor="apq-phone">WhatsApp Number</label>
                <div className={`ask-pandit__phone-wrap${errors.phone ? '' : ''}`}>
                  <span className="ask-pandit__phone-prefix">+91</span>
                  <input
                    id="apq-phone"
                    className="ask-pandit__phone-input"
                    type="tel"
                    placeholder="xxxxx xxxxx"
                    value={form.phone}
                    maxLength={10}
                    onChange={e => setField('phone', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                {errors.phone && <div className="ask-pandit__error">{errors.phone}</div>}
              </div>
            </div>

            <button className="ask-pandit__cta" type="button" onClick={handleContinue}>
              Continue to Review →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="ask-pandit__body">
            <div className="ask-pandit__review-question">
              <div className="ask-pandit__review-label">Your Question</div>
              <div className="ask-pandit__review-text">&ldquo;{form.question}&rdquo;</div>
            </div>

            <div className="ask-pandit__review-contact">
              <div className="ask-pandit__review-contact-row">
                <span className="ask-pandit__review-contact-label">Name</span>
                <span className="ask-pandit__review-contact-value">{form.name}</span>
              </div>
              <div className="ask-pandit__review-contact-row">
                <span className="ask-pandit__review-contact-label">WhatsApp</span>
                <span className="ask-pandit__review-contact-value">+91 {form.phone}</span>
              </div>
            </div>

            <button className="ask-pandit__edit-link" type="button" onClick={() => setStep(1)}>
              ✎ Edit question
            </button>

            <div className="ask-pandit__verified">
              <span>✓</span>
              <span>Verified Kashi-trained Pandits · &lt;2hr response</span>
            </div>

            <button className="ask-pandit__cta" type="button" onClick={handleSend} disabled={submitting}>
              {submitting ? 'Sending…' : 'Send now'}
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="ask-pandit__confirmation">
            <div className="ask-pandit__check-circle" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L19 7" stroke="#FFF8ED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="ask-pandit__confirm-title">Question Sent!</div>
            <p className="ask-pandit__confirm-subtitle">
              A verified Pandit will respond on WhatsApp within 2 hours.
            </p>
            {refId && <div className="ask-pandit__confirm-ref">Reference #{refId}</div>}
            <blockquote className="ask-pandit__confirm-quote">
              &ldquo;{form.question}&rdquo;
            </blockquote>
            <button className="ask-pandit__done-btn" type="button" onClick={onClose}>Done</button>
          </div>
        )}

      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
