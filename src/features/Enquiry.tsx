'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BASE_URL } from '@/constants'
import './Enquiry.css'

const WA_LINK = 'https://wa.me/918448140932'

const FALLBACK_OCCASIONS = [
  'Satyanarayan Katha',
  'Griha Pravesh',
  'Ganesh Puja',
  'Rudrabhishek',
  'Mundan Sanskar',
  'Something else',
]

const TIME_OPTIONS = [
  'Early morning (6-9 AM)',
  'Morning (9 AM-12 PM)',
  'Afternoon (12-4 PM)',
  'Evening (4-8 PM)',
  'As per shubh muhurat',
]

interface FormData {
  occasion: string
  date: string
  time: string
  area: string
  samagri: string
  name: string
  phone: string
  note: string
}

const INITIAL: FormData = {
  occasion: '',
  date: '',
  time: 'Morning (9 AM-12 PM)',
  area: '',
  samagri: 'Yes, include samagri',
  name: '',
  phone: '',
  note: '',
}

function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'WhatsApp number is required'
  if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter a valid 10-digit Indian mobile number'
  return null
}

function formatDate(iso: string) {
  if (!iso) return '-'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function DiyaIcon({ size = 34 }: { size?: number }) {
  const h = Math.round(size * 40 / 34)
  return (
    <svg width={size} height={h} viewBox="0 0 34 40" aria-hidden="true">
      <path d="M4 24Q17 34 30 24l-3 7q-10 7-20 0Z" fill="#C07840" />
      <ellipse cx="17" cy="24" rx="13" ry="2.8" fill="#E8A860" />
      <path d="M17 6q7 11 2.5 18-1.5 3.5-2.5 3.5t-2.5-3.5Q10 17 17 6" fill="#F5A623" />
      <path d="M17 13q3.5 6 1 10-.8 1.8-1 1.8t-1-1.8q-2.5-4 1-10" fill="#FFF0C2" />
    </svg>
  )
}

function WhatsAppIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.7 15l-1.2 4.3 4.4-1.2A10 10 0 1 0 12 2zm5.6 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.5-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4-.1.5l-.3.4c-.1.1-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l1.9.9c.2.1.4.2.4.3.1.2.1.7 0 1z" fill="currentColor" />
    </svg>
  )
}

const STEPS = [
  { num: 1, label: 'Pooja details' },
  { num: 2, label: 'Your details' },
  { num: 3, label: 'Sent' },
]

function Progress({ current }: { current: number }) {
  return (
    <ol className="enq-progress" aria-label="Enquiry progress">
      {STEPS.map((s, i) => {
        const state = current > s.num ? 'done' : current === s.num ? 'active' : 'todo'
        return (
          <li key={s.num} className="enq-progress__step" data-state={state}>
            <span className="enq-progress__dot">{state === 'done' ? '✓' : s.num}</span>
            <span className="enq-progress__label">{s.label}</span>
            {i < STEPS.length - 1 && <span className="enq-progress__line" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

function Step1({
  data, occasions, occasionsLoading, error, onChange, onNext,
}: {
  data: FormData
  occasions: string[]
  occasionsLoading: boolean
  error: boolean
  onChange: (k: keyof FormData, v: string) => void
  onNext: () => void
}) {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div className="enq-form-grid">
      <section className="enq-panel">
        <div className="enq-rule-accent" role="presentation" />
        <div className="enq-panel__body">
          <h2 className="enq-h3">What pooja do you need?</h2>
          <p className="enq-sub enq-panel__sub">Tell us the occasion and when you would like it. No payment at this stage.</p>

          <div className="enq-field">
            <span className="enq-field__label" id="occasion-label">Occasion</span>
            {occasionsLoading ? (
              <div className="enq-field__options">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton enq-chip-skeleton" />
                ))}
              </div>
            ) : (
              <div className="enq-field__options" role="group" aria-labelledby="occasion-label">
                {occasions.map(o => (
                  <button
                    key={o}
                    className="enq-chip"
                    type="button"
                    aria-pressed={data.occasion === o}
                    onClick={() => onChange('occasion', o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="enq-field enq-field__row">
            <div>
              <label className="enq-field__label" htmlFor="enq-date">Preferred date *</label>
              <input
                className="enq-control"
                id="enq-date"
                name="date"
                type="date"
                min={today}
                value={data.date}
                onChange={e => onChange('date', e.target.value)}
              />
            </div>
            <div>
              <label className="enq-field__label" htmlFor="enq-time">Preferred time</label>
              <select
                className="enq-control enq-select"
                id="enq-time"
                name="time"
                value={data.time}
                onChange={e => onChange('time', e.target.value)}
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="enq-field">
            <label className="enq-field__label" htmlFor="enq-area">Area in Noida *</label>
            <input
              className="enq-control"
              id="enq-area"
              name="area"
              type="text"
              placeholder="e.g. Sector 50, Noida"
              value={data.area}
              onChange={e => onChange('area', e.target.value)}
            />
          </div>

          <div className="enq-field">
            <span className="enq-field__label" id="samagri-label">Do you need samagri?</span>
            <div className="enq-field__options" role="group" aria-labelledby="samagri-label">
              {['Yes, include samagri', 'No, we have it'].map(opt => (
                <button
                  key={opt}
                  className="enq-chip enq-chip--sage"
                  type="button"
                  aria-pressed={data.samagri === opt}
                  onClick={() => onChange('samagri', opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="enq-alert" role="alert">
              Please choose a date and tell us your area in Noida.
            </p>
          )}

          <button className="enq-btn enq-btn--primary enq-btn--block" type="button" onClick={onNext}>
            Continue →
          </button>
        </div>
      </section>

      <aside className="enq-panel enq-panel--plain">
        <div className="enq-panel__body">
          <h2 className="enq-summary__label">What happens next</h2>
          <ol className="enq-next-steps">
            <li>
              <span className="enq-next-num">1</span>
              <span className="enq-sub">We check pandit availability for your date and area.</span>
            </li>
            <li>
              <span className="enq-next-num">2</span>
              <span className="enq-sub">You receive the pandit name, timing and full price on WhatsApp.</span>
            </li>
            <li>
              <span className="enq-next-num">3</span>
              <span className="enq-sub">Confirm only if it suits you. Nothing is charged before that.</span>
            </li>
          </ol>
          <div className="enq-hurry">
            <p className="enq-hurry__title">In a hurry?</p>
            <p className="enq-hurry__text">WhatsApp is faster - most enquiries are answered in under an hour.</p>
            <a
              className="enq-btn enq-btn--wa enq-btn--block enq-btn--sm"
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}

function Step2({
  data, error, phoneError, submitting, submitError, onChange, onBack, onSubmit,
}: {
  data: FormData
  error: boolean
  phoneError: string | null
  submitting: boolean
  submitError: boolean
  onChange: (k: keyof FormData, v: string) => void
  onBack: () => void
  onSubmit: () => void
}) {
  return (
    <div className="enq-form-grid">
      <section className="enq-panel">
        <div className="enq-rule-accent" role="presentation" />
        <div className="enq-panel__body">
          <h2 className="enq-h3">How do we reach you?</h2>
          <p className="enq-sub enq-panel__sub">We reply on WhatsApp. Your number is never shared or used for marketing.</p>

          <div className="enq-field enq-field__row">
            <div>
              <label className="enq-field__label" htmlFor="enq-name">Your name *</label>
              <input
                className="enq-control"
                id="enq-name"
                name="name"
                type="text"
                placeholder="e.g. Anjali Mehra"
                autoComplete="name"
                value={data.name}
                onChange={e => onChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="enq-field__label" htmlFor="enq-phone">WhatsApp number *</label>
              <input
                className={`enq-control${phoneError ? ' enq-control--error' : ''}`}
                id="enq-phone"
                name="phone"
                type="tel"
                placeholder="98xxxxxxxx"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                value={data.phone}
                onChange={e => onChange('phone', e.target.value.replace(/\D/g, ''))}
              />
              {phoneError && <p className="enq-field-error" role="alert">{phoneError}</p>}
            </div>
          </div>

          <div className="enq-field">
            <label className="enq-field__label" htmlFor="enq-note">Anything else we should know?</label>
            <textarea
              className="enq-control enq-control--area"
              id="enq-note"
              name="note"
              placeholder="Number of people attending, gotra, language preference, parking, or anything specific to your home..."
              value={data.note}
              rows={4}
              onChange={e => onChange('note', e.target.value)}
            />
          </div>

          {error && (
            <p className="enq-alert" role="alert">
              Please add your name so we can reply.
            </p>
          )}

          {submitError && (
            <p className="enq-alert" role="alert">
              Something went wrong sending your enquiry. Please try again or chat on WhatsApp.
            </p>
          )}

          <div className="enq-step2-actions">
            <button className="enq-btn enq-btn--ghost" type="button" onClick={onBack} disabled={submitting}>
              ← Back
            </button>
            <button
              className="enq-btn enq-btn--primary enq-btn--grow"
              type="button"
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send my enquiry'}
            </button>
          </div>
        </div>
      </section>

      <aside className="enq-panel enq-panel--plain">
        <div className="enq-panel__body">
          <h2 className="enq-summary__label">Your enquiry</h2>
          <dl className="enq-summary-dl">
            <div className="enq-summary__row">
              <dt className="enq-summary__key">Occasion</dt>
              <dd className="enq-summary__value">{data.occasion || '-'}</dd>
            </div>
            <div className="enq-summary__row">
              <dt className="enq-summary__key">Date</dt>
              <dd className="enq-summary__value">{formatDate(data.date)}</dd>
            </div>
            <div className="enq-summary__row">
              <dt className="enq-summary__key">Time</dt>
              <dd className="enq-summary__value">{data.time || '-'}</dd>
            </div>
            <div className="enq-summary__row">
              <dt className="enq-summary__key">Area</dt>
              <dd className="enq-summary__value">{data.area || '-'}</dd>
            </div>
            <div className="enq-summary__row">
              <dt className="enq-summary__key">Samagri</dt>
              <dd className="enq-summary__value">{data.samagri}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  )
}

function Receipt({ data, refId }: { data: FormData; refId: string }) {
  return (
    <section className="enq-receipt is-popped" role="status">
      <header className="enq-receipt__head">
        <div className="enq-receipt__diya">
          <DiyaIcon size={34} />
        </div>
        <h2 className="enq-receipt__title">Your enquiry has reached us</h2>
        <p className="enq-receipt__ref">Reference <span>{refId}</span></p>
      </header>
      <div className="enq-receipt__body">
        <p className="enq-receipt__lede">
          We are checking pandit availability for{' '}
          <strong>{data.occasion}</strong> on{' '}
          <strong>{formatDate(data.date)}</strong> in{' '}
          <strong>{data.area}</strong>.
          You will hear from us on <strong>{data.phone}</strong> — usually within an hour, always the same day.
        </p>
        <div className="enq-receipt__list">
          <h3 className="enq-receipt__list-label">What you will receive</h3>
          <ul>
            <li>
              <span className="enq-receipt__tick" aria-hidden="true">✓</span>
              The name and experience of the pandit assigned to you
            </li>
            <li>
              <span className="enq-receipt__tick" aria-hidden="true">✓</span>
              Confirmed timing, and the muhurat if you asked for one
            </li>
            <li>
              <span className="enq-receipt__tick" aria-hidden="true">✓</span>
              The full price with samagri, itemised — nothing added later
            </li>
          </ul>
        </div>
        <div className="enq-receipt__actions">
          <a className="enq-btn enq-btn--wa enq-btn--sm" href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Continue on WhatsApp
          </a>
          <Link className="enq-btn enq-btn--outline enq-btn--sm" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Enquiry() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(INITIAL)
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [refId, setRefId] = useState('')
  const [occasions, setOccasions] = useState<string[]>([])
  const [occasionsLoading, setOccasionsLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE_URL}/occasions`)
      .then(r => r.json())
      .then(json => {
        const list: string[] = (json?.data ?? [])
          .map((o: Record<string, unknown>) => o.Title)
          .filter(Boolean)
        const resolved = list.length ? list : FALLBACK_OCCASIONS
        setOccasions(resolved)
        setData(d => ({ ...d, occasion: d.occasion || resolved[0] }))
      })
      .catch(() => {
        setOccasions(FALLBACK_OCCASIONS)
        setData(d => ({ ...d, occasion: d.occasion || FALLBACK_OCCASIONS[0] }))
      })
      .finally(() => setOccasionsLoading(false))
  }, [])

  function onChange(key: keyof FormData, value: string) {
    setData(d => ({ ...d, [key]: value }))
    if (error) setError(false)
    if (submitError) setSubmitError(false)
    if (key === 'phone' && phoneError) setPhoneError(null)
  }

  function handleNext() {
    if (!data.date || !data.area.trim()) { setError(true); return }
    setError(false)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setError(false)
    setSubmitError(false)
    setPhoneError(null)
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    const pErr = validatePhone(data.phone)
    const nameInvalid = !data.name.trim()
    if (nameInvalid || pErr) {
      if (nameInvalid) setError(true)
      if (pErr) setPhoneError(pErr)
      return
    }
    setError(false)
    setPhoneError(null)
    setSubmitError(false)
    setSubmitting(true)
    try {
      const res = await fetch(`${BASE_URL}/pooja-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            PreferredDate: data.date,
            YourName: data.name,
            WhatsappNumber: data.phone,
            Occasion: data.occasion,
            PreferredTime: data.time,
            IncludeSamagri: data.samagri === 'Yes, include samagri',
            Area: data.area,
            Comments: data.note,
          },
        }),
      })
      if (!res.ok) throw new Error('Request failed')
      const json = await res.json()
      const docId: string = json?.data?.documentId ?? ''
      setRefId('KS-E' + docId.slice(0, 8).toUpperCase())
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="enq-page">
      <section className="enq-section" aria-labelledby="enquiry-heading">
        <div className="container enq-container">
          <Link className="enq-back-link" href="/">← Back</Link>
          <h1 className="visually-hidden" id="enquiry-heading">Send an enquiry</h1>
          {step < 3 && <Progress current={step} />}
          {step === 1 && (
            <Step1
              data={data}
              occasions={occasions}
              occasionsLoading={occasionsLoading}
              error={error}
              onChange={onChange}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2
              data={data}
              error={error}
              phoneError={phoneError}
              submitting={submitting}
              submitError={submitError}
              onChange={onChange}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
          {step === 3 && <Receipt data={data} refId={refId} />}
        </div>
      </section>
    </div>
  )
}
