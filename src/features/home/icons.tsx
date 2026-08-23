export function DiyaIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round((size * 40) / 34)} viewBox="0 0 34 40" aria-hidden="true">
      <path d="M4 24Q17 34 30 24l-3 7q-10 7-20 0Z" fill="#C07840" />
      <ellipse cx="17" cy="24" rx="13" ry="2.8" fill="#E8A860" />
      <path d="M17 6q7 11 2.5 18-1.5 3.5-2.5 3.5t-2.5-3.5Q10 17 17 6" fill="#F5A623" />
      <path d="M17 13q3.5 6 1 10-.8 1.8-1 1.8t-1-1.8q-2.5-4 1-10" fill="#FFF0C2" />
    </svg>
  )
}

export function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2a10 10 0 0 0-8.7 15l-1.2 4.3 4.4-1.2A10 10 0 1 0 12 2zm5.6 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.5-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4-.1.5l-.3.4c-.1.1-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1l1.9.9c.2.1.4.2.4.3.1.2.1.7 0 1z"
        fill="currentColor"
      />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 6l8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SamagriIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 14h24l-2 21H10Z" stroke="#9A5A28" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M14 14V9a6 6 0 0 1 12 0v5" stroke="#9A5A28" strokeWidth="1.9" strokeLinecap="round" />
      <ellipse cx="20" cy="26" rx="6" ry="4.5" fill="#C07840" opacity=".9" />
    </svg>
  )
}

export function VerifiedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="17" cy="13" r="6.5" stroke="#9A5A28" strokeWidth="1.9" />
      <path d="M6 34q0-11 11-11t11 11" stroke="#9A5A28" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="30" cy="28" r="7.5" fill="#4E7A62" />
      <path d="M26.5 28l2.4 2.4 4.6-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function QuickIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M23 4L9 23h9l-2 14 14-19h-9z" fill="#C07840" />
    </svg>
  )
}

export function RupeeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="14.5" stroke="#9A5A28" strokeWidth="1.9" />
      <path d="M15 13h10M15 18h10M22 13c3 0 3 5 0 5h-3l7 9" stroke="#C07840" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M6 9h28v18H18l-8 7v-7H6z" stroke="#9A5A28" strokeWidth="1.9" strokeLinejoin="round" />
      <circle cx="14" cy="18" r="2" fill="#C07840" />
      <circle cx="20" cy="18" r="2" fill="#C07840" />
      <circle cx="26" cy="18" r="2" fill="#C07840" />
    </svg>
  )
}

export function ClipboardIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="9" y="8" width="22" height="27" rx="3" stroke="#9A5A28" strokeWidth="1.9" />
      <rect x="15" y="4" width="10" height="6" rx="2" fill="#9A5A28" />
      <path d="M14 21l4 4 8-9" stroke="#4E7A62" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HomeIconSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 6l15 13H5Z" fill="#C07840" />
      <rect x="9" y="19" width="22" height="15" fill="#E8D5B0" />
      <rect x="17" y="25" width="6" height="9" rx="1" fill="#9A5A28" />
      <circle cx="31" cy="10" r="5" fill="#4E7A62" />
    </svg>
  )
}

export function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M11 6h13l6 6v22H11z" stroke="#9A5A28" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M24 6v6h6" stroke="#9A5A28" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M16 20h10M16 25h7" stroke="#C07840" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 34v-8m0 0l-3.4 3.4M20 26l3.4 3.4" stroke="#4E7A62" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function GiftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M7 15h26v18H7z" stroke="#9A5A28" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M5 9h30v6H5z" fill="#C07840" />
      <path d="M20 15v18" stroke="#9A5A28" strokeWidth="1.8" />
      <path d="M20 9c-2-4-8-4-8 0M20 9c2-4 8-4 8 0" stroke="#9A6B1E" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  )
}
