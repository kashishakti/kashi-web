import { Playfair_Display, DM_Sans } from 'next/font/google'
import Providers from "./providers"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./globals.css"
import "../index.css"
import ScrollToTop from "../components/ScrollToTop"
import ToastProvider from "../components/ToastProvider"
import GlobalLoader from "../components/GlobalLoader"
import { BASE_URL, REVALIDATE } from "@/constants"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

async function getGlobalData() {
  try {
    const response = await fetch(`${BASE_URL}/global-full`, {
      next: { revalidate: REVALIDATE },
    })

    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalData = await getGlobalData()
  const headerData = globalData?.Header ?? null
  const footerData = globalData?.Footer ?? null

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`} data-scroll-behavior="smooth">
      <body>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2311600476014186');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2311600476014186&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Providers>
          <ToastProvider />
          <ScrollToTop />
          <GlobalLoader />

          <div className="app">
            <Navbar headerData={headerData} />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer footerData={footerData} />
          </div>
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
    </html>
  )
}
