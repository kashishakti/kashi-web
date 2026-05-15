import Providers from "./providers"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./globals.css"
import "../index.css"
import ScrollToTop from "../components/ScrollToTop"
import ToastProvider from "../components/ToastProvider"
import GlobalLoader from "../components/GlobalLoader"
import GlobalDataInitializer from "@/components/GlobalDataInitializer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider />
          <ScrollToTop />
          <GlobalLoader />
          <GlobalDataInitializer />

          <div className="app">
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}