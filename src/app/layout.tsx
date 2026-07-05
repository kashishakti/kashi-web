import Providers from "./providers"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./globals.css"
import "../index.css"
import ScrollToTop from "../components/ScrollToTop"
import ToastProvider from "../components/ToastProvider"
import GlobalLoader from "../components/GlobalLoader"
import { BASE_URL } from "@/constants"
import { GoogleAnalytics } from "@next/third-parties/google"


async function getGlobalData() {
  try {
    const response = await fetch(`${BASE_URL}/global-full`, {
      next: { revalidate: 600 },
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
    <html lang="en">
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