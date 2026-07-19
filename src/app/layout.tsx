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
