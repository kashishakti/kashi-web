'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import './Navbar.css'

const isHomeNavigationBlocked = (href?: string, pathname?: string) => {
  if (typeof href !== 'string' || typeof pathname !== 'string') return false

  const normalizedHref = href.trim()
  const normalizedPathname = pathname.trim()

  return normalizedPathname === '/' && (normalizedHref === '/' || normalizedHref === '')
}

const Navbar = ({ headerData }: { headerData: any }) => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(!menuOpen)
  const logoHref = headerData?.Logo?.href || '/'
  const shouldBlockLogoNavigation = isHomeNavigationBlocked(logoHref, pathname)

  return (
    <>
      <nav className="nav">
        {shouldBlockLogoNavigation ? (
          <div className="nav-logo" aria-disabled="true">
            <img src={headerData?.Logo?.image?.url || null} alt="Kashi Shakti" className='nav-logo-image' />
          </div>
        ) : (
          <Link href={logoHref} className="nav-logo">
            <img src={headerData?.Logo?.image?.url || null} alt="Kashi Shakti" className='nav-logo-image' />
          </Link>
        )}
        
        <div className="nav-menu">
          {headerData?.menu?.NavLink?.length ? headerData?.menu?.NavLink?.map((item: { href: string; label: string; id: number }) => (
            <Link href={item.href || '/'} className="nav-link" key={item.id}>
              {item.label}
            </Link>
          )) : null }
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="lang-toggle" style={{ cursor: 'pointer' }}>A/अ</span>
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      
      {menuOpen && (
        <div className="mobile-menu">
          {headerData?.menu?.NavLink?.length ? headerData?.menu?.NavLink?.map((item: { href: string; label: string; id: number }) => (
            <Link href={item.href || '/'} className="mobile-nav-link" key={item.id} onClick={() => setMenuOpen(false)}>
              {item.label}
            </Link>
          )) : null }
        </div>
      )}
    </>
  )
}

export default Navbar
