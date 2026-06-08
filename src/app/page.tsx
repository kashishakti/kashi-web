import { Metadata } from "next"
import Home from "../features/Home"
import { BASE_URL } from "@/constants"

export const metadata: Metadata = {
  title: "Kashi Shakti | Hindu Spiritual Knowledge, Sacred Products & Consulting",
  description:
    "Discover timeless wisdom from Kashi/Varanasi. Explore Karungali malas, purpose-based spiritual products, and consult trusted Pandits for health, wealth, love, and inner growth.",
}

async function getHomeData() {
  const response = await fetch(`${BASE_URL}/landing-page-full`, {
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

async function getNearestData() {
  const response = await fetch(`${BASE_URL}/upcoming-events`, {
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export default async function Page() {
  const [homeData, nearestData] = await Promise.all([getHomeData(), getNearestData()])
  const serverNow = Date.now()

  return <Home homeData={homeData} nearestData={nearestData} serverNow={serverNow} />
}