'use client'
import Link from "next/link"
import { useMemo, useState } from 'react'
import './Navbar.css'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { globalData } = useSelector((state: RootState) => state.global)
  const toggleMenu = () => setMenuOpen(!menuOpen)

  const headerData = useMemo(() => globalData?.Header, [globalData])

  return (
    <>
      <nav className="nav">
        <Link href={headerData?.Logo?.href || '/'} className="nav-logo">
          {/* <div className="nav-logo-mark">ॐ</div>
          <div>Kashi <span style={{ fontWeight: 400 }}>Shakti</span></div> */}
          <img src={headerData?.Logo?.image?.url || null} alt="Kashi Shakti" className='nav-logo-image' />
        </Link>
        
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
