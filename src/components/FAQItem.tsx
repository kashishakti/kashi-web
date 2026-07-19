'use client'

import { useState } from 'react'

interface Props {
  question: string
  answer: string
  defaultOpen?: boolean
}

export default function FAQItem({ question, answer, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className={`faq-item${isOpen ? '' : ' faq-item--closed'}`}>
      <button className="faq-q" onClick={() => setIsOpen(o => !o)} aria-expanded={isOpen}>
        <span>{question}</span>
        <span className="faq-q__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="faq-a">{answer}</div>
    </div>
  )
}
