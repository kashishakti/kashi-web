'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import html2canvas from 'html2canvas'
import { BASE_URL } from '@/constants'
import './MantraCardModal.css'

interface Deity {
  id: number
  documentId: string
  Title: string
  Slug: string
}

interface Intention {
  id: number
  documentId: string
  Title: string
  Slug: string
  deities: Deity[]
}

interface MantraData {
  id: number
  documentId: string
  Title: string
  Slug: string
  Mantra: string
  ChantCount: string
  BestTime: string
  intention?: { Title: string; Slug: string }
  deity?: { Title: string; Slug: string }
}

interface FormState {
  intentionSlug: string
  deitySlug: string
  name: string
  dob: string
  time: string
  phone: string
}

interface Errors {
  intentionSlug?: string
  deitySlug?: string
  name?: string
  dob?: string
  phone?: string
}

interface Props {
  onClose: () => void
  blogSlug: string
}

function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) return 'WhatsApp number is required'
  const digits = phone.replace(/\s/g, '')
  if (!/^[6-9]\d{9}$/.test(digits)) return 'Enter a valid 10-digit Indian mobile number'
}

export default function MantraCardModal({ onClose, blogSlug }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [intentions, setIntentions] = useState<Intention[]>([])
  const [intentionsLoading, setIntentionsLoading] = useState(true)
  const [form, setForm] = useState<FormState>({
    intentionSlug: '',
    deitySlug: '',
    name: '',
    dob: '',
    time: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [mantra, setMantra] = useState<MantraData | null>(null)
  const [mantraLoading, setMantraLoading] = useState(false)
  const [mantraError, setMantraError] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Fetch intentions on mount
  useEffect(() => {
    fetch(`${BASE_URL}/intentions?populate=*`)
      .then(r => r.json())
      .then(json => {
        setIntentions(json.data ?? [])
      })
      .catch(() => {})
      .finally(() => setIntentionsLoading(false))
  }, [])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  const selectedIntention = intentions.find(i => i.Slug === form.intentionSlug) ?? null
  const availableDeities = selectedIntention?.deities ?? []

  function setField<K extends keyof FormState>(field: K, value: string) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Reset deity if intention changes
      if (field === 'intentionSlug') next.deitySlug = ''
      return next
    })
    if (errors[field as keyof Errors]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validateStep1(): boolean {
    const next: Errors = {}
    if (!form.intentionSlug) next.intentionSlug = 'Please select your intention'
    if (availableDeities.length > 0 && !form.deitySlug) next.deitySlug = 'Please choose a deity'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateStep2(): boolean {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Full name is required'
    if (!form.dob) next.dob = 'Date of birth is required'
    const phoneErr = validatePhone(form.phone)
    if (phoneErr) next.phone = phoneErr
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleContinueFromStep1() {
    if (!validateStep1()) return
    setStep(2)
  }

  async function handleContinueToPreview() {
    if (!validateStep2()) return

    setMantraLoading(true)
    setMantraError(false)

    // Blocking: fetch mantra
    const intentionParam = form.intentionSlug
    const deityParam = form.deitySlug
    let resolvedMantra: MantraData | null = null
    try {
      let url = `${BASE_URL}/mantras?intention=${intentionParam}`
      if (deityParam) url += `&deity=${deityParam}`
      const res = await fetch(url)
      const json = await res.json()
      const results: MantraData[] = Array.isArray(json) ? json : (json.data ?? [])
      resolvedMantra = results[0] ?? null
    } catch {
      setMantraError(true)
      setMantraLoading(false)
      return
    }

    setMantra(resolvedMantra)
    setMantraLoading(false)
    setStep(3)

    // Non-blocking: create order
    const intentionObj = intentions.find(i => i.Slug === form.intentionSlug)
    const deityObj = availableDeities.find(d => d.Slug === form.deitySlug)
    fetch(`${BASE_URL}/mantra-card-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          FullName: form.name.trim(),
          Gotra: '--',
          DOB: form.dob,
          Intention: intentionObj?.Title ?? form.intentionSlug,
          MobileNumber: form.phone.trim(),
          MantraCardPrice: '0',
          SubmittedAt: new Date().toISOString(),
          Email: '--',
          SourcePage: `https://www.kashishakti.com/blogs/${blogSlug}`,
          isPaymentComplete: null,
          Deity: deityObj?.Title ?? form.deitySlug,
        },
      }),
    })
      .catch(err => console.error('[MantraCard] order error:', err))
  }

  async function handleDownload() {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = 'mantra-card.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('[MantraCard] download error:', err)
    } finally {
      setDownloading(false)
    }
  }

  const intentionTitle = intentions.find(i => i.Slug === form.intentionSlug)?.Title ?? ''
  const deityTitle = availableDeities.find(d => d.Slug === form.deitySlug)?.Title ?? ''

  // Step label info
  const stepLabels: Record<1 | 2 | 3, string> = {
    1: 'Intention & Deity',
    2: 'Your Details',
    3: 'Ready to share',
  }
  const progressWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%'

  const modal = (
    <div
      className="mc-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Mantra Card"
    >
      <div className="mc-modal">

        {/* Topbar */}
        <div className="mc-topbar">
          {step === 2 && (
            <button
              className="mc-back"
              onClick={() => setStep(1)}
              aria-label="Go back"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <span className="mc-title">
            {step === 3 ? 'Your Mantra Card' : 'Mantra Card'}
          </span>
          <button className="mc-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Progress */}
        <div className="mc-step-label">Step {step} of 3 · {stepLabels[step]}</div>
        <div className="mc-progress-track">
          <div className="mc-progress-bar" style={{ width: progressWidth }} />
        </div>
        <hr className="mc-progress-divider" />

        {/* ── Step 1: Intention & Deity ── */}
        {step === 1 && (
          <div className="mc-body">
            <div className="mc-desc-card">
              <div className="mc-desc-icon">&#x950;</div>
              <p className="mc-desc-text">
                What is this mantra for? We&apos;ll tailor the verse and deity to your intention.
              </p>
            </div>

            <div className={`mc-field${errors.intentionSlug ? ' mc-field--error' : ''}`}>
              <div className="mc-field-label">Your Intention</div>
              {intentionsLoading ? (
                <div className="mc-loading">Loading intentions…</div>
              ) : (
                <div className="mc-grid-2">
                  {intentions.map(intent => (
                    <button
                      key={intent.Slug}
                      type="button"
                      className={`mc-option-card${form.intentionSlug === intent.Slug ? ' mc-option-card--active' : ''}`}
                      onClick={() => setField('intentionSlug', intent.Slug)}
                    >
                      <span className="mc-option-title">{intent.Title}</span>
                    </button>
                  ))}
                </div>
              )}
              {errors.intentionSlug && <div className="mc-error">{errors.intentionSlug}</div>}
            </div>

            {availableDeities.length > 0 && (
              <div className={`mc-field${errors.deitySlug ? ' mc-field--error' : ''}`}>
                <div className="mc-field-label">Choose Your Deity</div>
                <div className="mc-chips">
                  {availableDeities.map(deity => (
                    <button
                      key={deity.Slug}
                      type="button"
                      className={`mc-chip${form.deitySlug === deity.Slug ? ' mc-chip--active' : ''}`}
                      onClick={() => setField('deitySlug', deity.Slug)}
                    >
                      {deity.Title}
                    </button>
                  ))}
                </div>
                {errors.deitySlug && <div className="mc-error">{errors.deitySlug}</div>}
              </div>
            )}

            <button className="mc-cta" type="button" onClick={handleContinueFromStep1}>
              Continue →
            </button>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <div className="mc-body">
            <div className="mc-desc-card">
              <div className="mc-desc-icon">&#x950;</div>
              <p className="mc-desc-text">
                Personalise your Mantra Card — takes under a minute.
              </p>
            </div>

            <div className={`mc-field${errors.name ? ' mc-field--error' : ''}`}>
              <label className="mc-field-label" htmlFor="mc-name">Full Name</label>
              <input
                id="mc-name"
                className="mc-input"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
              />
              {errors.name && <div className="mc-error">{errors.name}</div>}
            </div>

            <div className="mc-input-row">
              <div className={`mc-field${errors.dob ? ' mc-field--error' : ''}`}>
                <label className="mc-field-label" htmlFor="mc-dob">Date of Birth</label>
                <input
                  id="mc-dob"
                  className="mc-input"
                  type="date"
                  value={form.dob}
                  onChange={e => setField('dob', e.target.value)}
                />
                {errors.dob && <div className="mc-error">{errors.dob}</div>}
              </div>

              <div className="mc-field">
                <label className="mc-field-label" htmlFor="mc-time">
                  Time <span className="mc-optional">(optional)</span>
                </label>
                <input
                  id="mc-time"
                  className="mc-input"
                  type="time"
                  value={form.time}
                  onChange={e => setField('time', e.target.value)}
                />
              </div>
            </div>

            <div className={`mc-field${errors.phone ? ' mc-field--error' : ''}`}>
              <label className="mc-field-label" htmlFor="mc-phone">WhatsApp Number</label>
              <div className={`mc-phone-wrap${errors.phone ? ' mc-phone-wrap--error' : ''}`}>
                <span className="mc-phone-prefix">+91</span>
                <input
                  id="mc-phone"
                  className="mc-phone-input"
                  type="tel"
                  placeholder="xxxxx xxxxx"
                  value={form.phone}
                  maxLength={10}
                  onChange={e => setField('phone', e.target.value.replace(/\D/g, ''))}
                />
              </div>
              {errors.phone && <div className="mc-error">{errors.phone}</div>}
            </div>

            <button
              className="mc-cta"
              type="button"
              onClick={handleContinueToPreview}
              disabled={mantraLoading}
            >
              {mantraLoading ? 'Loading…' : 'Continue to Preview →'}
            </button>

            <p className="mc-privacy-note">🔒 Used only to personalise your mantra card</p>

            {mantraError && (
              <div className="mc-error mc-error--center">
                Something went wrong. Please try again.
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Mantra Card Preview ── */}
        {step === 3 && (
          <div className="mc-body">
            {/* The card visual — captured by html2canvas */}
            <div className="mc-card-preview" ref={cardRef}>
              <div className="mc-card-header">
                <div className="mc-card-om">&#x950;</div>
                <div className="mc-card-header-title">Your Personalised Mantra</div>
                <div className="mc-card-tags">
                  {intentionTitle && <span className="mc-card-tag">{intentionTitle}</span>}
                  {deityTitle && <span className="mc-card-tag">{deityTitle}</span>}
                </div>
                <div className="mc-card-prepared">Prepared for {form.name || 'You'}</div>
              </div>

              <div className="mc-card-body">
                <div className="mc-card-section-label">MANTRA DETAILS</div>

                {mantra ? (
                  <>
                    <div className="mc-card-mantra-text">{mantra.Mantra}</div>
                    {mantra.ChantCount && (
                      <>
                        <div className="mc-card-divider" />
                        <div className="mc-card-detail-label">CHANT COUNT</div>
                        <div className="mc-card-detail-value">{mantra.ChantCount}</div>
                      </>
                    )}
                    {mantra.BestTime && (
                      <>
                        <div className="mc-card-divider" />
                        <div className="mc-card-detail-label">BEST TIME TO CHANT</div>
                        <div className="mc-card-detail-value">{mantra.BestTime}</div>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mc-card-mantra-text mc-card-mantra-text--fallback">
                      ॐ सर्वे भवन्तु सुखिनः
                    </div>
                    <div className="mc-card-divider" />
                    <div className="mc-card-detail-label">CHANT COUNT</div>
                    <div className="mc-card-detail-value">108 times, once daily</div>
                    <div className="mc-card-divider" />
                    <div className="mc-card-detail-label">BEST TIME TO CHANT</div>
                    <div className="mc-card-detail-value">Morning, after sunrise</div>
                  </>
                )}
              </div>
            </div>

            <button
              className="mc-edit-link"
              type="button"
              onClick={() => setStep(2)}
            >
              ✎ Edit details
            </button>

            <button
              className="mc-cta"
              type="button"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Preparing…' : 'Download Card'}
            </button>

            <p className="mc-free-note">Free · No payment required</p>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
