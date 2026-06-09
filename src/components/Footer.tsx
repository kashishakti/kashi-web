import Link from "next/link"

const Footer = ({ footerData }: { footerData: any }) => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link href={footerData?.Logo?.href || '/'} className="nav-logo">
              <img src={footerData?.Logo?.image?.url || null} alt="Kashi Shakti" className='nav-logo-image moveToTop30' />
            </Link>
            <p className="footer-copy">
              {footerData?.BrandInformation || ''}
            </p>
          </div>
          <div className="footer-menus">
            {footerData?.menus?.map((menu: { id: number; title: string; NavLink: { href: string; label: string; id: number }[] }) => (
              <div key={menu.id}>
                <div className="footer-heading">{menu?.title || ''}</div>
                  <div className="footer-links">
                    {menu?.NavLink?.length ? menu?.NavLink?.map((nav) => (
                      <Link key={nav?.id} href={nav?.href || '/'} className="footer-link">
                        {nav?.label || ''}
                      </Link>
                    )) : null}
              </div>
              </div>
            ))}
          </div>
        </div>
        <div className="footer-meta">
          <span>{footerData?.CopyrightText || ''}</span>
          {/* <span>🪔 1,24,000+ sankalps offered</span> */}
          <span>🪔 1,24,000+ sankalps offered</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
