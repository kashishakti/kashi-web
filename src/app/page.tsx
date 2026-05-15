import { Metadata } from "next"
import Home from "../features/Home"

export const metadata: Metadata = {
  title: "Kashi Shakti | Hindu Spiritual Knowledge, Sacred Products & Consulting",
  description:
    "Discover timeless wisdom from Kashi/Varanasi. Explore Karungali malas, purpose-based spiritual products, and consult trusted Pandits for health, wealth, love, and inner growth.",
}

export default function Page() {
  return <Home />
}