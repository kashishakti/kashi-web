'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation'

const isValidNavigationTarget = (href?: string) => {
  if (typeof href !== "string") return false;

  const normalized = href.trim();
  return Boolean(normalized && normalized !== "/");
};

const isHomeNavigationBlocked = (href?: string, pathname?: string) => {
  if (typeof href !== 'string' || typeof pathname !== 'string') return false;

  const normalizedHref = href.trim();
  const normalizedPathname = pathname.trim();

  return normalizedPathname === '/' && (normalizedHref === '/' || normalizedHref === '');
};

const Footer = ({ footerData }: { footerData: any }) => {
  const pathname = usePathname();
  const logoHref = footerData?.Logo?.href || '/';
  const shouldBlockLogoNavigation = isHomeNavigationBlocked(logoHref, pathname);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            {shouldBlockLogoNavigation ? (
              <div className="nav-logo" aria-disabled="true">
                <img src={footerData?.Logo?.image?.url || null} alt="Kashi Shakti" className='nav-logo-image moveToTop30' />
              </div>
            ) : isValidNavigationTarget(footerData?.Logo?.href) ? (
              <Link href={logoHref} className="nav-logo">
                <img src={footerData?.Logo?.image?.url || null} alt="Kashi Shakti" className='nav-logo-image moveToTop30' />
              </Link>
            ) : (
              <div className="nav-logo" aria-disabled="true">
                <img src={footerData?.Logo?.image?.url || null} alt="Kashi Shakti" className='nav-logo-image moveToTop30' />
              </div>
            )}
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
                      isValidNavigationTarget(nav?.href) ? (
                        <Link key={nav?.id} href={nav?.href} className="footer-link">
                          {nav?.label || ''}
                        </Link>
                      ) : (
                        <span key={nav?.id} className="footer-link" aria-disabled="true" style={{ opacity: 0.7 }}>
                          {nav?.label || ''}
                        </span>
                      )
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
