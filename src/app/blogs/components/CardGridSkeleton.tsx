const CardSkeleton = () => (
  <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(28,15,8,0.07)' }}>
    <div className="skeleton" style={{ height: 188 }} />
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="skeleton" style={{ height: 14, width: '80%' }} />
      <div className="skeleton" style={{ height: 14 }} />
      <div className="skeleton" style={{ height: 14, width: '60%' }} />
      <div className="skeleton" style={{ height: 14, width: '40%', marginTop: 8 }} />
    </div>
  </div>
)

export default function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      <style>{`
        .skeleton-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media(max-width:900px) { .skeleton-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media(max-width:600px) { .skeleton-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div style={{ maxWidth: 1280, margin: '52px auto 0', padding: '0 40px' }}>
        <div className="skeleton-grid">
          {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    </>
  )
}
