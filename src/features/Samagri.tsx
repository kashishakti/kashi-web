'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { BASE_URL } from '@/constants'
import './Samagri.css'

const WA_LINK = 'https://wa.me/918448140932'

interface PoojaKit {
  documentId: string
  Title: string
  Price: string
  Items: string
}

interface FormData {
  samagriList: string
  neededBy: string
  deliveryArea: string
  name: string
  whatsappNumber: string
  address: string
}

const INITIAL: FormData = {
  samagriList: '',
  neededBy: '',
  deliveryArea: '',
  name: '',
  whatsappNumber: '',
  address: '',
}

function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'WhatsApp number is required'
  if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter a valid 10-digit Indian mobile number'
  return null
}

function formatDate(iso: string) {
  if (!iso) return '–'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const STEPS = [
  { num: 1, label: 'What you need' },
  { num: 2, label: 'Delivery details' },
  { num: 3, label: 'Quote on the way' },
]

function Progress({ current }: { current: number }) {
  return (
    <ol className="sam-progress" aria-label="Order progress">
      {STEPS.map((s, i) => {
        const state = current > s.num ? 'done' : current === s.num ? 'active' : 'todo'
        return (
          <li key={s.num} className="sam-progress__step" data-state={state}>
            <span className="sam-progress__dot">{state === 'done' ? '✓' : s.num}</span>
            <span className="sam-progress__label">{s.label}</span>
            {i < STEPS.length - 1 && <span className="sam-progress__line" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

function UploadZone({ file, onFile }: { file: File | null; onFile: (f: File | null) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className="sam-upload-zone"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      role="button"
      tabIndex={0}
      aria-label="Upload samagri list"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="sam-upload-input"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <div className="sam-upload-zone__icon">
        <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M11 6h13l6 6v22H11z" stroke="#9A5A28" strokeWidth="1.9" strokeLinejoin="round" />
          <path d="M24 6v6h6" stroke="#9A5A28" strokeWidth="1.9" strokeLinejoin="round" />
          <path d="M16 20h10M16 25h7" stroke="#C07840" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M20 34v-8m0 0l-3.4 3.4M20 26l3.4 3.4" stroke="#4E7A62" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {file ? (
        <>
          <p className="sam-upload-zone__title">{file.name}</p>
          <p className="sam-upload-zone__sub">Click to change</p>
        </>
      ) : (
        <>
          <p className="sam-upload-zone__title">Upload a photo or PDF</p>
          <p className="sam-upload-zone__sub">
            A clear photo of the handwritten list works perfectly.<br />
            JPG, PNG or PDF · up to 10 MB
          </p>
        </>
      )}
    </div>
  )
}

interface Step1Props {
  mode: 'upload' | 'kit'
  setMode: (m: 'upload' | 'kit') => void
  data: FormData
  file: File | null
  setFile: (f: File | null) => void
  kits: PoojaKit[]
  kitsLoading: boolean
  selectedKitId: string
  setSelectedKitId: (id: string) => void
  error: boolean
  errorMsg: string
  onChange: (k: keyof FormData, v: string) => void
  onNext: () => void
}

function Step1({
  mode, setMode, data, file, setFile, kits, kitsLoading,
  selectedKitId, setSelectedKitId, error, errorMsg, onChange, onNext,
}: Step1Props) {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div className="sam-form-grid">
      <section className="sam-panel">
        <div className="sam-rule-accent" role="presentation" />
        <div className="sam-panel__body">
          <h2 className="sam-h2">Samagri, assembled and delivered</h2>
          <p className="sam-sub sam-panel__sub">
            Choose how you&apos;d like to tell us what you need. Either way you see the itemised price before you pay.
          </p>

          <div className="sam-mode-tabs">
            <button
              className="sam-mode-tab"
              type="button"
              aria-pressed={mode === 'upload'}
              onClick={() => setMode('upload')}
            >
              Upload my pandit&apos;s list
            </button>
            <button
              className="sam-mode-tab"
              type="button"
              aria-pressed={mode === 'kit'}
              onClick={() => setMode('kit')}
            >
              Choose a ready kit
            </button>
          </div>

          {mode === 'upload' ? (
            <div className="sam-field">
              <UploadZone file={file} onFile={setFile} />
              <div className="sam-divider"><span>or type it out</span></div>
              <label className="visually-hidden" htmlFor="sam-list">Your samagri list</label>
              <textarea
                className="sam-control sam-control--area"
                id="sam-list"
                placeholder={`e.g.\nRoli, chawal, haldi\nKalash – 1\nMango leaves\nGhee – 500 g\nHavan samagri – 1 kg`}
                value={data.samagriList}
                rows={5}
                onChange={(e) => onChange('samagriList', e.target.value)}
              />
            </div>
          ) : (
            <div className="sam-field">
              {kitsLoading ? (
                <div className="sam-kits-loading">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton sam-kit-skeleton" />
                  ))}
                </div>
              ) : (
                <ul className="sam-kits" aria-label="Choose a kit">
                  {kits.map(kit => (
                    <li key={kit.documentId}>
                      <button
                        className="sam-kit-option"
                        type="button"
                        aria-pressed={selectedKitId === kit.documentId}
                        onClick={() => setSelectedKitId(kit.documentId)}
                      >
                        <span
                          className="sam-kit-option__radio"
                          aria-hidden="true"
                          data-selected={String(selectedKitId === kit.documentId)}
                        />
                        <span className="sam-kit-option__info">
                          <span className="sam-kit-option__name">{kit.Title}</span>
                          <span className="sam-kit-option__items">{kit.Items} items</span>
                        </span>
                        <span className="sam-kit-option__price">
                          ₹{Number(kit.Price).toLocaleString('en-IN')}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="sam-field sam-field--row">
            <div>
              <label className="sam-field__label" htmlFor="sam-date">Needed by *</label>
              <input
                className="sam-control"
                id="sam-date"
                type="date"
                min={today}
                value={data.neededBy}
                onChange={(e) => onChange('neededBy', e.target.value)}
              />
            </div>
            <div>
              <label className="sam-field__label" htmlFor="sam-area">Delivery area *</label>
              <input
                className="sam-control"
                id="sam-area"
                type="text"
                placeholder="e.g. Sector 50, Noida"
                value={data.deliveryArea}
                onChange={(e) => onChange('deliveryArea', e.target.value)}
              />
            </div>
          </div>

          {error && <p className="sam-alert" role="alert">{errorMsg}</p>}

          <button className="sam-btn sam-btn--primary sam-btn--block" type="button" onClick={onNext}>
            Continue →
          </button>
        </div>
      </section>

      <aside className="sam-panel sam-panel--plain">
        <div className="sam-panel__body">
          <h2 className="sam-aside-label">How it works</h2>
          <ol className="sam-how-list">
            <li>
              <span className="sam-how-num">1</span>
              <span className="sam-sub">You send the list or pick a kit — no payment yet.</span>
            </li>
            <li>
              <span className="sam-how-num">2</span>
              <span className="sam-sub">We share an itemised quote on WhatsApp within 2 hours.</span>
            </li>
            <li>
              <span className="sam-how-num">3</span>
              <span className="sam-sub">Approve it and the kit reaches you in 24–48 hours.</span>
            </li>
          </ol>
          <div className="sam-promo">
            <p className="sam-promo__title">Need a pandit as well?</p>
            <p className="sam-promo__text">
              Book pandit + samagri together and we handle the muhurat, the samagri and the ritual as one booking.
            </p>
            <Link className="sam-btn sam-btn--dark sam-btn--block sam-btn--sm" href="/enquiry">
              Book pandit + samagri →
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

interface Step2Props {
  data: FormData
  mode: 'upload' | 'kit'
  file: File | null
  selectedKitId: string
  kits: PoojaKit[]
  error: boolean
  phoneError: string | null
  submitting: boolean
  submitError: boolean
  onChange: (k: keyof FormData, v: string) => void
  onBack: () => void
  onSubmit: () => void
}

function Step2({
  data, mode, file, selectedKitId, kits, error, phoneError,
  submitting, submitError, onChange, onBack, onSubmit,
}: Step2Props) {
  const selectedKit = kits.find(k => k.documentId === selectedKitId)
  const requestLabel = mode === 'upload'
    ? (file ? file.name : 'Custom list')
    : (selectedKit ? `${selectedKit.Title} kit` : 'Kit')

  return (
    <div className="sam-form-grid">
      <section className="sam-panel">
        <div className="sam-rule-accent" role="presentation" />
        <div className="sam-panel__body">
          <h2 className="sam-h2">Delivery details</h2>
          <p className="sam-sub sam-panel__sub">
            We reply on WhatsApp with an itemised quote before anything is charged.
          </p>

          <div className="sam-field sam-field--row">
            <div>
              <label className="sam-field__label" htmlFor="sam-name">Your name *</label>
              <input
                className="sam-control"
                id="sam-name"
                type="text"
                placeholder="e.g. Anjali Mehra"
                autoComplete="name"
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="sam-field__label" htmlFor="sam-phone">WhatsApp number *</label>
              <input
                className={`sam-control${phoneError ? ' sam-control--error' : ''}`}
                id="sam-phone"
                type="tel"
                placeholder="98xxxxxxxx"
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                value={data.whatsappNumber}
                onChange={(e) => onChange('whatsappNumber', e.target.value.replace(/\D/g, ''))}
              />
              {phoneError && <p className="sam-field-error" role="alert">{phoneError}</p>}
            </div>
          </div>

          <div className="sam-field">
            <label className="sam-field__label" htmlFor="sam-address">Full delivery address *</label>
            <textarea
              className="sam-control sam-control--area"
              id="sam-address"
              placeholder="House / flat number, society, sector, city"
              rows={3}
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
            />
          </div>

          {error && (
            <p className="sam-alert" role="alert">
              Please fill in your name, WhatsApp number and delivery address.
            </p>
          )}
          {submitError && (
            <p className="sam-alert" role="alert">
              Something went wrong. Please try again or{' '}
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer">chat on WhatsApp</a>.
            </p>
          )}

          <div className="sam-step2-actions">
            <button className="sam-btn sam-btn--ghost" type="button" onClick={onBack} disabled={submitting}>
              ← Back
            </button>
            <button
              className="sam-btn sam-btn--primary sam-btn--grow"
              type="button"
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Send my request'}
            </button>
          </div>
        </div>
      </section>

      <aside className="sam-panel sam-panel--plain">
        <div className="sam-panel__body">
          <h2 className="sam-aside-label">Your request</h2>
          <dl className="sam-summary-dl">
            <div className="sam-summary__row">
              <dt className="sam-summary__key">Request</dt>
              <dd className="sam-summary__value">{requestLabel}</dd>
            </div>
            <div className="sam-summary__row">
              <dt className="sam-summary__key">Needed by</dt>
              <dd className="sam-summary__value">{formatDate(data.neededBy)}</dd>
            </div>
            <div className="sam-summary__row">
              <dt className="sam-summary__key">Area</dt>
              <dd className="sam-summary__value">{data.deliveryArea || '–'}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  )
}

function Receipt({ refId, data }: { refId: string; data: FormData }) {
  return (
    <section className="sam-receipt is-popped" role="status">
      <header className="sam-receipt__head">
        <div className="sam-receipt__icon">🪔</div>
        <h2 className="sam-receipt__title">Your request is with us</h2>
        <p className="sam-receipt__ref">Reference <span>{refId}</span></p>
      </header>
      <div className="sam-receipt__body">
        <p className="sam-receipt__lede">
          We will send an itemised quote to <strong>{data.whatsappNumber}</strong> on WhatsApp within 2 hours.
          Delivery to <strong>{data.deliveryArea}</strong> by <strong>{formatDate(data.neededBy)}</strong>.
        </p>
        <div className="sam-receipt__list">
          <h3 className="sam-receipt__list-label">What happens next</h3>
          <ul>
            <li><span className="sam-receipt__tick">✓</span>Itemised quote with every item and its price</li>
            <li><span className="sam-receipt__tick">✓</span>Confirm only if it suits you — nothing charged before</li>
            <li><span className="sam-receipt__tick">✓</span>Kit assembled and delivered in 24–48 hours</li>
          </ul>
        </div>
        <div className="sam-receipt__actions">
          <a className="sam-btn sam-btn--wa sam-btn--sm" href={WA_LINK} target="_blank" rel="noopener noreferrer">
            Continue on WhatsApp
          </a>
          <Link className="sam-btn sam-btn--outline sam-btn--sm" href="/">Back to home</Link>
        </div>
      </div>
    </section>
  )
}

export default function Samagri() {
  const searchParams = useSearchParams()
  const initialMode = searchParams.get('mode') === 'kit' ? 'kit' : 'upload'

  const [step, setStep] = useState(1)
  const [mode, setMode] = useState<'upload' | 'kit'>(initialMode)
  const [data, setData] = useState<FormData>(INITIAL)
  const [file, setFile] = useState<File | null>(null)
  const [kits, setKits] = useState<PoojaKit[]>([])
  const [kitsLoading, setKitsLoading] = useState(true)
  const [selectedKitId, setSelectedKitId] = useState('')
  const [error, setError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [refId, setRefId] = useState('')

  useEffect(() => {
    fetch(`${BASE_URL}/pooja-kits`)
      .then(r => r.json())
      .then(json => {
        const list: PoojaKit[] = json?.data ?? []
        setKits(list)
        setSelectedKitId(id => id || (list[0]?.documentId ?? ''))
      })
      .catch(() => {})
      .finally(() => setKitsLoading(false))
  }, [])

  function onChange(key: keyof FormData, value: string) {
    setData(d => ({ ...d, [key]: value }))
    if (error) setError(false)
    if (submitError) setSubmitError(false)
    if (key === 'whatsappNumber' && phoneError) setPhoneError(null)
  }

  function handleNext() {
    if (mode === 'upload') {
      if ((!data.samagriList.trim() && !file) || !data.neededBy || !data.deliveryArea.trim()) {
        setErrorMsg('Please add the list (upload or typed), a date and your delivery area.')
        setError(true)
        return
      }
    } else {
      if (!selectedKitId || !data.neededBy || !data.deliveryArea.trim()) {
        setErrorMsg('Please choose a kit, a date and your delivery area.')
        setError(true)
        return
      }
    }
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
    const pErr = validatePhone(data.whatsappNumber)
    const nameInvalid = !data.name.trim()
    const addrInvalid = !data.address.trim()
    if (nameInvalid || pErr || addrInvalid) {
      if (nameInvalid || addrInvalid) setError(true)
      if (pErr) setPhoneError(pErr)
      return
    }
    setError(false)
    setPhoneError(null)
    setSubmitError(false)
    setSubmitting(true)
    try {
      const fd = new FormData()
      if (file) fd.append('SamagriFile', file)
      const payload: Record<string, unknown> = {
        SamagriList: data.samagriList,
        NeededBy: data.neededBy,
        DeliveryArea: data.deliveryArea,
        Name: data.name,
        WhatsappNumber: data.whatsappNumber,
        Address: data.address,
      }
      if (mode === 'kit' && selectedKitId) {
        payload.pooja_kit = { documentId: selectedKitId }
      }
      fd.append('data', JSON.stringify(payload))

      const res = await fetch(`${BASE_URL}/samagri-orders`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Request failed')
      const json = await res.json()
      const docId: string = json?.data?.documentId ?? ''
      setRefId('KS-S' + docId.slice(0, 8).toUpperCase())
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="sam-page">
      <section className="sam-section">
        <div className="container sam-container">
          <Link className="sam-back-link" href="/">← Back to home</Link>
          {step < 3 && <Progress current={step} />}
          {step === 1 && (
            <Step1
              mode={mode}
              setMode={setMode}
              data={data}
              file={file}
              setFile={setFile}
              kits={kits}
              kitsLoading={kitsLoading}
              selectedKitId={selectedKitId}
              setSelectedKitId={setSelectedKitId}
              error={error}
              errorMsg={errorMsg}
              onChange={onChange}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <Step2
              data={data}
              mode={mode}
              file={file}
              selectedKitId={selectedKitId}
              kits={kits}
              error={error}
              phoneError={phoneError}
              submitting={submitting}
              submitError={submitError}
              onChange={onChange}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
          {step === 3 && <Receipt refId={refId} data={data} />}
        </div>
      </section>
    </div>
  )
}
